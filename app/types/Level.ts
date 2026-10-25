
export type Constraint = string | { text: string; block?: string }

export type PuzzlePiece = {
  block: string
  tiles?: string[]
}

export type Puzzle = {
  actor?: string
  dialogue?: string
  pieces?: PuzzlePiece[]
  constraints: Constraint[]
  solution: string[][]
}

export type Level = {
  name: string
  level: number
  board: number[][]
  puzzles: Puzzle[]
}
