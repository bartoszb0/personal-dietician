import { Trash2 } from "lucide-react"
import { motion, useAnimationControls } from "motion/react"
import type { ReactNode } from "react"

// width of the revealed delete button, in px
const REVEAL = 88

export default function SwipeToDelete({
  children,
  onDelete,
}: {
  children: ReactNode
  onDelete: () => void
}) {
  const controls = useAnimationControls()

  const close = () => controls.start({ x: 0 })

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* delete action, pinned behind the row on the right */}
      <button
        type="button"
        onClick={() => {
          onDelete()
          close()
        }}
        aria-label="Delete"
        className="absolute inset-y-0 right-0 flex items-center justify-center rounded-xl text-destructive"
        style={{ width: REVEAL }}
      >
        <Trash2 className="size-6" />
      </button>

      {/* draggable foreground — opaque so the red stays hidden when closed */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -REVEAL, right: 0 }}
        dragElastic={0.08}
        animate={controls}
        onDragEnd={(_, info) => {
          const shouldOpen =
            info.offset.x < -REVEAL / 2 || info.velocity.x < -400
          controls.start({ x: shouldOpen ? -REVEAL : 0 })
        }}
        className="relative bg-background"
      >
        {children}
      </motion.div>
    </div>
  )
}
