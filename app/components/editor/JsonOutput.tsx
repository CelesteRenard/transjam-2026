import { useState } from "react"
import type { Level } from "~/types/Level"
import { cleanLevel } from "~/utils/editor"

export const JsonOutput = ({ level }: { level: Level }) => {
  const [copied, setCopied] = useState(false)
  const json = JSON.stringify(cleanLevel(level), null, 2)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
    }
  }

  const download = () => {
    const url = URL.createObjectURL(new Blob([json], { type: "application/json" }))
    const link = document.createElement("a")
    link.href = url
    link.download = `level-${level.level}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">JSON</h2>
        <button type="button" onClick={copy} className="rounded border border-gray-400 px-2 py-1 text-sm">
          {copied ? "Copied" : "Copy"}
        </button>
        <button type="button" onClick={download} className="rounded border border-gray-400 px-2 py-1 text-sm">
          Download
        </button>
      </div>
      <textarea
        readOnly
        value={json}
        rows={20}
        onFocus={(e) => e.currentTarget.select()}
        className="rounded border border-gray-400 p-2 font-mono text-sm"
      />
    </section>
  )
}
