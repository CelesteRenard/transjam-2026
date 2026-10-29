import { useEffect, useId, useRef } from "react"
import { announce } from "~/utils/speech"

export const Modal = ({
  title,
  speech,
  onClose,
  children,
}: {
  title: string
  speech?: string
  onClose: () => void
  children: React.ReactNode
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const close = useRef(onClose)
  close.current = onClose
  const titleId = useId()

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    ref.current?.focus()
    announce(speech ? `${title}. ${speech}` : title)

    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        close.current()
      } else if (e.key === "Tab" && ref.current) {
        const items = [...ref.current.querySelectorAll<HTMLElement>("button, input, [href]")]
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", key)
    return () => {
      document.removeEventListener("keydown", key)
      if (!previous?.closest("[data-game-ui]")) previous?.focus()
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        ref={ref}
        tabIndex={-1}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col gap-6 overflow-y-auto border-4 border-[#43301f] bg-[#a8814f] p-8 shadow-xl outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} className="text-center text-4xl font-black uppercase tracking-wider text-[#43301f]">
          {title}
        </h2>
        {children}
      </div>
    </div>
  )
}

export const PanelButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className={`cursor-pointer border-4 border-[#43301f] bg-[#e0c79a] px-8 py-2 text-2xl font-black uppercase text-[#43301f] transition-transform hover:scale-105 active:scale-95 ${props.className ?? ""}`}
  />
)
