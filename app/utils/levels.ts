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
              "assets/images/gameplay/tiles/fingerprint/tile_fingerprint_1.jpg"
            ]
          }
        ],
        "constraints": [
          {
            "text": "Must have Exactly 3 Adjacent Unique Pieces",
            "block": "2x1_No_Rotate_1"
          },
          {
            "text": "Must have Exactly 1 Adjacent Unique Pieces",
            "block": "base_Celeste_1"
          },
          {
            "text": "Must have Exactly 2 Adjacent Unique Pieces",
            "block": "base_Celeste_2"
          },
          {
            "text": "Must be on the Bottom Row",
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
          "block": "base",
          "tiles": [
             "/assets/images/gameplay/tiles/pfp/tile_pfp_2.jpg"
          ]
        },
        {
          "block": "base_no_corner",
          "tiles": [
             "/assets/images/gameplay/tiles/flavors/flavor_name.png",
          ],
        },
        {
          "block": "Corner_up_right_no_bottom",
          "tiles":[
             "/assets/images/gameplay/tiles/certificate/cakedom_1.png",
             "/assets/images/gameplay/tiles/certificate/cakedom_2.png",
             "/assets/images/gameplay/tiles/flavors/strawberry.png"
          ]
        },
        {
          "block": "Corner_up_right_no_bottom",
          "tiles":[
             "/assets/images/gameplay/tiles/birthday/tile_bd_2.jpg",
             "/assets/images/gameplay/tiles/birthday/tile_bd_1.jpg",
             "/assets/images/gameplay/tiles/flavors/blueberry.png"
          ]
        },
        {
          "block": "2_line",
          "tiles" : [
             "/assets/images/gameplay/tiles/flavors/banana.png",
             "/assets/images/gameplay/tiles/flavors/orange.png"
          ]
        },
        {
          "block": "2_line",
          "tiles" : [
             "/assets/images/gameplay/tiles/flavors/17_06.png",
             "/assets/images/gameplay/tiles/flavors/tile_seal_2.png"
          ]
        },
        {
          "block": "2_line",
          "tiles" : [
             "/assets/images/gameplay/tiles/flavors/tile_seal3.png",
             "/assets/images/gameplay/tiles/flavors/tile_seal1.png"
          ]
        }
      ],
      "constraints": [
        "All 1-squares must be in the center",
        {
          "text": "Must not touch corner pieces",
          "block": "base_no_corner"
        },
        {
           "text": "Corner pieces cannot touch bottom row",
           "block": "Corner_up_right_no_bottom"
        }
      ],
      "solution": [
        [
          "Corner_up_right_no_bottom",
          "Corner_up_right_no_bottom",
          "Corner_up_right_no_bottom",
          "Corner_up_right_no_bottom"
        ],
        [
          "2_line",
          "Corner_up_right_no_bottom",
          "base",
          "Corner_up_right_no_bottom"
        ],
        [
          "2_line",
          "",
          "base_no_corner",
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
          "block": "base_left"
        },
        {
          "block": "corner_3_neighbours"
        },
        {
          "block": "right_L_no_bottom"
        },
        {
          "block": "corner_3_neighbours"
        },
        {
          "block": "3_line"
        }
      ],
      "constraints": [
        {
          "text": "Have 3 neighbours",
          "block": "corner_3_neighbours"
        },
        {
          "text": "Cannot be on bottom row",
          "block": "right_L_no_bottom"
        },
        { 
           "text": "Must be on the left",
           "block": "base_left"
        }
      ],
      "solution": [
        [
          "corner_3_neighbours",
          "corner_3_neighbours",
          "right_L_no_bottom",
          "right_L_no_bottom"
        ],
        [
          "corner_3_neighbours",
          "corner_3_neighbours",
          "corner_3_neighbours",
          "right_L_no_bottom"
        ],
        [
          "base_left",
          "",
          "corner_3_neighbours",
          "right_L_no_bottom"
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
