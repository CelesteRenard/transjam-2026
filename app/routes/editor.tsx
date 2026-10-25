import { useState } from "react"
import { BoardEditor } from "~/components/editor/BoardEditor"
import { JsonOutput } from "~/components/editor/JsonOutput"
import { PuzzleEditor } from "~/components/editor/PuzzleEditor"
import { createLevel, createPuzzle } from "~/utils/editor"

const Editor = () => {
  const [level, setLevel] = useState(createLevel)

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 p-8 dark:text-white">
      <h1 className="text-3xl font-bold">Level editor</h1>

      <div className="flex gap-4">
        <label className="flex flex-1 flex-col gap-1">
          Name
          <input
            value={level.name}
            onChange={(e) => setLevel({ ...level, name: e.target.value })}
            className="rounded border border-gray-400 px-2 py-1 dark:bg-gray-900"
          />
        </label>
        <label className="flex flex-col gap-1">
          Day
          <input
            type="number"
            min={1}
            value={level.level}
            onChange={(e) => setLevel({ ...level, level: Number(e.target.value) || 1 })}
            className="w-20 rounded border border-gray-400 px-2 py-1 dark:bg-gray-900"
          />
        </label>
      </div>

      <BoardEditor level={level} onChange={setLevel} />

      {level.puzzles.map((puzzle, i) => (
        <PuzzleEditor
          key={i}
          index={i}
          puzzle={puzzle}
          board={level.board}
          onChange={(p) => setLevel({ ...level, puzzles: level.puzzles.map((x, j) => (j === i ? p : x)) })}
          onRemove={() => setLevel({ ...level, puzzles: level.puzzles.filter((_, j) => j !== i) })}
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
