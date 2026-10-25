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
    name: "base_no_corner",
    picto: "/assets/images/gameplay/indentifiers/indentifiers_01.jpg",
    rotable: false,
    shape: [
      [1]
    ]
  },
  {
    name: "corner",
    rotable: true,
    shape: [
      [1, 0],
      [1,1]
    ]
  },
  {
    name: "corner_3_neighbours",
    picto: "/assets/images/ui/instructions/3_neighbours.svg",
    rotable: true,
    shape: [
      [1, 0],
      [1,1]
    ]
  },
  {
    name: "2_line",
    rotable: true,
    shape: [
      [1, 1]
    ]
  },
  {
    name: "3_line",
    rotable: true,
    shape: [
      [1, 1, 1]
    ]
  },
  {
    name: "right_L",
    rotable: true,
    shape: [
      [1, 0],
      [1, 0],
      [1, 1],
    ]
  },
  {
    name: "right_L_no_bottom",
    picto: "/assets/images/ui/instructions/no_bottom.svg",
    rotable: true,
    shape: [
      [1, 0],
      [1, 0],
      [1, 1],
    ]
  },
  {
    name: "left_L",
    rotable: true,
    shape: [
      [1, 0],
      [1, 0],
      [1, 1],
    ]
  },
  {
    name: "2x2",
    rotable: false,
    shape: [
      [1, 1],
      [1, 1]
    ]
  },
  {
    name: "Corner_up_right",
    rotable: false,
    shape: [
      [1, 1],
      [0, 1]
    ]
  },
  {
    name: "Corner_up_left",
    rotable: false,
    shape: [
      [1, 1],
      [1, 0]
    ]
  },
  {
    name: "Corner_down_left",
    rotable: false,
    shape: [
      [1, 0],
      [1, 1]
    ]
  },
  {
    name: "Corner_down_right",
    rotable: false,
    shape: [
      [0, 1],
      [1, 1]
    ]
  },
  {
    name: "2x1_No_Rotate_1",
    picto: "/assets/images/gameplay/indentifiers/indentifiers_02.jpg",
    rotable: false,
    shape: [
      [1, 1],
    ]
  },
  {
    name: "1x2_No_Rotate_1",
    picto: "/assets/images/gameplay/indentifiers/indentifiers_02.jpg",
    rotable: false,
    shape: [
      [1, 1],
    ]
  },
  {
    name: "base_Celeste_1",
    picto: "/assets/images/gameplay/indentifiers/indentifiers_03.jpg",
    rotable: false,
    shape: [
      [1]
    ]
  },
  {
    name: "base_Celeste_2",
    picto: "/assets/images/gameplay/indentifiers/indentifiers_04.jpg",
    rotable: false,
    shape: [
      [1]
    ]
  },
  {
    name: "base_Celeste_3",
    picto: "/assets/images/gameplay/indentifiers/indentifiers_05.jpg",
    rotable: false,
    shape: [
      [1]
    ]
  },
]
