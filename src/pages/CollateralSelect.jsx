import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COLLATERAL } from '../types/collaterals'

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
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={() => navigate('/goal')}>← back</button>
        <div style={styles.stepInfo}>
          <span style={styles.stepLabel}>step 2 of 3</span>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: '66%' }} />
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.headerLabel}>stakes collection</div>
          <h1 style={styles.title}>Choose Your Collateral</h1>
          <div style={styles.accentLine} />
          <p style={styles.sub}>if you miss a check-in, you owe this to your partner. choose wisely.</p>
        </div>

        <div style={styles.noteBox}>
          <span style={styles.noteBullet}>!</span>
          <span style={styles.noteText}>
            partners are matched based on compatible collateral choices — pick something real
          </span>
        </div>

        <div style={styles.sectionDivider}>
          <span style={styles.bullet}>•</span>
          <span style={styles.sectionLabel}>your consequence if you miss</span>
          <div style={styles.dividerLine} />
        </div>

        <div style={styles.list}>
          {COLLATERAL.map(c => {
            const isSelected = selected === c.id
            return (
              <button
                key={c.id}
                style={{ ...styles.item, ...(isSelected ? styles.itemActive : {}) }}
                onClick={() => setSelected(c.id)}
              >
                <span style={{ ...styles.itemSymbol, color: isSelected ? '#8b1a2e' : '#c8bfb0' }}>
                  {isSelected ? '●' : '○'}
                </span>
                <div style={styles.itemText}>
                  <span style={{ ...styles.itemLabel, color: isSelected ? '#2d2416' : '#4a3f35' }}>
                    {c.label}
                  </span>
                  <span style={styles.itemDesc}>{c.desc}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div style={styles.footer}>
        <div style={styles.footerLine} />
        <div style={styles.footerInner}>
          <span style={styles.footerNote}>
            {selected
              ? `✓ ${COLLATERAL.find(c => c.id === selected)?.label}`
              : 'nothing selected yet'}
          </span>
          <button
            style={{ ...styles.btn, opacity: selected ? 1 : 0.35 }}
            onClick={handleContinue}
            disabled={!selected}
          >
            find my partner →
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  screen: {
    minHeight: '100vh',
    background: '#faf7f2',
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 6,
  },
  topBar: {
    padding: '20px 52px 16px',
    borderBottom: '1px solid #e0d8cc',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  backBtn: {
    background: 'transparent',
    border: 'none',
    color: '#8b1a2e',
    fontSize: 20,
    fontFamily: 'Caveat, cursive',
    cursor: 'pointer',
    padding: 0,
    alignSelf: 'flex-start',
  },
  stepInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  stepLabel: {
    fontSize: 14,
    color: '#8b1a2e',
    fontStyle: 'italic',
  },
  progressTrack: {
    height: 2,
    background: '#e0d8cc',
    borderRadius: 1,
    overflow: 'hidden',
    maxWidth: 200,
  },
  progressFill: {
    height: '100%',
    background: '#8b1a2e',
    transition: 'width 0.3s',
  },
  content: {
    flex: 1,
    padding: '40px 52px 120px',
  },
  header: {
    marginBottom: 28,
  },
  headerLabel: {
    fontSize: 11,
    color: '#9b8c7e',
    letterSpacing: '2.5px',
    fontFamily: '-apple-system, sans-serif',
    fontWeight: 600,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    color: '#2d2416',
    fontSize: 40,
    fontWeight: 700,
    lineHeight: 1.1,
    marginBottom: 12,
  },
  accentLine: {
    width: 48,
    height: 3,
    background: '#8b1a2e',
    marginBottom: 10,
  },
  sub: {
    color: '#6b5d4e',
    fontSize: 18,
    fontStyle: 'italic',
  },
  noteBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '14px 18px',
    background: '#f5ede8',
    borderLeft: '3px solid #8b1a2e',
    marginBottom: 28,
  },
  noteBullet: {
    color: '#8b1a2e',
    fontSize: 20,
    fontWeight: 700,
    flexShrink: 0,
    lineHeight: 1.3,
  },
  noteText: {
    color: '#4a3f35',
    fontSize: 17,
    fontStyle: 'italic',
    lineHeight: 1.5,
  },
  sectionDivider: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  bullet: {
    color: '#8b1a2e',
    fontSize: 18,
    flexShrink: 0,
  },
  sectionLabel: {
    color: '#6b5d4e',
    fontSize: 16,
    fontStyle: 'italic',
    flexShrink: 0,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: '#e0d8cc',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
    padding: '14px 16px',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid #f0ece4',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background 0.15s',
    width: '100%',
  },
  itemActive: {
    background: '#f5ede8',
  },
  itemSymbol: {
    fontSize: 22,
    lineHeight: 1.3,
    flexShrink: 0,
    transition: 'color 0.15s',
  },
  itemText: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  itemLabel: {
    fontSize: 22,
    fontWeight: 600,
    transition: 'color 0.15s',
  },
  itemDesc: {
    fontSize: 16,
    color: '#9b8c7e',
    fontStyle: 'italic',
  },
  footer: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 720,
    paddingLeft: 6,
    background: '#faf7f2',
  },
  footerLine: {
    height: 1,
    background: '#e0d8cc',
  },
  footerInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 52px 24px',
  },
  footerNote: {
    color: '#9b8c7e',
    fontSize: 17,
    fontStyle: 'italic',
  },
  btn: {
    padding: '10px 28px',
    border: '2px solid #2d2416',
    background: '#2d2416',
    color: '#faf7f2',
    fontSize: 20,
    fontWeight: 700,
    borderRadius: 2,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
}
