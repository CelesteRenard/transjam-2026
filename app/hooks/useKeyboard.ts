import { useEffect, useRef, useState } from "react"
import type { Level, Puzzle } from "~/types/Level"
import {
  cellText,
  describeBoard,
  describeConstraints,
  describePiece,
  describeStatus,
  pieceName,
  shapeText,
} from "~/utils/describe"
import { getPuzzlePieces } from "~/utils/puzzle"
import { canPlace, findOwner, rotate } from "~/utils/shape"
import { announce } from "~/utils/speech"
import type { useBoard } from "./useBoard"

type Zone = "tray" | "board"

const ARROWS: Record<string, [number, number]> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
}

const firstCell = (shape: number[][]) => {
  for (let r = 0; r < shape.length; r++) for (let c = 0; c < shape[r].length; c++) if (shape[r][c]) return { r, c }
  return { r: 0, c: 0 }
}

export const useKeyboard = (level: Level, puzzle: Puzzle, api: ReturnType<typeof useBoard>) => {
  const { board } = level
  const pieces = getPuzzlePieces(puzzle)
  const [zone, setZone] = useState<Zone>("tray")
  const [trayPos, setTrayPos] = useState(0)
  const [cursor, setCursor] = useState({ row: 0, col: 0 })
  const [active, setActive] = useState(false)
  const note = useRef("")

  const { dragging, trayPieces, placed } = api
  const holding = dragging?.source === "keyboard"
  const pos = Math.min(trayPos, trayPieces.length - 1)
  const selected = trayPieces[pos]

  const status = (row: number, col: number) =>
    `Row ${row + 1}, column ${col + 1}, ${cellText(board, placed, pieces, row, col)}.`

  useEffect(() => {
    const actor = /actors\/([^/.]+)/.exec(puzzle.actor ?? "")?.[1]
    announce(
      [
        `Day ${level.level}.`,
        puzzle.dialogue ? `${actor ? `${actor} says: ` : ""}${puzzle.dialogue}` : "",
        `Board: ${board.length} rows by ${board[0].length} columns, ${pieces.length} pieces.`,
        "Press C for the constraints, S for the status, H for help.",
      ]
        .filter(Boolean)
        .join(" ")
    )
  }, [])

  useEffect(() => {
    if (api.solved) announce("Puzzle solved! Press Enter for the next puzzle.", { queue: true })
  }, [api.solved])

  useEffect(() => {
    if (!holding) return
    api.hoverCell(cursor.row, cursor.col)
    const fits = api.canDrop(cursor.row, cursor.col)
    announce(`${note.current}Row ${cursor.row + 1}, column ${cursor.col + 1}. ${fits ? "Can be placed here" : "Cannot be placed here"}.`)
    note.current = ""
  }, [holding, cursor.row, cursor.col, dragging?.shape])

  const pickUp = (kind: "new" | "move", id: number, offsetRow: number, offsetCol: number, from: { row: number; col: number }, blockIndex: number) => {
    note.current = `Holding ${pieceName(pieces, blockIndex)}. `
    setCursor(from)
    setZone("board")
    api.startDrag({ kind, id, offsetRow, offsetCol }, 0.5, 0.5, 0, 0, "keyboard")
  }

  const run = (e: KeyboardEvent): boolean => {
    if (dragging && !holding) return false

    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
    const arrow = ARROWS[key]
    const rotateKey = key === " " || key === "r"
    const { rows, cols } = { rows: board.length, cols: board[0].length }

    if (key === "c") return announce(describeConstraints(puzzle, pieces)), true
    if (key === "d") return announce(puzzle.dialogue ?? "Nothing to say."), true
    if (key === "s") return announce(describeStatus(board, placed, pieces)), true
    if (key === "g") return announce(describeBoard(board, placed, pieces)), true

    if (holding && dragging) {
      const blockIndex = dragging.kind === "new" ? dragging.id : placed.find((p) => p.id === dragging.id)?.blockIndex ?? 0
      if (arrow) {
        const row = Math.min(Math.max(cursor.row + arrow[0], 0), rows - 1)
        const col = Math.min(Math.max(cursor.col + arrow[1], 0), cols - 1)
        if (row === cursor.row && col === cursor.col) announce("Edge of the board.")
        else setCursor({ row, col })
      } else if (key === "Enter") {
        if (!api.canDrop(cursor.row, cursor.col)) {
          announce("Cannot place here. Move the piece, or press R to rotate it.")
        } else {
          const left = pieces.length - placed.length - (dragging.kind === "new" ? 1 : 0)
          api.drop(cursor.row, cursor.col)
          announce(
            `Placed ${pieceName(pieces, blockIndex)} at row ${cursor.row - dragging.offsetRow + 1}, column ${cursor.col - dragging.offsetCol + 1}. ${left ? `${left} left in the tray.` : "All pieces are placed."}`
          )
        }
      } else if (rotateKey) {
        if (!pieces[blockIndex].rotable) announce("This piece cannot be rotated.")
        else {
          note.current = "Rotated. "
          api.rotateDragged()
        }
      } else if (key === "Escape") {
        api.cancelDrag()
        setZone(dragging.kind === "new" ? "tray" : "board")
        announce("Put back.")
      } else if (key === "t" || key === "b") announce("Place the piece or press Escape first.")
      else return false
      return true
    }

    if (key === "t") {
      setZone("tray")
      announce(selected ? `Tray. Piece ${pos + 1} of ${trayPieces.length}: ${describePiece(puzzle, pieces, selected.index, selected.shape)}` : "The tray is empty.")
      return true
    }
    if (key === "b") {
      setZone("board")
      announce(`Board, ${rows} rows by ${cols} columns. ${status(cursor.row, cursor.col)}`)
      return true
    }

    if (zone === "tray") {
      if (arrow) {
        if (!trayPieces.length) return announce("The tray is empty. Press B for the board."), true
        const next = (pos + (arrow[0] + arrow[1] < 0 ? -1 : 1) + trayPieces.length) % trayPieces.length
        const piece = trayPieces[next]
        setTrayPos(next)
        announce(`Piece ${next + 1} of ${trayPieces.length}: ${describePiece(puzzle, pieces, piece.index, piece.shape)}`)
      } else if (key === "Enter") {
        if (!selected) return announce("The tray is empty. Press B for the board."), true
        const { r, c } = firstCell(selected.shape)
        let from = { row: r, col: c }
        search: for (let top = 0; top < rows; top++)
          for (let left = 0; left < cols; left++)
            if (canPlace(board, placed, selected.shape, top, left)) {
              from = { row: top + r, col: left + c }
              break search
            }
        pickUp("new", selected.index, r, c, from, selected.index)
      } else if (rotateKey) {
        if (!selected) return announce("The tray is empty."), true
        if (!selected.rotable) announce("This piece cannot be rotated.")
        else {
          api.rotateShape(selected.index)
          announce(`Rotated. ${shapeText(rotate(selected.shape))}.`)
        }
      } else return false
      return true
    }

    const owner = findOwner(placed, cursor.row, cursor.col)
    if (arrow) {
      const row = Math.min(Math.max(cursor.row + arrow[0], 0), rows - 1)
      const col = Math.min(Math.max(cursor.col + arrow[1], 0), cols - 1)
      if (row === cursor.row && col === cursor.col) announce("Edge of the board.")
      else {
        setCursor({ row, col })
        announce(status(row, col))
      }
    } else if (key === "Enter") {
      if (owner)
        pickUp("move", owner.id, cursor.row - owner.row, cursor.col - owner.col, cursor, owner.blockIndex)
      else announce(board[cursor.row][cursor.col] ? "Empty cell. Press T to choose a piece in the tray." : "Blocked cell.")
    } else if (rotateKey) {
      if (!owner) announce("No piece here.")
      else if (!pieces[owner.blockIndex].rotable) announce("This piece cannot be rotated.")
      else announce(api.rotatePlaced(owner.id, cursor.row, cursor.col) ? "Rotated." : "No room to rotate here.")
    } else if (key === "Delete" || key === "Backspace") {
      if (!owner) announce("No piece here.")
      else {
        api.returnToTray(owner.id)
        announce(`${pieceName(pieces, owner.blockIndex)} is back in the tray.`)
      }
    } else return false
    return true
  }

  const latest = useRef(run)
  latest.current = run

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return
      if (document.querySelector('[role="dialog"]') || target.closest("input, textarea, select")) return
      if ((e.key === "Enter" || e.key === " ") && target.closest("button")) return
      if (latest.current(e)) {
        e.preventDefault()
        setActive(true)
        if (target.closest("button")) (document.activeElement as HTMLElement).blur()
      }
    }
    const pointer = () => setActive(false)
    window.addEventListener("keydown", key)
    window.addEventListener("pointerdown", pointer)
    return () => {
      window.removeEventListener("keydown", key)
      window.removeEventListener("pointerdown", pointer)
    }
  }, [])

  return {
    cursor: active && !api.solved && (zone === "board" || holding) ? cursor : null,
    selectedPiece: active && !api.solved && zone === "tray" && !holding ? selected?.index ?? null : null,
  }
}
