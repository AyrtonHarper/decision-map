import type { CardType, EdgeLabel } from '../types'

type AuditNode = {
  id: string
  type: CardType
  title: string
}

type AuditEdge = {
  source: string
  target: string
  label: EdgeLabel
}

export type MechanicalWarnings = {
  unsupportedDecisions: string[]
  floatingAssumptions: string[]
  unmitigatedRisks: string[]
}

export type DecisionSummary = {
  currentDecision: string
  supportingFactors: string[]
  mainUncertainty: string[]
  nextAction: string
}

function connectedIds(nodeId: string, edges: AuditEdge[]): Set<string> {
  const ids = new Set<string>()
  for (const edge of edges) {
    if (edge.source === nodeId) ids.add(edge.target)
    if (edge.target === nodeId) ids.add(edge.source)
  }
  return ids
}

export function computeWarnings(
  nodes: AuditNode[],
  edges: AuditEdge[],
): MechanicalWarnings {
  const byId = new Map(nodes.map((n) => [n.id, n]))

  const unsupportedDecisions = nodes
    .filter((n) => n.type === 'Decision')
    .filter((decision) => {
      const incomingSupports = edges.filter(
        (e) => e.target === decision.id && e.label === 'supports',
      )
      return incomingSupports.length === 0
    })
    .map((n) => n.title)

  const floatingAssumptions = nodes
    .filter((n) => n.type === 'Assumption')
    .filter((assumption) => {
      const neighbors = connectedIds(assumption.id, edges)
      for (const id of neighbors) {
        const neighbor = byId.get(id)
        if (
          neighbor &&
          (neighbor.type === 'Decision' ||
            neighbor.type === 'Fact' ||
            neighbor.type === 'Risk')
        ) {
          return false
        }
      }
      return true
    })
    .map((n) => n.title)

  const unmitigatedRisks = nodes
    .filter((n) => n.type === 'Risk')
    .filter((risk) => {
      const neighbors = connectedIds(risk.id, edges)
      let hasEvidence = false
      let hasDecision = false
      for (const id of neighbors) {
        const neighbor = byId.get(id)
        if (!neighbor) continue
        if (neighbor.type === 'Evidence') hasEvidence = true
        if (neighbor.type === 'Decision') hasDecision = true
      }
      return !(hasEvidence || hasDecision)
    })
    .map((n) => n.title)

  return { unsupportedDecisions, floatingAssumptions, unmitigatedRisks }
}

export function computeSummary(
  nodes: AuditNode[],
  edges: AuditEdge[],
): DecisionSummary {
  const decisions = nodes.filter((n) => n.type === 'Decision')
  const primary = decisions[0]
  const warnings = computeWarnings(nodes, edges)

  if (!primary) {
    return {
      currentDecision: 'No decision node yet',
      supportingFactors: [],
      mainUncertainty: [],
      nextAction: 'Add a Decision node to frame the choice.',
    }
  }

  const byId = new Map(nodes.map((n) => [n.id, n]))
  const neighbors = connectedIds(primary.id, edges)

  const supportingFactors: string[] = []
  const mainUncertainty: string[] = []
  const connectedQuestions: string[] = []

  for (const edge of edges) {
    if (edge.target === primary.id && edge.label === 'supports') {
      const source = byId.get(edge.source)
      if (
        source &&
        (source.type === 'Fact' || source.type === 'Evidence')
      ) {
        supportingFactors.push(source.title)
      }
    }
  }

  // Also include Facts/Evidence connected in any direction as supporting context
  for (const id of neighbors) {
    const neighbor = byId.get(id)
    if (!neighbor) continue
    if (
      (neighbor.type === 'Fact' || neighbor.type === 'Evidence') &&
      !supportingFactors.includes(neighbor.title)
    ) {
      // Prefer explicit supports edges; only add undirected if none listed yet
      if (supportingFactors.length === 0) {
        supportingFactors.push(neighbor.title)
      }
    }
    if (neighbor.type === 'Assumption' || neighbor.type === 'Question') {
      if (!mainUncertainty.includes(neighbor.title)) {
        mainUncertainty.push(neighbor.title)
      }
    }
    if (neighbor.type === 'Question') {
      connectedQuestions.push(neighbor.title)
    }
  }

  let nextAction = 'Review the graph and refine connections.'
  if (connectedQuestions.length > 0) {
    nextAction = connectedQuestions[0]
  } else if (warnings.unmitigatedRisks.length > 0) {
    nextAction = warnings.unmitigatedRisks[0]
  } else if (mainUncertainty.length > 0) {
    nextAction = `Clarify: ${mainUncertainty[0]}`
  }

  return {
    currentDecision: primary.title,
    supportingFactors,
    mainUncertainty,
    nextAction,
  }
}
