import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CheckInButton from '../components/CheckInButton'
import StreakCalendar from '../components/StreakCalendar'
import BadgeDisplay from '../components/BadgeDisplay'
import { useAuth } from '../hooks/useAuth'
import { useDatabase } from '../hooks/useDatabase'
import ReportPopup from '../components/ReportPopup'
import ChatToggle from '../components/ChatToggle'
import { GOAL_LABELS } from '../types/goals'
import { COLLATERAL_LABELS, COLLATERAL_EMOJIS } from '../types/collaterals'
import { colors } from '../styles/colors'
import { shared } from '../styles/shared'
import { toLocalDateStr } from '../utils/localDateUtil'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    getActivePartnership,
    recordCheckIn,
    getCurrentStreak,
    getCheckInHistory,
    checkMissedCheckIns,
    getUserGoalAndCollateral,
    getPendingCollateral,
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
  const [goalLabel, setGoalLabel] = useState('')
  const [partnerCollateral, setPartnerCollateral] = useState(null)
  const [userOwesCollateral, setUserOwesCollateral] = useState(false)
  const [partnerOwesCollateral, setPartnerOwesCollateral] = useState(false)

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  })

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return
      try {
        setLoading(true)
        const activePartnership = await getActivePartnership(user.id)
        if (activePartnership) {
          setPartnership(activePartnership)
          setGoalLabel(GOAL_LABELS[activePartnership.goal_type] || 'Gym')

          const partnerUser = activePartnership.user1_id === user.id
            ? activePartnership.user2
            : activePartnership.user1
          setPartner(partnerUser)

          const currentStreak = await getCurrentStreak(activePartnership.id, user.id)
          setStreak(currentStreak)

          const history = await getCheckInHistory(activePartnership.id, user.id)
          setCheckInHistory(history)

          const todayStr = toLocalDateStr()
          const todayCheckIn = history.find(h => h.date === todayStr)
          setCheckedIn(!!todayCheckIn)

          await checkMissedCheckIns(activePartnership.id, user.id)

          const goalData = await getUserGoalAndCollateral(user.id)
          const collateralType = goalData?.collateral_type || 'money'
          setCollateral({
            emoji: COLLATERAL_EMOJIS[collateralType] || COLLATERAL_EMOJIS.money,
            label: COLLATERAL_LABELS[collateralType] || COLLATERAL_LABELS.money,
          })

          const partnerGoalData = await getUserGoalAndCollateral(partnerUser.id)
          const partnerCollateralType = partnerGoalData?.collateral_type || 'money'
          setPartnerCollateral({
            emoji: COLLATERAL_EMOJIS[partnerCollateralType] || COLLATERAL_EMOJIS.money,
            label: COLLATERAL_LABELS[partnerCollateralType] || COLLATERAL_LABELS.money,
          })

          const userPendingCollateral = await getPendingCollateral(activePartnership.id, user.id)
          const partnerPendingCollateral = await getPendingCollateral(activePartnership.id, partnerUser.id)
          setUserOwesCollateral(userPendingCollateral)
          setPartnerOwesCollateral(partnerPendingCollateral)
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
      await recordCheckIn(partnership.id, user.id)
      setCheckedIn(true)
      setStreak(prev => prev + 1)

      const updatedHistory = await getCheckInHistory(partnership.id, user.id)
      setCheckInHistory(updatedHistory)
    } catch (error) {
      console.error('Error checking in:', error)
      setError(error.message || 'Failed to check in. Please try again.')
    }
  }

  if (loading) {
    return (
      <div style={shared.screen}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>loading your journal...</p>
        </div>
      </div>
    )
  }

  if (error && !partnership) {
    return (
      <div style={shared.screen}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <h2 style={styles.errorTitle}>No Active Partnership</h2>
          <p style={styles.errorMsg}>{error}</p>
          <button style={styles.errorButton} onClick={() => navigate('/matching')}>
            → find a partner
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={shared.screen}>
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

        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <span style={styles.sectionBullet}>•</span>
            <span style={styles.sectionTitle}>accountability partner</span>
            <div style={styles.sectionLine} />
          </div>

          <div style={styles.partnerBlock}>
            <div style={styles.partnerInfo}>
              <div style={styles.partnerName}>{partner?.full_name || 'Accountability Partner'}</div>
              <div style={styles.partnerMeta}>
                {partner?.year || 'Unknown'} · {partner?.major || 'Unknown'} · {partner?.school || 'Unknown'}
              </div>
              <div style={styles.partnerStatus}>
                {checkedIn
                  ? <span style={styles.statusDone}>✓ you checked in</span>
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

        {!checkedIn && (
          <div style={styles.windowNote}>
            <span style={styles.windowText}>check-in window: coordinate a time with your partner</span>
          </div>
        )}

        {userOwesCollateral && (
          <section style={styles.section}>
            <div style={styles.sectionHead}>
              <span style={styles.sectionBullet}>•</span>
              <span style={styles.sectionTitle}>you owe collateral</span>
              <div style={styles.sectionLine} />
            </div>
            <div style={styles.collateralAlert}>
              <div style={styles.collateralAlertTitle}>you missed a check-in</div>
              <div style={styles.collateralAlertBody}>
                you owe your partner: <strong>{collateral ? `${collateral.emoji} ${collateral.label}` : 'collateral'}</strong>
              </div>
            </div>
          </section>
        )}

        {partnerOwesCollateral && (
          <section style={styles.section}>
            <div style={styles.sectionHead}>
              <span style={styles.sectionBullet}>•</span>
              <span style={styles.sectionTitle}>your partner owes collateral</span>
              <div style={styles.sectionLine} />
            </div>
            <div style={styles.collateralNotice}>
              <div style={styles.collateralNoticeTitle}>{partner?.full_name?.split(' ')[0] || 'your partner'} missed a check-in</div>
              <div style={styles.collateralNoticeBody}>
                they owe you: <strong>{partnerCollateral ? `${partnerCollateral.emoji} ${partnerCollateral.label}` : 'collateral'}</strong>
              </div>
            </div>
          </section>
        )}

        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <span style={styles.sectionBullet}>•</span>
            <span style={styles.sectionTitle}>daily check-in</span>
            <div style={styles.sectionLine} />
          </div>
          <div style={styles.checkInWrap}>
            <CheckInButton onCheckIn={handleCheckIn} alreadyCheckedIn={checkedIn} />
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <span style={styles.sectionBullet}>•</span>
            <span style={styles.sectionTitle}>calendar</span>
            <div style={styles.sectionLine} />
          </div>
          <StreakCalendar checkIns={checkInHistory.map(h => h.date)} />
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <span style={styles.sectionBullet}>•</span>
            <span style={styles.sectionTitle}>achievements</span>
            <div style={styles.sectionLine} />
          </div>
          <BadgeDisplay streak={streak} />
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <span style={styles.sectionBullet}>•</span>
            <span style={styles.sectionTitle}>your collateral</span>
            <div style={styles.sectionLine} />
          </div>
          <div style={styles.stakeRow}>
            <span style={styles.stakeText}>
              {collateral ? `${collateral.emoji} ${collateral.label} if you miss a check-in` : 'Collateral set if you miss a check-in'}
            </span>
          </div>
        </section>

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

      {partnership && partner && (
        <ChatToggle
          partnership={partnership}
          currentUser={user}
          partner={partner}
        />
      )}
    </div>
  )
}

const styles = {
  header: {
    padding: '18px 52px 16px',
    borderBottom: `2px solid ${colors.text}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    background: colors.bg,
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
    color: colors.text,
  },
  dateStamp: {
    fontSize: 15,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  headerRight: {},
  goalBadge: {
    border: `1.5px solid ${colors.primary}`,
    color: colors.primary,
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
  sectionBullet: {
    color: colors.primary,
    fontSize: 20,
    flexShrink: 0,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontStyle: 'italic',
    flexShrink: 0,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    background: colors.border,
  },
  partnerBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '18px 20px',
    background: colors.cardBg,
    border: `1px solid ${colors.border}`,
    borderLeft: `3px solid ${colors.primary}`,
  },
  partnerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  partnerName: {
    fontSize: 26,
    fontWeight: 700,
    color: colors.text,
  },
  partnerMeta: {
    fontSize: 16,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  partnerStatus: {
    fontSize: 17,
    marginTop: 4,
  },
  statusDone: {
    color: colors.success,
    fontWeight: 600,
  },
  statusWaiting: {
    color: colors.warning,
    fontStyle: 'italic',
  },
  streakBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderLeft: `1px solid ${colors.border}`,
    paddingLeft: 20,
    marginLeft: 20,
  },
  streakNum: {
    fontSize: 42,
    fontWeight: 700,
    color: colors.primary,
    lineHeight: 1,
  },
  streakLabel: {
    fontSize: 14,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  windowNote: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: '12px 16px',
    background: colors.warningBg,
    borderLeft: `3px solid ${colors.warning}`,
    marginBottom: 28,
    fontSize: 17,
    color: colors.textBodyDark,
    fontStyle: 'italic',
  },
  windowText: {
    lineHeight: 1.4,
  },
  checkInWrap: {
    display: 'flex',
    justifyContent: 'center',
  },
  stakeRow: {
    padding: '12px 16px',
    background: colors.cardBg,
    border: `1px solid ${colors.border}`,
  },
  stakeText: {
    fontSize: 19,
    color: colors.textBodyDark,
    fontStyle: 'italic',
  },
  collateralAlert: {
    padding: '16px 20px',
    background: '#fdf3f4',
    border: `1px solid ${colors.border}`,
    borderLeft: `3px solid ${colors.primary}`,
  },
  collateralAlertTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: colors.primary,
    marginBottom: 4,
  },
  collateralAlertBody: {
    fontSize: 16,
    color: colors.textBodyDark,
    fontStyle: 'italic',
  },
  collateralNotice: {
    padding: '16px 20px',
    background: colors.warningBg,
    border: `1px solid ${colors.border}`,
    borderLeft: `3px solid ${colors.warning}`,
  },
  collateralNoticeTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: colors.warning,
    marginBottom: 4,
  },
  collateralNoticeBody: {
    fontSize: 16,
    color: colors.textBodyDark,
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
    color: colors.textMuted,
    fontSize: 17,
    fontStyle: 'italic',
    cursor: 'pointer',
    padding: 0,
    fontFamily: 'Caveat, cursive',
    textDecoration: 'underline',
    textDecorationColor: colors.borderSubtle,
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
    border: `3px solid ${colors.border}`,
    borderTop: `3px solid ${colors.primary}`,
    borderRadius: '50%',
    animation: 'spin 0.9s linear infinite',
    marginBottom: 20,
  },
  loadingText: {
    color: colors.textBody,
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
    color: colors.primary,
    marginBottom: 12,
  },
  errorMsg: {
    fontSize: 18,
    color: colors.textBody,
    fontStyle: 'italic',
    marginBottom: 24,
    maxWidth: 400,
  },
  errorButton: {
    padding: '10px 28px',
    border: `2px solid ${colors.text}`,
    background: colors.text,
    color: colors.bg,
    fontSize: 20,
    fontWeight: 700,
    borderRadius: 2,
    cursor: 'pointer',
  },
}
