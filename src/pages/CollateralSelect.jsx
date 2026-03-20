import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const COLLATERAL = [
  { id: 'money', emoji: '💵', label: '$20 to your partner', desc: 'Cold hard cash — the classic motivator' },
  { id: 'meal', emoji: '🍕', label: 'Owe them a meal', desc: 'Buy your partner lunch or dinner' },
  { id: 'mile', emoji: '🏃', label: 'Run a mile', desc: 'Take it to the track, no excuses' },
  { id: 'bathroom', emoji: '🧹', label: "Clean their bathroom/kitchen", desc: "You miss, you scrub" },
  { id: 'dishes', emoji: '🍽️', label: 'Do their dishes', desc: "A humbling reminder to stay on track" },
]

export default function CollateralSelect() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  function handleContinue() {
    if (!selected) return
    localStorage.setItem('rul_collateral', selected)
    navigate('/matching')
  }

  return (
    <div style={styles.screen}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/goal')}>←</button>
        <div style={styles.stepRow}>
          <span style={styles.step}>Step 2 of 3</span>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: '66%' }} />
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>Choose your collateral</h1>
        <p style={styles.sub}>
          If you miss a check-in, you owe this to your accountability partner. Choose wisely.
        </p>

        <div style={styles.infoBox}>
          <span style={styles.infoIcon}>💡</span>
          <span style={styles.infoText}>
            Partners are matched based on compatible collateral choices — pick something real!
          </span>
        </div>

        <div style={styles.grid}>
          {COLLATERAL.map(c => (
            <button
              key={c.id}
              style={{
                ...styles.card,
                ...(selected === c.id ? styles.cardActive : {}),
              }}
              onClick={() => setSelected(c.id)}
            >
              <span style={styles.cardEmoji}>{c.emoji}</span>
              <div style={styles.cardText}>
                <span style={styles.cardLabel}>{c.label}</span>
                <span style={styles.cardDesc}>{c.desc}</span>
              </div>
              {selected === c.id && <span style={styles.check}>✓</span>}
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
          Find My Partner →
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
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  backBtn: {
    alignSelf: 'flex-start',
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: '#f5f5f5',
    border: 'none',
    fontSize: 18,
    cursor: 'pointer',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  content: {
    flex: 1,
    padding: '24px 20px 110px',
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
    marginBottom: 20,
    lineHeight: 1.5,
  },
  infoBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: '14px 16px',
    borderRadius: 12,
    background: '#fff8e6',
    border: '1.5px solid #FFD770',
    marginBottom: 24,
  },
  infoIcon: {
    fontSize: 18,
    flexShrink: 0,
  },
  infoText: {
    fontSize: 13,
    color: '#7a5c00',
    lineHeight: 1.5,
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  card: {
    width: '100%',
    padding: '16px 18px',
    borderRadius: 14,
    border: '2px solid #eee',
    background: '#fafafa',
    textAlign: 'left',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.18s',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  cardActive: {
    border: '2px solid #CC0033',
    background: '#fff5f7',
  },
  cardEmoji: {
    fontSize: 30,
    flexShrink: 0,
  },
  cardText: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    flex: 1,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: 700,
    color: '#1a1a1a',
  },
  cardDesc: {
    fontSize: 12,
    color: '#999',
  },
  check: {
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
    flexShrink: 0,
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
