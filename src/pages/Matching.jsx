import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDatabase } from '../hooks/useDatabase'
import { GOAL_LABELS } from '../types/goals'
import { COLLATERAL_LABELS } from '../types/collaterals'
import ReportPopup from '../components/ReportPopup'
import { colors } from '../styles/colors'
import { shared } from '../styles/shared'

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
  const [showReport, setShowReport] = useState(false)

  const goal = localStorage.getItem('rul_goal') || 'gym'
  const goalInfo = GOAL_LABELS[goal] || GOAL_LABELS.gym

  useEffect(() => {
    async function loadPartners() {
      if (!user) return
      try {
        setLoading(true)
        const partners = await findPotentialPartners(user.id, goal)
        const formattedProfiles = partners.map(p => ({
          name: p.profiles?.full_name || 'Anonymous',
          year: p.profiles?.year || 'Unknown',
          school: p.profiles?.school || 'Unknown',
          major: p.profiles?.major || 'Undeclared',
          collateral: COLLATERAL_LABELS[p.collateral_type] || 'Unknown',
          bio: p.profiles?.bio || `Working on ${goalInfo} and looking for accountability!`,
          userId: p.user_id,
          collateralType: p.collateral_type
        }))
        setProfiles(formattedProfiles)
        setPhase(formattedProfiles.length === 0 ? 'noMatches' : 'swiping')
      } catch (error) {
        console.error('Error loading partners:', error)
        setError('Could not find partners. Please try again later.')
        setPhase('error')
      } finally {
        setLoading(false)
      }
    }

    loadPartners()
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
          <p style={styles.loadingLabel}>searching profiles</p>
          <p style={styles.loadingGoal}>goal: <em>{goalInfo}</em></p>
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
      <div style={styles.centeredScreen}>
        <div style={styles.centeredInner}>
          <div style={styles.screenLabel}>new entry</div>
          <h1 style={styles.screenTitle}>No Matches Yet</h1>
          <div style={shared.accentLine} />
          <p style={styles.screenSub}>
            There's currently no one else working on <strong>{goalInfo}</strong>. Check back later!
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
      <div style={styles.centeredScreen}>
        <div style={styles.centeredInner}>
          <div style={styles.screenLabel}>error</div>
          <h1 style={styles.screenTitle}>Something Went Wrong</h1>
          <div style={shared.accentLine} />
          <p style={styles.screenSub}>{error}</p>
          <button style={styles.startBtn} onClick={() => window.location.reload()}>
            → try again
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'matched') {
    return (
      <div style={styles.centeredScreen}>
        <div style={styles.centeredInner}>
          <h1 style={styles.screenTitle}>It's a Match!</h1>
          <div style={shared.accentLine} />
          <p style={styles.screenSub}>
            you and <strong>{profile?.name}</strong> are now accountability partners!
          </p>

          <div style={styles.avatarsRow}>
            <div style={styles.avatarBox}>you</div>
            <div style={styles.vsEmoji}>🤝</div>
            <div style={styles.avatarBox}>{profile?.name?.split(' ')[0]}</div>
          </div>

          <div style={styles.matchDetails}>
            <div style={styles.matchRow}>
              <span style={styles.matchKey}>● shared goal</span>
              <span style={styles.matchVal}>{goalInfo}</span>
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
              coordinate a check-in time with your partner once you're connected.
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
      <div style={styles.centeredScreen}>
        <div style={styles.centeredInner}>
          <div style={styles.screenLabel}>new entry</div>
          <h1 style={styles.screenTitle}>No More Profiles</h1>
          <div style={shared.accentLine} />
          <p style={styles.screenSub}>
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
    <div style={shared.screen}>
      <div style={styles.topBar}>
        <h2 style={styles.topTitle}>Find Your Partner</h2>
        <span style={styles.goalTag}>goal: {goalInfo}</span>
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
                <span style={styles.detailVal}>{goalInfo}</span>
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
        you can{' '}
        <span style={styles.reportLink}>
          {/* onClick={() => setShowReport(true)} -- included this before but I dont't think it fits here */}
          report a partner
        </span>
        {' '}at any time.
      </p>

      <ReportPopup
        show={showReport}
        onClose={() => setShowReport(false)}
        onSubmit={() => {
          setShowReport(false)
          alert('Report submitted. Our team will review it within 24 hours.')
        }}
      />
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
        background: colors.primary,
        animation: `pulse 1s ${delay}s infinite`,
      }}
    />
  )
}

const styles = {
  loadingScreen: {
    minHeight: '100vh',
    background: colors.bg,
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
    border: `3px solid ${colors.border}`,
    borderTop: `3px solid ${colors.primary}`,
    borderRadius: '50%',
    animation: 'spin 0.9s linear infinite',
  },
  loadingLabel: {
    color: colors.text,
    fontSize: 26,
    fontStyle: 'italic',
  },
  loadingGoal: {
    color: colors.textBody,
    fontSize: 20,
  },
  dots: {
    display: 'flex',
    gap: 8,
    marginTop: 4,
  },
  centeredScreen: {
    minHeight: '100vh',
    background: colors.bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 52px',
    paddingLeft: 58,
  },
  centeredInner: {
    width: '100%',
    maxWidth: 500,
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  screenLabel: {
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: '2.5px',
    fontFamily: '-apple-system, sans-serif',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  screenTitle: {
    color: colors.text,
    fontSize: 48,
    fontWeight: 700,
    lineHeight: 1.05,
  },
  screenSub: {
    color: colors.textBody,
    fontSize: 20,
    fontStyle: 'italic',
    lineHeight: 1.5,
  },
  avatarsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    margin: '8px 0',
  },
  avatarBox: {
    padding: '8px 20px',
    border: `2px solid ${colors.text}`,
    color: colors.text,
    fontSize: 20,
    fontWeight: 700,
    borderRadius: 2,
  },
  vsEmoji: {
    fontSize: 52,
    lineHeight: 1,
    userSelect: 'none',
  },
  matchDetails: {
    borderTop: `1px solid ${colors.border}`,
    borderBottom: `1px solid ${colors.border}`,
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
    background: colors.borderLight,
  },
  matchKey: {
    color: colors.primary,
    fontSize: 18,
    fontStyle: 'italic',
  },
  matchVal: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 600,
  },
  matchNote: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '14px 18px',
    background: colors.warningBg,
    borderLeft: `3px solid ${colors.primary}`,
  },
  noteExclaim: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: 700,
    flexShrink: 0,
  },
  noteText: {
    color: colors.textBodyDark,
    fontSize: 17,
    fontStyle: 'italic',
    lineHeight: 1.5,
  },
  startBtn: {
    alignSelf: 'flex-start',
    padding: '10px 32px',
    border: `2px solid ${colors.text}`,
    background: colors.text,
    color: colors.bg,
    fontSize: 22,
    fontWeight: 700,
    borderRadius: 2,
    cursor: 'pointer',
  },
  topBar: {
    padding: '20px 52px 16px',
    borderBottom: `1px solid ${colors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: 700,
  },
  goalTag: {
    color: colors.primary,
    fontSize: 18,
    fontStyle: 'italic',
  },
  hint: {
    padding: '12px 52px',
    color: colors.textMuted,
    fontSize: 17,
    fontStyle: 'italic',
    borderBottom: `1px solid ${colors.borderLight}`,
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
    border: `2px solid ${colors.borderSubtle}`,
    background: colors.bg,
    borderRadius: 2,
    fontSize: 32,
    lineHeight: 1,
    cursor: 'pointer',
    color: colors.text,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s',
  },
  profileCard: {
    width: '100%',
    maxWidth: 480,
    background: colors.cardBg,
    border: `1px solid ${colors.border}`,
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
    color: colors.text,
    fontSize: 30,
    fontWeight: 700,
  },
  cardMeta: {
    color: colors.textMuted,
    fontSize: 17,
    fontStyle: 'italic',
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    background: colors.border,
    margin: '14px 0',
  },
  cardBio: {
    color: colors.textBodyDark,
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
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  detailVal: {
    color: colors.text,
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
    color: colors.textMuted,
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
    border: `2px solid ${colors.text}`,
    background: colors.text,
    color: colors.bg,
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
    color: colors.textMuted,
    padding: '8px 52px 20px',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  reportLink: {
    color: colors.primary,
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'underline',
    textDecorationColor: colors.borderSubtle,
  },
}
