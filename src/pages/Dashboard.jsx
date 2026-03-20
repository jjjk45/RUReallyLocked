import { useState } from 'react'
import CheckInButton from '../components/CheckInButton'
import StreakCalendar from '../components/StreakCalendar'
import BadgeDisplay from '../components/BadgeDisplay'

const GOAL_LABELS = {
  gym: 'Gym',
  internships: 'Internships',
  coding: 'Coding',
  studying: 'Studying',
  wakeup: 'Waking Up Early',
}

export default function Dashboard() {
  const [checkedIn, setCheckedIn] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [streak, setStreak] = useState(5)
  const goal = localStorage.getItem('rul_goal') || 'gym'
  const goalLabel = GOAL_LABELS[goal] || 'Gym'

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  })

  function handleCheckIn() {
    setCheckedIn(true)
    setStreak(s => s + 1)
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
              <div style={styles.partnerName}>Alex M.</div>
              <div style={styles.partnerMeta}>Junior · Computer Science</div>
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
          <span style={styles.windowText}>check-in window: <strong>7:30 – 8:00 AM</strong></span>
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

        {/* Habit Tracker */}
        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <span style={styles.bullet}>•</span>
            <span style={styles.sectionTitle}>habit tracker</span>
            <div style={styles.sectionLine} />
          </div>
          <StreakCalendar />
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
            <span style={styles.stakeText}>$20 to partner if you miss a check-in</span>
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

      {/* Report Modal */}
      {showReport && (
        <div style={styles.overlay} onClick={() => setShowReport(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalLabel}>report</div>
            <h3 style={styles.modalTitle}>Report Partner</h3>
            <div style={styles.modalAccent} />
            <p style={styles.modalText}>
              if your partner has made you uncomfortable in any way, you can report them here.
              your partnership will be reviewed and may be dissolved.
            </p>
            <div style={styles.modalBtns}>
              <button style={styles.modalCancel} onClick={() => setShowReport(false)}>cancel</button>
              <button
                style={styles.modalConfirm}
                onClick={() => { setShowReport(false); alert('Report submitted. Thank you.') }}
              >
                → submit report
              </button>
            </div>
          </div>
        </div>
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
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(45,36,22,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 440,
    background: '#faf7f2',
    border: '1px solid #e0d8cc',
    padding: '32px 36px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    boxShadow: '4px 4px 24px rgba(0,0,0,0.15)',
  },
  modalLabel: {
    fontSize: 11,
    color: '#9b8c7e',
    letterSpacing: '2.5px',
    fontFamily: '-apple-system, sans-serif',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: '#2d2416',
  },
  modalAccent: {
    width: 36,
    height: 3,
    background: '#8b1a2e',
  },
  modalText: {
    fontSize: 18,
    color: '#6b5d4e',
    lineHeight: 1.6,
    fontStyle: 'italic',
  },
  modalBtns: {
    display: 'flex',
    gap: 12,
    marginTop: 4,
  },
  modalCancel: {
    flex: 1,
    padding: '10px',
    border: '1.5px solid #c8bfb0',
    background: 'transparent',
    fontSize: 19,
    fontWeight: 600,
    color: '#6b5d4e',
    cursor: 'pointer',
    fontFamily: 'Caveat, cursive',
    borderRadius: 2,
  },
  modalConfirm: {
    flex: 1,
    padding: '10px',
    border: '2px solid #8b1a2e',
    background: '#8b1a2e',
    fontSize: 19,
    fontWeight: 700,
    color: '#faf7f2',
    cursor: 'pointer',
    fontFamily: 'Caveat, cursive',
    borderRadius: 2,
  },
}
