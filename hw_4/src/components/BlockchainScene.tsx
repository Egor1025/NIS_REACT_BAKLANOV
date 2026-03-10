import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line, OrbitControls, Stars } from '@react-three/drei'
import { DoubleSide, type Mesh } from 'three'
import type {
  BlockGraphNode,
  BlockchainGraphData,
  GraphEdge,
  TransactionGraphNode,
} from '../models/graph'

interface BlockchainSceneProps {
  graph: BlockchainGraphData | null
  selectedId: string | null
  hoveredId: string | null
  onSelect: (id: string | null) => void
  onHover: (id: string | null) => void
}

interface BlockNodeMeshProps {
  node: BlockGraphNode
  selected: boolean
  hovered: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

interface TransactionNodeMeshProps {
  node: TransactionGraphNode
  selected: boolean
  hovered: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

function BlockNodeMesh(props: BlockNodeMeshProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) {
      return
    }

    meshRef.current.rotation.y = clock.getElapsedTime() * 0.2
    meshRef.current.rotation.x = 0.15
  })

  const color = props.selected
    ? '#facc15'
    : props.hovered
      ? '#fb923c'
      : '#f97316'
  const scale = props.selected ? 1.2 : props.hovered ? 1.07 : 1

  return (
    <mesh
      ref={meshRef}
      position={props.node.position}
      scale={scale}
      onClick={(event) => {
        event.stopPropagation()
        props.onSelect(props.node.id)
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        props.onHover(props.node.id)
      }}
      onPointerOut={() => {
        props.onHover(null)
      }}
    >
      <dodecahedronGeometry args={[1.05, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={props.selected ? 0.45 : 0.2}
        roughness={0.28}
        metalness={0.4}
      />
    </mesh>
  )
}

function TransactionNodeMesh(props: TransactionNodeMeshProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) {
      return
    }

    const t = clock.getElapsedTime()
    meshRef.current.position.y = props.node.position[1] + Math.sin(t * 1.8) * 0.08
  })

  const color = props.selected
    ? '#67e8f9'
    : props.hovered
      ? '#7dd3fc'
      : '#22d3ee'
  const scale = props.selected ? 1.45 : props.hovered ? 1.2 : 1

  return (
    <mesh
      ref={meshRef}
      position={props.node.position}
      scale={scale}
      onClick={(event) => {
        event.stopPropagation()
        props.onSelect(props.node.id)
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        props.onHover(props.node.id)
      }}
      onPointerOut={() => {
        props.onHover(null)
      }}
    >
      <sphereGeometry args={[0.34, 24, 24]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={props.selected ? 0.42 : 0.18}
        roughness={0.2}
        metalness={0.22}
      />
    </mesh>
  )
}

function EdgeLines({
  graph,
  selectedId,
}: {
  graph: BlockchainGraphData
  selectedId: string | null
}) {
  const nodePositions: Record<string, [number, number, number]> = {}

  graph.blocks.forEach((node) => {
    nodePositions[node.id] = node.position
  })

  graph.transactions.forEach((node) => {
    nodePositions[node.id] = node.position
  })

  return (
    <>
      {graph.edges.map((edge: GraphEdge) => {
        const from = nodePositions[edge.from]
        const to = nodePositions[edge.to]

        if (!from || !to) {
          return null
        }

        const touchesSelected =
          selectedId !== null && (edge.from === selectedId || edge.to === selectedId)
        const chainEdge = edge.kind === 'chain'
        const color = chainEdge ? '#fb923c' : '#38bdf8'

        return (
          <Line
            key={edge.id}
            points={[from, to]}
            color={touchesSelected ? '#fef08a' : color}
            lineWidth={touchesSelected ? 2.2 : chainEdge ? 1.4 : 0.9}
            transparent
            opacity={touchesSelected ? 0.95 : chainEdge ? 0.8 : 0.3}
          />
        )
      })}
    </>
  )
}

function SceneEnvironment({
  graph,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
}: BlockchainSceneProps) {
  const floorRadius = Math.max(34, (graph?.blocks.length ?? 1) * 8)

  return (
    <>
      <color attach="background" args={['#030712']} />
      <fog attach="fog" args={['#030712', 24, 72]} />
      <ambientLight intensity={0.36} />
      <directionalLight position={[10, 18, 8]} intensity={1.05} color="#fef3c7" />
      <pointLight position={[-16, 5, -14]} intensity={0.72} color="#22d3ee" />
      <pointLight position={[14, 8, 11]} intensity={0.42} color="#fb923c" />
      <Stars
        radius={90}
        depth={40}
        count={2400}
        factor={4}
        saturation={0}
        fade
        speed={0.25}
      />

      <mesh
        position={[0, -2.6, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[floorRadius, 72]} />
        <meshStandardMaterial
          color="#0b1222"
          transparent
          opacity={0.72}
          side={DoubleSide}
          roughness={0.92}
          metalness={0.12}
        />
      </mesh>

      {graph && (
        <>
          <EdgeLines graph={graph} selectedId={selectedId} />

          {graph.blocks.map((node) => (
            <BlockNodeMesh
              key={node.id}
              node={node}
              selected={node.id === selectedId}
              hovered={node.id === hoveredId}
              onSelect={onSelect}
              onHover={onHover}
            />
          ))}

          {graph.transactions.map((node) => (
            <TransactionNodeMesh
              key={node.id}
              node={node}
              selected={node.id === selectedId}
              hovered={node.id === hoveredId}
              onSelect={onSelect}
              onHover={onHover}
            />
          ))}
        </>
      )}

      <OrbitControls
        makeDefault
        enablePan
        enableZoom
        enableDamping
        dampingFactor={0.08}
        minDistance={8}
        maxDistance={85}
        maxPolarAngle={Math.PI / 2.05}
      />
    </>
  )
}

export function BlockchainScene(props: BlockchainSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 16, 34], fov: 46 }}
      shadows
      gl={{ antialias: true }}
      onPointerMissed={() => {
        props.onSelect(null)
      }}
    >
      <SceneEnvironment {...props} />
    </Canvas>
  )
}
