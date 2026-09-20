'use client'

type PopupWindowButtonProps = {
  href: string
  label: string
  windowName: string
}

/**
 * Opens the target signup/settings page in a real, separate, resizable
 * browser window (not a fixed iframe — Stripe/Vercel/Google all send
 * X-Frame-Options/CSP frame-ancestors headers that block iframing anyway,
 * confirmed live 2026-09-19) so the customer can drag it beside these
 * instructions and copy/paste between the two.
 */
export function PopupWindowButton({ href, label, windowName }: PopupWindowButtonProps) {
  function openPopup() {
    const width = 520
    const height = 760
    const left = Math.max(0, Math.round((window.screen.width - width) / 2))
    const top = Math.max(0, Math.round((window.screen.height - height) / 2))
    window.open(
      href,
      windowName,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,toolbar=yes,location=yes`
    )
  }

  return (
    <button type="button" className="setup-window-btn" onClick={openPopup}>
      {label} <span aria-hidden="true">↗</span>
    </button>
  )
}
