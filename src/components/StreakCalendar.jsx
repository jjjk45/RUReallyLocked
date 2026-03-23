import { useState } from 'react'
import { colors } from '../styles/colors'

export default function StreakCalendar({ checkIns = [] }) {
  const [hoveredDay, setHoveredDay] = useState(null)
  const today = new Date()
  const todayISO = today.toISOString().split('T')[0]

  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  const days = []

  for (let i = firstOfMonth.getDay() - 1; i >= 0; i--) {
    const d = new Date(firstOfMonth)
    d.setDate(firstOfMonth.getDate() - i - 1)
    days.push({ date: d, outOfMonth: true })
  }

  for (let i = 1; i <= lastOfMonth.getDate(); i++) {
    days.push({ date: new Date(today.getFullYear(), today.getMonth(), i), outOfMonth: false })
  }

  const endPad = 6 - lastOfMonth.getDay()
  for (let i = 1; i <= endPad; i++) {
    const d = new Date(lastOfMonth)
    d.setDate(lastOfMonth.getDate() + i)
    days.push({ date: d, outOfMonth: true })
  }

  const weeks = []
  for (let w = 0; w < days.length / 7; w++) {
    weeks.push(days.slice(w * 7, w * 7 + 7))
  }

  const toISO = (d) => d.toISOString().split('T')[0]
  const checkedSet = new Set(checkIns)

  const DAY_LABELS = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa']

  return (
    <div style={styles.wrap}>
      <div style={styles.labelRow}>
        {DAY_LABELS.map((l, i) => (
          <div key={i} style={styles.dayLabel}>{l}</div>
        ))}
      </div>

      {weeks.map((week, wi) => (
        <div key={wi} style={styles.row}>
          {week.map(({ date: d, outOfMonth }, di) => {
            const iso = toISO(d)
            const isToday = iso === todayISO
            const isFuture = iso > todayISO
            const checked = checkedSet.has(iso)

            if (outOfMonth) {
              return <div key={di} style={styles.emptyCell} />
            }

            const bg = checked ? colors.primary : 'transparent'
            const borderColor = checked || isToday ? colors.primary : isFuture ? '#e8e0d8' : '#d8d0c4'
            const borderStyle = isFuture ? 'dashed' : 'solid'
            const color = checked ? '#fff' : isToday ? colors.primary : isFuture ? '#c8bfb5' : colors.textMuted

            const isHovered = hoveredDay === iso

            return (
              <div
                key={di}
                style={{
                  ...styles.cell,
                  backgroundColor: isHovered ? colors.bg : bg,
                  border: `2px ${borderStyle} ${borderColor}`,
                  color: isHovered ? colors.text : color,
                  transform: isHovered ? `scale(1.12) rotate(${Math.floor(Math.random() * 10) - 5}deg)` : 'scale(1) rotate(0deg)',
                  transition: 'background-color 0.2s, color 0.2s, transform 0.2s',
                  cursor: 'default',
                  position: 'relative',
                  zIndex: isHovered ? 10 : 1,
                }}
                title={d.toDateString()}
                onMouseEnter={() => setHoveredDay(iso)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {d.getDate()}
              </div>
            )
          })}
        </div>
      ))}

      <div style={styles.legend}>
        <span style={styles.legendItem}>
          <span style={{ width: 12, height: 12, borderRadius: '20%', backgroundColor: colors.primary, display: 'inline-block' }} /> checked in
        </span>
        <span style={styles.legendItem}>
          <span style={{ width: 12, height: 12, borderRadius: '20%', border: '2px solid #d8d0c4', display: 'inline-block' }} /> missed
        </span>
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    padding: '4px 0',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  labelRow: {
    display: 'flex',
    gap: 4,
    marginBottom: 6,
    width: '100%',
  },
  dayLabel: {
    flex: 1,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    color: colors.textMuted,
    fontFamily: '-apple-system, sans-serif',
  },
  row: {
    display: 'flex',
    gap: 4,
    marginBottom: 4,
    width: '100%',
  },
  cell: {
    flex: 1,
    aspectRatio: '1',
    borderRadius: '20%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Patrick Hand',
    fontSize: 13,
    lineHeight: 1,
  },
  emptyCell: {
    flex: 1,
    aspectRatio: '1',
  },
  legend: {
    display: 'flex',
    gap: 20,
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  legendItem: {
    fontSize: 14,
    color: colors.textMuted,
    fontStyle: 'italic',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
}
