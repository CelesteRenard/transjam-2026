import type { Constraint, Puzzle } from "~/types/Level"
import type { Piece, Placed, Shape } from "~/types/Shape"

const TOPICS: Record<string, string> = {
  pfp: "profile picture",
  fingerprint: "fingerprint",
  residence: "residence",
  associate: "associate",
}

const humanize = (name: string) => name.replace(/_/g, " ").toLowerCase()

export const pieceLabel = ({ name, tiles }: Pick<Piece, "name" | "tiles">) => {
  const topics = new Set<string>()
  tiles.flat().forEach((tile) => {
    const [, folder, file] = /tiles\/([^/]+)\/([^/.]+)/.exec(tile?.image ?? "") ?? []
    if (folder) topics.add(folder === "flavors" ? `${file.replace(/_/g, " ")}` : TOPICS[folder] ?? folder)
  })
  return topics.size ? [...topics].join(" and ") : humanize(name)
}

export const pieceName = (pieces: Piece[], index: number) => {
  const label = pieceLabel(pieces[index])
  const same = pieces.map((p, i) => [pieceLabel(p), i] as const).filter(([l]) => l === label)
  return same.length > 1 ? `${label}, number ${same.findIndex(([, i]) => i === index) + 1} of ${same.length}` : label
}

export const shapeText = (shape: Shape) => {
  const cells = shape.flatMap((line, r) => line.flatMap((v, c) => (v ? [`row ${r + 1} column ${c + 1}`] : [])))
  return `${cells.length} cell${cells.length > 1 ? "s" : ""}, ${shape.length} by ${shape[0].length}${cells.length > 1 ? `: ${cells.join(", ")}` : ""}`
}

export const constraintText = (constraint: Constraint) => (typeof constraint === "string" ? constraint : constraint.text)

export const rulesFor = (puzzle: Puzzle, blockName: string) =>
  puzzle.constraints.flatMap((c) =>
    typeof c !== "string" && c.block?.toLowerCase() === blockName.toLowerCase() ? [c.text] : []
  )

export const describePiece = (puzzle: Puzzle, pieces: Piece[], index: number, shape = pieces[index].shape) => {
  const rules = rulesFor(puzzle, pieces[index].name)
  return [
    `${pieceName(pieces, index)}.`,
    `${shapeText(shape)}.`,
    rules.length ? `Rule: ${rules.join(". ")}.` : "",
    pieces[index].rotable ? "Can be rotated." : "Cannot be rotated.",
  ]
    .filter(Boolean)
    .join(" ")
}

export const describeConstraints = (puzzle: Puzzle, pieces: Piece[]) => {
  const lines = puzzle.constraints.map((c, i) => {
    if (typeof c === "string") return `${i + 1}: ${c}.`
    const index = pieces.findIndex((p) => p.name.toLowerCase() === c.block?.toLowerCase())
    return `${i + 1}: ${index >= 0 ? `${pieceName(pieces, index)}: ` : ""}${c.text}.`
  })
  return lines.length ? `${lines.length} constraint${lines.length > 1 ? "s" : ""}. ${lines.join(" ")}` : "No constraints."
}

export const cellText = (board: number[][], placed: Placed[], pieces: Piece[], row: number, col: number) => {
  if (!board[row]?.[col]) return "blocked"
  const owner = placed.find((p) => p.shape[row - p.row]?.[col - p.col] === 1)
  return owner ? `occupied by ${pieceName(pieces, owner.blockIndex)}` : "empty"
}

export const describeBoard = (board: number[][], placed: Placed[], pieces: Piece[]) =>
  board
    .map(
      (line, r) =>
        `Row ${r + 1}: ${line.map((_, c) => `${c + 1} ${cellText(board, placed, pieces, r, c)}`).join(", ")}.`
    )
    .join(" ")

export const describeStatus = (board: number[][], placed: Placed[], pieces: Piece[]) => {
  const left = pieces.flatMap((_, i) => (placed.some((p) => p.blockIndex === i) ? [] : [pieceName(pieces, i)]))
  const done = placed.map((p) => `${pieceName(pieces, p.blockIndex)} at row ${p.row + 1} column ${p.col + 1}`)
  return [
    `Board: ${board.length} rows by ${board[0].length} columns.`,
    done.length ? `Placed: ${done.join("; ")}.` : "Nothing placed yet.",
    left.length ? `Left in the tray: ${left.join("; ")}.` : "The tray is empty.",
  ].join(" ")
}
