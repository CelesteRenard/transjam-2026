import { useBoard } from "~/hooks/useBoard"
import type { Level, Puzzle } from "~/types/Level"
import { useCellSize } from "~/utils/cellSize"
import { Board } from "./Board"
import { ConstraintNote } from "./ConstraintNote"
import { Stage } from "./Stage"
import { Tray } from "./Tray"

export const Game = ({ level, puzzle, onNext }: { level: Level; puzzle: Puzzle, onNext: () => void }) => {
  const { trayPieces, placed, preview, rotateShape, drop, dropInTray, rotatePlaced, startDrag, endDrag, hoverCell, solved } =
    useBoard(level.board, puzzle)

  useCellSize()

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <Stage day={level.level} actor={puzzle.actor} dialogue={puzzle.dialogue} />
      <div className="grid h-2/3 shrink-0 grid-cols-3 divide-x-2 divide-black">
        <div className="relative overflow-hidden">
          {!solved &&
            <Tray
              pieces={trayPieces}
              onRotate={rotateShape}
              onDropPiece={dropInTray}
              onDragStart={startDrag}
              onDragEnd={endDrag}
            />
          }
        </div>
        <div className="relative flex items-center justify-center">
          <Board
            board={level.board}
            placed={placed}
            preview={preview}
            onDropPiece={drop}
            onHover={hoverCell}
            onRotatePiece={rotatePlaced}
            onDragStart={startDrag}
            onDragEnd={endDrag}
          />
          {solved && (
            <p className="absolute inset-x-0 bottom-8 text-center text-xl font-semibold text-emerald-500">
              Bravo, niveau réussi !
              <button onClick={onNext} className="ml-4 rounded bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600">
                Next puzzle
              </button>
            </p>
          )}
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto p-4">
          {puzzle.constraints.map((constraint, i) => (
            <ConstraintNote key={i} constraint={constraint} />
          ))}
        </div>
      </div>
    </div>
  )
}
