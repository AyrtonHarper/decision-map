import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type Edge,
  type EdgeProps,
} from '@xyflow/react'
import { EDGE_LABELS, type EdgeLabel } from '../types'

export type LabeledFlowEdge = Edge<{
  label: EdgeLabel
  onLabelChange: (id: string, label: EdgeLabel) => void
  onDelete: (id: string) => void
}>

export function LabeledEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  selected,
}: EdgeProps<LabeledFlowEdge>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{ stroke: selected ? '#a1a1aa' : '#71717a', strokeWidth: selected ? 2 : 1.5 }}
      />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan absolute flex items-center gap-1"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
          <select
            value={data?.label ?? 'supports'}
            onChange={(e) =>
              data?.onLabelChange(id, e.target.value as EdgeLabel)
            }
            className="rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 text-[10px] text-zinc-300 outline-none"
          >
            {EDGE_LABELS.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
          <button
            type="button"
            title="Delete edge"
            onClick={() => data?.onDelete(id)}
            className="rounded border border-zinc-700 bg-zinc-900 px-1 text-[10px] text-zinc-500 hover:text-rose-400"
          >
            ✕
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
