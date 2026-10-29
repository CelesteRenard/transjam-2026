import type { Shape, Tiles } from "~/types/Shape"
import type { StartDrag } from "~/utils/drag"
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
  selectedPiece?: number | null
  onRotate: (index: number) => void
  onDragStart: StartDrag
}

export const Tray = ({ pieces, selectedPiece, onRotate, onDragStart }: Props) => {
  return (
    <div data-tray className="relative h-full w-full">
      {pieces.map(({ index, name, rotable, shape, tiles, position }) => (
        <TrayPiece
          key={name + index}
          index={index}
          shape={shape}
          tiles={tiles}
          rotable={rotable}
          selected={selectedPiece === index}
          position={position}
          onRotate={() => onRotate(index)}
          onDragStart={onDragStart}
        />
      ))}
    </div>
  )
}
