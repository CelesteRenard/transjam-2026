import { TILE_CLASS } from "~/utils/constants"
import type { Tile } from "~/types/Shape"

export const TileView = ({ tile, ...props }: { tile?: Tile } & React.HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    className={`h-(--cell) w-(--cell) ${TILE_CLASS} ${props.className ?? ""}`}
    style={tile?.image ? { backgroundImage: `url(${tile.image})` } : undefined}
  >
    {tile?.picto && <img src={tile.picto} alt="" className="pointer-events-none absolute left-1 top-1 h-[calc(var(--cell)/4)] w-[calc(var(--cell)/4)]" />}
    {props.children}
  </div>
)
