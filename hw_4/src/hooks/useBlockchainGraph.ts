import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import type {
  BlockGraphNode,
  BlockchainGraphData,
  GraphEdge,
  TransactionGraphNode,
} from '../models/graph'

const GRAPH_LAYOUT = {
  blockSpacing: 10,
  minRingRadius: 3.2,
  maxRingRadiusBoost: 3.8,
}

const LIMITS = {
  maxBlockDepth: 24,
  maxTxPerBlock: 30,
}

export const GRAPH_DEFAULTS = {
  rpcUrl: 'https://ethereum-rpc.publicnode.com',
  blockDepth: 8,
  txPerBlock: 12,
  autoRefreshMs: 30_000,
}

interface UseBlockchainGraphConfig {
  rpcUrl: string
  blockDepth: number
  txPerBlock: number
  autoRefresh: boolean
  autoRefreshMs?: number
}

interface UseBlockchainGraphResult {
  graph: BlockchainGraphData | null
  loading: boolean
  error: string | null
  refresh: () => void
}

interface RpcTransaction {
  hash: string
  from: string
  to: string | null
  value: string
  gas: string
  gasPrice?: string
  maxFeePerGas?: string
  nonce: string
}

interface RpcBlock {
  number: string
  hash: string
  parentHash: string
  miner: string
  timestamp: string
  gasUsed: string
  gasLimit: string
  size?: string
  baseFeePerGas?: string
  transactions: RpcTransaction[]
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function toNumberFromHex(value: string | null | undefined): number {
  if (!value) {
    return 0
  }

  return Number(BigInt(value))
}

function toGweiFromHex(value: string | null | undefined): number | null {
  if (!value) {
    return null
  }

  return Number(ethers.formatUnits(BigInt(value), 'gwei'))
}

function toEthFromHex(value: string | null | undefined): number {
  if (!value) {
    return 0
  }

  return Number(ethers.formatEther(BigInt(value)))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

function isRpcTransaction(value: unknown): value is RpcTransaction {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.hash === 'string' &&
    typeof value.from === 'string' &&
    typeof value.value === 'string' &&
    typeof value.gas === 'string' &&
    typeof value.nonce === 'string' &&
    (typeof value.to === 'string' || value.to === null)
  )
}

function isRpcBlock(value: unknown): value is RpcBlock {
  if (!isRecord(value)) {
    return false
  }

  if (!Array.isArray(value.transactions)) {
    return false
  }

  return (
    typeof value.number === 'string' &&
    typeof value.hash === 'string' &&
    typeof value.parentHash === 'string' &&
    typeof value.miner === 'string' &&
    typeof value.timestamp === 'string' &&
    typeof value.gasUsed === 'string' &&
    typeof value.gasLimit === 'string'
  )
}

function buildGraph(
  rpcBlocks: RpcBlock[],
  latestBlock: number,
  txPerBlock: number,
  networkName: string,
  chainId: number,
): BlockchainGraphData {
  const blocks: BlockGraphNode[] = []
  const transactions: TransactionGraphNode[] = []
  const edges: GraphEdge[] = []

  rpcBlocks.forEach((rpcBlock, blockIndex) => {
    const blockNumber = toNumberFromHex(rpcBlock.number)
    const blockId = `block-${blockNumber}`
    const centeredX =
      (blockIndex - (rpcBlocks.length - 1) / 2) * GRAPH_LAYOUT.blockSpacing

    const blockNode: BlockGraphNode = {
      id: blockId,
      kind: 'block',
      number: blockNumber,
      hash: rpcBlock.hash,
      parentHash: rpcBlock.parentHash,
      miner: rpcBlock.miner,
      timestamp: toNumberFromHex(rpcBlock.timestamp),
      txCount: rpcBlock.transactions.length,
      gasUsed: toNumberFromHex(rpcBlock.gasUsed),
      gasLimit: toNumberFromHex(rpcBlock.gasLimit),
      sizeBytes: toNumberFromHex(rpcBlock.size),
      baseFeeGwei: toGweiFromHex(rpcBlock.baseFeePerGas),
      position: [centeredX, 0, 0],
    }

    blocks.push(blockNode)

    if (blockIndex > 0) {
      const previousBlockNumber = toNumberFromHex(rpcBlocks[blockIndex - 1].number)
      edges.push({
        id: `chain-${previousBlockNumber}-${blockNumber}`,
        from: `block-${previousBlockNumber}`,
        to: blockId,
        kind: 'chain',
      })
    }

    const visibleTransactions = rpcBlock.transactions
      .filter(isRpcTransaction)
      .slice(0, txPerBlock)

    const ringRadius =
      GRAPH_LAYOUT.minRingRadius +
      Math.min(
        GRAPH_LAYOUT.maxRingRadiusBoost,
        visibleTransactions.length * 0.23,
      )

    visibleTransactions.forEach((transaction, txIndex) => {
      const angle =
        (txIndex / Math.max(1, visibleTransactions.length)) * Math.PI * 2
      const verticalOffset = ((txIndex % 4) - 1.5) * 0.65
      const txId = `tx-${transaction.hash}`
      const txPosition: [number, number, number] = [
        centeredX + Math.cos(angle) * ringRadius,
        verticalOffset,
        Math.sin(angle) * ringRadius,
      ]

      const txNode: TransactionGraphNode = {
        id: txId,
        kind: 'transaction',
        hash: transaction.hash,
        from: transaction.from,
        to: transaction.to,
        valueEth: toEthFromHex(transaction.value),
        gasLimit: toNumberFromHex(transaction.gas),
        gasPriceGwei: toGweiFromHex(transaction.gasPrice),
        maxFeePerGasGwei: toGweiFromHex(transaction.maxFeePerGas),
        nonce: toNumberFromHex(transaction.nonce),
        blockNumber,
        position: txPosition,
      }

      transactions.push(txNode)
      edges.push({
        id: `contains-${blockNode.id}-${txNode.id}`,
        from: blockNode.id,
        to: txNode.id,
        kind: 'contains',
      })
    })
  })

  return {
    blocks,
    transactions,
    edges,
    latestBlock,
    networkName,
    chainId,
    fetchedAt: Date.now(),
  }
}

export function useBlockchainGraph(
  config: UseBlockchainGraphConfig,
): UseBlockchainGraphResult {
  const [graph, setGraph] = useState<BlockchainGraphData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshTick, setRefreshTick] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function loadGraph(): Promise<void> {
      setLoading(true)
      setError(null)

      try {
        const rpcUrl = config.rpcUrl.trim()
        if (!rpcUrl) {
          throw new Error('RPC URL не указан')
        }

        const provider = new ethers.JsonRpcProvider(rpcUrl)
        const [network, latestBlock] = await Promise.all([
          provider.getNetwork(),
          provider.getBlockNumber(),
        ])

        const blockDepth = clamp(config.blockDepth, 1, LIMITS.maxBlockDepth)
        const txPerBlock = clamp(config.txPerBlock, 1, LIMITS.maxTxPerBlock)
        const fromBlock = Math.max(0, latestBlock - blockDepth + 1)
        const blockNumbers = Array.from(
          { length: latestBlock - fromBlock + 1 },
          (_, index) => fromBlock + index,
        )

        const rpcBlocks = await Promise.all(
          blockNumbers.map(async (blockNumber) => {
            const response = (await provider.send('eth_getBlockByNumber', [
              ethers.toQuantity(blockNumber),
              true,
            ])) as unknown

            if (!isRpcBlock(response)) {
              return null
            }

            return response
          }),
        )

        const validBlocks = rpcBlocks.filter(
          (block): block is RpcBlock => block !== null,
        )

        if (!validBlocks.length) {
          throw new Error(
            'RPC не вернул данные блоков. Проверьте URL и CORS-поддержку провайдера.',
          )
        }

        const graphData = buildGraph(
          validBlocks,
          latestBlock,
          txPerBlock,
          network.name || 'unknown',
          Number(network.chainId),
        )

        if (!cancelled) {
          setGraph(graphData)
        }
      } catch (reason) {
        const message =
          reason instanceof Error ? reason.message : 'Не удалось загрузить граф'

        if (!cancelled) {
          setError(message)
          setGraph(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadGraph()

    return () => {
      cancelled = true
    }
  }, [config.blockDepth, config.rpcUrl, config.txPerBlock, refreshTick])

  useEffect(() => {
    if (!config.autoRefresh) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setRefreshTick((value) => value + 1)
    }, config.autoRefreshMs ?? GRAPH_DEFAULTS.autoRefreshMs)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [
    config.autoRefresh,
    config.autoRefreshMs,
    config.blockDepth,
    config.rpcUrl,
    config.txPerBlock,
  ])

  return {
    graph,
    loading,
    error,
    refresh: () => {
      setRefreshTick((value) => value + 1)
    },
  }
}
