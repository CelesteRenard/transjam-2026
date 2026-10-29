import type { Placed } from "~/types/Shape"
import type { StartDrag } from "~/utils/drag"
import { findOwner } from "~/utils/shape"
import { BoardCell } from "./BoardCell"

type Props = {
  board: number[][]
  placed: Placed[]
  preview: Map<string, boolean> | null
  cursor?: { row: number; col: number } | null
  onRotatePiece: (id: number, row: number, col: number) => void
  onDragStart: StartDrag
}

export const Board = ({ board, placed, preview, cursor, onRotatePiece, onDragStart }: Props) => {
  return (
    <div className="grid" style={{ gridTemplateColumns: `repeat(${board[0].length}, auto)` }}>
      {board.flatMap((line, row) =>
        line.map((v, col) => (
          <BoardCell
            key={`${row}-${col}`}
            row={row}
            col={col}
            blocked={!v}
            piece={findOwner(placed, row, col)}
            preview={preview?.get(`${row}-${col}`)}
            cursor={cursor?.row === row && cursor.col === col}
            onRotatePiece={onRotatePiece}
            onDragStart={onDragStart}
          />
        ))
      )}
    </div>
  )
}
