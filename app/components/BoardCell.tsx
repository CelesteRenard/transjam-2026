import type { Placed } from "~/types/Shape"
import { OVERLAP_CLASS, TILE_CLASS } from "~/utils/constants"
import { watchDrag, type StartDrag } from "~/utils/drag"

const CURSOR_CLASS = "z-20 outline-4 -outline-offset-4 outline-blue-700"

type Props = {
  row: number
  col: number
  blocked: boolean
  piece?: Placed
  preview?: boolean
  cursor?: boolean
  onRotatePiece: (id: number, row: number, col: number) => void
  onDragStart: StartDrag
}

export const BoardCell = ({ row, col, blocked, piece, preview, cursor, onRotatePiece, onDragStart }: Props) => {
  if (blocked)
    return <div data-blocked className={`h-(--cell) w-(--cell) ${OVERLAP_CLASS} ${cursor ? CURSOR_CLASS : ""}`} />

  const tile = piece?.tiles[row - piece.row][col - piece.col]

  return (
    <div
      data-cell={`${row}-${col}`}
      onPointerDown={(e) => {
        if (!piece) return
        const payload = { kind: "move", id: piece.id, offsetRow: row - piece.row, offsetCol: col - piece.col } as const
        const { offsetX, offsetY } = e.nativeEvent
        const { offsetWidth, offsetHeight } = e.currentTarget
        watchDrag(e, (x, y) => onDragStart(payload, offsetX / offsetWidth, offsetY / offsetHeight, x, y))
      }}
      onContextMenu={(e) => {
        if (!piece) return
        e.preventDefault()
        onRotatePiece(piece.id, row, col)
      }}
      style={tile?.image ? { backgroundImage: `url(${tile.image})` } : undefined}
      className={`relative h-(--cell) w-(--cell) ${OVERLAP_CLASS} ${piece ? `${TILE_CLASS} z-10 cursor-grab touch-none select-none` : "border-2 border-gray-400 bg-black/10"} ${cursor ? CURSOR_CLASS : ""}`}
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
