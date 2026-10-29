import { useEffect, useRef } from "react"
import { announce } from "~/utils/speech"

const ICON = "/assets/images/ui/interface"

const click = (onClick: () => void) => (e: React.MouseEvent<HTMLButtonElement>) => {
  if (e.detail > 0) e.currentTarget.blur()
  onClick()
}

export const SettingsButton = ({ onClick, small }: { onClick: () => void; small?: boolean }) => (
  <button
    onClick={click(onClick)}
    data-game-ui={small || undefined}
    onFocus={() => announce("Settings")}
    aria-label="Settings"
    className="cursor-pointer transition-transform hover:rotate-12 hover:scale-110 active:scale-95"
  >
    <img src={`${ICON}/settings.png`} alt="" className={`${small ? "size-12" : "size-20"} select-none`} draggable={false} />
  </button>
)

export const HelpButton = ({ onClick, small }: { onClick: () => void; small?: boolean }) => (
  <button
    onClick={click(onClick)}
    data-game-ui={small || undefined}
    onFocus={() => announce("Keyboard and voice help")}
    aria-label="Keyboard and voice help"
    className={`${small ? "size-12 text-2xl" : "h-20 px-6 text-3xl"} cursor-pointer border-4 border-[#43301f] bg-[#a8814f] font-black text-[#43301f] transition-transform hover:scale-110 active:scale-95`}
  >
    {small ? "?" : "? Help"}
  </button>
)

export const MainMenu = ({
  onStart,
  onSettings,
  onHelp,
}: {
  onStart: () => void
  onSettings: () => void
  onHelp: () => void
}) => {
  const menu = useRef<HTMLElement>(null)

  useEffect(() => {
    announce("Id peluche, main menu. Start, Settings, Help. Press H for the keyboard and voice help.")
  }, [])

  const move = (e: React.KeyboardEvent) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]
    if (!step) return
    const items = [...menu.current!.querySelectorAll<HTMLElement>("button")]
    const next = items[(items.indexOf(document.activeElement as HTMLElement) + step + items.length) % items.length]
    e.preventDefault()
    next.focus()
  }

  return (
    <main
      ref={menu}
      onKeyDown={move}
      className="relative flex h-screen w-full flex-col items-center justify-center gap-10 bg-cover bg-center"
      style={{ backgroundImage: "url(/assets/images/gameplay/background/background.jpg)" }}
    >
      <div className="absolute inset-0 bg-black/30" />
      <h1 className="relative text-center text-7xl font-black uppercase tracking-widest text-white drop-shadow-[0_4px_0_#43301f]">
        Id peluche
      </h1>
      <button
        autoFocus
        onClick={onStart}
        onFocus={() => announce("Start the game")}
        aria-label="Start"
        className="relative cursor-pointer transition-transform hover:scale-110 active:scale-95"
      >
        <img src={`${ICON}/start.png`} alt="" className="w-72 select-none" draggable={false} />
      </button>
      <div className="absolute bottom-6 right-6 flex items-center gap-4">
        <HelpButton onClick={onHelp} />
        <SettingsButton onClick={onSettings} />
      </div>
    </main>
  )
}
