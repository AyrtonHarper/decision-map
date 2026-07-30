import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
} from '@xyflow/react'
import { useCallback, useEffect, useMemo } from 'react'
import type { CardType, EdgeLabel, ReasoningNodeData } from '../types'
import { LabeledEdge, type LabeledFlowEdge } from './LabeledEdge'
import { ReasoningNode, type ReasoningFlowNode } from './ReasoningNode'
import { ThinkingSidebar } from './ThinkingSidebar'

type WorkspaceProps = {
  question: string
  initialNodes: ReasoningFlowNode[]
  initialEdges: LabeledFlowEdge[]
  onBack: () => void
  onPersist: (nodes: ReasoningFlowNode[], edges: LabeledFlowEdge[]) => void
}

const nodeTypes = { reasoning: ReasoningNode }
const edgeTypes = { labeled: LabeledEdge }

export function Workspace({
  question,
  initialNodes,
  initialEdges,
  onBack,
  onPersist,
}: WorkspaceProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<ReasoningFlowNode>(
    initialNodes,
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState<LabeledFlowEdge>(
    initialEdges,
  )

  const handleNodeChange = useCallback(
    (
      id: string,
      patch: Partial<Pick<ReasoningNodeData, 'type' | 'title' | 'description'>>,
    ) => {
      setNodes((current) =>
        current.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, ...patch } }
            : node,
        ),
      )
    },
    [setNodes],
  )

  const handleNodeDelete = useCallback(
    (id: string) => {
      setNodes((current) => current.filter((node) => node.id !== id))
      setEdges((current) =>
        current.filter((edge) => edge.source !== id && edge.target !== id),
      )
    },
    [setNodes, setEdges],
  )

  const handleEdgeLabelChange = useCallback(
    (id: string, label: EdgeLabel) => {
      setEdges((current) =>
        current.map((edge) =>
          edge.id === id
            ? { ...edge, label, data: { ...edge.data!, label } }
            : edge,
        ),
      )
    },
    [setEdges],
  )

  const handleEdgeDelete = useCallback(
    (id: string) => {
      setEdges((current) => current.filter((edge) => edge.id !== id))
    },
    [setEdges],
  )

  // Keep handler refs fresh on every node/edge without fighting drag state
  const nodesWithHandlers = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onChange: handleNodeChange,
          onDelete: handleNodeDelete,
        },
      })),
    [nodes, handleNodeChange, handleNodeDelete],
  )

  const edgesWithHandlers = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        type: 'labeled' as const,
        data: {
          label: (edge.data?.label ?? edge.label ?? 'supports') as EdgeLabel,
          onLabelChange: handleEdgeLabelChange,
          onDelete: handleEdgeDelete,
        },
      })),
    [edges, handleEdgeLabelChange, handleEdgeDelete],
  )

  useEffect(() => {
    onPersist(nodes, edges)
  }, [nodes, edges, onPersist])

  const onConnect = useCallback(
    (connection: Connection) => {
      const id = `e-${connection.source}-${connection.target}-${Date.now()}`
      setEdges((current) =>
        addEdge(
          {
            ...connection,
            id,
            type: 'labeled',
            label: 'supports',
            data: {
              label: 'supports' as EdgeLabel,
              onLabelChange: handleEdgeLabelChange,
              onDelete: handleEdgeDelete,
            },
          },
          current,
        ),
      )
    },
    [setEdges, handleEdgeLabelChange, handleEdgeDelete],
  )

  const sidebarNodes = nodes.map((n) => ({
    id: n.id,
    type: n.data.type as CardType,
    title: n.data.title,
  }))

  const sidebarEdges = edges.map((e) => ({
    source: e.source,
    target: e.target,
    label: (e.data?.label ?? e.label ?? 'supports') as EdgeLabel,
  }))

  return (
    <div className="flex h-full w-full bg-zinc-950">
      <div className="h-full w-3/4">
        <ReactFlow
          nodes={nodesWithHandlers}
          edges={edgesWithHandlers}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          deleteKeyCode={['Backspace', 'Delete']}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#3f3f46" gap={20} size={1} />
          <Controls />
          <MiniMap
            nodeStrokeColor="#52525b"
            nodeColor="#27272a"
            maskColor="rgba(0,0,0,0.6)"
            className="!bg-zinc-900 !border-zinc-700"
          />
        </ReactFlow>
      </div>
      <div className="h-full w-1/4 min-w-[260px]">
        <ThinkingSidebar
          question={question}
          nodes={sidebarNodes}
          edges={sidebarEdges}
          onBack={onBack}
        />
      </div>
    </div>
  )
}
