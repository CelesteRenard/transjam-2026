import type { Placed, Shape } from "~/types/Shape"

export const rotate = <T>(grid: T[][]): T[][] =>
  grid[0].map((_, i) => grid.map((_, j) => grid[grid.length - 1 - j][i]))

export const canPlace = (
  board: number[][],
  placed: Placed[],
  shape: Shape,
  row: number,
  col: number,
  ignoreId?: number
) => {
  const occupied = new Set<string>()
  placed.filter((p) => p.id !== ignoreId).forEach((p) =>
    p.shape.forEach((line, r) =>
      line.forEach((v, c) => v && occupied.add(`${p.row + r}-${p.col + c}`))
    )
  )
  return shape.every((line, r) =>
    line.every((v, c) => {
      if (!v) return true
      const rr = row + r
      const cc = col + c
      return board[rr]?.[cc] === 1 && !occupied.has(`${rr}-${cc}`)
    })
  )
}

export const findOwner = (placed: Placed[], row: number, col: number) =>
  placed.find((p) => p.shape[row - p.row]?.[col - p.col] === 1)

export const isSolved = (board: number[][], placed: Placed[]) =>
  board.every((line, r) => line.every((v, c) => !v || !!findOwner(placed, r, c)))
