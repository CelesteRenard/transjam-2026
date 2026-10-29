import type { Constraint, Level, Puzzle, PuzzlePiece } from "~/types/Level"
import { blocks } from "./blocks"
import { getPuzzlePieces } from "./puzzle"

export const createPuzzle = (rows: number, cols: number): Puzzle => ({
  actor: "",
  dialogue: "",
  pieces: [],
  constraints: [],
  solution: Array.from({ length: rows }, () => Array(cols).fill("")),
})

export const createLevel = (): Level => ({
  name: "",
  level: 1,
  board: [
    [1, 1, 1],
    [1, 1, 0],
  ],
  puzzles: [createPuzzle(2, 3)],
})

export const resizeGrid = <T>(grid: T[][], rows: number, cols: number, fill: T): T[][] =>
  Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => grid[r]?.[c] ?? fill))

export const resizeLevel = (level: Level, rows: number, cols: number): Level => ({
  ...level,
  board: resizeGrid(level.board, rows, cols, 1),
  puzzles: level.puzzles.map((p) => ({ ...p, solution: resizeGrid(p.solution, rows, cols, "") })),
})

const cleanPiece = ({ block, tiles = [] }: PuzzlePiece): PuzzlePiece =>
  tiles.some(Boolean) ? { block, tiles: tiles.map((t) => t.trim()) } : { block }

const cleanConstraint = (c: Constraint): Constraint =>
  typeof c === "string" || !c.block ? (typeof c === "string" ? c : c.text) : c

export const cleanLevel = (level: Level): Level => ({
  ...level,
  puzzles: level.puzzles.map(({ actor, dialogue, pieces, constraints, solution }) => ({
    ...(actor?.trim() ? { actor: actor.trim() } : {}),
    ...(dialogue?.trim() ? { dialogue: dialogue.trim() } : {}),
    ...(pieces?.length ? { pieces: pieces.map(cleanPiece) } : {}),
    constraints: constraints.map(cleanConstraint),
    solution,
  })),
})

export const normalizeSrc = (path: string) => (!path || path.startsWith("/") || path.startsWith("http") ? path : `/${path}`)

export const blockColor = (name: string) => {
  const index = Math.max(0, blocks.findIndex((b) => b.name === name))
  return `hsl(${(index * 47) % 360} 70% 80%)`
}

const cells = (shape: number[][]) => shape.flat().filter(Boolean).length

export const validatePuzzle = (puzzle: Puzzle, board: number[][]): string[] => {
  const warnings: string[] = []
  const pieces = getPuzzlePieces(puzzle)
  const playable = board.flat().filter(Boolean).length
  const pieceCells = pieces.reduce((sum, p) => sum + cells(p.shape), 0)

  if (!puzzle.actor?.trim()) warnings.push("No character image.")
  if (!puzzle.dialogue?.trim()) warnings.push("No dialogue.")
  if (!pieces.length) warnings.push("No pieces: paint the solution first.")

  const empty = board.flatMap((line, r) => line.filter((v, c) => v && !puzzle.solution[r]?.[c])).length
  if (empty) warnings.push(`${empty} playable cell${empty > 1 ? "s have" : " has"} no piece in the solution.`)

  if (pieces.length && pieceCells !== playable)
    warnings.push(`The pieces cover ${pieceCells} cells but the board has ${playable} playable cells.`)

  const used = new Map<string, number>()
  puzzle.solution.forEach((line, r) =>
    line.forEach((name, c) => name && board[r]?.[c] && used.set(name.toLowerCase(), (used.get(name.toLowerCase()) ?? 0) + 1))
  )
  const needed = new Map<string, number>()
  pieces.forEach((p) => needed.set(p.name.toLowerCase(), (needed.get(p.name.toLowerCase()) ?? 0) + cells(p.shape)))
  new Set([...used.keys(), ...needed.keys()]).forEach((name) => {
    if ((used.get(name) ?? 0) !== (needed.get(name) ?? 0))
      warnings.push(`"${name}": ${used.get(name) ?? 0} cells in the solution, ${needed.get(name) ?? 0} in the pieces.`)
  })

  if (puzzle.constraints.some((c) => !(typeof c === "string" ? c : c.text).trim())) warnings.push("A constraint is empty.")
  return warnings
}

export const normalizeLevel = (raw: any): Level => {
  const rows: number[][] =
    Array.isArray(raw?.board) && raw.board.length && Array.isArray(raw.board[0])
      ? raw.board.map((line: unknown[]) => line.map((v) => (v ? 1 : 0)))
      : createLevel().board
  const cols = Math.max(...rows.map((line) => line.length))
  const board = resizeGrid(rows, rows.length, cols, 0)

  const puzzles: Puzzle[] = (Array.isArray(raw?.puzzles) ? raw.puzzles : []).map((p: any) => ({
    actor: p?.actor ?? "",
    dialogue: p?.dialogue ?? "",
    pieces: (Array.isArray(p?.pieces) ? p.pieces : []).map((x: any) => ({
      block: String(x.block),
      tiles: Array.isArray(x.tiles) ? x.tiles.map(String) : [],
    })),
    constraints: Array.isArray(p?.constraints) ? p.constraints : [],
    solution: resizeGrid(Array.isArray(p?.solution) ? p.solution : [], board.length, cols, ""),
  }))

  return {
    name: String(raw?.name ?? ""),
    level: Number(raw?.level) || 1,
    board,
    puzzles: puzzles.length ? puzzles : [createPuzzle(board.length, cols)],
  }
}
