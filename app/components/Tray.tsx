import type { DragEvent } from "react"
import type { Shape, Tiles } from "~/types/Shape"
import { allowDrop, getDragPayload, type DragPayload } from "~/utils/drag"
import { TrayPiece } from "./TrayPiece"

type Props = {
  pieces: {
    index: number
    name: string
    rotable: boolean
    shape: Shape
    tiles: Tiles
    position: { x: number; y: number; z: number }
  }[]
  onRotate: (index: number) => void
  onDropPiece: (payload: DragPayload, x: number, y: number, width: number, height: number) => void
  onDragStart: (payload: DragPayload) => void
  onDragEnd: () => void
}

export const Tray = ({ pieces, onRotate, onDropPiece, onDragStart, onDragEnd }: Props) => {
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    onDropPiece(getDragPayload(e), e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height)
  }

  return (
    <div
      onDragOver={allowDrop}
      onDrop={handleDrop}
      className="relative h-full w-full"
    >
      {pieces.map(({ index, name, rotable, shape, tiles, position }) => (
        <TrayPiece
          key={name + index}
          index={index}
          shape={shape}
          tiles={tiles}
          rotable={rotable}
          position={position}
          onRotate={() => onRotate(index)}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      ))}
    </div>
  )
}
