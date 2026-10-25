export type Shape = number[][]

export type Tile = { image?: string; picto?: string }

export type Tiles = (Tile | undefined)[][]

export type blocks = {
  name: string
  rotable: boolean
  picto?: string
  shape: Shape
}[]

export type Piece = {
  name: string
  rotable: boolean
  shape: Shape
  tiles: Tiles
}

export type Placed = {
  id: number
  blockIndex: number
  shape: Shape
  tiles: Tiles
  row: number
  col: number
}
