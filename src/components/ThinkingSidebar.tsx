import { computeSummary, computeWarnings } from '../lib/audit'
import type { CardType, EdgeLabel } from '../types'

type SidebarNode = {
  id: string
  type: CardType
  title: string
}

type SidebarEdge = {
  source: string
  target: string
  label: EdgeLabel
}

type ThinkingSidebarProps = {
  question: string
  nodes: SidebarNode[]
  edges: SidebarEdge[]
  onBack: () => void
}

function WarningList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mb-4">
      <h3 className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-xs text-zinc-600">None</p>
      ) : (
        <ul className="list-disc space-y-1 pl-4 text-sm text-amber-200/90">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function ThinkingSidebar({
  question,
  nodes,
  edges,
  onBack,
}: ThinkingSidebarProps) {
  const warnings = computeWarnings(nodes, edges)
  const summary = computeSummary(nodes, edges)

  return (
    <aside className="flex h-full w-full flex-col border-l border-zinc-800 bg-zinc-950">
      <div className="flex items-start justify-between gap-2 border-b border-zinc-800 px-4 py-3">
        <div>
          <p className="text-xs text-zinc-500">Decision Map v0.1</p>
          <h2 className="text-sm font-medium text-zinc-100">
            Thinking Check & Summary
          </h2>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
        >
          Back
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {question ? (
          <p className="mb-4 text-xs text-zinc-500">
            Question: <span className="text-zinc-300">{question}</span>
          </p>
        ) : null}

        <section className="mb-6">
          <h3 className="mb-3 text-sm font-medium text-zinc-200">
            Mechanical Warnings
          </h3>
          <WarningList
            title="Unsupported Decisions"
            items={warnings.unsupportedDecisions}
          />
          <WarningList
            title="Floating Assumptions"
            items={warnings.floatingAssumptions}
          />
          <WarningList
            title="Unmitigated Risks"
            items={warnings.unmitigatedRisks}
          />
        </section>

        <section>
          <h3 className="mb-3 text-sm font-medium text-zinc-200">
            Decision Summary
          </h3>

          <div className="mb-3">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Current Decision
            </p>
            <p className="text-sm text-zinc-100">{summary.currentDecision}</p>
          </div>

          <div className="mb-3">
            <p className="mb-1 text-xs uppercase tracking-wide text-zinc-500">
              Supporting Factors
            </p>
            {summary.supportingFactors.length === 0 ? (
              <p className="text-sm text-zinc-600">None linked yet</p>
            ) : (
              <ul className="list-disc space-y-1 pl-4 text-sm text-zinc-300">
                {summary.supportingFactors.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="mb-3">
            <p className="mb-1 text-xs uppercase tracking-wide text-zinc-500">
              Main Uncertainty
            </p>
            {summary.mainUncertainty.length === 0 ? (
              <p className="text-sm text-zinc-600">None linked yet</p>
            ) : (
              <ul className="list-disc space-y-1 pl-4 text-sm text-zinc-300">
                {summary.mainUncertainty.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-zinc-500">
              Next Action
            </p>
            <p className="text-sm text-zinc-100">{summary.nextAction}</p>
          </div>
        </section>
      </div>
    </aside>
  )
}
