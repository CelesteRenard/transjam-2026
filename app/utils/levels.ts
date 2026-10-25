import type { Level } from "~/types/Level"

const tiles = "/assets/images/gameplay/tiles"

export const levels: Level[] = [
  {
    name: 'Beginner',
    level: 1,
    board:[
      [1, 1, 1],
      [1, 1, 0],
    ],
    puzzles:[
      {
        actor: "/assets/images/gameplay/actors/shark.png",
        dialogue: "Welcome ! Fill in my form, and do not forget the seal.",
        pieces: [
          {
            block: "corner",
            tiles: [`${tiles}/seal/tile_seal_3.jpg`, `${tiles}/seal/tile_seal_2.jpg`, `${tiles}/seal/tile_seal_1.jpg`]
          },
          {
            block: "2_line",
            tiles: [`${tiles}/birthday/tile_bd_2.jpg`, `${tiles}/birthday/tile_bd_1.jpg`]
          }
        ],
        constraints: [
          { text: "Birth Date must have 3 Unique Adjacent Items", block: "2_line" },
          { text: "Seal must TOUCH BOTTOM ROW", block: "corner" }
        ],

        solution: [
          ["corner","2_line","2_line"],
          ["corner","corner", ""]
        ]
      },
      {
      "constraints": [
        "test",
        "test 2",
        " test 3"
      ],
      "solution": [
        [
          "base",
          "corner",
          "corner"
        ],
        [
          "base",
          "corner",
          ""
        ]
      ]
    }
    ]
  }
]
