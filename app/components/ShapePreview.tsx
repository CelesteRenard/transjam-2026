import type { Shape, Tiles } from "~/types/Shape"
import { TileView } from "./TileView"

export const ShapePreview = ({
  shape,
  tiles,
  onGrab,
}: {
  shape: Shape
  tiles: Tiles
  onGrab: (r: number, c: number, fx: number, fy: number) => void
}) => (
  <div className="grid" style={{ gridTemplateColumns: `repeat(${shape[0].length}, var(--cell))` }}>
    {shape.flatMap((line, r) =>
      line.map((v, c) =>
        v ? (
          <TileView
            key={`${r}-${c}`}
            tile={tiles[r][c]}
            onMouseDown={(e) => {
              const { offsetX, offsetY } = e.nativeEvent
              onGrab(r, c, offsetX / e.currentTarget.offsetWidth, offsetY / e.currentTarget.offsetHeight)
            }}
          />
        ) : (
          <div key={`${r}-${c}`} className="pointer-events-none h-(--cell) w-(--cell)" />
        )
      )
    )}
  </div>
)
