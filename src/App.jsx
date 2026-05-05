import { useState } from 'react'
import { useDiary } from './hooks/useDiary'
import CalendarPanel from './components/CalendarPanel'
import DiaryEditor from './components/DiaryEditor'
import SearchBar from './components/SearchBar'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export default function App() {
  const today = new Date()
  const { entries, saveEntry, deleteEntry, exportJSON } = useDiary()
  const [selectedDate, setSelectedDate] = useState(todayKey())
  const [currentMonth, setCurrentMonth] = useState({ year: today.getFullYear(), month: today.getMonth() })

  function handleSelect(dateKey) {
    setSelectedDate(dateKey)
    const [y, m] = dateKey.split('-')
    setCurrentMonth({ year: Number(y), month: Number(m) - 1 })
  }

  return (
    <div className="flex flex-col h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 shrink-0">
        <h1 className="text-xl font-bold text-indigo-600 tracking-tight">📔 CalendarDiary</h1>
        <div className="flex items-center gap-3">
          <SearchBar entries={entries} onSelect={handleSelect} />
          <button
            onClick={exportJSON}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            title="JSONでエクスポート"
          >
            エクスポート
          </button>
        </div>
      </header>

      {/* Main */}
      <div className="flex flex-1 min-h-0">
        <CalendarPanel
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          entries={entries}
        />
        <DiaryEditor
          selectedDate={selectedDate}
          entry={entries[selectedDate]}
          onSave={saveEntry}
          onDelete={deleteEntry}
        />
      </div>
    </div>
  )
}
