import type { Puzzle, PuzzlePiece } from "~/types/Level"
import type { Piece, Tiles } from "~/types/Shape"
import { blocks } from "./blocks"

const cellCount = (shape: number[][]) => shape.flat().filter(Boolean).length

const findBlock = (name: string) => blocks.find((b) => b.name.toLowerCase() === name.toLowerCase())

const buildTiles = (shape: number[][], picto?: string, images: string[] = []): Tiles => {
  let n = 0
  return shape.map((line) =>
    line.map((v) => {
      if (!v) return undefined
      const tile = { image: images[n], picto: n === 0 ? picto : undefined }
      n++
      return tile
    })
  )
}

const piecesFromSolution = (solution: string[][]): PuzzlePiece[] => {
  const cells = new Map<string, number>()
  solution.flat().forEach((cell) => {
    const name = cell.toLowerCase()
    if (name) cells.set(name, (cells.get(name) ?? 0) + 1)
  })

  return [...cells].flatMap(([name, count]) => {
    const block = findBlock(name)
    if (!block) return []
    return Array.from({ length: Math.round(count / cellCount(block.shape)) }, () => ({ block: block.name }))
  })
}

export const getPuzzlePieces = (puzzle: Puzzle): Piece[] =>
  (puzzle.pieces ?? piecesFromSolution(puzzle.solution)).flatMap(({ block: name, tiles }) => {
    const block = findBlock(name)
    if (!block) return []
    return [{ name: block.name, rotable: block.rotable, shape: block.shape, tiles: buildTiles(block.shape, block.picto, tiles) }]
  })

export const getBlockPicto = (name: string) => findBlock(name)?.picto
