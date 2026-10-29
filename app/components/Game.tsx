import { useBoard } from "~/hooks/useBoard"
import { useKeyboard } from "~/hooks/useKeyboard"
import type { Level, Puzzle } from "~/types/Level"
import { useCellSize } from "~/utils/cellSize"
import { Board } from "./Board"
import { DragGhost } from "./DragGhost"
import { ConstraintNote } from "./ConstraintNote"
import { PanelButton } from "./Modal"
import { Stage } from "./Stage"
import { Tray } from "./Tray"

export const Game = ({ level, puzzle, onNext }: { level: Level; puzzle: Puzzle, onNext: () => void }) => {
  const api = useBoard(level.board, puzzle)
  const { trayPieces, placed, preview, dragging, rotateShape, rotatePlaced, startDrag, solved } = api
  const { cursor, selectedPiece } = useKeyboard(level, puzzle, api)

  useCellSize()

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <Stage day={level.level} actor={puzzle.actor} dialogue={puzzle.dialogue} />
      <div className="grid h-2/3 shrink-0 grid-cols-3 divide-x-2 divide-black">
        <div className="relative overflow-hidden">
          {!solved &&
            <Tray
              pieces={trayPieces}
              selectedPiece={selectedPiece}
              onRotate={rotateShape}
              onDragStart={startDrag}
            />
          }
        </div>
        <div className="relative flex items-center justify-center">
          <div className={`transition-opacity duration-500 ${solved ? "opacity-50" : ""}`}>
            <Board
              board={level.board}
              placed={placed}
              preview={preview}
              cursor={cursor}
              onRotatePiece={rotatePlaced}
              onDragStart={startDrag}
            />
          </div>
          {solved && (
            <img
              src="/assets/images/gameplay/stamps/stamp.jpg"
              alt="Official approval"
              className="stamp pointer-events-none absolute z-30 aspect-square h-1/4 mix-blend-multiply"
            />
          )}
          {solved && (
            <PanelButton autoFocus onClick={onNext} className="absolute bottom-8 left-1/2 -translate-x-1/2">
              Next
            </PanelButton>
          )}
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto p-4">
          {puzzle.constraints.map((constraint, i) => (
            <ConstraintNote key={i} constraint={constraint} />
          ))}
        </div>
      </div>
      {dragging?.source === "pointer" && <DragGhost drag={dragging} />}
    </div>
  )
}
