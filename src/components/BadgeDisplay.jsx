const BADGES = [
  { id: 'week',    label: '7-day streak',     sub: 'one full week',          required: 7  },
  { id: 'twoweek', label: '14-day streak',    sub: 'two weeks strong',       required: 14 },
  { id: 'month',   label: '30-day streak',    sub: 'a whole month',          required: 30 },
  { id: 'partner', label: '60-day partner',   sub: 'habit formed',           required: 60 },
]

export default function BadgeDisplay({ streak = 5 }) {
  return (
    <div style={styles.wrap}>
      <div style={styles.row}>
        {BADGES.map(b => {
          const earned = streak >= b.required
          return (
            <div
              key={b.id}
              style={{ ...styles.badge, ...(earned ? styles.badgeEarned : styles.badgeLocked) }}
              title={earned ? b.label : `locked — reach ${b.required}-day streak`}
            >
              <div style={{ ...styles.stampCircle, ...(earned ? styles.stampEarned : styles.stampLocked) }}>
                <span style={styles.stampNum}>{b.required}d</span>
              </div>
              <span style={{ ...styles.badgeLabel, color: earned ? '#2d2416' : '#c8bfb0' }}>
                {b.label}
              </span>
              <span style={{ ...styles.badgeSub, color: earned ? '#9b8c7e' : '#d8d0c4' }}>
                {earned ? b.sub : 'locked'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    padding: '4px 0',
  },
  row: {
    display: 'flex',
    gap: 12,
    overflowX: 'auto',
    paddingBottom: 6,
  },
  badge: {
    flexShrink: 0,
    width: 100,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: '16px 8px',
    border: '1px solid transparent',
    borderRadius: 2,
  },
  badgeEarned: {
    background: '#fdf9f3',
    border: '1px solid #e0d8cc',
    borderTop: '3px solid #8b1a2e',
  },
  badgeLocked: {
    background: '#f5f3ef',
    border: '1px solid #ece8e0',
  },
  stampCircle: {
    width: 52,
    height: 52,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampEarned: {
    border: '2.5px solid #8b1a2e',
    background: '#faf7f2',
  },
  stampLocked: {
    border: '2px dashed #d8d0c4',
    background: 'transparent',
  },
  stampNum: {
    fontSize: 18,
    fontWeight: 700,
    color: 'inherit',
    fontFamily: 'Caveat, cursive',
  },
  badgeLabel: {
    fontSize: 13,
    fontWeight: 700,
    textAlign: 'center',
    lineHeight: 1.3,
  },
  badgeSub: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
}
