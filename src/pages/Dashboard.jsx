import { useState } from 'react'
import CheckInButton from '../components/CheckInButton'
import StreakCalendar from '../components/StreakCalendar'
import BadgeDisplay from '../components/BadgeDisplay'

const GOAL_LABELS = {
  gym: { label: 'Gym', emoji: '💪' },
  internships: { label: 'Internships', emoji: '💼' },
  coding: { label: 'Coding', emoji: '💻' },
  studying: { label: 'Studying', emoji: '📚' },
  wakeup: { label: 'Waking Up Early', emoji: '🌅' },
}

export default function Dashboard() {
  const [checkedIn, setCheckedIn] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [streak, setStreak] = useState(5)
  const goal = localStorage.getItem('rul_goal') || 'gym'
  const goalInfo = GOAL_LABELS[goal] || GOAL_LABELS.gym

  function handleCheckIn() {
    setCheckedIn(true)
    setStreak(s => s + 1)
  }

  return (
    <div style={styles.screen}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.appName}>RUrllyLocked?</span>
          <span style={styles.goalChip}>{goalInfo.emoji} {goalInfo.label}</span>
        </div>
        <div style={styles.avatarWrap}>
          <div style={styles.avatar}>🙋</div>
        </div>
      </div>

      {/* Partner Card */}
      <div style={styles.partnerCard}>
        <div style={styles.partnerLeft}>
          <div style={styles.partnerAvatar}>😎</div>
          <div>
            <p style={styles.partnerLabel}>Your Partner</p>
            <p style={styles.partnerName}>Alex M.</p>
            <p style={styles.partnerStatus}>
              {checkedIn
                ? <span style={styles.statusGreen}>✓ Both checked in today!</span>
                : <span style={styles.statusOrange}>⏳ Waiting on today's check-in</span>
              }
            </p>
          </div>
        </div>
        <div style={styles.partnerStreak}>
          <span style={styles.streakNum}>{streak}</span>
          <span style={styles.streakLabel}>day streak</span>
        </div>
      </div>

      {/* Check-in Window */}
      <div style={styles.windowBanner}>
        <span style={styles.windowIcon}>⏰</span>
        <span style={styles.windowText}>Check-in window: <strong>7:30 – 8:00 AM</strong></span>
      </div>

      {/* Big Check-In Button */}
      <div style={styles.section}>
        <CheckInButton onCheckIn={handleCheckIn} alreadyCheckedIn={checkedIn} />
      </div>

      {/* Streak Calendar */}
      <div style={styles.card}>
        <StreakCalendar />
      </div>

      {/* Badges */}
      <div style={styles.card}>
        <BadgeDisplay streak={streak} />
      </div>

      {/* Collateral info */}
      <div style={styles.collateralCard}>
        <span style={styles.collateralIcon}>💵</span>
        <div>
          <p style={styles.collateralTitle}>Your collateral: $20 to partner</p>
          <p style={styles.collateralSub}>Owed if you miss a check-in</p>
        </div>
      </div>

      {/* Report Button */}
      <div style={styles.reportWrap}>
        <button style={styles.reportBtn} onClick={() => setShowReport(true)}>
          🚩 Report Partner
        </button>
      </div>

      <div style={{ height: 40 }} />

      {/* Report Modal */}
      {showReport && (
        <div style={styles.overlay} onClick={() => setShowReport(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Report Partner</h3>
            <p style={styles.modalText}>
              If your partner has made you uncomfortable in any way, you can report them here.
              Your partnership will be reviewed and may be dissolved.
            </p>
            <div style={styles.modalBtns}>
              <button style={styles.modalCancel} onClick={() => setShowReport(false)}>Cancel</button>
              <button
                style={styles.modalConfirm}
                onClick={() => { setShowReport(false); alert('Report submitted. Thank you.') }}
              >
                Submit Report
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
    background: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    background: '#fff',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #f0f0f0',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  appName: {
    fontSize: 20,
    fontWeight: 800,
    color: '#CC0033',
    letterSpacing: '-0.3px',
  },
  goalChip: {
    fontSize: 12,
    fontWeight: 600,
    color: '#888',
  },
  avatarWrap: {},
  avatar: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #CC0033, #ff6b6b)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
  },
  partnerCard: {
    margin: '16px 16px 0',
    background: '#fff',
    borderRadius: 18,
    padding: '16px 18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  partnerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  partnerAvatar: {
    width: 52,
    height: 52,
    borderRadius: '50%',
    background: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    border: '2.5px solid #CC0033',
  },
  partnerLabel: {
    fontSize: 11,
    color: '#aaa',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  partnerName: {
    fontSize: 17,
    fontWeight: 800,
    color: '#1a1a1a',
  },
  partnerStatus: {
    fontSize: 12,
    marginTop: 2,
  },
  statusGreen: {
    color: '#22c55e',
    fontWeight: 600,
  },
  statusOrange: {
    color: '#f59e0b',
    fontWeight: 600,
  },
  partnerStreak: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#fff5f7',
    borderRadius: 12,
    padding: '10px 14px',
  },
  streakNum: {
    fontSize: 28,
    fontWeight: 800,
    color: '#CC0033',
    lineHeight: 1,
  },
  streakLabel: {
    fontSize: 11,
    color: '#CC0033',
    fontWeight: 600,
    opacity: 0.7,
  },
  windowBanner: {
    margin: '12px 16px 0',
    background: '#fff8e6',
    border: '1.5px solid #FFD770',
    borderRadius: 12,
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: '#7a5c00',
  },
  windowIcon: { fontSize: 16 },
  windowText: { flex: 1 },
  section: {
    padding: '8px 16px 4px',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    margin: '12px 16px 0',
    background: '#fff',
    borderRadius: 18,
    padding: '18px 18px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  collateralCard: {
    margin: '12px 16px 0',
    background: '#fff',
    borderRadius: 14,
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    border: '1.5px solid #f0f0f0',
  },
  collateralIcon: { fontSize: 28 },
  collateralTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#1a1a1a',
  },
  collateralSub: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  reportWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 20,
  },
  reportBtn: {
    padding: '10px 24px',
    borderRadius: 24,
    background: 'transparent',
    border: '1.5px solid #ffccd5',
    color: '#CC0033',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 100,
  },
  modal: {
    width: '100%',
    maxWidth: 430,
    background: '#fff',
    borderRadius: '24px 24px 0 0',
    padding: '28px 24px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: '#1a1a1a',
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 1.6,
  },
  modalBtns: {
    display: 'flex',
    gap: 12,
    marginTop: 4,
  },
  modalCancel: {
    flex: 1,
    padding: '14px',
    borderRadius: 12,
    background: '#f5f5f5',
    border: 'none',
    fontSize: 15,
    fontWeight: 700,
    color: '#555',
    cursor: 'pointer',
  },
  modalConfirm: {
    flex: 1,
    padding: '14px',
    borderRadius: 12,
    background: '#CC0033',
    border: 'none',
    fontSize: 15,
    fontWeight: 700,
    color: '#fff',
    cursor: 'pointer',
  },
}
