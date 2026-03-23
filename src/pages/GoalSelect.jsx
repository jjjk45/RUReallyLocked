import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GOALS } from '../types/goals'
import { colors } from '../styles/colors'
import { shared } from '../styles/shared'

export default function GoalSelect() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  function handleContinue() {
    if (!selected) return
    localStorage.setItem('rul_goal', selected)
    navigate('/collateral')
  }

  return (
    <div style={shared.screen}>
      <div style={styles.topBar}>
        <div style={styles.stepInfo}>
          <span style={styles.stepLabel}>step 1 of 3</span>
          <div style={shared.progressTrack}>
            <div style={{ ...shared.progressFill, width: '33%' }} />
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>What are you working on?</h1>
          <div style={shared.accentLine} />
          <p style={styles.sub}>pick a goal to work on daily</p>
        </div>

        <div style={shared.sectionDivider}>
          <span style={shared.bullet}>•</span>
          <span style={shared.sectionLabel}>choose your focus</span>
          <div style={shared.dividerLine} />
        </div>

        <div style={styles.list}>
          {GOALS.map(g => {
            const isSelected = selected === g.id
            return (
              <button
                key={g.id}
                style={{ ...styles.item, ...(isSelected ? styles.itemActive : {}) }}
                onClick={() => setSelected(g.id)}
              >
                <span style={{ ...styles.itemSymbol, color: isSelected ? colors.primary : colors.borderSubtle }}>
                  {isSelected ? '●' : '○'}
                </span>
                <div style={styles.itemText}>
                  <span style={{ ...styles.itemLabel, color: isSelected ? colors.text : colors.textBodyDark }}>
                    {g.label}
                  </span>
                  <span style={styles.itemDesc}>{g.desc}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div style={shared.footer}>
        <div style={shared.footerLine} />
        <div style={shared.footerInner}>
          <span style={shared.footerNote}>
            {selected ? `✓ selected: ${GOALS.find(g => g.id === selected)?.label}` : 'nothing selected yet'}
          </span>
          <button
            style={{ ...styles.btn, opacity: selected ? 1 : 0.35 }}
            onClick={handleContinue}
            disabled={!selected}
          >
            continue →
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
    marginBottom: 32,
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
    fontSize: 24,
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
