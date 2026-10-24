import type { blocks as b } from "~/types/Shape"

export const blocks : b = [
  {
    name: "base",
    rotable: false,
    shape: [
      [1]
    ]
  },
  {
    name: "L",
    rotable: true,
    shape: [
      [1, 0],
      [1,1]
    ]
  },
  {
    name: "2x2",
    rotable: false,
    shape: [
      [1, 1],
      [1, 1]
    ]
  }
  
]