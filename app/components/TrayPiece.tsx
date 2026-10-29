import { useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import type { Shape, Tiles } from "~/types/Shape"
import { watchDrag, type StartDrag } from "~/utils/drag"
import { ShapePreview } from "./ShapePreview"

type Props = {
  index: number
  shape: Shape
  tiles: Tiles
  rotable: boolean
  selected?: boolean
  position: { x: number; y: number; z: number }
  onRotate: () => void
  onDragStart: StartDrag
}

export const TrayPiece = ({ index, shape, tiles, rotable, selected, position, onRotate, onDragStart }: Props) => {
  const grab = useRef<[number, number, number, number]>([0, 0, 0, 0])
  const [hint, setHint] = useState<{ x: number; y: number } | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const [selectedHint, setSelectedHint] = useState<{ x: number; y: number } | null>(null)

  useLayoutEffect(() => {
    const rect = box.current?.getBoundingClientRect()
    setSelectedHint(selected && rect ? { x: rect.left, y: rect.bottom - 8 } : null)
  }, [selected, shape, position.x, position.y])
  const tip = hint ?? selectedHint

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        left: `calc(var(--cell) * ${position.x})`,
        top: `calc(var(--cell) * ${position.y})`,
        zIndex: position.z,
      }}
    >
      <div
        ref={box}
        onPointerEnter={(e) => e.buttons === 0 && setHint({ x: e.clientX, y: e.clientY })}
        onPointerMove={(e) => setHint(e.buttons === 0 ? { x: e.clientX, y: e.clientY } : null)}
        onPointerLeave={() => setHint(null)}
        onPointerDown={(e) => {
          setHint(null)
          const [r, c, fx, fy] = grab.current
          if (!shape[r]?.[c]) return
          const payload = { kind: "new", id: index, offsetRow: r, offsetCol: c } as const
          watchDrag(e, (x, y) => onDragStart(payload, fx, fy, x, y))
        }}
        onContextMenu={(e) => {
          e.preventDefault()
          if (rotable) onRotate()
        }}
        className={`cursor-grab touch-none select-none ${selected ? "outline-4 outline-offset-4 outline-blue-700" : ""}`}
      >
        <ShapePreview shape={shape} tiles={tiles} onGrab={(r, c, fx, fy) => (grab.current = [r, c, fx, fy])} />
      </div>
      {rotable && tip && createPortal(
        <span
          className="pointer-events-none fixed z-[100] whitespace-nowrap border-4 border-[#43301f] bg-[#a8814f] px-3 py-1 text-sm font-black uppercase tracking-wider text-[#43301f] shadow-lg"
          style={{ left: tip.x + 16, top: tip.y + 16 }}
        >
          Space / Right click to rotate
        </span>,
        document.body
      )}
    </div>
  )
}
