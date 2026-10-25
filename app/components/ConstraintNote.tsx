import type { Constraint } from "~/types/Level"
import { getBlockPicto } from "~/utils/puzzle"

export const ConstraintNote = ({ constraint }: { constraint: Constraint }) => {
  const { text, block } = typeof constraint === "string" ? { text: constraint, block: undefined } : constraint
  const picto = block ? getBlockPicto(block) : undefined

  return (
    <div className="relative min-h-36 border-2 border-black bg-yellow-200 p-3 text-lg text-gray-900">
      {picto && <img src={picto} alt="" className="mb-1 h-8 w-8" />}
      <p>{text}</p>
    </div>
  )
}
