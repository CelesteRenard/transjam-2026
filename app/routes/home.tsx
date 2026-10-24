import { useRef, useState } from "react"
import { ShapePreview } from "~/components/ShapePreview"
import type { Placed, Shape } from "~/types/Shape"
import { blocks } from "../utils/blocks"

const GRID_SIZE = 3
const COLORS = ["bg-sky-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-violet-500"]

const rotate = (shape: Shape): Shape =>
  shape[0].map((_, i) => shape.map((_, j) => shape[shape.length - 1 - j][i]))

const canPlace = (placed: Placed[], shape: Shape, row: number, col: number, ignoreId?: number) => {
  const occupied = new Set<string>()
  placed.filter((p) => p.id !== ignoreId).forEach((p) =>
    p.shape.forEach((line, r) =>
      line.forEach((v, c) => v && occupied.add(`${p.row + r}-${p.col + c}`))
    )
  )
  return shape.every((line, r) =>
    line.every((v, c) => {
      if (!v) return true
      const rr = row + r
      const cc = col + c
      return rr >= 0 && cc >= 0 && rr < GRID_SIZE && cc < GRID_SIZE && !occupied.has(`${rr}-${cc}`)
    })
  )
}


const Home = () => {
  const [shapes, setShapes] = useState<Shape[]>(() => blocks.map((b) => b.shape))
  const [placed, setPlaced] = useState<Placed[]>([])
  const [nextId, setNextId] = useState(1)
  const grab = useRef<[number, number]>([0, 0])

  const owner = (row: number, col: number) =>
    placed.find((p) => p.shape[row - p.row]?.[col - p.col] === 1)

  const onDropCell = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault()
    const [kind, value, or, oc] = e.dataTransfer.getData("text/plain").split(":")
    const n = Number(value)
    const top = row - Number(or)
    const left = col - Number(oc)

    if (kind === "new") {
      if (!canPlace(placed, shapes[n], top, left)) return
      setPlaced([
        ...placed,
        { id: nextId, color: COLORS[n % COLORS.length], shape: shapes[n], row: top, col: left },
      ])
      setNextId(nextId + 1)
    } else if (kind === "move") {
      const piece = placed.find((p) => p.id === n)
      if (!piece || !canPlace(placed, piece.shape, top, left, n)) return
      setPlaced(placed.map((p) => (p.id === n ? { ...p, row: top, col: left } : p)))
    }
  }

  const onDropTray = (e: React.DragEvent) => {
    e.preventDefault()
    const [kind, value] = e.dataTransfer.getData("text/plain").split(":")
    if (kind === "move") setPlaced(placed.filter((p) => p.id !== Number(value)))
  }

  const allow = (e: React.DragEvent) => e.preventDefault()

  return (
    <main className="mx-auto flex max-w-xl flex-col items-center gap-8 p-8">
      <h1 className="text-3xl font-bold dark:text-white">TransJam 2026</h1>

      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
          const row = Math.floor(i / GRID_SIZE)
          const col = i % GRID_SIZE
          const piece = owner(row, col)
          return (
            <div
              key={i}
              draggable={!!piece}
              onDragStart={(e) =>
                piece &&
                e.dataTransfer.setData("text/plain", `move:${piece.id}:${row - piece.row}:${col - piece.col}`)
              }
              onDragOver={allow}
              onDrop={(e) => onDropCell(e, row, col)}
              className={`h-24 w-24 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-700 ${piece ? `${piece.color} cursor-grab border-solid border-transparent` : ""
                }`}
            />
          )
        })}
      </div>

      <div
        onDragOver={allow}
        onDrop={onDropTray}
        className="flex w-full flex-wrap items-center justify-center gap-6 rounded-md border border-gray-300 p-4 dark:border-gray-700"
      >
        {blocks.map((block, i) => (
          <div key={block.name} className="flex flex-col items-center gap-2">
            <div
              draggable
              onDragStart={(e) => {
                const [r, c] = grab.current
                if (!shapes[i][r]?.[c]) return e.preventDefault()
                e.dataTransfer.setData("text/plain", `new:${i}:${r}:${c}`)
              }}
              className="cursor-grab"
            >
              <ShapePreview
                shape={shapes[i]}
                color={COLORS[i % COLORS.length]}
                onGrab={(r, c) => (grab.current = [r, c])}
              />
            </div>
            {block.rotable && (
              <button
                type="button"
                onClick={() => setShapes(shapes.map((s, j) => (j === i ? rotate(s) : s)))}
                className="rounded border border-gray-300 px-2 py-0.5 text-sm dark:border-gray-700 dark:text-white"
              >
                Rotate
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}

export default Home
