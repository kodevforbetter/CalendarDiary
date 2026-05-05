const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

const MOOD_ICON = { happy: '😊', neutral: '😐', sad: '😞' }

function toKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function CalendarPanel({ currentMonth, onMonthChange, selectedDate, onSelectDate, entries }) {
  const { year, month } = currentMonth
  const today = new Date()
  const todayKey = today.toISOString().slice(0, 10)

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  function prevMonth() {
    onMonthChange(month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 })
  }
  function nextMonth() {
    onMonthChange(month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 })
  }

  return (
    <div className="w-80 shrink-0 border-r border-gray-200 p-4 select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600"
        >
          ◀
        </button>
        <span className="font-semibold text-gray-800">
          {year}年{month + 1}月
        </span>
        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600"
        >
          ▶
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-xs font-medium py-1 ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'}`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />
          const key = toKey(year, month, day)
          const entry = entries[key]
          const isToday = key === todayKey
          const isSelected = key === selectedDate
          const weekday = (firstDay + day - 1) % 7

          return (
            <button
              key={key}
              onClick={() => onSelectDate(key)}
              className={`
                relative flex flex-col items-center justify-center h-10 rounded-lg text-sm transition-colors
                ${isSelected ? 'bg-indigo-500 text-white' : isToday ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-gray-100'}
                ${!isSelected && weekday === 0 ? 'text-red-400' : ''}
                ${!isSelected && weekday === 6 ? 'text-blue-400' : ''}
              `}
            >
              {day}
              {entry && (
                <span className="text-[8px] leading-none mt-0.5">
                  {MOOD_ICON[entry.mood] ?? '●'}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
