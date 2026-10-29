import { readdir } from "node:fs/promises"
import { join } from "node:path"

const IMAGE = /\.(png|jpe?g|webp|gif|svg)$/i

export async function loader() {
  const roots = [join(process.cwd(), "public"), join(process.cwd(), "build", "client")]

  for (const root of roots) {
    try {
      const entries = await readdir(join(root, "assets", "images"), { recursive: true })
      const files = entries
        .filter((entry) => IMAGE.test(entry))
        .map((entry) => `/assets/images/${entry.split("\\").join("/")}`)
        .sort()
      return Response.json(files)
    } catch {}
  }
  return Response.json([])
}
