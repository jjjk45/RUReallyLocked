import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const COLLATERAL_LABELS = {
  money: { emoji: '💵', label: '$20 to your partner' },
  meal: { emoji: '🍕', label: 'Owe them a meal' },
  mile: { emoji: '🏃', label: 'Run a mile' },
  bathroom: { emoji: '🧹', label: "Clean their bathroom/kitchen" },
  dishes: { emoji: '🍽️', label: 'Do their dishes' },
}

export default function CollateralOwed() {
  const navigate = useNavigate()
  const [confirmed, setConfirmed] = useState(false)
  const collateralKey = localStorage.getItem('rul_collateral') || 'money'
  const collateral = COLLATERAL_LABELS[collateralKey] || COLLATERAL_LABELS.money

  if (confirmed) {
    return (
      <div style={styles.screen}>
        <div style={styles.confirmedWrap}>
          <span style={styles.bigEmoji}>✅</span>
          <h2 style={styles.confirmedTitle}>Collateral marked!</h2>
          <p style={styles.confirmedSub}>
            Your partner has been notified. Stay consistent — you've got this!
          </p>
          <button style={styles.homeBtn} onClick={() => navigate('/dashboard')}>
            Back to Dashboard →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.screen}>
      {/* Alert bar */}
      <div style={styles.alertBar}>
        <span style={styles.alertIcon}>⚠️</span>
        <span style={styles.alertText}>Missed check-in detected</span>
      </div>

      <div style={styles.content}>
        <div style={styles.topSection}>
          <span style={styles.sadEmoji}>😬</span>
          <h1 style={styles.title}>You missed a check-in</h1>
          <p style={styles.sub}>
            No worries — life happens. But you know what that means...
          </p>
        </div>

        {/* Collateral due */}
        <div style={styles.collateralDue}>
          <p style={styles.dueLabel}>You owe your partner:</p>
          <div style={styles.dueCard}>
            <span style={styles.dueEmoji}>{collateral.emoji}</span>
            <span style={styles.dueText}>{collateral.label}</span>
          </div>
        </div>

        {/* Partner info */}
        <div style={styles.partnerRow}>
          <div style={styles.partnerAvatar}>😎</div>
          <div>
            <p style={styles.partnerName}>Alex M.</p>
            <p style={styles.partnerInfo}>Will confirm once you've paid up</p>
          </div>
        </div>

        {/* Instructions */}
        <div style={styles.infoBox}>
          <p style={styles.infoTitle}>How it works</p>
          <div style={styles.infoStep}>
            <span style={styles.stepNum}>1</span>
            <span style={styles.stepText}>Pay your collateral to your partner</span>
          </div>
          <div style={styles.infoStep}>
            <span style={styles.stepNum}>2</span>
            <span style={styles.stepText}>Tap "Mark as Paid" below</span>
          </div>
          <div style={styles.infoStep}>
            <span style={styles.stepNum}>3</span>
            <span style={styles.stepText}>Your partner confirms receipt</span>
          </div>
          <div style={styles.infoStep}>
            <span style={styles.stepNum}>4</span>
            <span style={styles.stepText}>Back to your streak — don't let it happen again!</span>
          </div>
        </div>

        {/* Warning */}
        <div style={styles.warningBox}>
          <span style={styles.warnIcon}>🚨</span>
          <span style={styles.warnText}>
            Repeated missed check-ins will automatically dissolve your partnership.
            If collateral is not paid, your partner may report you.
          </span>
        </div>
      </div>

      <div style={styles.footer}>
        <button style={styles.paidBtn} onClick={() => setConfirmed(true)}>
          Mark as Paid ✓
        </button>
        <button style={styles.dashBtn} onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </button>
      </div>
    </div>
  )
}

const styles = {
  screen: {
    minHeight: '100vh',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
  alertBar: {
    background: '#CC0033',
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  alertIcon: { fontSize: 18 },
  alertText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: '0.2px',
  },
  content: {
    flex: 1,
    padding: '28px 22px 120px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  topSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: 8,
  },
  sadEmoji: { fontSize: 52 },
  title: {
    fontSize: 26,
    fontWeight: 800,
    color: '#1a1a1a',
  },
  sub: {
    fontSize: 14,
    color: '#888',
    lineHeight: 1.5,
  },
  collateralDue: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
  },
  dueLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  dueCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '18px 28px',
    borderRadius: 18,
    background: 'linear-gradient(135deg, #fff5f7, #ffe0e6)',
    border: '2px solid #ffccd5',
    boxShadow: '0 4px 16px rgba(204,0,51,0.1)',
  },
  dueEmoji: { fontSize: 36 },
  dueText: {
    fontSize: 20,
    fontWeight: 800,
    color: '#CC0033',
  },
  partnerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 18px',
    background: '#f8f8f8',
    borderRadius: 14,
  },
  partnerAvatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: '#e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 26,
    border: '2px solid #CC0033',
  },
  partnerName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#1a1a1a',
  },
  partnerInfo: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  infoBox: {
    borderRadius: 16,
    border: '1.5px solid #e0e0e0',
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  infoStep: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: '#CC0033',
    color: '#fff',
    fontSize: 12,
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 1.5,
    paddingTop: 2,
  },
  warningBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: '14px 16px',
    borderRadius: 12,
    background: '#fff8e6',
    border: '1.5px solid #FFD770',
  },
  warnIcon: { fontSize: 16, flexShrink: 0 },
  warnText: {
    fontSize: 12,
    color: '#7a5c00',
    lineHeight: 1.6,
  },
  footer: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 430,
    padding: '14px 22px 28px',
    background: 'linear-gradient(to top, #fff 80%, transparent)',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  paidBtn: {
    width: '100%',
    padding: '16px',
    borderRadius: 14,
    background: '#CC0033',
    color: '#fff',
    fontSize: 17,
    fontWeight: 700,
  },
  dashBtn: {
    width: '100%',
    padding: '13px',
    borderRadius: 14,
    background: 'transparent',
    border: '1.5px solid #e0e0e0',
    color: '#888',
    fontSize: 15,
    fontWeight: 600,
  },
  confirmedWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 28px',
    gap: 16,
    textAlign: 'center',
  },
  bigEmoji: { fontSize: 72 },
  confirmedTitle: {
    fontSize: 28,
    fontWeight: 800,
    color: '#16a34a',
  },
  confirmedSub: {
    fontSize: 15,
    color: '#888',
    lineHeight: 1.6,
    maxWidth: 300,
  },
  homeBtn: {
    marginTop: 16,
    padding: '16px 36px',
    borderRadius: 14,
    background: '#CC0033',
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
  },
}
