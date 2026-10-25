import { useEffect } from "react"

const DEFAULT_CELL_SIZE = 96

export const getCellSize = () =>
  typeof window === "undefined"
    ? DEFAULT_CELL_SIZE
    : Math.round(Math.min(Math.max(Math.min(window.innerHeight * 0.09, window.innerWidth * 0.07), 40), 110))


export const useCellSize = () =>
  useEffect(() => {
    const update = () => document.documentElement.style.setProperty("--cell", `${getCellSize()}px`)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])
