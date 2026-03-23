import { useState } from 'react'
import confetti from 'canvas-confetti'
import { colors } from '../styles/colors'

export default function CheckInButton({ onCheckIn, alreadyCheckedIn }) {
  const [pressing, setPressing] = useState(false)

  function handlePress() {
    if (alreadyCheckedIn) return

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: [colors.primary, colors.borderSubtle, colors.bg, colors.success],
    })
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 50,
        origin: { x: 0 },
        colors: [colors.primary, colors.borderSubtle],
      })
    }, 200)
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 50,
        origin: { x: 1 },
        colors: [colors.primary, colors.borderSubtle],
      })
    }, 350)

    setPressing(true)
    setTimeout(() => setPressing(false), 500)
    if (onCheckIn) onCheckIn()
  }

  if (alreadyCheckedIn) {
    return (
      <div style={styles.wrap}>
        <div style={styles.doneCircle}>
          <div style={styles.doneInner} />
        </div>
        <p style={styles.doneLabel}>checked in</p>
        <p style={styles.doneNote}>great work — keep the streak going</p>
      </div>
    )
  }

  return (
    <div style={styles.wrap}>
      <p style={styles.prompt}>tap to mark today's check-in</p>
      <button
        style={{
          ...styles.bigCircle,
          transform: pressing ? 'scale(0.92)' : 'scale(1)',
          transition: 'transform 0.15s',
        }}
        onClick={handlePress}
      >
        <div style={styles.circleInner} />
        <span style={styles.circleLabel}>CHECK IN</span>
      </button>
      <p style={styles.hint}>tap within your check-in window</p>
    </div>
  )
}

const styles = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 0',
    gap: 14,
  },
  prompt: {
    fontSize: 17,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  bigCircle: {
    width: 148,
    height: 148,
    borderRadius: '50%',
    border: `3px solid ${colors.text}`,
    background: colors.bg,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    cursor: 'pointer',
    willChange: 'transform',
    position: 'relative',
    boxShadow: `2px 3px 0 ${colors.text}`,
  },
  circleInner: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    border: `2.5px solid ${colors.text}`,
    background: 'transparent',
  },
  circleLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '1.5px',
    fontFamily: '-apple-system, sans-serif',
  },
  hint: {
    fontSize: 14,
    color: colors.borderSubtle,
    fontStyle: 'italic',
  },
  doneCircle: {
    width: 148,
    height: 148,
    borderRadius: '50%',
    border: `3px solid ${colors.success}`,
    background: colors.success,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '2px 3px 0 #2d3d39',
  },
  doneInner: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: colors.bg,
  },
  doneLabel: {
    fontSize: 22,
    fontWeight: 700,
    color: colors.success,
  },
  doneNote: {
    fontSize: 16,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
}
