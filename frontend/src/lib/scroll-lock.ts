import { useEffect } from "react"

// Ref-counted body scroll lock, shared by every dialog. Ref counting means
// stacked/nested dialogs (e.g. Edit over the meal detail) lock once and only
// unlock when the last one closes. Uses `position: fixed` so it also holds on
// iOS Safari, which ignores `overflow: hidden` on the body.
let count = 0
let savedScrollY = 0

function lock() {
  if (count === 0) {
    savedScrollY = window.scrollY
    const { style } = document.body
    style.position = "fixed"
    style.top = `-${savedScrollY}px`
    style.left = "0"
    style.right = "0"
    style.overflow = "hidden"
  }
  count += 1
}

function unlock() {
  count -= 1
  if (count === 0) {
    const { style } = document.body
    style.position = ""
    style.top = ""
    style.left = ""
    style.right = ""
    style.overflow = ""
    window.scrollTo(0, savedScrollY)
  }
}

export function useScrollLock() {
  useEffect(() => {
    lock()
    return unlock
  }, [])
}
