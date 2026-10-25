import type { Placed } from "~/types/Shape"
import { TILE_CLASS } from "~/utils/constants"
import { allowDrop, setDragPayload, setPieceDragImage, type DragPayload } from "~/utils/drag"

type Props = {
  row: number
  col: number
  blocked: boolean
  piece?: Placed
  preview?: boolean
  onDrop: (e: React.DragEvent, row: number, col: number) => void
  onHover: (row: number, col: number) => void
  onRotatePiece: (id: number, row: number, col: number) => void
  onDragStart: (payload: DragPayload) => void
  onDragEnd: () => void
}

export const BoardCell = ({ row, col, blocked, piece, preview, onDrop, onHover, onRotatePiece, onDragStart, onDragEnd }: Props) => {
  if (blocked) return <div className="h-(--cell) w-(--cell)" />

  const tile = piece?.tiles[row - piece.row][col - piece.col]

  return (
    <div
      draggable={!!piece}
      onDragStart={(e) => {
        if (!piece) return
        const offsetRow = row - piece.row
        const offsetCol = col - piece.col
        const payload = { kind: "move", id: piece.id, offsetRow, offsetCol } satisfies DragPayload
        setDragPayload(e, payload)
        onDragStart(payload)
        const { offsetX, offsetY } = e.nativeEvent
        const { offsetWidth, offsetHeight } = e.currentTarget
        setPieceDragImage(e, piece, offsetRow, offsetCol, offsetX / offsetWidth, offsetY / offsetHeight)
      }}
      onContextMenu={(e) => {
        if (!piece) return
        e.preventDefault()
        onRotatePiece(piece.id, row, col)
      }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        allowDrop(e)
        onHover(row, col)
      }}
      onDrop={(e) => onDrop(e, row, col)}
      style={tile?.image ? { backgroundImage: `url(${tile.image})` } : undefined}
      className={`relative h-(--cell) w-(--cell) ${piece ? `${TILE_CLASS} cursor-grab` : "border-2 border-gray-400"}`}
    >
      {tile?.picto && <img src={tile.picto} alt="" className="pointer-events-none absolute left-1 top-1 h-[calc(var(--cell)/4)] w-[calc(var(--cell)/4)]" />}
      {preview !== undefined && (
        <div
          className={`pointer-events-none absolute inset-0 ${preview ? "bg-emerald-500/40" : "bg-rose-500/40"}`}
        />
      )}
    </div>
  )
}
