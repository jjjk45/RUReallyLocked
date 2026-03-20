const BADGES = [
  { id: 'week', emoji: '🔥', label: '7-Day Streak', desc: 'One full week!', required: 7 },
  { id: 'twoweek', emoji: '⚡', label: '14-Day Streak', desc: 'Two weeks strong', required: 14 },
  { id: 'month', emoji: '💎', label: '30-Day Streak', desc: 'A whole month!', required: 30 },
  { id: 'partner', emoji: '🏆', label: '60-Day Partner', desc: 'Full partnership complete', required: 60 },
]

export default function BadgeDisplay({ streak = 5 }) {
  return (
    <div style={styles.wrap}>
      <h3 style={styles.title}>Badges</h3>
      <div style={styles.row}>
        {BADGES.map(b => {
          const earned = streak >= b.required
          return (
            <div
              key={b.id}
              style={{ ...styles.badge, ...(earned ? styles.badgeEarned : styles.badgeLocked) }}
              title={earned ? b.label : `Locked — reach ${b.required}-day streak`}
            >
              <span style={{ fontSize: 26, filter: earned ? 'none' : 'grayscale(1)', opacity: earned ? 1 : 0.4 }}>
                {b.emoji}
              </span>
              <span style={{ ...styles.badgeLabel, color: earned ? '#1a1a1a' : '#bbb' }}>
                {b.label}
              </span>
              {!earned && (
                <span style={styles.lockOverlay}>🔒 {b.required}d</span>
              )}
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
  title: {
    fontSize: 15,
    fontWeight: 700,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  row: {
    display: 'flex',
    gap: 10,
    overflowX: 'auto',
    paddingBottom: 4,
  },
  badge: {
    flexShrink: 0,
    width: 80,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    padding: '14px 8px',
    borderRadius: 14,
    position: 'relative',
    border: '2px solid transparent',
    transition: 'all 0.2s',
  },
  badgeEarned: {
    background: 'linear-gradient(135deg, #fff5f7, #ffe0e6)',
    border: '2px solid #ffccd5',
    boxShadow: '0 2px 12px rgba(204,0,51,0.1)',
  },
  badgeLocked: {
    background: '#f8f8f8',
    border: '2px solid #f0f0f0',
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: 700,
    textAlign: 'center',
    lineHeight: 1.3,
    letterSpacing: '0.2px',
  },
  lockOverlay: {
    fontSize: 9,
    color: '#ccc',
    fontWeight: 600,
  },
}
