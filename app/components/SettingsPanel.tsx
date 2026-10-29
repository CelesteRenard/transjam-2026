import { announce, toggleVoice } from "~/utils/speech"
import { setSettings, useSettings } from "~/utils/settings"
import { Modal, PanelButton } from "./Modal"

const ICON = "/assets/images/ui/interface"

const Slider = ({ icon, label, name }: { icon: string; label: string; name: "music" | "fx" }) => {
  const settings = useSettings()
  const value = Math.round(settings[name] * 100)

  return (
    <label className="flex items-center gap-4">
      <img src={`${ICON}/${icon}.png`} alt={label} className="size-20 shrink-0 select-none" draggable={false} />
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        aria-label={label}
        onChange={(e) => {
          setSettings({ [name]: Number(e.target.value) / 100 })
          announce(`${label} ${e.target.value} percent`)
        }}
        className="volume-slider h-4 flex-1"
        style={{ "--fill": `${value}%` } as React.CSSProperties}
      />
      <span className="w-12 text-right text-2xl font-bold text-[#43301f]">{value}</span>
    </label>
  )
}

export const SettingsPanel = ({ onClose }: { onClose: () => void }) => {
  const { voice } = useSettings()

  return (
    <Modal title="Settings" speech="Music volume, effects volume and voice. Use the arrow keys on a slider, Escape to go back." onClose={onClose}>
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
        <Slider icon="music" label="Music" name="music" />
        <Slider icon="fx" label="Sound effects" name="fx" />
        <button
          type="button"
          role="switch"
          aria-checked={voice}
          onClick={toggleVoice}
          className="flex cursor-pointer items-center justify-between border-4 border-[#43301f] bg-[#e0c79a] px-6 py-3 text-2xl font-black uppercase text-[#43301f] transition-transform hover:scale-[1.02]"
        >
          <span>Voice (speech)</span>
          <span>{voice ? "On" : "Off"}</span>
        </button>
        <PanelButton onClick={onClose} className="mx-auto">
          Back
        </PanelButton>
      </div>
    </Modal>
  )
}
