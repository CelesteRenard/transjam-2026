import { useState } from "react"
import type { Puzzle } from "~/types/Level"
import type { Placed, Shape, Tiles } from "~/types/Shape"
import { getCellSize } from "~/utils/cellSize"
import type { DragPayload } from "~/utils/drag"
import { getPuzzlePieces } from "~/utils/puzzle"
import { canPlace, isSolved, rotate } from "~/utils/shape"

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), Math.max(min, max))

export const useBoard = (board: number[][], puzzle: Puzzle) => {
  let pieces = getPuzzlePieces(puzzle)
  const [orientations, setOrientations] = useState<{ shape: Shape; tiles: Tiles }[]>(() =>
    pieces.map(({ shape, tiles }) => ({ shape, tiles }))
  )
  const [placed, setPlaced] = useState<Placed[]>([])
  const [positions, setPositions] = useState(() =>
    pieces.map((_, i) => ({
      x: 0.2 + (i % 4) * 1.6 + ((i * 37) % 28) / 100,
      y: 0.1 + Math.floor(i / 4) * 1.3 + ((i * 53) % 24) / 100,
      z: i,
    }))
  )
  const [nextId, setNextId] = useState(1)
  const [dragging, setDragging] = useState<DragPayload | null>(null)
  const [hover, setHover] = useState<{ row: number; col: number } | null>(null)

  const rotateShape = (index: number) =>
    setOrientations(
      orientations.map((o, i) => (i === index ? { shape: rotate(o.shape), tiles: rotate(o.tiles) } : o))
    )

  const endDrag = () => {
    setDragging(null)
    setHover(null)
  }

  const hoverCell = (row: number, col: number) =>
    setHover((h) => (h && h.row === row && h.col === col ? h : { row, col }))

  const drop = ({ kind, id, offsetRow, offsetCol }: DragPayload, row: number, col: number) => {
    endDrag()
    const top = row - offsetRow
    const left = col - offsetCol

    if (kind === "new") {
      if (placed.some((p) => p.blockIndex === id)) return
      if (!canPlace(board, placed, orientations[id].shape, top, left)) return
      setPlaced([
        ...placed,
        { id: nextId, blockIndex: id, ...orientations[id], row: top, col: left },
      ])
      setNextId(nextId + 1)
    } else {
      const piece = placed.find((p) => p.id === id)
      if (!piece || !canPlace(board, placed, piece.shape, top, left, id)) return
      setPlaced(placed.map((p) => (p.id === id ? { ...p, row: top, col: left } : p)))
    }
  }

  const rotatePlaced = (id: number, row: number, col: number) => {
    const piece = placed.find((p) => p.id === id)
    if (!piece || !pieces[piece.blockIndex].rotable) return
    const shape = rotate(piece.shape)
    const tiles = rotate(piece.tiles)
    const anchors = [
      { row: row - (col - piece.col), col: col - (piece.shape.length - 1 - (row - piece.row)) },
      { row: piece.row, col: piece.col },
    ]
    const anchor = anchors.find((a) => canPlace(board, placed, shape, a.row, a.col, id))
    if (anchor) setPlaced(placed.map((p) => (p.id === id ? { ...p, shape, tiles, ...anchor } : p)))
  }

  const dropInTray = (
    { kind, id, offsetRow, offsetCol }: DragPayload,
    px: number,
    py: number,
    width: number,
    height: number
  ) => {
    const piece = kind === "move" ? placed.find((p) => p.id === id) : undefined
    const index = kind === "move" ? piece?.blockIndex : id
    const shape = kind === "move" ? piece?.shape : orientations[id].shape
    endDrag()
    if (index === undefined || !shape) return

    const cell = getCellSize()
    const x = px / cell - offsetCol - 0.5
    const y = py / cell - offsetRow - 0.5
    const maxX = width / cell - shape[0].length
    const maxY = height / cell - shape.length
    setPositions(positions.map((pos, i) => (i === index ? { x: clamp(x, 0, maxX), y: clamp(y, 0, maxY), z: Math.max(...positions.map((p) => p.z)) + 1 } : pos)))

    if (piece) {
      setOrientations(orientations.map((o, i) => (i === index ? { shape: piece.shape, tiles: piece.tiles } : o)))
      setPlaced(placed.filter((p) => p.id !== piece.id))
    }
  }

  const preview = (() => {
    if (!dragging || !hover) return null
    const piece = dragging.kind === "move" ? placed.find((p) => p.id === dragging.id) : undefined
    const shape = dragging.kind === "new" ? orientations[dragging.id].shape : piece?.shape
    if (!shape) return null
    const top = hover.row - dragging.offsetRow
    const left = hover.col - dragging.offsetCol
    const valid = canPlace(board, placed, shape, top, left, piece?.id)
    const cells = new Map<string, boolean>()
    shape.forEach((line, r) => line.forEach((v, c) => v && cells.set(`${top + r}-${left + c}`, valid)))
    return cells
  })()

  const trayPieces = pieces.flatMap((piece, index) => placed.some((p) => p.blockIndex === index) ? [] : [{
    index,
    name: piece.name,
    rotable: piece.rotable,
    shape: orientations[index].shape,
    tiles: orientations[index].tiles,
    position: positions[index],
  }])

  const resetBoard = () => {
  pieces = getPuzzlePieces(puzzle)
  setOrientations(() =>
    pieces.map(({ shape, tiles }) => ({ shape, tiles }))
  )
  setPlaced([])
  setPositions(() =>
    pieces.map((_, i) => ({
      x: 0.2 + (i % 4) * 1.6 + ((i * 37) % 28) / 100,
      y: 0.1 + Math.floor(i / 4) * 1.3 + ((i * 53) % 24) / 100,
      z: i,
    }))
  )
  setNextId(1)
  setDragging(null)
  setHover(null)

  }

  return { trayPieces, placed, preview, rotateShape, drop, dropInTray, rotatePlaced, startDrag: setDragging, endDrag, hoverCell, solved: isSolved(board, placed), resetBoard }
}
