import type { ExtractionResult } from '../types'

/**
 * Modular extractor. Currently returns a hardcoded mock so an LLM API
 * can replace the body later without changing call sites.
 */
export function extractReasoning(
  _rawText: string,
  _question: string,
): ExtractionResult {
  return {
    cards: [
      {
        id: '1',
        type: 'Decision',
        title: 'Hold publication',
        description: 'Wait for trade confirmation',
      },
      {
        id: '2',
        type: 'Risk',
        title: 'Damage credibility',
        description: 'Publishing false news harms trust',
      },
      {
        id: '3',
        type: 'Assumption',
        title: 'Source reliability',
        description: 'Assuming leaker is accurate',
      },
      {
        id: '4',
        type: 'Fact',
        title: 'SDCC Panel next week',
        description: 'Official announcements coming soon',
      },
    ],
    edges: [
      { source: '2', target: '1', label: 'supports' },
      { source: '3', target: '1', label: 'depends on' },
    ],
  }
}

/** Simple grid layout for extracted cards. */
export function layoutCards(
  cards: ExtractionResult['cards'],
): Array<{ id: string; position: { x: number; y: number } }> {
  const cols = 2
  const xGap = 300
  const yGap = 180
  return cards.map((card, index) => ({
    id: card.id,
    position: {
      x: 40 + (index % cols) * xGap,
      y: 40 + Math.floor(index / cols) * yGap,
    },
  }))
}
