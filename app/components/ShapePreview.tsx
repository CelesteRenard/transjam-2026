import type { Shape } from "~/types/Shape"

export const ShapePreview = ({
  shape,
  color,
  onGrab,
}: {
  shape: Shape
  color: string
  onGrab: (r: number, c: number) => void
}) => (
  <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${shape[0].length}, 1.5rem)` }}>
    {shape.flatMap((line, r) =>
      line.map((v, c) => (
        <div
          key={`${r}-${c}`}
          onMouseDown={() => onGrab(r, c)}
          className={`h-6 w-6 rounded-sm ${v ? color : ""}`}
        />
      ))
    )}
  </div>
)
