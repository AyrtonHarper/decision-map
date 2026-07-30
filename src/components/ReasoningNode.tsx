import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import { CARD_TYPES, type CardType, type ReasoningNodeData } from '../types'

const typeAccent: Record<CardType, string> = {
  Fact: 'border-l-sky-600',
  Observation: 'border-l-teal-600',
  Assumption: 'border-l-amber-600',
  Evidence: 'border-l-emerald-600',
  Risk: 'border-l-rose-600',
  Question: 'border-l-violet-600',
  Decision: 'border-l-zinc-200',
}

export type ReasoningFlowNode = Node<ReasoningNodeData, 'reasoning'>

export function ReasoningNode({ id, data }: NodeProps<ReasoningFlowNode>) {
  return (
    <div
      className={`w-56 rounded border border-zinc-700 border-l-4 bg-zinc-900 shadow-none ${typeAccent[data.type]}`}
    >
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800 px-2 py-1.5">
        <select
          value={data.type}
          onChange={(e) =>
            data.onChange(id, { type: e.target.value as CardType })
          }
          className="nodrag nopan w-full rounded border border-zinc-700 bg-zinc-950 px-1.5 py-0.5 text-xs text-zinc-300 outline-none"
        >
          {CARD_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button
          type="button"
          title="Delete card"
          onClick={() => data.onDelete(id)}
          className="nodrag nopan shrink-0 px-1 text-xs text-zinc-500 hover:text-rose-400"
        >
          ✕
        </button>
      </div>
      <div className="space-y-1.5 p-2">
        <input
          value={data.title}
          onChange={(e) => data.onChange(id, { title: e.target.value })}
          className="nodrag nopan w-full rounded border border-transparent bg-transparent px-1 text-sm font-medium text-zinc-100 outline-none focus:border-zinc-600"
          placeholder="Title"
        />
        <textarea
          value={data.description}
          onChange={(e) => data.onChange(id, { description: e.target.value })}
          rows={2}
          className="nodrag nopan w-full resize-none rounded border border-transparent bg-transparent px-1 text-xs text-zinc-400 outline-none focus:border-zinc-600"
          placeholder="Description"
        />
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
