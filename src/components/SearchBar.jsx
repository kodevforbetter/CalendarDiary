import { useState, useRef, useEffect } from 'react'

function highlight(text, query) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 rounded">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

function formatKey(dateKey) {
  const [y, m, d] = dateKey.split('-')
  return `${y}/${m}/${d}`
}

export default function SearchBar({ entries, onSelect }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const results = query.trim()
    ? Object.entries(entries)
        .filter(([, e]) =>
          e.title?.toLowerCase().includes(query.toLowerCase()) ||
          e.body?.toLowerCase().includes(query.toLowerCase())
        )
        .sort(([a], [b]) => b.localeCompare(a))
        .slice(0, 10)
    : []

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(dateKey) {
    onSelect(dateKey)
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative w-64">
      <input
        type="text"
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        placeholder="日記を検索..."
        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
      {open && results.length > 0 && (
        <ul className="absolute top-full mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {results.map(([dateKey, entry]) => (
            <li key={dateKey}>
              <button
                onClick={() => handleSelect(dateKey)}
                className="w-full text-left px-3 py-2 hover:bg-indigo-50 transition-colors"
              >
                <div className="text-xs text-indigo-400 font-medium">{formatKey(dateKey)}</div>
                {entry.title && (
                  <div className="text-sm font-medium text-gray-700 truncate">
                    {highlight(entry.title, query)}
                  </div>
                )}
                <div className="text-xs text-gray-400 truncate">
                  {highlight(entry.body?.slice(0, 60) ?? '', query)}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && query.trim() && results.length === 0 && (
        <div className="absolute top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 px-3 py-2 text-sm text-gray-400">
          見つかりませんでした
        </div>
      )}
    </div>
  )
}
