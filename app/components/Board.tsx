import type { DragEvent } from "react"
import type { Placed } from "~/types/Shape"
import { getDragPayload, type DragPayload } from "~/utils/drag"
import { findOwner } from "~/utils/shape"
import { BoardCell } from "./BoardCell"

type Props = {
  board: number[][]
  placed: Placed[]
  preview: Map<string, boolean> | null
  onDropPiece: (payload: DragPayload, row: number, col: number) => void
  onHover: (row: number, col: number) => void
  onRotatePiece: (id: number, row: number, col: number) => void
  onDragStart: (payload: DragPayload) => void
  onDragEnd: () => void
}

export const Board = ({ board, placed, preview, onDropPiece, onHover, onRotatePiece, onDragStart, onDragEnd }: Props) => {
  const handleDrop = (e: DragEvent, row: number, col: number) => {
    e.preventDefault()
    onDropPiece(getDragPayload(e), row, col)
  }

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
            onDrop={handleDrop}
            onHover={onHover}
            onRotatePiece={onRotatePiece}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))
      )}
    </div>
  )
}
