import type { Constraint, Level, Puzzle, PuzzlePiece } from "~/types/Level"

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
