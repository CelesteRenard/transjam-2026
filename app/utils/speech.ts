import { useSyncExternalStore } from "react"
import { getSettings, setSettings } from "./settings"

type Message = { text: string; n: number }

let message: Message = { text: "", n: 0 }
const listeners = new Set<() => void>()

export const announce = (
  text: string,
  { force = false, queue = false }: { force?: boolean; queue?: boolean } = {}
) => {
  message = { text, n: message.n + 1 }
  listeners.forEach((l) => l())

  if (typeof window === "undefined" || !("speechSynthesis" in window)) return
  if (!force && !getSettings().voice) return
  if (!queue) window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = "en-US"
  window.speechSynthesis.speak(utterance)
}

export const stopSpeaking = () => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel()
}

export const toggleVoice = () => {
  const on = !getSettings().voice
  if (on) setSettings({ voice: true })
  announce(on ? "Voice on" : "Voice off", { force: true })
  if (!on) setSettings({ voice: false })
}

export const useMessage = () =>
  useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => message,
    () => message
  )
