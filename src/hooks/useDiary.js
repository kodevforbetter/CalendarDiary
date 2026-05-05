import { useState, useEffect } from 'react'

const STORAGE_KEY = 'diary_entries'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function useDiary() {
  const [entries, setEntries] = useState(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  function saveEntry(dateKey, { title, body, mood }) {
    setEntries(prev => ({
      ...prev,
      [dateKey]: {
        title,
        body,
        mood,
        createdAt: prev[dateKey]?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }))
  }

  function deleteEntry(dateKey) {
    setEntries(prev => {
      const next = { ...prev }
      delete next[dateKey]
      return next
    })
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'diary_export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return { entries, saveEntry, deleteEntry, exportJSON }
}
