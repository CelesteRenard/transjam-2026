import { useEffect, useState } from "react"
import { BoardEditor } from "~/components/editor/BoardEditor"
import { JsonOutput } from "~/components/editor/JsonOutput"
import { PuzzleEditor } from "~/components/editor/PuzzleEditor"
import { Toolbar } from "~/components/editor/Toolbar"
import { createLevel, createPuzzle, normalizeLevel } from "~/utils/editor"

const DRAFT_KEY = "transjam-editor-draft"

const Editor = () => {
  const [level, setLevel] = useState(createLevel)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY)
      if (draft) setLevel(normalizeLevel(JSON.parse(draft)))
    } catch { }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(level))
    } catch { }
  }, [level, ready])

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 p-8">
      <h1 className="text-3xl font-bold">Level editor</h1>

      <Toolbar level={level} onLoad={setLevel} onReset={() => setLevel(createLevel())} />

      <div className="flex gap-4">
        <label className="flex flex-1 flex-col gap-1">
          Name
          <input
            value={level.name}
            onChange={(e) => setLevel({ ...level, name: e.target.value })}
            className="rounded border border-gray-400 px-2 py-1"
          />
        </label>
        <label className="flex flex-col gap-1">
          Day
          <input
            type="number"
            min={1}
            value={level.level}
            onChange={(e) => setLevel({ ...level, level: Number(e.target.value) || 1 })}
            className="w-20 rounded border border-gray-400 px-2 py-1"
          />
        </label>
      </div>

      <BoardEditor level={level} onChange={setLevel} />

      {level.puzzles.map((puzzle, i) => (
        <PuzzleEditor
          key={i}
          index={i}
          puzzle={puzzle}
          level={level}
          onChange={(p) => setLevel({ ...level, puzzles: level.puzzles.map((x, j) => (j === i ? p : x)) })}
          onRemove={() => setLevel({ ...level, puzzles: level.puzzles.filter((_, j) => j !== i) })}
          onDuplicate={() =>
            setLevel({ ...level, puzzles: [...level.puzzles.slice(0, i + 1), structuredClone(puzzle), ...level.puzzles.slice(i + 1)] })
          }
        />
      ))}
      <button
        type="button"
        onClick={() =>
          setLevel({ ...level, puzzles: [...level.puzzles, createPuzzle(level.board.length, level.board[0].length)] })
        }
        className="w-fit rounded border border-gray-400 px-3 py-1"
      >
        Add puzzle
      </button>

      <JsonOutput level={level} />
    </main>
  )
}

export default Editor
