import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDatabase } from '../hooks/useDatabase'

const GOAL_LABELS = {
  gym: { label: 'Gym' },
  internships: { label: 'Internships' },
  coding: { label: 'Coding' },
  studying: { label: 'Studying' },
  wakeup: { label: 'Waking Up Early' },
  calling: { label: 'Calling Parents' }
}

// const FAKE_PROFILES = [
//   {
//     name: 'Alex M.',
//     year: 'Junior',
//     major: 'Computer Science',
//     collateral: '$20 to partner',
//     bio: 'Trying to stay consistent at the gym this semester. Looking for someone serious!',
//   },
//   {
//     name: 'Jordan T.',
//     year: 'Sophomore',
//     major: 'Business',
//     collateral: 'Owe them a meal',
//     bio: 'Applying to 3 internships a week. Need a partner to keep me honest.',
//   },
//   {
//     name: 'Sam R.',
//     year: 'Senior',
//     major: 'Biology',
//     collateral: 'Run a mile',
//     bio: 'Early morning check-ins only. Serious about consistency.',
//   },
// ]

// ========== ADDED HERE: Collateral label mapping ==========
const COLLATERAL_LABELS = {
  money: '$20 to partner',
  meal: 'Owe them a meal',
  mile: 'Run a mile',
  bathroom: 'Clean their bathroom/kitchen',
  dishes: 'Do their dishes'
}

export default function Matching() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { findPotentialPartners, createPartnership } = useDatabase()

  const [phase, setPhase] = useState('loading')
  const [cardIndex, setCardIndex] = useState(0)
  const [slideDir, setSlideDir] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const goal = localStorage.getItem('rul_goal') || 'gym' //SHOULD NOT BE LOCAL STORAGE ADD A HOOK INTO THE DB FOR THIS
  const goalInfo = GOAL_LABELS[goal] || GOAL_LABELS.gym

  useEffect(() => {
    async function loadPartners() {
      if (!user) return

      try {
        setLoading(true)
        const partners = await findPotentialPartners(user.id, goal)

        //array
        const formattedProfiles = partners.map(p => ({
          name: p.profiles?.full_name || 'Anonymous',
          year: p.profiles?.year || 'Unknown',
          school: p.profiles?.school || 'School of Arts and Sciences',
          major: p.profiles?.major || 'Undeclared',
          collateral: COLLATERAL_LABELS[p.collateral_type] || 'Unknown',
          bio: p.profiles?.bio || `Working on ${goalInfo.label} and looking for accountability!`,
          userId: p.user_id,
          collateralType: p.collateral_type
        }))
        setProfiles(formattedProfiles)

        if (formattedProfiles.length === 0) {
          setPhase('noMatches')
        } else {
          setPhase('swiping')
        }
      } catch (error) {
        console.error('Error loading partners:', error)
        setError('Could not find partners. Please try again later.')
        setPhase('error')
      } finally {
        setLoading(false)
      }
    }

    // ========== ADDED HERE: Short delay to show loading animation ==========
    const timer = setTimeout(() => {
      loadPartners()
    }, 800)

    return () => clearTimeout(timer)
  }, [user, goal])

  async function handleAccept() {
    if (!profiles[cardIndex]) return
    try {
      await createPartnership(user.id, profiles[cardIndex].userId, goal)
      setPhase('matched')
    } catch (err) {
      console.error('Error creating partnership:', err)
      setError('Could not create partnership. Please try again.')
    }
  }

  function handlePrev() {
    if (isAnimating || cardIndex === 0) return
    setIsAnimating(true)
    setSlideDir('right')
    setTimeout(() => {
      setCardIndex(i => i - 1)
      setSlideDir(null)
      setIsAnimating(false)
    }, 300)
  }

  function handleNext() {
    if (isAnimating || cardIndex === profiles.length - 1) return
    setIsAnimating(true)
    setSlideDir('left')
    setTimeout(() => {
      setCardIndex(i => i + 1)
      setSlideDir(null)
      setIsAnimating(false)
    }, 300)
  }

  const profile = profiles[cardIndex]

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.loadingInner}>
          <div style={styles.spinner} />
          <p style={styles.loadingLabel}>searching for your match</p>
          <p style={styles.loadingGoal}>goal: <em>{goalInfo.label}</em></p>
          <div style={styles.dots}>
            <Dot delay={0} />
            <Dot delay={0.25} />
            <Dot delay={0.5} />
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'noMatches') {
    return (
      <div style={styles.matchedScreen}>
        <div style={styles.matchedInner}>
          <div style={styles.matchedLabel}>new entry</div>
          <h1 style={styles.matchedTitle}>No Matches Yet</h1>
          <div style={styles.matchedAccent} />
          <p style={styles.matchedSub}>
            There's currently no one else working on <strong>{goalInfo.label}</strong>. Check back later!
          </p>
          <button style={styles.startBtn} onClick={() => navigate('/dashboard')}>
            → back to dashboard
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'error') {
    return (
      <div style={styles.matchedScreen}>
        <div style={styles.matchedInner}>
          <div style={styles.matchedLabel}>error</div>
          <h1 style={styles.matchedTitle}>Something Went Wrong</h1>
          <div style={styles.matchedAccent} />
          <p style={styles.matchedSub}>{error}</p>
          <button style={styles.startBtn} onClick={() => window.location.reload()}>
            → try again
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'matched') {
    return (
      <div style={styles.matchedScreen}>
        <div style={styles.matchedInner}>
          <div style={styles.matchedLabel}>new entry</div>
          <h1 style={styles.matchedTitle}>It's a Match!</h1>
          <div style={styles.matchedAccent} />
          <p style={styles.matchedSub}>
            you and <strong>{profile?.name}</strong> are now accountability partners.
          </p>

          <div style={styles.avatarsRow}>
            <div style={styles.avatarBox}>you</div>
            <span style={styles.heartSym}>♥</span>
            <div style={styles.avatarBox}>{profile?.name?.split(' ')[0]}</div>
          </div>

          <div style={styles.matchDetails}>
            <div style={styles.matchRow}>
              <span style={styles.matchKey}>● shared goal</span>
              <span style={styles.matchVal}>{goalInfo.label}</span>
            </div>
            <div style={styles.matchRowDivider} />
            <div style={styles.matchRow}>
              <span style={styles.matchKey}>● collateral</span>
              <span style={styles.matchVal}>{profile?.collateral}</span>
            </div>
          </div>

          <div style={styles.matchNote}>
            <span style={styles.noteExclaim}>!</span>
            <span style={styles.noteText}>
              you have <strong>1 hour</strong> to agree on a daily check-in window, or you'll be unmatched.
            </span>
          </div>

          <button style={styles.startBtn} onClick={() => navigate('/dashboard')}>
            → let's go
          </button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div style={styles.matchedScreen}>
        <div style={styles.matchedInner}>
          <div style={styles.matchedLabel}>new entry</div>
          <h1 style={styles.matchedTitle}>No More Profiles</h1>
          <div style={styles.matchedAccent} />
          <p style={styles.matchedSub}>
            You've viewed all available partners. Check back later!
          </p>
          <button style={styles.startBtn} onClick={() => navigate('/dashboard')}>
            → back to dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.screen}>
      <div style={styles.topBar}>
        <h2 style={styles.topTitle}>Find Your Partner</h2>
        <span style={styles.goalTag}>goal: {goalInfo.label}</span>
      </div>

      <p style={styles.hint}>• browse profiles and accept an accountability partner</p>

      <div style={styles.cardArea}>
        <button
          style={{ ...styles.arrowBtn, opacity: cardIndex === 0 ? 0.25 : 1 }}
          onClick={handlePrev}
          disabled={cardIndex === 0}
        >
          ‹
        </button>

        <div style={{ flex: 1, maxWidth: 480, overflow: 'hidden' }}>
          <div
            style={{
              ...styles.profileCard,
              animation: slideDir ? `slide-${slideDir} 0.3s ease` : 'none',
            }}
          >
            <div style={styles.cardHeaderRow}>
              <div>
                <div style={styles.cardName}>{profile.name}</div>
                <div style={styles.cardMeta}>{profile.year} · {profile.major} · {profile.school}</div>
              </div>
            </div>

            <div style={styles.cardDivider} />

            <p style={styles.cardBio}>"{profile.bio}"</p>

            <div style={styles.cardDivider} />

            <div style={styles.cardDetails}>
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>○ goal</span>
                <span style={styles.detailVal}>{goalInfo.label}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailKey}>○ collateral</span>
                <span style={styles.detailVal}>{profile.collateral}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          style={{ ...styles.arrowBtn, opacity: cardIndex === profiles.length - 1 ? 0.25 : 1 }}
          onClick={handleNext}
          disabled={cardIndex === profiles.length - 1}
        >
          ›
        </button>
      </div>

      <div style={styles.actionRow}>
        <span style={styles.counterText}>{cardIndex + 1} / {profiles.length}</span>
        <button style={styles.acceptBtn} onClick={handleAccept}>
          <span style={styles.actionGlyph}>✓</span>
          <span style={styles.actionLabel}>accept</span>
        </button>
      </div>

      <p style={styles.disclaimer}>
        you can <span style={styles.reportLink}>report a partner</span> at any time.
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
        background: '#8b1a2e',
        animation: `pulse 1s ${delay}s infinite`,
      }}
    />
  )
}

const keyframes = `
@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes slide-left {
  0% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(-40px); opacity: 0; }
}

@keyframes slide-right {
  0% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(40px); opacity: 0; }
}
`

// Add style tag for animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = keyframes
  document.head.appendChild(style)
}

const styles = {
  loadingScreen: {
    minHeight: '100vh',
    background: '#faf7f2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 6,
  },
  loadingInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    padding: 40,
  },
  spinner: {
    width: 48,
    height: 48,
    border: '3px solid #e0d8cc',
    borderTop: '3px solid #8b1a2e',
    borderRadius: '50%',
    animation: 'spin 0.9s linear infinite',
  },
  loadingLabel: {
    color: '#2d2416',
    fontSize: 26,
    fontStyle: 'italic',
  },
  loadingGoal: {
    color: '#6b5d4e',
    fontSize: 20,
  },
  dots: {
    display: 'flex',
    gap: 8,
    marginTop: 4,
  },
  matchedScreen: {
    minHeight: '100vh',
    background: '#faf7f2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 52px',
    paddingLeft: 58,
  },
  matchedInner: {
    width: '100%',
    maxWidth: 500,
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  matchedLabel: {
    fontSize: 11,
    color: '#9b8c7e',
    letterSpacing: '2.5px',
    fontFamily: '-apple-system, sans-serif',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  matchedTitle: {
    color: '#2d2416',
    fontSize: 48,
    fontWeight: 700,
    lineHeight: 1.05,
  },
  matchedAccent: {
    width: 48,
    height: 3,
    background: '#8b1a2e',
  },
  matchedSub: {
    color: '#6b5d4e',
    fontSize: 20,
    fontStyle: 'italic',
    lineHeight: 1.5,
  },
  avatarsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    margin: '8px 0',
  },
  avatarBox: {
    padding: '8px 20px',
    border: '2px solid #2d2416',
    color: '#2d2416',
    fontSize: 20,
    fontWeight: 700,
    borderRadius: 2,
  },
  heartSym: {
    color: '#8b1a2e',
    fontSize: 28,
  },
  matchDetails: {
    borderTop: '1px solid #e0d8cc',
    borderBottom: '1px solid #e0d8cc',
    padding: '16px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  matchRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchRowDivider: {
    height: 1,
    background: '#f0ece4',
  },
  matchKey: {
    color: '#8b1a2e',
    fontSize: 18,
    fontStyle: 'italic',
  },
  matchVal: {
    color: '#2d2416',
    fontSize: 18,
    fontWeight: 600,
  },
  matchNote: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '14px 18px',
    background: '#f5ede8',
    borderLeft: '3px solid #8b1a2e',
  },
  noteExclaim: {
    color: '#8b1a2e',
    fontSize: 20,
    fontWeight: 700,
    flexShrink: 0,
  },
  noteText: {
    color: '#4a3f35',
    fontSize: 17,
    fontStyle: 'italic',
    lineHeight: 1.5,
  },
  startBtn: {
    alignSelf: 'flex-start',
    padding: '10px 32px',
    border: '2px solid #2d2416',
    background: '#2d2416',
    color: '#faf7f2',
    fontSize: 22,
    fontWeight: 700,
    borderRadius: 2,
    cursor: 'pointer',
  },
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topTitle: {
    color: '#2d2416',
    fontSize: 28,
    fontWeight: 700,
  },
  goalTag: {
    color: '#8b1a2e',
    fontSize: 18,
    fontStyle: 'italic',
  },
  hint: {
    padding: '12px 52px',
    color: '#9b8c7e',
    fontSize: 17,
    fontStyle: 'italic',
    borderBottom: '1px solid #f0ece4',
  },
  cardArea: {
    flex: 1,
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    overflow: 'hidden',
  },
  arrowBtn: {
    flexShrink: 0,
    width: 48,
    height: 48,
    border: '2px solid #c8bfb0',
    background: '#faf7f2',
    borderRadius: 2,
    fontSize: 32,
    lineHeight: 1,
    cursor: 'pointer',
    color: '#2d2416',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s',
  },
  profileCard: {
    width: '100%',
    maxWidth: 480,
    background: '#fdf9f3',
    border: '1px solid #e0d8cc',
    padding: '28px 32px',
    boxShadow: '2px 3px 12px rgba(0,0,0,0.08)',
    willChange: 'transform',
  },
  cardHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardName: {
    color: '#2d2416',
    fontSize: 30,
    fontWeight: 700,
  },
  cardMeta: {
    color: '#9b8c7e',
    fontSize: 17,
    fontStyle: 'italic',
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    background: '#e0d8cc',
    margin: '14px 0',
  },
  cardBio: {
    color: '#4a3f35',
    fontSize: 19,
    fontStyle: 'italic',
    lineHeight: 1.6,
  },
  cardDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 18,
  },
  detailKey: {
    color: '#9b8c7e',
    fontStyle: 'italic',
  },
  detailVal: {
    color: '#2d2416',
    fontWeight: 600,
  },
  actionRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    padding: '12px 52px 8px',
  },
  counterText: {
    color: '#9b8c7e',
    fontSize: 18,
    fontStyle: 'italic',
    minWidth: 48,
    textAlign: 'center',
  },
  acceptBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    width: 80,
    height: 80,
    border: '2px solid #2d2416',
    background: '#2d2416',
    color: '#faf7f2',
    borderRadius: 2,
    cursor: 'pointer',
  },
  actionGlyph: {
    fontSize: 28,
    lineHeight: 1,
    marginTop: 10,
  },
  actionLabel: {
    fontSize: 14,
    fontStyle: 'italic',
    letterSpacing: '0.3px',
  },
  disclaimer: {
    fontSize: 15,
    color: '#9b8c7e',
    padding: '8px 52px 20px',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  reportLink: {
    color: '#8b1a2e',
    fontWeight: 600,
  },
}