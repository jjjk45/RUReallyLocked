export default function StreakCalendar({ checkIns = [] }) {
  const today = new Date()
  const WEEKS = 7
  const DAYS = 7
  const totalDays = WEEKS * DAYS

  // Build array of dates (oldest first)
  const days = []
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push(d)
  }

  // Default: mock some checked-in days for demo
  const checkedSet = new Set(checkIns)
  if (checkIns.length === 0) {
    // Demo data: last 5 days checked in
    for (let i = 0; i < 5; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      checkedSet.add(d.toDateString())
    }
    // random sprinkle earlier
    for (let i = 7; i < 35; i += Math.floor(Math.random() * 3) + 1) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      checkedSet.add(d.toDateString())
    }
  }

  const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const weeks = []
  for (let w = 0; w < WEEKS; w++) {
    weeks.push(days.slice(w * 7, w * 7 + 7))
  }

  function getCellColor(d) {
    const isToday = d.toDateString() === today.toDateString()
    const checked = checkedSet.has(d.toDateString())
    if (isToday && !checked) return '#ffe0e6'
    if (checked) return '#CC0033'
    return '#f0f0f0'
  }

  function getCellBorder(d) {
    const isToday = d.toDateString() === today.toDateString()
    return isToday ? '2px solid #CC0033' : '2px solid transparent'
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.headerRow}>
        <span style={styles.title}>Check-in Calendar</span>
        <span style={styles.legend}>
          <span style={styles.legendDot} /> checked in
        </span>
      </div>

      <div style={styles.grid}>
        {/* Day labels */}
        <div style={styles.row}>
          {DAY_LABELS.map((l, i) => (
            <div key={i} style={styles.dayLabel}>{l}</div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} style={styles.row}>
            {week.map((d, di) => (
              <div
                key={di}
                style={{
                  ...styles.cell,
                  background: getCellColor(d),
                  border: getCellBorder(d),
                }}
                title={d.toDateString()}
              />
            ))}
          </div>
        ))}
      </div>

      <div style={styles.monthLabel}>
        Last {WEEKS} weeks
      </div>
    </div>
  )
}

const CELL = 36

const styles = {
  wrap: {
    padding: '4px 0',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
    color: '#1a1a1a',
  },
  legend: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: '#888',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
    background: '#CC0033',
    display: 'inline-block',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  row: {
    display: 'flex',
    gap: 4,
    justifyContent: 'center',
  },
  dayLabel: {
    width: CELL,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: 600,
    color: '#bbb',
    letterSpacing: '0.3px',
  },
  cell: {
    width: CELL,
    height: CELL,
    borderRadius: 7,
    transition: 'background 0.2s',
  },
  monthLabel: {
    fontSize: 11,
    color: '#ccc',
    textAlign: 'right',
    marginTop: 8,
  },
}
