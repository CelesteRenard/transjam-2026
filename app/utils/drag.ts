import type { PointerEvent } from "react"
import type { Shape, Tiles } from "~/types/Shape"

export type DragPayload = {
  kind: "new" | "move"
  id: number
  offsetRow: number
  offsetCol: number
}

export type Drag = DragPayload & {
  shape: Shape
  tiles: Tiles
  fx: number
  fy: number
  x: number
  y: number
  source: "pointer" | "keyboard"
}

export type StartDrag = (payload: DragPayload, fx: number, fy: number, x: number, y: number) => void

const DRAG_THRESHOLD = 4

export const watchDrag = (e: PointerEvent, start: (x: number, y: number) => void) => {
  if (e.button !== 0) return
  const { clientX, clientY } = e

  const stop = () => {
    window.removeEventListener("pointermove", move)
    window.removeEventListener("pointerup", stop)
    window.removeEventListener("pointercancel", stop)
  }
  const move = (m: globalThis.PointerEvent) => {
    if (Math.hypot(m.clientX - clientX, m.clientY - clientY) < DRAG_THRESHOLD) return
    stop()
    start(m.clientX, m.clientY)
  }
  window.addEventListener("pointermove", move)
  window.addEventListener("pointerup", stop)
  window.addEventListener("pointercancel", stop)
}
