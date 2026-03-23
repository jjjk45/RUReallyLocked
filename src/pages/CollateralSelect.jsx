import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDatabase } from '../hooks/useDatabase'
import { COLLATERAL } from '../types/collaterals'
import { colors } from '../styles/colors'
import { shared } from '../styles/shared'

export default function CollateralSelect() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { saveGoal } = useDatabase()
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleContinue() {
    if (!selected) return
    setLoading(true)
    setError('')

    try {
      const goal = localStorage.getItem('rul_goal') || 'gym'
      localStorage.setItem('rul_collateral', selected)

      if (user) {
        await saveGoal(user.id, goal, selected)
      }

      navigate('/matching')
    } catch (err) {
      setError('Failed to save your selection. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={shared.screen}>
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={() => navigate('/goal')}>← back</button>
        <div style={styles.stepInfo}>
          <span style={styles.stepLabel}>step 2 of 3</span>
          <div style={shared.progressTrack}>
            <div style={{ ...shared.progressFill, width: '66%' }} />
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Choose Your Collateral</h1>
          <div style={shared.accentLine} />
          <p style={styles.sub}>if you miss a check-in, you owe this to your partner</p>
        </div>

        <div style={styles.noteBox}>
          <span style={styles.noteBullet}>!</span>
          <span style={styles.noteText}>
            prospective partners will match with you based on your collateral choice, choose wisely!
          </span>
        </div>

        <div style={shared.sectionDivider}>
          <span style={shared.bullet}>•</span>
          <span style={shared.sectionLabel}>your consequence if you miss</span>
          <div style={shared.dividerLine} />
        </div>

        <div style={styles.list}>
          {COLLATERAL.map(c => {
            const isSelected = selected === c.id
            return (
              <button
                key={c.id}
                style={{ ...styles.item, ...(isSelected ? styles.itemActive : {}) }}
                onClick={() => setSelected(c.id)}
                disabled={loading}
              >
                <span style={{ ...styles.itemSymbol, color: isSelected ? colors.primary : colors.borderSubtle }}>
                  {isSelected ? '●' : '○'}
                </span>
                <div style={styles.itemText}>
                  <span style={{ ...styles.itemLabel, color: isSelected ? colors.text : colors.textBodyDark }}>
                    {c.label}
                  </span>
                  <span style={styles.itemDesc}>{c.desc}</span>
                </div>
              </button>
            )
          })}
        </div>

        {error && (
          <div style={{ ...shared.errorMessage, marginTop: 20 }}>
            <span style={shared.errorIcon}>⚠️</span>
            <span style={shared.errorText}>{error}</span>
          </div>
        )}
      </div>

      <div style={shared.footer}>
        <div style={shared.footerLine} />
        <div style={shared.footerInner}>
          <span style={shared.footerNote}>
            {selected
              ? `✓ ${COLLATERAL.find(c => c.id === selected)?.label}`
              : 'nothing selected yet'}
          </span>
          <button
            style={{ ...styles.btn, opacity: (selected && !loading) ? 1 : 0.35 }}
            onClick={handleContinue}
            disabled={!selected || loading}
          >
            {loading ? 'saving...' : 'find my partner →'}
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  topBar: {
    padding: '20px 52px 16px',
    borderBottom: `1px solid ${colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  backBtn: {
    background: 'transparent',
    border: 'none',
    color: colors.primary,
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
    color: colors.primary,
    fontStyle: 'italic',
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
    color: colors.textMuted,
    letterSpacing: '2.5px',
    fontFamily: '-apple-system, sans-serif',
    fontWeight: 600,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 40,
    fontWeight: 700,
    lineHeight: 1.1,
    marginBottom: 12,
  },
  sub: {
    color: colors.textBody,
    fontSize: 18,
    fontStyle: 'italic',
  },
  noteBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '14px 18px',
    background: colors.warningBg,
    borderLeft: `3px solid ${colors.primary}`,
    marginBottom: 28,
  },
  noteBullet: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: 700,
    flexShrink: 0,
    lineHeight: 1.3,
  },
  noteText: {
    color: colors.textBodyDark,
    fontSize: 17,
    fontStyle: 'italic',
    lineHeight: 1.5,
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
    borderBottom: `1px solid ${colors.borderLight}`,
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background 0.15s',
    width: '100%',
  },
  itemActive: {
    background: colors.warningBg,
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
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  btn: {
    padding: '10px 28px',
    border: `2px solid ${colors.text}`,
    background: colors.text,
    color: colors.bg,
    fontSize: 20,
    fontWeight: 700,
    borderRadius: 2,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
}
