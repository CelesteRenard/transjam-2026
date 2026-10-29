import { useEffect, useState } from "react"
import { Game } from "~/components/Game"
import { HelpPanel } from "~/components/HelpPanel"
import { HelpButton, MainMenu, SettingsButton } from "~/components/MainMenu"
import { SettingsPanel } from "~/components/SettingsPanel"
import { PREVIEW_KEY } from "~/components/editor/Toolbar"
import { normalizeLevel } from "~/utils/editor"
import { levels as gameLevels } from "~/utils/levels"
import { toggleVoice } from "~/utils/speech"

const HELP_SEEN = "transjam-help-seen"

const Home = () => {
  const [levels, setLevels] = useState(gameLevels)
  const [levelIndex, setLevelIndex] = useState<number>(0)
  const [puzzleIndex, setPuzzleIndex] = useState<number>(0)
  const [started, setStarted] = useState(false)
  const [panel, setPanel] = useState<"settings" | "help" | null>(null)

  const [preview, setPreview] = useState(false)
  useEffect(() => {
    if (!new URLSearchParams(location.search).has("preview")) return
    try {
      setLevels([normalizeLevel(JSON.parse(localStorage.getItem(PREVIEW_KEY) ?? ""))])
      setPreview(true)
      setStarted(true)
    } catch {}
  }, [])

  useEffect(() => {
    if (new URLSearchParams(location.search).has("preview")) return
    try {
      if (localStorage.getItem(HELP_SEEN)) return
      localStorage.setItem(HELP_SEEN, "1")
    } catch {}
    setPanel("help")
  }, [])

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || (e.target as HTMLElement).closest("input, textarea")) return
      if (e.key.toLowerCase() === "v") toggleVoice()
      else if (e.key.toLowerCase() === "h" && !document.querySelector('[role="dialog"]')) setPanel("help")
    }
    window.addEventListener("keydown", key)
    return () => window.removeEventListener("keydown", key)
  }, [])

  const handleNext = () => {
    if (puzzleIndex < levels[levelIndex].puzzles.length - 1) {
      setPuzzleIndex(puzzleIndex + 1)
    }
    else if (levelIndex < levels.length - 1) {
      setLevelIndex(levelIndex + 1)
      setPuzzleIndex(0)
    }
  }

  return (
    <>
      {started ? (
        <>
          <Game
            key={`${levelIndex}-${puzzleIndex}`}
            level={levels[levelIndex]}
            puzzle={levels[levelIndex].puzzles[puzzleIndex]}
            onNext={handleNext}
          />
          <div className="fixed right-4 top-4 z-40 flex items-center gap-2">
            <HelpButton small onClick={() => setPanel("help")} />
            <SettingsButton small onClick={() => setPanel("settings")} />
          </div>
        </>
      ) : (
        <MainMenu onStart={() => setStarted(true)} onSettings={() => setPanel("settings")} onHelp={() => setPanel("help")} />
      )}
      {preview && (
        <p className="fixed bottom-2 left-2 z-40 rounded bg-black/70 px-2 py-1 text-xs text-white">
          Preview of the level editor
        </p>
      )}
      {panel === "settings" && <SettingsPanel onClose={() => setPanel(null)} />}
      {panel === "help" && <HelpPanel onClose={() => setPanel(null)} />}
    </>
  )
}

export default Home
