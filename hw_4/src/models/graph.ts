export interface BaseGraphNode {
  id: string
  position: [number, number, number]
}

export interface BlockGraphNode extends BaseGraphNode {
  kind: 'block'
  number: number
  hash: string
  parentHash: string
  miner: string
  timestamp: number
  txCount: number
  gasUsed: number
  gasLimit: number
  sizeBytes: number
  baseFeeGwei: number | null
}

export interface TransactionGraphNode extends BaseGraphNode {
  kind: 'transaction'
  hash: string
  from: string
  to: string | null
  valueEth: number
  gasLimit: number
  gasPriceGwei: number | null
  maxFeePerGasGwei: number | null
  nonce: number
  blockNumber: number
}

export interface GraphEdge {
  id: string
  from: string
  to: string
  kind: 'chain' | 'contains'
}

export interface BlockchainGraphData {
  blocks: BlockGraphNode[]
  transactions: TransactionGraphNode[]
  edges: GraphEdge[]
  latestBlock: number
  networkName: string
  chainId: number
  fetchedAt: number
}

export type GraphNode = BlockGraphNode | TransactionGraphNode
