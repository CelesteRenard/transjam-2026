export const RotateButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded border border-gray-300 px-2 py-0.5 text-sm dark:border-gray-700 dark:text-white"
  >
    Rotate
  </button>
)
