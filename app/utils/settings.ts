import { useSyncExternalStore } from "react"

export type Settings = { music: number; fx: number; voice: boolean }

const KEY = "transjam-settings"
const DEFAULTS: Settings = { music: 0.8, fx: 1, voice: false }

let settings: Settings = DEFAULTS
let loaded = false
const listeners = new Set<() => void>()

const load = () => {
  if (loaded || typeof window === "undefined") return
  loaded = true
  try {
    settings = { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") }
  } catch {}
}

export const getSettings = () => {
  load()
  return settings
}

export const setSettings = (patch: Partial<Settings>) => {
  settings = { ...getSettings(), ...patch }
  try {
    localStorage.setItem(KEY, JSON.stringify(settings))
  } catch {}
  listeners.forEach((l) => l())
}

export const subscribeSettings = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export const useSettings = () =>
  useSyncExternalStore(subscribeSettings, getSettings, () => DEFAULTS)
