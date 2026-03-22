import type { BlockchainGraphData, GraphNode } from '../models/graph'
import {
  formatEth,
  formatGwei,
  formatNumber,
  formatUnixTime,
  shortenHash,
} from '../utils/format'

interface ControlPanelProps {
  rpcDraft: string
  onRpcDraftChange: (value: string) => void
  onRpcApply: () => void
  onRpcReset: () => void
  blockDepth: number
  onBlockDepthChange: (value: number) => void
  txPerBlock: number
  onTxPerBlockChange: (value: number) => void
  autoRefresh: boolean
  onAutoRefreshChange: (value: boolean) => void
  loading: boolean
  error: string | null
  graph: BlockchainGraphData | null
  selectedNode: GraphNode | null
  hoveredNode: GraphNode | null
  onRefresh: () => void
}

function renderNodeDetails(node: GraphNode | null) {
  if (!node) {
    return (
      <p className="panel-empty">
        Выберите блок или транзакцию на 3D-графе, чтобы увидеть подробности.
      </p>
    )
  }

  if (node.kind === 'block') {
    return (
      <div className="details-grid">
        <div>Тип</div>
        <div>Block</div>
        <div>Номер</div>
        <div>#{formatNumber(node.number)}</div>
        <div>Hash</div>
        <div title={node.hash}>{shortenHash(node.hash)}</div>
        <div>Parent</div>
        <div title={node.parentHash}>{shortenHash(node.parentHash)}</div>
        <div>Timestamp</div>
        <div>{formatUnixTime(node.timestamp)}</div>
        <div>Miner</div>
        <div title={node.miner}>{shortenHash(node.miner)}</div>
        <div>Транзакции</div>
        <div>{formatNumber(node.txCount)}</div>
        <div>Gas Used / Limit</div>
        <div>
          {formatNumber(node.gasUsed)} / {formatNumber(node.gasLimit)}
        </div>
        <div>Base Fee</div>
        <div>{formatGwei(node.baseFeeGwei)}</div>
      </div>
    )
  }

  return (
    <div className="details-grid">
      <div>Тип</div>
      <div>Transaction</div>
      <div>Hash</div>
      <div title={node.hash}>{shortenHash(node.hash)}</div>
      <div>Block</div>
      <div>#{formatNumber(node.blockNumber)}</div>
      <div>From</div>
      <div title={node.from}>{shortenHash(node.from)}</div>
      <div>To</div>
      <div title={node.to ?? ''}>{node.to ? shortenHash(node.to) : 'contract call'}</div>
      <div>Value</div>
      <div>{formatEth(node.valueEth)}</div>
      <div>Gas Limit</div>
      <div>{formatNumber(node.gasLimit)}</div>
      <div>Gas Price</div>
      <div>{formatGwei(node.gasPriceGwei)}</div>
      <div>Max Fee</div>
      <div>{formatGwei(node.maxFeePerGasGwei)}</div>
      <div>Nonce</div>
      <div>{formatNumber(node.nonce)}</div>
    </div>
  )
}

export function ControlPanel(props: ControlPanelProps) {
  const nodeForDetails = props.selectedNode ?? props.hoveredNode

  return (
    <section className="control-panel">
      <header className="panel-header">
        <h1>Chain Atlas 3D</h1>
        <p>
          Визуализация последних Ethereum блоков и транзакций как интерактивного
          графа.
        </p>
      </header>

      <div className="panel-block">
        <label htmlFor="rpc-url">RPC URL</label>
        <input
          id="rpc-url"
          type="text"
          value={props.rpcDraft}
          onChange={(event) => {
            props.onRpcDraftChange(event.target.value)
          }}
          spellCheck={false}
        />
        <div className="row">
          <button
            type="button"
            onClick={props.onRpcApply}
            disabled={props.loading}
          >
            Применить RPC
          </button>
          <button
            type="button"
            className="ghost"
            onClick={props.onRpcReset}
            disabled={props.loading}
          >
            Сбросить
          </button>
        </div>
      </div>

      <div className="panel-block">
        <label htmlFor="depth">Глубина цепочки: {props.blockDepth} блоков</label>
        <input
          id="depth"
          type="range"
          min={3}
          max={24}
          value={props.blockDepth}
          onChange={(event) => {
            props.onBlockDepthChange(Number(event.target.value))
          }}
        />
        <label htmlFor="tx-limit">
          Транзакций на блок: {props.txPerBlock} (первые в блоке)
        </label>
        <input
          id="tx-limit"
          type="range"
          min={4}
          max={30}
          value={props.txPerBlock}
          onChange={(event) => {
            props.onTxPerBlockChange(Number(event.target.value))
          }}
        />
        <label className="switch">
          <input
            type="checkbox"
            checked={props.autoRefresh}
            onChange={(event) => {
              props.onAutoRefreshChange(event.target.checked)
            }}
          />
          <span>Автообновление каждые 30 секунд</span>
        </label>
        <button type="button" onClick={props.onRefresh} disabled={props.loading}>
          Обновить сейчас
        </button>
      </div>

      {props.error && <div className="panel-error">{props.error}</div>}

      <div className="panel-block stats">
        <h2>Состояние данных</h2>
        <div className="details-grid compact">
          <div>Загрузка</div>
          <div>{props.loading ? 'Да' : 'Нет'}</div>
          <div>Сеть</div>
          <div>{props.graph ? props.graph.networkName : '—'}</div>
          <div>Chain ID</div>
          <div>{props.graph ? props.graph.chainId : '—'}</div>
          <div>Последний блок</div>
          <div>
            {props.graph ? `#${formatNumber(props.graph.latestBlock)}` : '—'}
          </div>
          <div>Блоков в графе</div>
          <div>{props.graph ? formatNumber(props.graph.blocks.length) : '—'}</div>
          <div>Транзакций в графе</div>
          <div>
            {props.graph ? formatNumber(props.graph.transactions.length) : '—'}
          </div>
          <div>Ребер</div>
          <div>{props.graph ? formatNumber(props.graph.edges.length) : '—'}</div>
          <div>Обновлено</div>
          <div>
            {props.graph
              ? new Date(props.graph.fetchedAt).toLocaleTimeString('ru-RU')
              : '—'}
          </div>
        </div>
      </div>

      <div className="panel-block">
        <h2>Детали объекта</h2>
        {renderNodeDetails(nodeForDetails)}
      </div>
    </section>
  )
}
