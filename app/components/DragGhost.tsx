import { useEffect, useLayoutEffect, useRef } from "react"
import { getCellSize } from "~/utils/cellSize"
import { CELL_OVERLAP } from "~/utils/constants"
import type { Drag } from "~/utils/drag"
import { ShapePreview } from "./ShapePreview"

export const DragGhost = ({ drag }: { drag: Drag }) => {
  const ref = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: drag.x, y: drag.y })
  const latest = useRef(drag)
  latest.current = drag

  const place = () => {
    const el = ref.current
    if (!el) return
    const { offsetRow, offsetCol, fx, fy } = latest.current
    const cell = getCellSize()
    const pitch = cell - CELL_OVERLAP
    el.style.left = `${pointer.current.x - offsetCol * pitch - fx * cell}px`
    el.style.top = `${pointer.current.y - offsetRow * pitch - fy * cell}px`
  }

  useLayoutEffect(place)

  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY }
      place()
    }
    window.addEventListener("pointermove", move)
    return () => window.removeEventListener("pointermove", move)
  }, [])

  return (
    <div ref={ref} className="pointer-events-none fixed z-50 opacity-90 drop-shadow-lg">
      <ShapePreview shape={drag.shape} tiles={drag.tiles} />
    </div>
  )
}
