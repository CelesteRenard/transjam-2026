import type { Level } from "~/types/Level"

const tiles = "/assets/images/gameplay/tiles"

export const levels: Level[] = [
  {
    "name": "Test_Celeste_01",
    "level": 1,
    "board": [
      [
        1,
        1,
        1
      ],
      [
        0,
        1,
        1
      ],
      [
        1,
        1,
        1
      ]
    ],
    "puzzles": [
      {
        "dialogue": "Celeste n2's Puzzle",
        "pieces": [
          {
            "block": "2x1_No_Rotate_1",
            "tiles": [
              "assets/images/gameplay/tiles/birthday/tile_bd_1.jpg",
              "assets/images/gameplay/tiles/birthday/tile_bd_2.jpg"
            ]
          },
          {
            "block": "Corner_down_right",
            "tiles": [
              "assets/images/gameplay/tiles/seal/tile_seal_1.jpg",
              "assets/images/gameplay/tiles/seal/tile_seal_2.jpg",
              "assets/images/gameplay/tiles/seal/tile_seal_3.jpg"
            ]
          },
          {
            "block": "base_Celeste_1",
            "tiles": [
              "assets/images/gameplay/tiles/pfp/tile_pfp_1.jpg"
            ]
          },
          {
            "block": "base_Celeste_2",
            "tiles": [
              "assets/images/gameplay/tiles/certificate/tile_certificate_1.jpg"
            ]
          },
          {
            "block": "base_Celeste_3",
            "tiles": [
              "assets/images/gameplay/tiles/certificate/tile_certificate_1.jpg"
            ]
          }
        ],
        "constraints": [
          {
            "text": "Must have 3 Adjacent Unique Items",
            "block": "2x1_No_Rotate_1"
          },
          {
            "text": "Must have 1 Adjacent Unique Items",
            "block": "base_Celeste_1"
          },
          {
            "text": "Must have 2 Adjacent Unique Items",
            "block": "base_Celeste_2"
          },
          {
            "text": "Must be on Bottom Row",
            "block": "base_Celeste_3"
          }
        ],
        "solution": [
          [
            "base_Celeste_1",
            "2x1_No_Rotate_1",
            "2x1_No_Rotate_1"
          ],
          [
            "",
            "base_Celeste_2",
            "Corner_No_Rotate_1"
          ],
          [
            "base_Celeste_3",
            "Corner_No_Rotate_1",
            "Corner_No_Rotate_1"
          ]
        ]
      }
    ]
  }
]
