export type blocks = {
  name: string
  rotable: boolean
  shape: Array<Array<number>>
}[]

export type Shape = number[][]

export type Placed = {
  id: number
  color: string
  shape: Shape
  row: number
  col: number
}