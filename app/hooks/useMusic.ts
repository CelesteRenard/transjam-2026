import { Howl } from "howler"
import { useEffect } from "react"
import { getSettings } from "~/utils/settings"

const TRACKS = ["/audio/music/music.mp3"]
const FADE = 3000
const TICK = 50

type Voice = { howl: Howl; level: number; target: number; rate: number }

export const useMusic = () => {
  useEffect(() => {
    const voices = new Set<Voice>()
    let next: ReturnType<typeof setTimeout> | undefined
    let index = 0
    let started = false

    const interval = setInterval(() => {
      const volume = getSettings().music
      voices.forEach((voice) => {
        if (voice.level < voice.target) voice.level = Math.min(voice.target, voice.level + voice.rate)
        else if (voice.level > voice.target) voice.level = Math.max(voice.target, voice.level - voice.rate)

        if (voice.target === 0 && voice.level === 0) {
          voices.delete(voice)
          voice.howl.unload()
        } else {
          voice.howl.volume(voice.level * volume)
        }
      })
    }, TICK)

    const fadeTo = (voice: Voice, target: number, ms: number) => {
      voice.target = target
      voice.rate = TICK / ms
    }

    const playNext = () => {
      const src = TRACKS[index++ % TRACKS.length]
      const voice: Voice = {
        howl: new Howl({
          src: [src],
          html5: true,
          volume: 0,
          onplay: () => {
            const duration = voice.howl.duration() * 1000
            const fade = Math.min(FADE, duration / 2)
            fadeTo(voice, 1, fade)
            clearTimeout(next)
            next = setTimeout(() => {
              fadeTo(voice, 0, fade)
              playNext()
            }, duration - fade)
          },
        }),
        level: 0,
        target: 1,
        rate: TICK / FADE,
      }
      voices.add(voice)
      voice.howl.play()
    }

    const events = ["pointerup", "click", "keydown", "touchend"]
    const unlock = () => {
      events.forEach((e) => window.removeEventListener(e, unlock))
      if (started) return
      started = true
      playNext()
    }
    events.forEach((e) => window.addEventListener(e, unlock))

    return () => {
      events.forEach((e) => window.removeEventListener(e, unlock))
      clearTimeout(next)
      clearInterval(interval)
      voices.forEach((voice) => voice.howl.unload())
      voices.clear()
    }
  }, [])
}
