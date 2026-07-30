export const CARD_TYPES = [
  'Fact',
  'Observation',
  'Assumption',
  'Evidence',
  'Risk',
  'Question',
  'Decision',
] as const

export type CardType = (typeof CARD_TYPES)[number]

export const EDGE_LABELS = [
  'supports',
  'challenges',
  'depends on',
  'leads to',
] as const

export type EdgeLabel = (typeof EDGE_LABELS)[number]

export type ReasoningCard = {
  id: string
  type: CardType
  title: string
  description: string
}

export type ReasoningEdge = {
  source: string
  target: string
  label: EdgeLabel
}

export type ExtractionResult = {
  cards: ReasoningCard[]
  edges: ReasoningEdge[]
}

export type ReasoningNodeData = {
  type: CardType
  title: string
  description: string
  onChange: (id: string, patch: Partial<Pick<ReasoningNodeData, 'type' | 'title' | 'description'>>) => void
  onDelete: (id: string) => void
}

export type PersistedState = {
  view: 'input' | 'workspace'
  question: string
  rawText: string
  nodes: Array<{
    id: string
    position: { x: number; y: number }
    data: {
      type: CardType
      title: string
      description: string
    }
  }>
  edges: Array<{
    id: string
    source: string
    target: string
    label: EdgeLabel
  }>
}
