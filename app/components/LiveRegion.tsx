import { useSettings } from "~/utils/settings"
import { useMessage } from "~/utils/speech"

export const LiveRegion = () => {
  const { voice } = useSettings()
  const { text, n } = useMessage()

  return (
    <p role="status" aria-live="polite" className="sr-only">
      {!voice && text && <span key={n}>{text}</span>}
    </p>
  )
}
