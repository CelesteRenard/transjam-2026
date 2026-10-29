import { useState } from "react"
import type { Level, Puzzle, PuzzlePiece } from "~/types/Level"
import { blocks } from "~/utils/blocks"
import { blockColor, normalizeSrc } from "~/utils/editor"
import { buildTiles } from "~/utils/puzzle"
import { ShapePreview } from "../ShapePreview"
import { ImagePicker } from "./ImagePicker"
import { PuzzlePreview } from "./PuzzlePreview"

type Props = {
  index: number
  puzzle: Puzzle
  level: Level
  onChange: (puzzle: Puzzle) => void
  onRemove: () => void
  onDuplicate: () => void
}

type Picking = { kind: "actor" } | { kind: "tile"; piece: number; tile: number }

const inputClass = "rounded border border-gray-400 px-2 py-1 "
const buttonClass = "rounded border border-gray-400 px-2 py-1 text-sm hover:bg-gray-100"

const findBlock = (name: string) => blocks.find((b) => b.name === name)

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

const TileSlots = ({
  block,
  tiles,
  onPick,
  onClear,
}: {
  block: string
  tiles: string[]
  onPick: (tile: number) => void
  onClear: (tile: number) => void
}) => {
  const shape = findBlock(block)?.shape ?? []
  const picto = findBlock(block)?.picto
  let n = 0

  return (
    <div className="grid w-fit" style={{ gridTemplateColumns: `repeat(${shape[0]?.length ?? 1}, 3.5rem)` }}>
      {shape.flatMap((line, r) =>
        line.map((v, c) => {
          if (!v) return <div key={`${r}-${c}`} />
          const tile = n++
          const image = tiles[tile]
          return (
            <div key={`${r}-${c}`} className="group relative -mr-0.5 -mb-0.5">
              <button
                type="button"
                onClick={() => onPick(tile)}
                title={image ? `Tile ${tile + 1}: ${image.split("/").pop()}` : `Choose the image of tile ${tile + 1}`}
                className="flex h-14 w-14 items-center justify-center border-2 border-black bg-amber-200 bg-cover bg-center text-2xl text-black/50 hover:brightness-110"
                style={image ? { backgroundImage: `url(${normalizeSrc(image)})` } : undefined}
              >
                {!image && "+"}
                {tile === 0 && picto && (
                  <img src={picto} alt="" className="pointer-events-none absolute left-0.5 top-0.5 h-4 w-4" />
                )}
              </button>
              {image && (
                <button
                  type="button"
                  onClick={() => onClear(tile)}
                  aria-label={`Remove the image of tile ${tile + 1}`}
                  className="absolute -right-1 -top-1 hidden h-5 w-5 rounded-full bg-black text-xs text-white group-hover:block"
                >
                  ×
                </button>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

const SolutionPainter = ({ puzzle, board, onChange }: { puzzle: Puzzle; board: number[][]; onChange: (s: string[][]) => void }) => {
  const names = puzzle.pieces?.length
    ? [...new Set(puzzle.pieces.map((p) => p.block))]
    : blocks.map((b) => b.name)
  const [brush, setBrush] = useState<string | null>(null)
  const current = brush === "" ? "" : brush && names.includes(brush) ? brush : names[0] ?? ""

  const paint = (r: number, c: number) =>
    onChange(puzzle.solution.map((row, i) => row.map((x, j) => (i === r && j === c ? current : x))))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setBrush("")}
          className={`${buttonClass} ${current === "" ? "border-blue-600 ring-2 ring-blue-600" : ""}`}
        >
          Erase
        </button>
        {names.map((name) => {
          const block = findBlock(name)
          if (!block) return null
          return (
            <button
              key={name}
              type="button"
              onClick={() => setBrush(name)}
              title={name}
              style={{ background: blockColor(name), "--cell": "14px" } as React.CSSProperties}
              className={`flex items-center gap-2 rounded border border-gray-500 px-2 py-1 text-xs text-black ${current === name ? "ring-2 ring-blue-600" : ""}`}
            >
              <ShapePreview shape={block.shape} tiles={buildTiles(block.shape, undefined)} />
              {name}
            </button>
          )
        })}
      </div>

      <div className="grid w-fit select-none" style={{ gridTemplateColumns: `repeat(${board[0].length}, 4rem)` }}>
        {board.flatMap((line, r) =>
          line.map((v, c) => {
            if (!v) return <div key={`${r}-${c}`} className="h-16 w-16 bg-gray-300 " />
            const name = puzzle.solution[r]?.[c] ?? ""
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onMouseDown={() => paint(r, c)}
                onMouseEnter={(e) => e.buttons === 1 && paint(r, c)}
                title={name || "Empty"}
                style={name ? { background: blockColor(name) } : undefined}
                className="-mr-0.5 -mb-0.5 flex h-16 w-16 items-center justify-center break-all border-2 border-black bg-white p-0.5 text-[10px] leading-tight text-black "
              >
                {name}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

export const PuzzleEditor = ({ index, puzzle, level, onChange, onRemove, onDuplicate }: Props) => {
  const [picking, setPicking] = useState<Picking | null>(null)
  const pieces = puzzle.pieces ?? []
  const set = (patch: Partial<Puzzle>) => onChange({ ...puzzle, ...patch })

  const setTile = (piece: number, tile: number, path: string) => {
    const p = pieces[piece]
    const count = findBlock(p.block)?.shape.flat().filter(Boolean).length ?? 0
    const tiles = Array.from({ length: count }, (_, n) => (n === tile ? path : p.tiles?.[n] ?? ""))
    set({ pieces: pieces.map((x, j) => (j === piece ? { ...x, tiles } : x)) })
  }

  return (
    <section className="grid gap-6 rounded border-2 border-black p-4 lg:grid-cols-[minmax(0,1fr)_24rem] ">
      <div className="flex min-w-0 flex-col gap-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">Puzzle {index + 1}</h2>
          <div className="flex gap-2">
            <button type="button" onClick={onDuplicate} className={buttonClass}>
              Duplicate
            </button>
            <button type="button" onClick={onRemove} className={buttonClass}>
              Remove puzzle
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPicking({ kind: "actor" })}
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded border-2 border-dashed border-gray-400 bg-gray-100 "
          >
            {puzzle.actor ? (
              <img src={normalizeSrc(puzzle.actor)} alt="" className="h-full w-full object-contain" />
            ) : (
              <span className="text-3xl text-gray-400">+</span>
            )}
          </button>
          <div className="flex flex-col gap-1">
            <span>Character</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => setPicking({ kind: "actor" })} className={buttonClass}>
                Choose an image
              </button>
              {puzzle.actor && (
                <button type="button" onClick={() => set({ actor: "" })} className={buttonClass}>
                  Remove
                </button>
              )}
            </div>
            {puzzle.actor && <span className="text-xs text-gray-500">{puzzle.actor.split("/").pop()}</span>}
          </div>
        </div>

        <label className="flex flex-col gap-1">
          Dialogue
          <textarea
            value={puzzle.dialogue ?? ""}
            onChange={(e) => set({ dialogue: e.target.value })}
            rows={2}
            className={inputClass}
          />
        </label>

        <div className="flex flex-col gap-3">
          <h3 className="font-semibold">Pieces</h3>
          {pieces.map((piece, i) => {
            const tiles = piece.tiles ?? []
            const setPiece = (p: PuzzlePiece) => set({ pieces: pieces.map((x, j) => (j === i ? p : x)) })
            return (
              <div key={i} className="flex gap-4 rounded border border-gray-400 p-3">
                <TileSlots
                  block={piece.block}
                  tiles={tiles}
                  onPick={(tile) => setPicking({ kind: "tile", piece: i, tile })}
                  onClear={(tile) => setTile(i, tile, "")}
                />
                <div className="flex flex-1 flex-col items-start gap-2">
                  <BlockSelect value={piece.block} onChange={(block) => setPiece({ block, tiles: [] })} />
                  <span className="text-xs text-gray-500">
                    {findBlock(piece.block)?.rotable ? "Can be rotated" : "Cannot be rotated"}. Click a cell to choose its image.
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => set({ pieces: [...pieces.slice(0, i + 1), { ...piece, tiles: [...tiles] }, ...pieces.slice(i + 1)] })}
                      className={buttonClass}
                    >
                      Duplicate
                    </button>
                    <button type="button" onClick={() => set({ pieces: pieces.filter((_, j) => j !== i) })} className={buttonClass}>
                      Remove
                    </button>
                  </div>
                </div>
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
            const picto = findBlock(block)?.picto
            const setConstraint = (c: { text: string; block: string }) =>
              set({ constraints: puzzle.constraints.map((x, j) => (j === i ? c : x)) })
            return (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={text}
                  onChange={(e) => setConstraint({ text: e.target.value, block })}
                  className={`${inputClass} min-w-0 flex-1`}
                />
                <BlockSelect value={block} onChange={(b) => setConstraint({ text, block: b })} empty="No picto" />
                <span className="flex h-8 w-8 shrink-0 items-center justify-center">
                  {picto && <img src={picto} alt="" className="h-8 w-8" />}
                </span>
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
          <SolutionPainter puzzle={puzzle} board={level.board} onChange={(solution) => set({ solution })} />
        </div>
      </div>

      <div className="lg:sticky lg:top-4 lg:self-start">
        <PuzzlePreview puzzle={puzzle} level={level} />
      </div>

      {picking && (
        <ImagePicker
          scope={picking.kind === "actor" ? "actors" : "tiles"}
          value={picking.kind === "actor" ? puzzle.actor : pieces[picking.piece]?.tiles?.[picking.tile]}
          onClose={() => setPicking(null)}
          onSelect={(path) => {
            if (picking.kind === "actor") set({ actor: path })
            else setTile(picking.piece, picking.tile, path)
            setPicking(null)
          }}
        />
      )}
    </section>
  )
}
