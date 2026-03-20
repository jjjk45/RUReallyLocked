import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const GOALS = [
  { id: 'gym', emoji: '💪', label: 'Gym', desc: 'Build a consistent workout habit' },
  { id: 'internships', emoji: '💼', label: 'Internships', desc: 'Apply to opportunities daily' },
  { id: 'coding', emoji: '💻', label: 'Coding', desc: 'Practice & build projects' },
  { id: 'studying', emoji: '📚', label: 'Studying', desc: 'Stay on top of coursework' },
  { id: 'wakeup', emoji: '🌅', label: 'Waking Up Early', desc: 'Build a morning routine' },
]

export default function GoalSelect() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  function handleContinue() {
    if (!selected) return
    localStorage.setItem('rul_goal', selected)
    navigate('/collateral')
  }

  return (
    <div style={styles.screen}>
      <div style={styles.header}>
        <div style={styles.stepRow}>
          <span style={styles.step}>Step 1 of 3</span>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: '33%' }} />
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>What are you working on?</h1>
        <p style={styles.sub}>Pick one goal — your partner will share the same one.</p>

        <div style={styles.grid}>
          {GOALS.map(g => (
            <button
              key={g.id}
              style={{
                ...styles.card,
                ...(selected === g.id ? styles.cardActive : {}),
              }}
              onClick={() => setSelected(g.id)}
            >
              <span style={styles.cardEmoji}>{g.emoji}</span>
              <span style={styles.cardLabel}>{g.label}</span>
              <span style={styles.cardDesc}>{g.desc}</span>
              {selected === g.id && <span style={styles.check}>✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.footer}>
        <button
          style={{ ...styles.btn, opacity: selected ? 1 : 0.4 }}
          onClick={handleContinue}
          disabled={!selected}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}

const styles = {
  screen: {
    minHeight: '100vh',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '20px 24px 0',
  },
  stepRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  step: {
    fontSize: 13,
    fontWeight: 600,
    color: '#CC0033',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    background: '#f0f0f0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: '#CC0033',
    borderRadius: 2,
    transition: 'width 0.3s',
  },
  content: {
    flex: 1,
    padding: '28px 20px 100px',
    overflowY: 'auto',
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 1.2,
  },
  sub: {
    fontSize: 14,
    color: '#888',
    marginBottom: 28,
    lineHeight: 1.5,
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  card: {
    width: '100%',
    padding: '18px 20px',
    borderRadius: 16,
    border: '2px solid #eee',
    background: '#fafafa',
    textAlign: 'left',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.18s',
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  cardActive: {
    border: '2px solid #CC0033',
    background: '#fff5f7',
  },
  cardEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 17,
    fontWeight: 700,
    color: '#1a1a1a',
  },
  cardDesc: {
    fontSize: 13,
    color: '#888',
  },
  check: {
    position: 'absolute',
    top: 18,
    right: 20,
    width: 26,
    height: 26,
    borderRadius: '50%',
    background: '#CC0033',
    color: '#fff',
    fontSize: 13,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 430,
    padding: '16px 24px 28px',
    background: 'linear-gradient(to top, #fff 80%, transparent)',
  },
  btn: {
    width: '100%',
    padding: '16px',
    borderRadius: 14,
    background: '#CC0033',
    color: '#fff',
    fontSize: 17,
    fontWeight: 700,
    transition: 'opacity 0.2s',
  },
}
