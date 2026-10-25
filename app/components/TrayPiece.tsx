import { useRef } from "react"
import type { Shape, Tiles } from "~/types/Shape"
import { setDragPayload, setPieceDragImage, type DragPayload } from "~/utils/drag"
import { RotateButton } from "./RotateButton"
import { ShapePreview } from "./ShapePreview"

type Props = {
  index: number
  shape: Shape
  tiles: Tiles
  rotable: boolean
  position: { x: number; y: number; z: number }
  onRotate: () => void
  onDragStart: (payload: DragPayload) => void
  onDragEnd: () => void
}

export const TrayPiece = ({ index, shape, tiles, rotable, position, onRotate, onDragStart, onDragEnd }: Props) => {
  const grab = useRef<[number, number, number, number]>([0, 0, 0, 0])

  return (
    <div
      className={`absolute flex flex-col items-center gap-1`}
      style={{
        left: `calc(var(--cell) * ${position.x})`,
        top: `calc(var(--cell) * ${position.y})`,
        zIndex: position.z,
      }}
    >
      <div
        draggable
        onDragStart={(e) => {
          const [r, c, fx, fy] = grab.current
          if (!shape[r]?.[c]) return e.preventDefault()
          const payload = { kind: "new", id: index, offsetRow: r, offsetCol: c } satisfies DragPayload
          setDragPayload(e, payload)
          onDragStart(payload)
          setPieceDragImage(e, { shape, tiles }, r, c, fx, fy)
        }}
        onDragEnd={onDragEnd}
        className="cursor-grab"
      >
        <ShapePreview shape={shape} tiles={tiles} onGrab={(r, c, fx, fy) => (grab.current = [r, c, fx, fy])} />
      </div>
      {rotable && <RotateButton onClick={onRotate} />}
    </div>
  )
}
