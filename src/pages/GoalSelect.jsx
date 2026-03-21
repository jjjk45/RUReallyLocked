import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// ========== ADDED HERE: Import auth and database hooks ==========
import { useAuth } from '../hooks/useAuth'
import { useDatabase } from '../hooks/useDatabase'

const GOALS = [
  { id: 'gym', symbol: '◉', label: 'Gym', desc: 'build a consistent workout habit' },
  { id: 'internships', symbol: '◉', label: 'Internships', desc: 'apply to opportunities daily' },
  { id: 'coding', symbol: '◉', label: 'Coding', desc: 'practice & build projects' },
  { id: 'studying', symbol: '◉', label: 'Studying', desc: 'stay on top of coursework' },
  { id: 'wakeup', symbol: '◉', label: 'Waking Up Early', desc: 'build a morning routine' },
]

export default function GoalSelect() {
  const navigate = useNavigate()
  // ========== ADDED HERE: Get user and database functions ==========
  const { user } = useAuth()
  const { saveGoal } = useDatabase()
  
  const [selected, setSelected] = useState(null)
  // ========== ADDED HERE: Loading state for button ==========
  const [loading, setLoading] = useState(false)
  // ========== ADDED HERE: Error state for displaying errors ==========
  const [error, setError] = useState('')

  // ========== ADDED HERE: Completely replace handleContinue with async version ==========
  async function handleContinue() {
    if (!selected) return
    
    // Get collateral from localStorage (set in CollateralSelect)
    const collateral = localStorage.getItem('rul_collateral') || 'money'
    
    setLoading(true)
    setError('')
    
    try {
      // Save goal to database
      await saveGoal(user.id, selected, collateral)
      
      // Store in localStorage for quick access
      localStorage.setItem('rul_goal', selected)
      localStorage.setItem('rul_collateral', collateral)
      
      // Navigate to matching page
      navigate('/matching')
    } catch (error) {
      console.error('Error saving goal:', error)
      setError(error.message || 'Failed to save your goal. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ========== COMMENTED OUT ORIGINAL handleContinue ==========
  // function handleContinue() {
  //   if (!selected) return
  //   localStorage.setItem('rul_goal', selected)
  //   navigate('/collateral')
  // }

  return (
    <div style={styles.screen}>
      <div style={styles.topBar}>
        <div style={styles.stepInfo}>
          <span style={styles.stepLabel}>step 1 of 3</span>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: '33%' }} />
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.headerLabel}>goals collection</div>
          <h1 style={styles.title}>What are you working on?</h1>
          <div style={styles.accentLine} />
          <p style={styles.sub}>pick one goal — your partner will share the same one.</p>
        </div>

        <div style={styles.sectionDivider}>
          <span style={styles.bullet}>•</span>
          <span style={styles.sectionLabel}>choose your focus</span>
          <div style={styles.dividerLine} />
        </div>

        <div style={styles.list}>
          {GOALS.map(g => {
            const isSelected = selected === g.id
            return (
              <button
                key={g.id}
                style={{ ...styles.item, ...(isSelected ? styles.itemActive : {}) }}
                onClick={() => setSelected(g.id)}
                // ========== ADDED HERE: Disable selection while loading ==========
                disabled={loading}
              >
                <span style={{ ...styles.itemSymbol, color: isSelected ? '#8b1a2e' : '#c8bfb0' }}>
                  {isSelected ? '●' : '○'}
                </span>
                <div style={styles.itemText}>
                  <span style={{ ...styles.itemLabel, color: isSelected ? '#2d2416' : '#4a3f35' }}>
                    {g.label}
                  </span>
                  <span style={styles.itemDesc}>{g.desc}</span>
                </div>
              </button>
            )
          })}
        </div>
        
        {/* ========== ADDED HERE: Error message display ========== */}
        {error && (
          <div style={styles.errorMessage}>
            <span style={styles.errorIcon}>⚠️</span>
            <span style={styles.errorText}>{error}</span>
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <div style={styles.footerLine} />
        <div style={styles.footerInner}>
          <span style={styles.footerNote}>
            {selected ? `✓ selected: ${GOALS.find(g => g.id === selected)?.label}` : 'nothing selected yet'}
          </span>
          <button
            style={{ ...styles.btn, opacity: (selected && !loading) ? 1 : 0.35 }}
            onClick={handleContinue}
            disabled={!selected || loading}
          >
            {/* ========== ADDED HERE: Dynamic button text ========== */}
            {loading ? 'saving...' : 'continue →'}
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
    marginBottom: 32,
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
  sectionDivider: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
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
    fontSize: 24,
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
  // ========== ADDED HERE: New styles for error messages ==========
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    marginTop: '20px',
    background: '#fff5f5',
    borderLeft: '4px solid #8b1a2e',
  },
  errorIcon: {
    fontSize: '16px',
  },
  errorText: {
    color: '#8b1a2e',
    fontSize: '13px',
    flex: 1,
    fontFamily: '-apple-system, sans-serif',
  },
}