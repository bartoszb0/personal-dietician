import { useEffect } from "react"

// While any dialog is open, freeze the app's scroll container so content behind
// it can't scroll. The dashboard scrolls inside an inner <main>
// ([data-scroll-container]) rather than the body, so we lock that with plain
// `overflow: hidden` — which, unlike on the body, iOS Safari respects. Pages
// without the app shell (login/onboarding) scroll the body, which base-ui
// already locks, so there's nothing to do there.
export function useDialogScrollLock() {
  useEffect(() => {
    let locked = false

    const update = () => {
      const dialogOpen =
        document.querySelector('[data-slot="dialog-content"]') != null
      if (dialogOpen === locked) return
      locked = dialogOpen

      const container = document.querySelector<HTMLElement>(
        "[data-scroll-container]"
      )
      if (container) container.style.overflow = dialogOpen ? "hidden" : ""
    }

    // dialog popups portal into <body>; watch for them appearing/disappearing
    const observer = new MutationObserver(update)
    observer.observe(document.body, { childList: true, subtree: true })
    update()

    return () => observer.disconnect()
  }, [])
}
