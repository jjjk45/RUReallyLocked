import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const GOAL_LABELS = {
  gym: { label: 'Gym', emoji: '💪' },
  internships: { label: 'Internships', emoji: '💼' },
  coding: { label: 'Coding', emoji: '💻' },
  studying: { label: 'Studying', emoji: '📚' },
  wakeup: { label: 'Waking Up Early', emoji: '🌅' },
}

const FAKE_PROFILES = [
  {
    name: 'Alex M.',
    year: 'Junior',
    major: 'Computer Science',
    avatar: '😎',
    collateral: '$20 to partner',
    streak: 12,
    bio: 'Trying to stay consistent at the gym this semester. Looking for someone serious!',
  },
  {
    name: 'Jordan T.',
    year: 'Sophomore',
    major: 'Business',
    avatar: '🙌',
    collateral: 'Owe them a meal',
    streak: 7,
    bio: 'Applying to 3 internships a week. Need a partner to keep me honest.',
  },
  {
    name: 'Sam R.',
    year: 'Senior',
    major: 'Biology',
    avatar: '🔥',
    collateral: 'Run a mile',
    streak: 21,
    bio: 'Early morning check-ins only. Serious about consistency.',
  },
]

export default function Matching() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('loading') // loading | swiping | matched
  const [cardIndex, setCardIndex] = useState(0)
  const [swipeDir, setSwipeDir] = useState(null)
  const goal = localStorage.getItem('rul_goal') || 'gym'
  const goalInfo = GOAL_LABELS[goal] || GOAL_LABELS.gym

  useEffect(() => {
    const t = setTimeout(() => setPhase('swiping'), 2200)
    return () => clearTimeout(t)
  }, [])

  function handleAccept() {
    setSwipeDir('right')
    setTimeout(() => {
      setPhase('matched')
    }, 400)
  }

  function handlePass() {
    setSwipeDir('left')
    setTimeout(() => {
      setSwipeDir(null)
      setCardIndex(i => Math.min(i + 1, FAKE_PROFILES.length - 1))
    }, 350)
  }

  function handleStart() {
    navigate('/dashboard')
  }

  const profile = FAKE_PROFILES[cardIndex]

  if (phase === 'loading') {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.loadingInner}>
          <div style={styles.spinner} />
          <h2 style={styles.loadingTitle}>Finding your match...</h2>
          <p style={styles.loadingDesc}>
            Searching for someone working on{' '}
            <strong>{goalInfo.emoji} {goalInfo.label}</strong>
          </p>
          <div style={styles.dots}>
            <Dot delay={0} />
            <Dot delay={0.2} />
            <Dot delay={0.4} />
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'matched') {
    return (
      <div style={styles.matchedScreen}>
        <div style={styles.matchedCard}>
          <span style={styles.matchConfetti}>🎉</span>
          <h1 style={styles.matchTitle}>It's a match!</h1>
          <p style={styles.matchSub}>
            You and <strong>{profile.name}</strong> are now accountability partners.
          </p>
          <div style={styles.matchAvatars}>
            <div style={styles.avatarCircle}>🙋</div>
            <span style={styles.heartIcon}>❤️</span>
            <div style={styles.avatarCircle}>{profile.avatar}</div>
          </div>
          <div style={styles.matchInfoBox}>
            <div style={styles.matchInfoRow}>
              <span>🎯 Shared goal</span>
              <span style={styles.matchInfoVal}>{goalInfo.emoji} {goalInfo.label}</span>
            </div>
            <div style={styles.matchInfoRow}>
              <span>💸 Collateral</span>
              <span style={styles.matchInfoVal}>{profile.collateral}</span>
            </div>
          </div>
          <div style={styles.matchNote}>
            <span style={styles.noteIcon}>⚠️</span>
            <span style={styles.noteText}>
              You have <strong>1 hour</strong> to agree on a daily check-in window, or you'll be unmatched.
            </span>
          </div>
          <button style={styles.startBtn} onClick={handleStart}>
            Let's Go! →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.screen}>
      <div style={styles.topBar}>
        <h2 style={styles.topTitle}>Find Your Partner</h2>
        <span style={styles.goalTag}>{goalInfo.emoji} {goalInfo.label}</span>
      </div>

      <p style={styles.hint}>Accept or pass — only you can see them</p>

      <div style={styles.cardArea}>
        <div
          style={{
            ...styles.profileCard,
            transform: swipeDir === 'right'
              ? 'translateX(120%) rotate(15deg)'
              : swipeDir === 'left'
              ? 'translateX(-120%) rotate(-15deg)'
              : 'translateX(0)',
            transition: swipeDir ? 'transform 0.35s ease-in' : 'none',
          }}
        >
          <div style={styles.cardTop}>
            <div style={styles.bigAvatar}>{profile.avatar}</div>
            <div style={styles.cardNameRow}>
              <h3 style={styles.cardName}>{profile.name}</h3>
              <span style={styles.streakBadge}>🔥 {profile.streak} day streak</span>
            </div>
            <p style={styles.cardMeta}>{profile.year} · {profile.major}</p>
          </div>

          <p style={styles.cardBio}>"{profile.bio}"</p>

          <div style={styles.cardDetails}>
            <div style={styles.detailRow}>
              <span style={styles.detailIcon}>🎯</span>
              <span style={styles.detailText}>Goal: <strong>{goalInfo.label}</strong></span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailIcon}>💸</span>
              <span style={styles.detailText}>Collateral: <strong>{profile.collateral}</strong></span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailIcon}>🏫</span>
              <span style={styles.detailText}>Rutgers University</span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.actionRow}>
        <button style={styles.passBtn} onClick={handlePass}>
          <span style={styles.actionIcon}>✕</span>
          <span style={styles.actionLabel}>Pass</span>
        </button>
        <button style={styles.acceptBtn} onClick={handleAccept}>
          <span style={styles.actionIcon}>✓</span>
          <span style={styles.actionLabel}>Accept</span>
        </button>
      </div>

      <p style={styles.disclaimer}>
        You can <span style={styles.reportLink}>report a partner</span> at any time if uncomfortable.
      </p>
    </div>
  )
}

function Dot({ delay }) {
  return (
    <div
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: '#CC0033',
        animation: `pulse 1s ${delay}s infinite`,
        opacity: 0.6,
      }}
    />
  )
}

const styles = {
  loadingScreen: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #CC0033 0%, #8B0022 50%, #1a1a2e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    padding: 32,
  },
  spinner: {
    width: 56,
    height: 56,
    border: '4px solid rgba(255,255,255,0.2)',
    borderTop: '4px solid #fff',
    borderRadius: '50%',
    animation: 'spin 0.9s linear infinite',
  },
  loadingTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 800,
  },
  loadingDesc: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 15,
    textAlign: 'center',
  },
  dots: {
    display: 'flex',
    gap: 8,
    marginTop: 8,
  },
  matchedScreen: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #CC0033 0%, #8B0022 60%, #1a1a2e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  matchedCard: {
    background: '#fff',
    borderRadius: 24,
    padding: '36px 28px',
    width: '100%',
    maxWidth: 370,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  matchConfetti: { fontSize: 44 },
  matchTitle: {
    fontSize: 30,
    fontWeight: 800,
    color: '#1a1a1a',
  },
  matchSub: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 1.5,
  },
  matchAvatars: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '4px 0',
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    border: '3px solid #CC0033',
  },
  heartIcon: { fontSize: 28 },
  matchInfoBox: {
    width: '100%',
    borderRadius: 14,
    background: '#f8f8f8',
    padding: '14px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  matchInfoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 14,
    color: '#666',
  },
  matchInfoVal: {
    fontWeight: 700,
    color: '#1a1a1a',
  },
  matchNote: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: '12px 14px',
    borderRadius: 12,
    background: '#fff8e6',
    border: '1.5px solid #FFD770',
    width: '100%',
  },
  noteIcon: { fontSize: 16, flexShrink: 0 },
  noteText: { fontSize: 13, color: '#7a5c00', lineHeight: 1.5 },
  startBtn: {
    width: '100%',
    padding: '16px',
    borderRadius: 14,
    background: '#CC0033',
    color: '#fff',
    fontSize: 17,
    fontWeight: 700,
    marginTop: 4,
  },
  screen: {
    minHeight: '100vh',
    background: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  topBar: {
    width: '100%',
    padding: '20px 24px 12px',
    background: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #f0f0f0',
  },
  topTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: '#1a1a1a',
  },
  goalTag: {
    fontSize: 13,
    fontWeight: 700,
    color: '#CC0033',
    background: '#fff5f7',
    padding: '6px 12px',
    borderRadius: 20,
    border: '1.5px solid #ffccd5',
  },
  hint: {
    fontSize: 13,
    color: '#aaa',
    marginTop: 12,
    marginBottom: 8,
  },
  cardArea: {
    width: '100%',
    padding: '0 20px',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileCard: {
    width: '100%',
    maxWidth: 380,
    background: '#fff',
    borderRadius: 24,
    padding: '24px 22px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    willChange: 'transform',
  },
  cardTop: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 16,
  },
  bigAvatar: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #CC0033, #ff6b6b)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 40,
    marginBottom: 12,
  },
  cardNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  cardName: {
    fontSize: 22,
    fontWeight: 800,
    color: '#1a1a1a',
  },
  streakBadge: {
    fontSize: 12,
    fontWeight: 700,
    background: '#fff3e0',
    color: '#e65100',
    padding: '4px 10px',
    borderRadius: 20,
  },
  cardMeta: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  cardBio: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 1.6,
    padding: '0 8px',
    marginBottom: 18,
  },
  cardDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    borderTop: '1px solid #f0f0f0',
    paddingTop: 16,
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 14,
    color: '#555',
  },
  detailIcon: { fontSize: 18, width: 24 },
  detailText: { flex: 1 },
  actionRow: {
    display: 'flex',
    gap: 20,
    padding: '20px 0 8px',
  },
  passBtn: {
    width: 70,
    height: 70,
    borderRadius: '50%',
    background: '#fff',
    border: '2px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    cursor: 'pointer',
  },
  acceptBtn: {
    width: 70,
    height: 70,
    borderRadius: '50%',
    background: '#CC0033',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    boxShadow: '0 4px 16px rgba(204,0,51,0.35)',
    cursor: 'pointer',
  },
  actionIcon: {
    fontSize: 22,
    color: 'inherit',
    lineHeight: 1,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  disclaimer: {
    fontSize: 12,
    color: '#bbb',
    padding: '8px 20px 20px',
    textAlign: 'center',
  },
  reportLink: {
    color: '#CC0033',
    fontWeight: 600,
  },
}
