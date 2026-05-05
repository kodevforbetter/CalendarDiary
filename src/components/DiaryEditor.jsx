import { useState, useEffect } from 'react'

const MOODS = [
  { value: 'happy', icon: '😊', label: 'いい気分' },
  { value: 'neutral', icon: '😐', label: 'ふつう' },
  { value: 'sad', icon: '😞', label: 'しんどい' },
]

function formatDate(dateKey) {
  if (!dateKey) return ''
  const [y, m, d] = dateKey.split('-')
  const date = new Date(Number(y), Number(m) - 1, Number(d))
  return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })
}

export default function DiaryEditor({ selectedDate, entry, onSave, onDelete }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [mood, setMood] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setTitle(entry?.title ?? '')
    setBody(entry?.body ?? '')
    setMood(entry?.mood ?? '')
    setSaved(false)
  }, [selectedDate, entry])

  function handleSave() {
    if (!selectedDate) return
    onSave(selectedDate, { title, body, mood })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleDelete() {
    if (!selectedDate || !entry) return
    if (window.confirm('この日記を削除しますか？')) {
      onDelete(selectedDate)
    }
  }

  if (!selectedDate) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        日付を選択してください
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col p-6 min-h-0">
      {/* Date header */}
      <h2 className="text-lg font-semibold text-gray-700 mb-4">{formatDate(selectedDate)}</h2>

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="タイトル（任意）"
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />

      {/* Body */}
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="今日はどんな一日でしたか？"
        className="flex-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 min-h-48"
      />

      {/* Mood selector */}
      <div className="flex items-center gap-3 mt-4">
        <span className="text-sm text-gray-500">気分：</span>
        {MOODS.map(m => (
          <button
            key={m.value}
            onClick={() => setMood(prev => prev === m.value ? '' : m.value)}
            title={m.label}
            className={`text-2xl rounded-lg p-1 transition-all ${mood === m.value ? 'scale-125 ring-2 ring-indigo-400' : 'opacity-50 hover:opacity-100'}`}
          >
            {m.icon}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4">
        <div>
          {entry && (
            <button
              onClick={handleDelete}
              className="text-sm text-red-400 hover:text-red-600 transition-colors"
            >
              削除
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-green-500">保存しました</span>}
          <button
            onClick={handleSave}
            className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-5 py-2 rounded-lg transition-colors"
          >
            保存
          </button>
        </div>
      </div>

      {/* Updated time */}
      {entry?.updatedAt && (
        <p className="text-xs text-gray-300 mt-2 text-right">
          最終更新：{new Date(entry.updatedAt).toLocaleString('ja-JP')}
        </p>
      )}
    </div>
  )
}
