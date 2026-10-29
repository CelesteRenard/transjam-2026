import { useEffect, useState } from "react"
import { normalizeSrc } from "~/utils/editor"

const SCOPES = {
  actors: { prefix: "/assets/images/gameplay/actors/", label: "Characters" },
  tiles: { prefix: "/assets/images/gameplay/tiles/", label: "Tiles" },
}
const EVERYTHING = "/assets/images/"

let cache: Promise<string[]> | null = null
const loadAssets = () =>
(cache ??= fetch("/api/assets")
  .then((r) => r.json() as Promise<string[]>)
  .catch(() => {
    cache = null
    return []
  }))

export const ImagePicker = ({
  scope,
  value,
  onSelect,
  onClose,
}: {
  scope: keyof typeof SCOPES
  value?: string
  onSelect: (path: string) => void
  onClose: () => void
}) => {
  const [files, setFiles] = useState<string[] | null>(null)
  const [everything, setEverything] = useState(false)
  const [dir, setDir] = useState("")
  const [query, setQuery] = useState("")

  useEffect(() => {
    loadAssets().then(setFiles)
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", key)
    return () => window.removeEventListener("keydown", key)
  }, [])

  const prefix = everything ? EVERYTHING : SCOPES[scope].prefix
  const inScope = (files ?? []).filter((f) => f.startsWith(prefix))
  const dirOf = (f: string) => f.slice(prefix.length, f.lastIndexOf("/"))
  const dirs = [...new Set(inScope.map(dirOf))].filter(Boolean).sort()
  const visible = inScope.filter(
    (f) => (!dir || dirOf(f) === dir) && f.toLowerCase().includes(query.trim().toLowerCase())
  )
  const current = normalizeSrc(value ?? "")

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm ${active ? "border-blue-600 bg-blue-600 text-white" : "border-gray-400 hover:bg-gray-100"}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Choose an image"
    >
      <div
        className="flex max-h-[85vh] w-full max-w-4xl flex-col gap-3 rounded-lg bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Choose an image</h2>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name"
            className="flex-1 rounded border border-gray-400 px-2 py-1"
          />
          <button type="button" onClick={() => onSelect("")} className="rounded border border-gray-400 px-3 py-1 text-sm">
            No image
          </button>
          <button type="button" onClick={onClose} className="rounded border border-gray-400 px-3 py-1 text-sm">
            Close
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setEverything(false)
              setDir("")
            }}
            className={chip(!everything && !dir)}
          >
            {SCOPES[scope].label}
          </button>
          {dirs.map((d) => (
            <button key={d} type="button" onClick={() => setDir(d)} className={chip(dir === d)}>
              {d.split("/").pop()}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setEverything(true)
              setDir("")
            }}
            className={`${chip(everything)} ml-auto`}
          >
            Everything
          </button>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-3 overflow-y-auto p-1">
          {files === null && <p className="text-gray-500">Loading…</p>}
          {files && !visible.length && <p className="text-gray-500">No image here.</p>}
          {visible.map((file) => (
            <button
              key={file}
              type="button"
              onClick={() => onSelect(file)}
              title={file}
              className={`flex flex-col gap-1 rounded border-2 p-1 text-left hover:border-blue-500 ${file === current ? "border-blue-600" : "border-transparent"}`}
            >
              <img src={file} alt="" loading="lazy" className="h-24 w-full rounded bg-gray-200 object-contain" />
              <span className="truncate text-xs text-gray-600">{file.split("/").pop()}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
