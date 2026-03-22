import { useState, useEffect } from 'react'
import CheckInButton from '../components/CheckInButton'
import StreakCalendar from '../components/StreakCalendar'
import BadgeDisplay from '../components/BadgeDisplay'
import { useAuth } from '../hooks/useAuth'
import { useDatabase } from '../hooks/useDatabase'
import ReportPopup from '../components/ReportPopup'
// ========== ADDED HERE: Chat imports ==========
import ChatToggle from '../components/ChatToggle'
import { useUnreadCount } from '../hooks/useUnreadCount'

const GOAL_LABELS = {
  gym: 'Gym',
  internships: 'Internships',
  coding: 'Coding',
  studying: 'Studying',
  wakeup: 'Waking Up Early',
}

const COLLATERAL_LABELS = {
  money: { emoji: '💵', label: '$20 to partner' },
  meal: { emoji: '🍕', label: 'Owe them a meal' },
  mile: { emoji: '🏃', label: 'Run a mile' },
  bathroom: { emoji: '🧹', label: 'Clean their bathroom/kitchen' },
  dishes: { emoji: '🍽️', label: 'Do their dishes' },
}

export default function Dashboard() {
  const { user } = useAuth()
  const {
    getActivePartnership,
    recordCheckIn,
    getCurrentStreak,
    getCheckInHistory,
    checkMissedCheckIns
  } = useDatabase()

  const [partnership, setPartnership] = useState(null)
  const [partner, setPartner] = useState(null)
  const [streak, setStreak] = useState(0)
  const [checkedIn, setCheckedIn] = useState(false)
  const [checkInHistory, setCheckInHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showReport, setShowReport] = useState(false)
  const [collateral, setCollateral] = useState(null)
  // ========== ADDED HERE: Chat state ==========
  const [conversationId, setConversationId] = useState(null)

  const goal = localStorage.getItem('rul_goal') || 'gym'
  const goalLabel = GOAL_LABELS[goal] || 'Gym'

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  })

  // ========== ADDED HERE: Get conversation ID for unread count ==========
  useEffect(() => {
    async function getConversationId() {
      if (!partnership) return
      
      const { data, error } = await supabase
        .from('conversations')
        .select('id')
        .eq('partnership_id', partnership.id)
        .maybeSingle()
      
      if (!error && data) {
        setConversationId(data.id)
      }
    }
    
    getConversationId()
  }, [partnership])

  // ========== ADDED HERE: Unread message count ==========
  const unreadCount = useUnreadCount(user?.id, conversationId)

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return

      try {
        setLoading(true)

        const activePartnership = await getActivePartnership(user.id)

        if (activePartnership) {
          setPartnership(activePartnership)

          const partnerUser = activePartnership.user1_id === user.id
            ? activePartnership.user2
            : activePartnership.user1
          setPartner(partnerUser)

          const currentStreak = await getCurrentStreak(activePartnership.id, user.id)
          setStreak(currentStreak)

          const history = await getCheckInHistory(activePartnership.id, user.id)
          setCheckInHistory(history)

          const todayStr = new Date().toISOString().split('T')[0]
          const todayCheckIn = history.find(h => h.date === todayStr)
          setCheckedIn(!!todayCheckIn)

          await checkMissedCheckIns(activePartnership.id, user.id)

          const collateralType = localStorage.getItem('rul_collateral') || 'money'
          setCollateral(COLLATERAL_LABELS[collateralType] || COLLATERAL_LABELS.money)
        } else {
          setError('No active partnership found. Please find a partner first.')
        }
      } catch (error) {
        console.error('Error loading dashboard:', error)
        setError(error.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user])

  async function handleCheckIn() {
    if (!partnership || checkedIn) return

    try {
      const result = await recordCheckIn(partnership.id, user.id)
      setCheckedIn(true)
      setStreak(prev => prev + 1)

      const updatedHistory = await getCheckInHistory(partnership.id, user.id)
      setCheckInHistory(updatedHistory)

      if (result.bothCheckedIn) {
        console.log('Both partners checked in today!')
      }
    } catch (error) {
      console.error('Error checking in:', error)
      setError(error.message || 'Failed to check in. Please try again.')
    }
  }

  // ========== COMMENTED OUT ORIGINAL handleCheckIn ==========
  // function handleCheckIn() {
  //   setCheckedIn(true)
  //   setStreak(s => s + 1)
  // }

  const getPartnerDisplayName = () => {
    if (!partner) return 'Finding partner...'
    return partner.full_name || 'Accountability Partner'
  }

  const getPartnerYear = () => {
    if (!partner) return ''
    return partner.year || 'Student'
  }

  const getPartnerSchool = () => {
    if (!partner) return ''
    return partner.school || 'Rutgers University'
  }

  if (loading) {
    return (
      <div style={styles.screen}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>loading your journal...</p>
        </div>
      </div>
    )
  }

  if (error && !partnership) {
    return (
      <div style={styles.screen}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <h2 style={styles.errorTitle}>No Active Partnership</h2>
          <p style={styles.errorMessage}>{error}</p>
          <button style={styles.errorButton} onClick={() => window.location.href = '/matching'}>
            → find a partner
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.screen}>
      {/* Journal Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.journalTitle}>RUrllyLocked?</div>
          <div style={styles.dateStamp}>{today}</div>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.goalBadge}>{goalLabel}</div>
        </div>
      </div>

      <div style={styles.content}>

        {/* Partner Section */}
        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <span style={styles.bullet}>•</span>
            <span style={styles.sectionTitle}>accountability partner</span>
            <div style={styles.sectionLine} />
          </div>

          <div style={styles.partnerBlock}>
            <div style={styles.partnerInfo}>
              <div style={styles.partnerName}>{getPartnerDisplayName()}</div>
              <div style={styles.partnerMeta}>
                {getPartnerYear()} · {getPartnerSchool()}
              </div>
              <div style={styles.partnerStatus}>
                {checkedIn
                  ? <span style={styles.statusDone}>✓ both checked in today</span>
                  : <span style={styles.statusWaiting}>○ waiting on today's check-in</span>
                }
              </div>
            </div>
            <div style={styles.streakBox}>
              <div style={styles.streakNum}>{streak}</div>
              <div style={styles.streakLabel}>day streak</div>
            </div>
          </div>
        </section>

        {/* Check-in Window */}
        <div style={styles.windowNote}>
          <span style={styles.windowBullet}>!</span>
          <span style={styles.windowText}>
            check-in window: <strong>7:30 – 8:00 AM</strong>
            <span style={styles.windowHint}> (set your daily reminder)</span>
          </span>
        </div>

        {/* Check-In Button */}
        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <span style={styles.bullet}>•</span>
            <span style={styles.sectionTitle}>daily check-in</span>
            <div style={styles.sectionLine} />
          </div>
          <div style={styles.checkInWrap}>
            <CheckInButton onCheckIn={handleCheckIn} alreadyCheckedIn={checkedIn} />
          </div>
        </section>

        {/* Calendar */}
        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <span style={styles.bullet}>•</span>
            <span style={styles.sectionTitle}>calendar</span>
            <div style={styles.sectionLine} />
          </div>
          <StreakCalendar checkIns={checkInHistory.map(h => h.date)} />
        </section>

        {/* Badges */}
        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <span style={styles.bullet}>•</span>
            <span style={styles.sectionTitle}>achievements</span>
            <div style={styles.sectionLine} />
          </div>
          <BadgeDisplay streak={streak} />
        </section>

        {/* Collateral */}
        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <span style={styles.bullet}>•</span>
            <span style={styles.sectionTitle}>your stake</span>
            <div style={styles.sectionLine} />
          </div>
          <div style={styles.stakeRow}>
            <span style={styles.stakeText}>
              {collateral ? `${collateral.emoji} ${collateral.label} if you miss a check-in` : 'Collateral set if you miss a check-in'}
            </span>
          </div>
        </section>

        {/* Report */}
        <div style={styles.reportWrap}>
          <button style={styles.reportBtn} onClick={() => setShowReport(true)}>
            ✕ report partner
          </button>
        </div>

        <div style={{ height: 40 }} />
      </div>

      <ReportPopup
        show={showReport}
        onClose={() => setShowReport(false)}
        onSubmit={() => {
          setShowReport(false)
          alert('Report submitted. Our team will review your report within 24 hours. Thank you for helping keep our community safe.')
        }}
      />

      {/* ========== ADDED HERE: Chat Toggle Button ========== */}
      {partnership && partner && (
        <ChatToggle
          partnership={partnership}
          currentUser={user}
          partner={partner}
          unreadCount={unreadCount}
        />
      )}
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
  header: {
    padding: '18px 52px 16px',
    borderBottom: '2px solid #2d2416',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    background: '#faf7f2',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  journalTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: '#2d2416',
  },
  dateStamp: {
    fontSize: 15,
    color: '#9b8c7e',
    fontStyle: 'italic',
  },
  headerRight: {},
  goalBadge: {
    border: '1.5px solid #8b1a2e',
    color: '#8b1a2e',
    fontSize: 16,
    padding: '4px 12px',
    borderRadius: 2,
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    padding: '32px 52px',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  section: {
    marginBottom: 32,
  },
  sectionHead: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  bullet: {
    color: '#8b1a2e',
    fontSize: 20,
    flexShrink: 0,
  },
  sectionTitle: {
    color: '#2d2416',
    fontSize: 18,
    fontStyle: 'italic',
    flexShrink: 0,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    background: '#e0d8cc',
  },
  partnerBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '18px 20px',
    background: '#fdf9f3',
    border: '1px solid #e0d8cc',
    borderLeft: '3px solid #8b1a2e',
  },
  partnerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  partnerName: {
    fontSize: 26,
    fontWeight: 700,
    color: '#2d2416',
  },
  partnerMeta: {
    fontSize: 16,
    color: '#9b8c7e',
    fontStyle: 'italic',
  },
  partnerStatus: {
    fontSize: 17,
    marginTop: 4,
  },
  statusDone: {
    color: '#4a7c6f',
    fontWeight: 600,
  },
  statusWaiting: {
    color: '#8b5e3c',
    fontStyle: 'italic',
  },
  streakBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderLeft: '1px solid #e0d8cc',
    paddingLeft: 20,
    marginLeft: 20,
  },
  streakNum: {
    fontSize: 42,
    fontWeight: 700,
    color: '#8b1a2e',
    lineHeight: 1,
  },
  streakLabel: {
    fontSize: 14,
    color: '#9b8c7e',
    fontStyle: 'italic',
  },
  windowNote: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: '12px 16px',
    background: '#f5ede8',
    borderLeft: '3px solid #8b5e3c',
    marginBottom: 28,
    fontSize: 17,
    color: '#4a3f35',
    fontStyle: 'italic',
  },
  windowBullet: {
    color: '#8b5e3c',
    fontWeight: 700,
    fontSize: 18,
    flexShrink: 0,
  },
  windowText: {
    lineHeight: 1.4,
  },
  windowHint: {
    fontSize: 13,
    color: '#9b8c7e',
    marginLeft: 8,
  },
  checkInWrap: {
    display: 'flex',
    justifyContent: 'center',
  },
  stakeRow: {
    padding: '12px 16px',
    background: '#fdf9f3',
    border: '1px solid #e0d8cc',
  },
  stakeText: {
    fontSize: 19,
    color: '#4a3f35',
    fontStyle: 'italic',
  },
  reportWrap: {
    display: 'flex',
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  reportBtn: {
    background: 'transparent',
    border: 'none',
    color: '#9b8c7e',
    fontSize: 17,
    fontStyle: 'italic',
    cursor: 'pointer',
    padding: 0,
    fontFamily: 'Caveat, cursive',
    textDecoration: 'underline',
    textDecorationColor: '#c8bfb0',
  },
  loadingContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 52px',
  },
  spinner: {
    width: 48,
    height: 48,
    border: '3px solid #e0d8cc',
    borderTop: '3px solid #8b1a2e',
    borderRadius: '50%',
    animation: 'spin 0.9s linear infinite',
    marginBottom: 20,
  },
  loadingText: {
    color: '#6b5d4e',
    fontSize: 20,
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 52px',
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: '#8b1a2e',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 18,
    color: '#6b5d4e',
    fontStyle: 'italic',
    marginBottom: 24,
    maxWidth: 400,
  },
  errorButton: {
    padding: '10px 28px',
    border: '2px solid #2d2416',
    background: '#2d2416',
    color: '#faf7f2',
    fontSize: 20,
    fontWeight: 700,
    borderRadius: 2,
    cursor: 'pointer',
  },
}

// ========== ADDED HERE: Keyframe animation for spinner ==========
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `
  document.head.appendChild(style)
}