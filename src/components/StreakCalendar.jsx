export default function StreakCalendar({ checkIns = [] }) {
  const today = new Date()
  const WEEKS = 7
  const totalDays = WEEKS * 7

  const days = []
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push(d)
  }

  const checkedSet = new Set(checkIns)
  if (checkIns.length === 0) {
    for (let i = 0; i < 5; i++) {
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

  function getCellStyle(d) {
    const isToday = d.toDateString() === today.toDateString()
    const checked = checkedSet.has(d.toDateString())
    const isFuture = d > today

    if (isFuture) {
      return { symbol: '·', color: '#d8d0c4', fontSize: 20 }
    }
    if (checked) {
      return { symbol: '●', color: '#8b1a2e', fontSize: 18 }
    }
    if (isToday) {
      return { symbol: '○', color: '#8b1a2e', fontSize: 18 }
    }
    return { symbol: '○', color: '#d8d0c4', fontSize: 18 }
  }

  return (
    <div style={styles.wrap}>
      {/* Day labels */}
      <div style={styles.labelRow}>
        {DAY_LABELS.map((l, i) => (
          <div key={i} style={styles.dayLabel}>{l}</div>
        ))}
      </div>

      {/* Weeks */}
      {weeks.map((week, wi) => (
        <div key={wi} style={styles.row}>
          {week.map((d, di) => {
            const cell = getCellStyle(d)
            return (
              <div
                key={di}
                style={{ ...styles.cell, color: cell.color, fontSize: cell.fontSize }}
                title={d.toDateString()}
              >
                {cell.symbol}
              </div>
            )
          })}
        </div>
      ))}

      <div style={styles.legend}>
        <span style={styles.legendItem}>
          <span style={{ color: '#8b1a2e', fontSize: 14 }}>●</span> checked in
        </span>
        <span style={styles.legendItem}>
          <span style={{ color: '#d8d0c4', fontSize: 14 }}>○</span> missed
        </span>
      </div>
    </div>
  )
}

const CELL = 34

const styles = {
  wrap: {
    padding: '4px 0',
  },
  labelRow: {
    display: 'flex',
    gap: 4,
    marginBottom: 6,
  },
  dayLabel: {
    width: CELL,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    color: '#9b8c7e',
    fontStyle: 'italic',
  },
  row: {
    display: 'flex',
    gap: 4,
    marginBottom: 4,
  },
  cell: {
    width: CELL,
    height: CELL,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Caveat, cursive',
    lineHeight: 1,
  },
  legend: {
    display: 'flex',
    gap: 20,
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  legendItem: {
    fontSize: 14,
    color: '#9b8c7e',
    fontStyle: 'italic',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
}
