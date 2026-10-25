import type { Level, Puzzle } from "~/types/Level"
import { blocks } from "~/utils/blocks"

type Props = {
  index: number
  puzzle: Puzzle
  board: Level["board"]
  onChange: (puzzle: Puzzle) => void
  onRemove: () => void
}

const cellCount = (blockName: string) =>
  blocks.find((b) => b.name === blockName)?.shape.flat().filter(Boolean).length ?? 0

const inputClass = "rounded border border-gray-400 px-2 py-1 dark:bg-gray-900"
const buttonClass = "rounded border border-gray-400 px-2 py-1 text-sm"

const BlockSelect = ({ value, onChange, empty }: { value: string; onChange: (v: string) => void; empty?: string }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
    {empty !== undefined && <option value="">{empty}</option>}
    {blocks.map((b) => (
      <option key={b.name} value={b.name}>
        {b.name}
      </option>
    ))}
  </select>
)

export const PuzzleEditor = ({ index, puzzle, board, onChange, onRemove }: Props) => {
  const pieces = puzzle.pieces ?? []
  const set = (patch: Partial<Puzzle>) => onChange({ ...puzzle, ...patch })

  return (
    <section className="flex flex-col gap-4 rounded border-2 border-black p-4 dark:border-gray-500">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Puzzle {index + 1}</h2>
        <button type="button" onClick={onRemove} className={buttonClass}>
          Remove puzzle
        </button>
      </div>

      <label className="flex flex-col gap-1">
        Character image
        <input
          value={puzzle.actor ?? ""}
          onChange={(e) => set({ actor: e.target.value })}
          placeholder="/assets/images/gameplay/actors/shark.png"
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1">
        Dialogue
        <textarea
          value={puzzle.dialogue ?? ""}
          onChange={(e) => set({ dialogue: e.target.value })}
          rows={2}
          className={inputClass}
        />
      </label>

      <div className="flex flex-col gap-2">
        <h3 className="font-semibold">Pieces</h3>
        {pieces.map((piece, i) => {
          const tiles = Array.from({ length: cellCount(piece.block) }, (_, n) => piece.tiles?.[n] ?? "")
          const setPiece = (p: typeof piece) => set({ pieces: pieces.map((x, j) => (j === i ? p : x)) })
          return (
            <div key={i} className="flex flex-col gap-1 rounded border border-gray-400 p-2">
              <div className="flex items-center gap-2">
                <BlockSelect value={piece.block} onChange={(block) => setPiece({ block, tiles: [] })} />
                <button type="button" onClick={() => set({ pieces: pieces.filter((_, j) => j !== i) })} className={buttonClass}>
                  Remove
                </button>
              </div>
              {tiles.map((tile, n) => (
                <input
                  key={n}
                  value={tile}
                  onChange={(e) => setPiece({ ...piece, tiles: tiles.map((t, m) => (m === n ? e.target.value : t)) })}
                  placeholder={`Tile ${n + 1} image (reading order)`}
                  className={inputClass}
                />
              ))}
            </div>
          )
        })}
        <button
          type="button"
          onClick={() => set({ pieces: [...pieces, { block: blocks[0].name, tiles: [] }] })}
          className={`${buttonClass} w-fit`}
        >
          Add piece
        </button>
        <p className="text-sm text-gray-500">Without pieces, they are deduced from the solution.</p>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-semibold">Constraints</h3>
        {puzzle.constraints.map((constraint, i) => {
          const { text, block } = typeof constraint === "string" ? { text: constraint, block: "" } : { block: "", ...constraint }
          const setConstraint = (c: { text: string; block: string }) =>
            set({ constraints: puzzle.constraints.map((x, j) => (j === i ? c : x)) })
          return (
            <div key={i} className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setConstraint({ text: e.target.value, block })}
                className={`${inputClass} flex-1`}
              />
              <BlockSelect value={block} onChange={(b) => setConstraint({ text, block: b })} empty="No picto" />
              <button
                type="button"
                onClick={() => set({ constraints: puzzle.constraints.filter((_, j) => j !== i) })}
                className={buttonClass}
              >
                Remove
              </button>
            </div>
          )
        })}
        <button
          type="button"
          onClick={() => set({ constraints: [...puzzle.constraints, { text: "", block: "" }] })}
          className={`${buttonClass} w-fit`}
        >
          Add constraint
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-semibold">Solution</h3>
        <div className="grid w-fit gap-1" style={{ gridTemplateColumns: `repeat(${board[0].length}, auto)` }}>
          {board.flatMap((line, r) =>
            line.map((v, c) =>
              v ? (
                <BlockSelect
                  key={`${r}-${c}`}
                  value={puzzle.solution[r]?.[c] ?? ""}
                  empty="-"
                  onChange={(name) =>
                    set({ solution: puzzle.solution.map((row, i) => row.map((x, j) => (i === r && j === c ? name : x))) })
                  }
                />
              ) : (
                <div key={`${r}-${c}`} />
              )
            )
          )}
        </div>
      </div>
    </section>
  )
}
