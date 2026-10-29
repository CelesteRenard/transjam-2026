import type { Level, Puzzle } from "~/types/Level"
import { validatePuzzle } from "~/utils/editor"
import { getPuzzlePieces } from "~/utils/puzzle"
import { ConstraintNote } from "../ConstraintNote"
import { ShapePreview } from "../ShapePreview"
import { Stage } from "../Stage"

export const PuzzlePreview = ({ puzzle, level }: { puzzle: Puzzle; level: Level }) => {
  const pieces = getPuzzlePieces(puzzle)
  const warnings = validatePuzzle(puzzle, level.board)

  return (
    <div className="flex flex-col gap-3" style={{ "--cell": "44px" } as React.CSSProperties}>
      <h3 className="font-semibold">Preview</h3>

      <div className="flex h-72 flex-col overflow-hidden border-2 border-black">
        <Stage day={level.level} actor={puzzle.actor || undefined} dialogue={puzzle.dialogue || undefined} />
      </div>

      {warnings.length ? (
        <ul className="list-disc rounded border border-amber-500 bg-amber-100 py-2 pl-7 pr-3 text-sm text-amber-900">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      ) : (
        <p className="rounded border border-emerald-500 bg-emerald-100 px-3 py-2 text-sm text-emerald-900">
          The solution matches the board and the pieces.
        </p>
      )}

      {!!pieces.length && (
        <div className="flex flex-wrap items-start gap-4 border-2 border-black bg-gray-100 p-3">
          {pieces.map((piece, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <ShapePreview shape={piece.shape} tiles={piece.tiles} />
              <span className="text-xs text-gray-600">{piece.rotable ? "rotates" : "fixed"}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {puzzle.constraints.map((constraint, i) => (
          <ConstraintNote key={i} constraint={constraint} />
        ))}
      </div>
    </div>
  )
}
