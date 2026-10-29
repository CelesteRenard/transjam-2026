import { useState } from "react"
import type { Level } from "~/types/Level"
import { cleanLevel, normalizeLevel } from "~/utils/editor"
import { levels } from "~/utils/levels"

export const PREVIEW_KEY = "transjam-preview-level"

const buttonClass = "rounded border border-gray-400 px-3 py-1 text-sm hover:bg-gray-100"

export const Toolbar = ({ level, onLoad, onReset }: { level: Level; onLoad: (level: Level) => void; onReset: () => void }) => {
  const [json, setJson] = useState("")
  const [error, setError] = useState("")

  const play = () => {
    try {
      localStorage.setItem(PREVIEW_KEY, JSON.stringify(cleanLevel(level)))
    } catch { }
    window.open("/?preview", "_blank")
  }

  const importJson = () => {
    try {
      const raw = JSON.parse(json)
      onLoad(normalizeLevel(Array.isArray(raw) ? raw[0] : raw))
      setJson("")
      setError("")
    } catch {
      setError("This is not a valid level JSON.")
    }
  }

  return (
    <section className="flex flex-col gap-3 rounded border border-gray-400 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={play} className="rounded bg-emerald-600 px-3 py-1 text-sm text-white hover:bg-emerald-700">
          ▶ Play this level
        </button>
        <select
          value=""
          onChange={(e) => e.target.value && onLoad(normalizeLevel(structuredClone(levels[Number(e.target.value)])))}
          className="rounded border border-gray-400 px-2 py-1 text-sm"
        >
          <option value="">Edit an existing level…</option>
          {levels.map((l, i) => (
            <option key={i} value={i}>
              Day {l.level} · {l.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => window.confirm("Start a new level? The current draft will be lost.") && onReset()}
          className={buttonClass}
        >
          New level
        </button>
        <span className="ml-auto text-xs text-gray-500">The draft is saved in this browser as you type.</span>
      </div>

      <details>
        <summary className="cursor-pointer text-sm">Import a JSON</summary>
        <div className="mt-2 flex flex-col gap-2">
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            rows={5}
            placeholder="Paste the JSON of a level"
            className="rounded border border-gray-400 p-2 font-mono text-sm"
          />
          <div className="flex items-center gap-3">
            <button type="button" onClick={importJson} disabled={!json.trim()} className={`${buttonClass} disabled:opacity-50`}>
              Load
            </button>
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </div>
      </details>
    </section>
  )
}
