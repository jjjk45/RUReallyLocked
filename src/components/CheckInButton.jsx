import { useState } from 'react'
import confetti from 'canvas-confetti'

export default function CheckInButton({ onCheckIn, alreadyCheckedIn }) {
  const [shaking, setShaking] = useState(false)

  function handlePress() {
    if (alreadyCheckedIn) return

    // confetti burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#CC0033', '#FF6B6B', '#fff', '#FFD700'],
    })
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#CC0033', '#FF6B6B', '#fff'],
      })
    }, 200)
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#CC0033', '#FF6B6B', '#fff'],
      })
    }, 350)

    setShaking(true)
    setTimeout(() => setShaking(false), 600)
    if (onCheckIn) onCheckIn()
  }

  return (
    <div style={styles.wrap}>
      {alreadyCheckedIn ? (
        <div style={styles.doneWrap}>
          <div style={styles.doneCircle}>
            <span style={styles.doneCheck}>✓</span>
          </div>
          <p style={styles.doneLabel}>Checked in today!</p>
          <p style={styles.doneTime}>Your partner has been notified 🎉</p>
        </div>
      ) : (
        <>
          <p style={styles.prompt}>Ready to check in?</p>
          <button
            style={{
              ...styles.bigBtn,
              transform: shaking ? 'scale(0.93)' : 'scale(1)',
              transition: 'transform 0.15s',
            }}
            onClick={handlePress}
          >
            <span style={styles.btnEmoji}>🔒</span>
            <span style={styles.btnText}>CHECK IN</span>
          </button>
          <p style={styles.hint}>Tap within your check-in window</p>
        </>
      )}
    </div>
  )
}

const styles = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px 0',
  },
  prompt: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
    fontWeight: 500,
  },
  bigBtn: {
    width: 160,
    height: 160,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #CC0033 0%, #8B0022 100%)',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    cursor: 'pointer',
    boxShadow: '0 8px 32px rgba(204,0,51,0.45), 0 0 0 8px rgba(204,0,51,0.1)',
    willChange: 'transform',
  },
  btnEmoji: {
    fontSize: 36,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 800,
    letterSpacing: '1.5px',
  },
  hint: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 14,
  },
  doneWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  doneCircle: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 24px rgba(34,197,94,0.4)',
  },
  doneCheck: {
    color: '#fff',
    fontSize: 44,
    fontWeight: 700,
  },
  doneLabel: {
    fontSize: 18,
    fontWeight: 800,
    color: '#16a34a',
  },
  doneTime: {
    fontSize: 13,
    color: '#888',
  },
}
