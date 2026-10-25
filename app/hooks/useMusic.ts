import { Howl } from "howler"
import { useEffect } from "react"

const VOLUME = 0.8
const FADE = 2000

export const useMusic = () => {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const music: Howl = new Howl({
      src: ["/audio/music/music.mp3"],
      loop: true,
      volume: 0,
      html5: true,
      onplay: () => {
        music.fade(0, VOLUME, FADE)
        clearTimeout(timer)
        const remaining = Math.max(0, music.duration() * 1000 - FADE)
        timer = setTimeout(() => music.fade(music.volume(), 0, FADE), remaining)
      },
    })

    const start = () => {
      if (!music.playing()) music.play()
    }
    const events = ["pointerup", "click", "keydown", "touchend"]
    const unlock = () => {
      start()
      events.forEach((e) => window.removeEventListener(e, unlock))
    }
    events.forEach((e) => window.addEventListener(e, unlock))

    return () => {
      events.forEach((e) => window.removeEventListener(e, unlock))
      clearTimeout(timer)
      music.unload()
    }
  }, [])
}
