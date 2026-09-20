'use client'

import { useEffect, useState } from 'react'

type ChecklistItemProps = {
  id: string
  title: string
  children: React.ReactNode
}

const STORAGE_KEY = 'mts-onboarding-accounts-checklist'

function readState(): Record<string, boolean> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeState(state: Record<string, boolean>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage unavailable (private browsing, etc.) — checklist still works, just doesn't persist.
  }
}

export function ChecklistItem({ id, title, children }: ChecklistItemProps) {
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDone(!!readState()[id])
  }, [id])

  function toggle() {
    const next = !done
    setDone(next)
    const state = readState()
    state[id] = next
    writeState(state)
  }

  return (
    <li className={done ? 'checklist-item is-done' : 'checklist-item'}>
      <label className="checklist-label">
        <input type="checkbox" checked={done} onChange={toggle} />
        <span className="checklist-title">{title}</span>
      </label>
      <div className="checklist-body">{children}</div>
    </li>
  )
}
