import { Howl } from 'howler'
import { useEffect, useRef, useState } from "react"
import type { Puzzle } from "~/types/Level"
import type { Placed, Shape, Tiles } from "~/types/Shape"
import { getSettings } from "~/utils/settings"
import { getCellSize } from "~/utils/cellSize"
import type { Drag, DragPayload } from "~/utils/drag"
import { getPuzzlePieces } from "~/utils/puzzle"
import { canPlace, isSolved, rotate } from "~/utils/shape"

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), Math.max(min, max))

const sounds: Partial<Record<"pick" | "place" | "rotate", Howl>> = {}
const playSound = (name: "pick" | "place" | "rotate") => {
  if (typeof window === "undefined") return
  const sound = (sounds[name] ??= new Howl({ src: [`/audio/fx/${name}.ogg`] }))
  sound.volume(getSettings().fx)
  sound.play()
}

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
  const [dragging, setDragging] = useState<Drag | null>(null)
  const [hover, setHover] = useState<{ row: number; col: number } | null>(null)

  const rotateShape = (index: number) => {
    playSound("rotate")
    setOrientations(
      orientations.map((o, i) => (i === index ? { shape: rotate(o.shape), tiles: rotate(o.tiles) } : o))
    )
  }

  const startDrag = (
    payload: DragPayload,
    fx: number,
    fy: number,
    x: number,
    y: number,
    origin: Drag["source"] = "pointer"
  ) => {
    const piece = payload.kind === "new" ? orientations[payload.id] : placed.find((p) => p.id === payload.id)
    if (!piece) return
    playSound("pick")
    setDragging({ ...payload, shape: piece.shape, tiles: piece.tiles, fx, fy, x, y, source: origin })
  }

  const endDrag = () => {
    setDragging(null)
    setHover(null)
  }

  const keepRotation = (drag: Drag) => {
    if (drag.kind !== "new") return
    setOrientations((os) => os.map((o, i) => (i === drag.id ? { shape: drag.shape, tiles: drag.tiles } : o)))
  }

  const cancelDrag = () => {
    if (dragging) keepRotation(dragging)
    endDrag()
  }

  const rotateDragged = () => {
    if (!dragging) return
    const blockIndex = dragging.kind === "new" ? dragging.id : placed.find((p) => p.id === dragging.id)?.blockIndex
    if (blockIndex === undefined || !pieces[blockIndex].rotable) return
    playSound("rotate")
    const { shape, tiles, offsetRow, offsetCol, fx, fy } = dragging
    setDragging({
      ...dragging,
      shape: rotate(shape),
      tiles: rotate(tiles),
      offsetRow: offsetCol,
      offsetCol: shape.length - 1 - offsetRow,
      fx: 1 - fy,
      fy: fx,
    })
  }

  const hoverCell = (row: number, col: number) =>
    setHover((h) => (h && h.row === row && h.col === col ? h : { row, col }))

  const drop = (row: number, col: number) => {
    const drag = dragging
    endDrag()
    if (!drag) return
    const top = row - drag.offsetRow
    const left = col - drag.offsetCol

    if (drag.kind === "new") {
      keepRotation(drag)
      if (placed.some((p) => p.blockIndex === drag.id)) return
      if (!canPlace(board, placed, drag.shape, top, left)) return
      playSound("place")
      setPlaced([
        ...placed,
        { id: nextId, blockIndex: drag.id, shape: drag.shape, tiles: drag.tiles, row: top, col: left },
      ])
      setNextId(nextId + 1)
    } else {
      if (!canPlace(board, placed, drag.shape, top, left, drag.id)) return
      playSound("place")
      setPlaced(
        placed.map((p) => (p.id === drag.id ? { ...p, shape: drag.shape, tiles: drag.tiles, row: top, col: left } : p))
      )
    }
  }

  const rotatePlaced = (id: number, row: number, col: number) => {
    const piece = placed.find((p) => p.id === id)
    if (!piece || !pieces[piece.blockIndex].rotable) return false
    const shape = rotate(piece.shape)
    const tiles = rotate(piece.tiles)
    const anchors = [
      { row: row - (col - piece.col), col: col - (piece.shape.length - 1 - (row - piece.row)) },
      { row: piece.row, col: piece.col },
    ]
    const anchor = anchors.find((a) => canPlace(board, placed, shape, a.row, a.col, id))
    if (anchor) playSound("rotate")
    if (anchor) setPlaced(placed.map((p) => (p.id === id ? { ...p, shape, tiles, ...anchor } : p)))
    return !!anchor
  }

  const dropInTray = (px: number, py: number, width: number, height: number) => {
    const drag = dragging
    endDrag()
    if (!drag) return
    const index = drag.kind === "move" ? placed.find((p) => p.id === drag.id)?.blockIndex : drag.id
    if (index === undefined) return

    const cell = getCellSize()
    const x = px / cell - drag.offsetCol - drag.fx
    const y = py / cell - drag.offsetRow - drag.fy
    const maxX = width / cell - drag.shape[0].length
    const maxY = height / cell - drag.shape.length
    setPositions(positions.map((pos, i) => (i === index ? { x: clamp(x, 0, maxX), y: clamp(y, 0, maxY), z: Math.max(...positions.map((p) => p.z)) + 1 } : pos)))
    setOrientations(orientations.map((o, i) => (i === index ? { shape: drag.shape, tiles: drag.tiles } : o)))
    if (drag.kind === "move") setPlaced(placed.filter((p) => p.id !== drag.id))
  }

  const canDrop = (row: number, col: number) =>
    !!dragging &&
    !(dragging.kind === "new" && placed.some((p) => p.blockIndex === dragging.id)) &&
    canPlace(
      board,
      placed,
      dragging.shape,
      row - dragging.offsetRow,
      col - dragging.offsetCol,
      dragging.kind === "move" ? dragging.id : undefined
    )

  const returnToTray = (id: number) => {
    const piece = placed.find((p) => p.id === id)
    if (!piece) return
    setOrientations(orientations.map((o, i) => (i === piece.blockIndex ? { shape: piece.shape, tiles: piece.tiles } : o)))
    setPositions(positions.map((pos, i) => (i === piece.blockIndex ? { ...pos, z: Math.max(...positions.map((p) => p.z)) + 1 } : pos)))
    setPlaced(placed.filter((p) => p.id !== id))
  }

  const latest = useRef({ drop, dropInTray, rotateDragged, cancelDrag })
  latest.current = { drop, dropInTray, rotateDragged, cancelDrag }
  const isDragging = dragging !== null && dragging.source === "pointer"

  useEffect(() => {
    if (!isDragging) return
    const cellAt = (x: number, y: number) => {
      const el = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-cell]")
      return el ? (el.dataset.cell!.split("-").map(Number) as [number, number]) : null
    }

    const move = (e: PointerEvent) => {
      const cell = cellAt(e.clientX, e.clientY)
      if (cell) hoverCell(...cell)
      else setHover(null)
    }
    const up = (e: PointerEvent) => {
      const cell = cellAt(e.clientX, e.clientY)
      const tray = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-tray]")
      if (cell) latest.current.drop(...cell)
      else if (tray) {
        const rect = tray.getBoundingClientRect()
        latest.current.dropInTray(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height)
      } else latest.current.cancelDrag()
    }
    const key = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault()
        if (!e.repeat) latest.current.rotateDragged()
      } else if (e.key === "Escape") latest.current.cancelDrag()
    }
    const cancel = () => latest.current.cancelDrag()
    const context = (e: MouseEvent) => {
      e.preventDefault()
      latest.current.rotateDragged()
    }

    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up)
    window.addEventListener("pointercancel", cancel)
    window.addEventListener("keydown", key)
    window.addEventListener("contextmenu", context)
    document.body.style.cursor = "grabbing"
    return () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
      window.removeEventListener("pointercancel", cancel)
      window.removeEventListener("keydown", key)
      window.removeEventListener("contextmenu", context)
      document.body.style.cursor = ""
    }
  }, [isDragging])

  const preview = (() => {
    if (!dragging || !hover) return null
    const top = hover.row - dragging.offsetRow
    const left = hover.col - dragging.offsetCol
    const valid = canPlace(board, placed, dragging.shape, top, left, dragging.kind === "move" ? dragging.id : undefined)
    const cells = new Map<string, boolean>()
    dragging.shape.forEach((line, r) => line.forEach((v, c) => v && cells.set(`${top + r}-${left + c}`, valid)))
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

  return { trayPieces, placed, preview, dragging, rotateShape, rotatePlaced, startDrag, drop, cancelDrag, rotateDragged, hoverCell, canDrop, returnToTray, solved: isSolved(board, placed, pieces.map((p) => p.name), puzzle.solution), resetBoard }
}
