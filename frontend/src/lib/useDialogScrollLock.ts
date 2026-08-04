import { useEffect } from "react"

// iOS Safari ignores base-ui's `overflow: hidden` scroll lock on the body, so
// the page behind an open dialog still scrolls. Only `position: fixed` holds
// there. We detect an open dialog straight from the DOM (base-ui unmounts closed
// dialog popups) and reinforce the lock on iOS only — desktop already works via
// base-ui, and iOS has no persistent scrollbar so there's no layout shift.
function isIOS() {
  if (typeof navigator === "undefined") return false
  return (
    /iP(hone|ad|od)/.test(navigator.userAgent) ||
    // iPadOS 13+ reports as Mac but has touch
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  )
}

export function useDialogScrollLock() {
  useEffect(() => {
    if (!isIOS()) return

    const body = document.body
    let locked = false
    let scrollY = 0

    const update = () => {
      const dialogOpen =
        document.querySelector('[data-slot="dialog-content"]') != null
      if (dialogOpen === locked) return
      locked = dialogOpen

      if (dialogOpen) {
        scrollY = window.scrollY
        body.style.position = "fixed"
        body.style.top = `-${scrollY}px`
        body.style.left = "0"
        body.style.right = "0"
      } else {
        body.style.position = ""
        body.style.top = ""
        body.style.left = ""
        body.style.right = ""
        window.scrollTo(0, scrollY)
      }
    }

    // dialog popups portal into <body>; watch for them appearing/disappearing
    const observer = new MutationObserver(update)
    observer.observe(document.body, { childList: true, subtree: true })
    update()

    return () => observer.disconnect()
  }, [])
}
