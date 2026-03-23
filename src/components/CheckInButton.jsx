import { useState } from 'react'
import confetti from 'canvas-confetti'

export default function CheckInButton({ onCheckIn, alreadyCheckedIn }) {
  const [pressing, setPressing] = useState(false)

  function handlePress() {
    if (alreadyCheckedIn) return

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b1a2e', '#c8bfb0', '#faf7f2', '#4a7c6f'],
    })
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 50,
        origin: { x: 0 },
        colors: ['#8b1a2e', '#c8bfb0'],
      })
    }, 200)
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 50,
        origin: { x: 1 },
        colors: ['#8b1a2e', '#c8bfb0'],
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
        <p style={styles.doneNote}>your partner has been notified</p>
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
    color: '#9b8c7e',
    fontStyle: 'italic',
  },
  bigCircle: {
    width: 148,
    height: 148,
    borderRadius: '50%',
    border: '3px solid #2d2416',
    background: '#faf7f2',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    cursor: 'pointer',
    willChange: 'transform',
    position: 'relative',
    boxShadow: '2px 3px 0 #2d2416',
  },
  circleInner: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    border: '2.5px solid #2d2416',
    background: 'transparent',
  },
  circleLabel: {
    color: '#2d2416',
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '1.5px',
    fontFamily: '-apple-system, sans-serif',
  },
  hint: {
    fontSize: 14,
    color: '#c8bfb0',
    fontStyle: 'italic',
  },
  doneCircle: {
    width: 148,
    height: 148,
    borderRadius: '50%',
    border: '3px solid #4a7c6f',
    background: '#4a7c6f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '2px 3px 0 #2d3d39',
  },
  doneInner: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: '#faf7f2',
  },
  doneLabel: {
    fontSize: 22,
    fontWeight: 700,
    color: '#4a7c6f',
  },
  doneNote: {
    fontSize: 16,
    color: '#9b8c7e',
    fontStyle: 'italic',
  },
}