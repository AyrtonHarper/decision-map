type DecisionInputProps = {
  question: string
  rawText: string
  onQuestionChange: (value: string) => void
  onRawTextChange: (value: string) => void
  onMap: () => void
}

export function DecisionInput({
  question,
  rawText,
  onQuestionChange,
  onRawTextChange,
  onMap,
}: DecisionInputProps) {
  return (
    <div className="flex min-h-full items-center justify-center bg-zinc-950 px-4 py-10 text-zinc-300">
      <div className="w-full max-w-2xl">
        <header className="mb-8">
          <h1 className="text-2xl font-medium tracking-tight text-zinc-100">
            Decision Map v0.1
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Dump thoughts first. Structure them second.
          </p>
        </header>

        <label className="mb-2 block text-sm text-zinc-400">
          What are you trying to decide?
        </label>
        <input
          type="text"
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          placeholder="e.g. Should we publish this story now?"
          className="mb-5 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-zinc-500"
        />

        <label className="mb-2 block text-sm text-zinc-400">
          Dump your thoughts freely. Do not organise them.
        </label>
        <textarea
          value={rawText}
          onChange={(e) => onRawTextChange(e.target.value)}
          rows={12}
          placeholder="Write everything on your mind…"
          className="mb-6 w-full resize-y rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-zinc-500"
        />

        <button
          type="button"
          onClick={onMap}
          disabled={!question.trim() && !rawText.trim()}
          className="rounded bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
        >
          Map My Thinking
        </button>
      </div>
    </div>
  )
}
