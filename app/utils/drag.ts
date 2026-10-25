import type { DragEvent } from "react"
import type { Placed } from "~/types/Shape"
import { getCellSize } from "./cellSize"
import { CELL_OVERLAP, OVERLAP_CLASS, TILE_CLASS } from "./constants"

export type DragPayload = {
  kind: "new" | "move"
  id: number
  offsetRow: number
  offsetCol: number
}

export const setDragPayload = (e: DragEvent, { kind, id, offsetRow, offsetCol }: DragPayload) =>
  e.dataTransfer.setData("text/plain", `${kind}:${id}:${offsetRow}:${offsetCol}`)

export const getDragPayload = (e: DragEvent): DragPayload => {
  const [kind, id, offsetRow, offsetCol] = e.dataTransfer.getData("text/plain").split(":")
  return { kind: kind as DragPayload["kind"], id: Number(id), offsetRow: Number(offsetRow), offsetCol: Number(offsetCol) }
}

export const allowDrop = (e: DragEvent) => e.preventDefault()

const CELL_GAP = 0

export const setPieceDragImage = (
  e: DragEvent,
  piece: Pick<Placed, "shape" | "tiles">,
  offsetRow: number,
  offsetCol: number,
  fx: number,
  fy: number
) => {
  const cellSize = getCellSize()
  const ghost = document.createElement("div")
  ghost.style.cssText = `position:fixed;top:-9999px;left:-9999px;display:grid;gap:${CELL_GAP}px;grid-template-columns:repeat(${piece.shape[0].length},${cellSize}px)`
  piece.shape.forEach((line, r) =>
    line.forEach((v, c) => {
      const cell = document.createElement("div")
      cell.style.height = `${cellSize}px`
      cell.className = OVERLAP_CLASS
      const tile = piece.tiles[r][c]
      if (v) {
        cell.className = TILE_CLASS
        if (tile?.image) cell.style.backgroundImage = `url(${tile.image})`
        if (tile?.picto) {
          const picto = document.createElement("img")
          picto.src = tile.picto
          picto.className = "absolute left-1 top-1"
          picto.style.width = picto.style.height = `${cellSize / 4}px`
          cell.appendChild(picto)
        }
      }
      ghost.appendChild(cell)
    })
  )
  document.body.appendChild(ghost)

  const pitch = cellSize + CELL_GAP - CELL_OVERLAP
  e.dataTransfer.setDragImage(ghost, offsetCol * pitch + fx * cellSize, offsetRow * pitch + fy * cellSize)
  setTimeout(() => ghost.remove(), 0)
}
