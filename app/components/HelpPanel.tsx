import { Modal, PanelButton } from "./Modal"

const SECTIONS = [
  {
    title: "Voice",
    items: [
      { keys: "V", text: "Turn the voice on or off, anywhere. It reads the menus and describes the game." },
      { keys: "Screen reader", text: "If you already use one, keep the voice off: the game talks to it directly." },
    ],
  },
  {
    title: "Menus",
    items: [
      { keys: "Tab / Arrows", text: "Move between buttons" },
      { keys: "Enter", text: "Press the button" },
      { keys: "Escape", text: "Close a window" },
      { keys: "H", text: "Open this help" },
    ],
  },
  {
    title: "Game, keyboard only",
    items: [
      { keys: "T", text: "Go to the tray, where the pieces wait" },
      { keys: "B", text: "Go to the board" },
      { keys: "Arrows", text: "Tray: choose a piece. Board: move the cursor. Holding a piece: move it" },
      { keys: "Enter", text: "Pick up the chosen piece, then place it" },
      { keys: "R or Space", text: "Rotate the chosen, held or pointed piece" },
      { keys: "Escape", text: "Put the held piece back" },
      { keys: "Delete", text: "Send the piece under the cursor back to the tray" },
      { keys: "C", text: "Read the constraints" },
      { keys: "D", text: "Read what the character says" },
      { keys: "S", text: "Read what is placed and what is left" },
      { keys: "G", text: "Read the board cell by cell" },
    ],
  },
  {
    title: "Mouse",
    items: [
      { keys: "Drag and drop", text: "Move the pieces" },
      { keys: "Space or right click", text: "Rotate, even while dragging" },
    ],
  },
]

export const helpSpeech = SECTIONS.map(
  (s) => `${s.title}. ${s.items.map((i) => `${i.keys}: ${i.text}.`).join(" ")}`
).join(" ")

export const HelpPanel = ({ onClose }: { onClose: () => void }) => (
  <Modal title="Keyboard & voice help" speech={helpSpeech} onClose={onClose}>
    <div className="flex flex-col gap-5 text-[#43301f]">
      {SECTIONS.map((section) => (
        <section key={section.title}>
          <h3 className="mb-2 text-2xl font-black uppercase">{section.title}</h3>
          <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1.5">
            {section.items.map((item) => (
              <div key={item.keys} className="contents">
                <dt>
                  <kbd className="border-2 border-[#43301f] bg-[#e0c79a] px-2 py-0.5 text-sm font-black uppercase">
                    {item.keys}
                  </kbd>
                </dt>
                <dd className="text-lg font-semibold">{item.text}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
    <PanelButton onClick={onClose} className="mx-auto">
      Got it
    </PanelButton>
  </Modal>
)
