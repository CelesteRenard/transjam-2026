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
        "actor": "/assets/images/gameplay/actors/shark.png",
        "dialogue": "Hello! I'm Shark, can you make my ID?",
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
            "Corner_down_right"
          ],
          [
            "base_Celeste_3",
            "Corner_down_right",
            "Corner_down_right"
          ]
        ]
      }
    ]
  },
  {
  "name": "Muffins",
  "level": 3,
  "board": [
    [
      1,
      1,
      1,
      1
    ],
    [
      1,
      1,
      1,
      1
    ],
    [
      1,
      0,
      1,
      1
    ],
    [
      0,
      1,
      1,
      1
    ]
  ],
  "puzzles": [
    {
      "actor": "/assets/images/gameplay/actors/muffin.png",
      "dialogue": "Hi ! can you please change my birth flavour. It doesn't suits me any more.",
      "pieces": [
        {
          "block": "base"
        },
        {
          "block": "special_base"
        },
        {
          "block": "Corner_up_right"
        },
        {
          "block": "Corner_up_right"
        },
        {
          "block": "2_line"
        },
        {
          "block": "2_line"
        },
        {
          "block": "2_line"
        }
      ],
      "constraints": [
        "All 1-squares must be in the center",
        {
          "text": "Must not touch corner pieces",
          "block": "special_base"
        }
      ],
      "solution": [
        [
          "Corner_up_right",
          "Corner_up_right",
          "Corner_up_right",
          "Corner_up_right"
        ],
        [
          "2_line",
          "Corner_up_right",
          "base",
          "Corner_up_right"
        ],
        [
          "2_line",
          "",
          "special_base",
          "2_line"
        ],
        [
          "",
          "2_line",
          "2_line",
          "2_line"
        ]
      ]
    },
    {
      "actor": "/assets/images/gameplay/actors/muffin2.png",
      "dialogue": "I don't get why all plushies should know my FAB (flavor assigned at birth). Can you remove it please.",
      "pieces": [
        {
          "block": "base"
        },
        {
          "block": "corner"
        },
        {
          "block": "right_L"
        },
        {
          "block": "corner"
        },
        {
          "block": "3_line"
        }
      ],
      "constraints": [
        {
          "text": "Have 3 neighbours",
          "block": "corner"
        },
        {
          "text": "Cannot be on bottom row",
          "block": "right_L"
        }
      ],
      "solution": [
        [
          "corner",
          "corner",
          "right_L",
          "right_L"
        ],
        [
          "corner",
          "corner",
          "corner",
          "right_L"
        ],
        [
          "base",
          "",
          "corner",
          "right_L"
        ],
        [
          "",
          "3_line",
          "3_line",
          "3_line"
        ]
      ]
    }
  ]
}
]
