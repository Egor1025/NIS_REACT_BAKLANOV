import { startTransition, useDeferredValue, useState } from 'react'
import './App.css'
import { BlockchainScene } from './components/BlockchainScene'
import { ControlPanel } from './components/ControlPanel'
import { GRAPH_DEFAULTS, useBlockchainGraph } from './hooks/useBlockchainGraph'
import type { GraphNode } from './models/graph'

function App() {
  const [rpcUrl, setRpcUrl] = useState<string>(
    import.meta.env.VITE_RPC_URL || GRAPH_DEFAULTS.rpcUrl,
  )
  const [rpcDraft, setRpcDraft] = useState<string>(
    import.meta.env.VITE_RPC_URL || GRAPH_DEFAULTS.rpcUrl,
  )
  const [blockDepth, setBlockDepth] = useState<number>(GRAPH_DEFAULTS.blockDepth)
  const [txPerBlock, setTxPerBlock] = useState<number>(GRAPH_DEFAULTS.txPerBlock)
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const { graph, loading, error, refresh } = useBlockchainGraph({
    rpcUrl,
    blockDepth,
    txPerBlock,
    autoRefresh,
    autoRefreshMs: GRAPH_DEFAULTS.autoRefreshMs,
  })

  const deferredGraph = useDeferredValue(graph)

  const allNodes: GraphNode[] = deferredGraph
    ? [...deferredGraph.blocks, ...deferredGraph.transactions]
    : []

  const selectedNode =
    selectedId !== null
      ? allNodes.find((node) => node.id === selectedId) ?? null
      : null

  const hoveredNode =
    hoveredId !== null
      ? allNodes.find((node) => node.id === hoveredId) ?? null
      : null

  const activeSelectedId = selectedNode ? selectedId : null

  function applyRpc(): void {
    const nextUrl = rpcDraft.trim() || GRAPH_DEFAULTS.rpcUrl
    startTransition(() => {
      setRpcUrl(nextUrl)
    })
  }

  function resetRpc(): void {
    startTransition(() => {
      setRpcDraft(GRAPH_DEFAULTS.rpcUrl)
      setRpcUrl(GRAPH_DEFAULTS.rpcUrl)
    })
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <ControlPanel
          rpcDraft={rpcDraft}
          onRpcDraftChange={setRpcDraft}
          onRpcApply={applyRpc}
          onRpcReset={resetRpc}
          blockDepth={blockDepth}
          onBlockDepthChange={setBlockDepth}
          txPerBlock={txPerBlock}
          onTxPerBlockChange={setTxPerBlock}
          autoRefresh={autoRefresh}
          onAutoRefreshChange={setAutoRefresh}
          loading={loading}
          error={error}
          graph={deferredGraph}
          selectedNode={selectedNode}
          hoveredNode={hoveredNode}
          onRefresh={refresh}
        />
      </aside>

      <main className="stage">
        <BlockchainScene
          graph={deferredGraph}
          selectedId={activeSelectedId}
          hoveredId={hoveredId}
          onSelect={setSelectedId}
          onHover={setHoveredId}
        />

        {loading && (
          <div className="stage-overlay">
            <div className="status-card">
              <strong>Загрузка блокчейна...</strong>
              <span>Получаю последние блоки и транзакции через ethers.js</span>
            </div>
          </div>
        )}

        {!loading && !deferredGraph && (
          <div className="stage-overlay">
            <div className="status-card">
              <strong>Граф недоступен</strong>
              <span>Проверьте RPC URL и повторите попытку.</span>
            </div>
          </div>
        )}

        {!loading && deferredGraph && (
          <div className="scene-help">
            <p>
              ЛКМ: выбрать узел | Колесо: zoom | ПКМ/drag: вращение | Двойной клик
              по пустому месту: снять выделение
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
