import { useCallback, useMemo, useState } from 'react'
import type { LabeledFlowEdge } from './components/LabeledEdge'
import { DecisionInput } from './components/DecisionInput'
import type { ReasoningFlowNode } from './components/ReasoningNode'
import { Workspace } from './components/Workspace'
import { extractReasoning, layoutCards } from './lib/extractReasoning'
import { loadState, saveState } from './lib/storage'
import type { EdgeLabel, PersistedState } from './types'

function buildFlowFromExtraction(
  question: string,
  rawText: string,
): { nodes: ReasoningFlowNode[]; edges: LabeledFlowEdge[] } {
  const extracted = extractReasoning(rawText, question)
  const positions = layoutCards(extracted.cards)
  const positionById = new Map(positions.map((p) => [p.id, p.position]))

  const nodes: ReasoningFlowNode[] = extracted.cards.map((card) => ({
    id: card.id,
    type: 'reasoning',
    position: positionById.get(card.id) ?? { x: 0, y: 0 },
    data: {
      type: card.type,
      title: card.title,
      description: card.description,
      onChange: () => undefined,
      onDelete: () => undefined,
    },
  }))

  const edges: LabeledFlowEdge[] = extracted.edges.map((edge, index) => ({
    id: `e-${edge.source}-${edge.target}-${index}`,
    source: edge.source,
    target: edge.target,
    type: 'labeled',
    label: edge.label,
    data: {
      label: edge.label,
      onLabelChange: () => undefined,
      onDelete: () => undefined,
    },
  }))

  return { nodes, edges }
}

function hydrateFromStorage(saved: PersistedState): {
  view: 'input' | 'workspace'
  question: string
  rawText: string
  nodes: ReasoningFlowNode[]
  edges: LabeledFlowEdge[]
} {
  return {
    view: saved.view,
    question: saved.question,
    rawText: saved.rawText,
    nodes: saved.nodes.map((node) => ({
      id: node.id,
      type: 'reasoning' as const,
      position: node.position,
      data: {
        type: node.data.type,
        title: node.data.title,
        description: node.data.description,
        onChange: () => undefined,
        onDelete: () => undefined,
      },
    })),
    edges: saved.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'labeled' as const,
      label: edge.label,
      data: {
        label: edge.label,
        onLabelChange: () => undefined,
        onDelete: () => undefined,
      },
    })),
  }
}

function toPersisted(
  view: 'input' | 'workspace',
  question: string,
  rawText: string,
  nodes: ReasoningFlowNode[],
  edges: LabeledFlowEdge[],
): PersistedState {
  return {
    view,
    question,
    rawText,
    nodes: nodes.map((node) => ({
      id: node.id,
      position: node.position,
      data: {
        type: node.data.type,
        title: node.data.title,
        description: node.data.description,
      },
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: (edge.data?.label ?? edge.label ?? 'supports') as EdgeLabel,
    })),
  }
}

export default function App() {
  const initial = useMemo(() => {
    const saved = loadState()
    if (saved) return hydrateFromStorage(saved)
    return {
      view: 'input' as const,
      question: '',
      rawText: '',
      nodes: [] as ReasoningFlowNode[],
      edges: [] as LabeledFlowEdge[],
    }
  }, [])

  const [view, setView] = useState<'input' | 'workspace'>(initial.view)
  const [question, setQuestion] = useState(initial.question)
  const [rawText, setRawText] = useState(initial.rawText)
  const [nodes, setNodes] = useState<ReasoningFlowNode[]>(initial.nodes)
  const [edges, setEdges] = useState<LabeledFlowEdge[]>(initial.edges)
  const [workspaceKey, setWorkspaceKey] = useState(0)

  const persist = useCallback(
    (
      nextView: 'input' | 'workspace',
      nextQuestion: string,
      nextRawText: string,
      nextNodes: ReasoningFlowNode[],
      nextEdges: LabeledFlowEdge[],
    ) => {
      saveState(
        toPersisted(nextView, nextQuestion, nextRawText, nextNodes, nextEdges),
      )
    },
    [],
  )

  const handleMap = () => {
    const built = buildFlowFromExtraction(question, rawText)
    setNodes(built.nodes)
    setEdges(built.edges)
    setView('workspace')
    setWorkspaceKey((k) => k + 1)
    persist('workspace', question, rawText, built.nodes, built.edges)
  }

  const handleBack = () => {
    setView('input')
    persist('input', question, rawText, nodes, edges)
  }

  const handlePersistGraph = useCallback(
    (nextNodes: ReasoningFlowNode[], nextEdges: LabeledFlowEdge[]) => {
      setNodes(nextNodes)
      setEdges(nextEdges)
      persist('workspace', question, rawText, nextNodes, nextEdges)
    },
    [persist, question, rawText],
  )

  if (view === 'workspace') {
    return (
      <Workspace
        key={workspaceKey}
        question={question}
        initialNodes={nodes}
        initialEdges={edges}
        onBack={handleBack}
        onPersist={handlePersistGraph}
      />
    )
  }

  return (
    <DecisionInput
      question={question}
      rawText={rawText}
      onQuestionChange={setQuestion}
      onRawTextChange={setRawText}
      onMap={handleMap}
    />
  )
}
