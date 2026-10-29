import type { Level } from "~/types/Level"
import { resizeLevel } from "~/utils/editor"

const NumberField = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
  <label className="flex items-center gap-2">
    {label}
    <input
      type="number"
      min={1}
      max={10}
      value={value}
      onChange={(e) => onChange(Math.min(10, Math.max(1, Number(e.target.value) || 1)))}
      className="w-16 rounded border border-gray-400 px-2 py-1"
    />
  </label>
)

export const BoardEditor = ({ level, onChange }: { level: Level; onChange: (level: Level) => void }) => {
  const rows = level.board.length
  const cols = level.board[0].length

  const toggle = (r: number, c: number) =>
    onChange({ ...level, board: level.board.map((line, i) => line.map((v, j) => (i === r && j === c ? 1 - v : v))) })

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold">Board</h2>
      <div className="flex gap-4">
        <NumberField label="Rows" value={rows} onChange={(v) => onChange(resizeLevel(level, v, cols))} />
        <NumberField label="Columns" value={cols} onChange={(v) => onChange(resizeLevel(level, rows, v))} />
      </div>
      <div className="grid w-fit" style={{ gridTemplateColumns: `repeat(${cols}, 3rem)` }}>
        {level.board.flatMap((line, r) =>
          line.map((v, c) => (
            <button
              key={`${r}-${c}`}
              type="button"
              onClick={() => toggle(r, c)}
              title={v ? "Playable" : "Blocked"}
              className={`h-12 w-12 border-2 border-gray-400 ${v ? "bg-white" : "bg-gray-400"}`}
            />
          ))
        )}
      </div>
      <p className="text-sm text-gray-500">Click a cell: white = a piece can go there, grey = nothing can.</p>
    </section>
  )
}
