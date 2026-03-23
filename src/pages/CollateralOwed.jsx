import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COLLATERAL_LABELS } from '../types/collaterals'

export default function CollateralOwed() {
  const navigate = useNavigate()
  const [confirmed, setConfirmed] = useState(false)
  const collateralKey = localStorage.getItem('rul_collateral') || 'money'
  const collateralLabel = COLLATERAL_LABELS[collateralKey] || COLLATERAL_LABELS.money

  if (confirmed) {
    return (
      <div style={styles.screen}>
        <div style={styles.confirmedWrap}>
          <div style={styles.confirmedLabel}>entry logged</div>
          <h2 style={styles.confirmedTitle}>Collateral Marked</h2>
          <div style={styles.confirmedAccent} />
          <p style={styles.confirmedSub}>
            your partner has been notified. stay consistent — you've got this.
          </p>
          <button style={styles.homeBtn} onClick={() => navigate('/dashboard')}>
            → back to journal
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.screen}>
      {/* Alert bar */}
      <div style={styles.alertBar}>
        <span style={styles.alertBullet}>!</span>
        <span style={styles.alertText}>missed check-in detected</span>
      </div>

      <div style={styles.content}>
        <div style={styles.topSection}>
          <div style={styles.headerLabel}>missed entry</div>
          <h1 style={styles.title}>You Missed a Check-In</h1>
          <div style={styles.accentLine} />
          <p style={styles.sub}>no worries — life happens. but you know what that means...</p>
        </div>

        {/* What you owe */}
        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <span style={styles.bullet}>•</span>
            <span style={styles.sectionLabel}>you owe your partner</span>
            <div style={styles.sectionLine} />
          </div>
          <div style={styles.dueCard}>
            <span style={styles.dueText}>{collateralLabel}</span>
          </div>
        </section>

        {/* Partner */}
        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <span style={styles.bullet}>•</span>
            <span style={styles.sectionLabel}>partner</span>
            <div style={styles.sectionLine} />
          </div>
          <div style={styles.partnerRow}>
            <div style={styles.partnerName}>Alex M.</div>
            <div style={styles.partnerInfo}>will confirm once you've paid up</div>
          </div>
        </section>

        {/* Steps */}
        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <span style={styles.bullet}>•</span>
            <span style={styles.sectionLabel}>how it works</span>
            <div style={styles.sectionLine} />
          </div>
          <div style={styles.stepList}>
            {[
              'pay your collateral to your partner',
              'tap "mark as paid" below',
              'your partner confirms receipt',
              "back to your streak — don't let it happen again!",
            ].map((step, i) => (
              <div key={i} style={styles.stepRow}>
                <span style={styles.stepNum}>{i + 1}.</span>
                <span style={styles.stepText}>{step}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Warning */}
        <div style={styles.warnBox}>
          <span style={styles.warnBullet}>!</span>
          <span style={styles.warnText}>
            repeated missed check-ins will automatically dissolve your partnership.
            if collateral is not paid, your partner may report you.
          </span>
        </div>
      </div>

      <div style={styles.footer}>
        <div style={styles.footerLine} />
        <div style={styles.footerInner}>
          <button style={styles.dashBtn} onClick={() => navigate('/dashboard')}>
            dashboard
          </button>
          <button style={styles.paidBtn} onClick={() => setConfirmed(true)}>
            → mark as paid
          </button>
        </div>
      </div>
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
  alertBar: {
    background: '#8b1a2e',
    padding: '14px 52px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  alertBullet: {
    color: '#faf7f2',
    fontSize: 20,
    fontWeight: 700,
    flexShrink: 0,
  },
  alertText: {
    color: '#faf7f2',
    fontSize: 19,
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    padding: '36px 52px 120px',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  topSection: {
    marginBottom: 32,
  },
  headerLabel: {
    fontSize: 11,
    color: '#9b8c7e',
    letterSpacing: '2.5px',
    fontFamily: '-apple-system, sans-serif',
    fontWeight: 600,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    color: '#2d2416',
    fontSize: 40,
    fontWeight: 700,
    lineHeight: 1.1,
    marginBottom: 12,
  },
  accentLine: {
    width: 48,
    height: 3,
    background: '#8b1a2e',
    marginBottom: 10,
  },
  sub: {
    color: '#6b5d4e',
    fontSize: 18,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 28,
  },
  sectionHead: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  bullet: {
    color: '#8b1a2e',
    fontSize: 20,
    flexShrink: 0,
  },
  sectionLabel: {
    color: '#6b5d4e',
    fontSize: 17,
    fontStyle: 'italic',
    flexShrink: 0,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    background: '#e0d8cc',
  },
  dueCard: {
    padding: '18px 24px',
    background: '#f5ede8',
    borderLeft: '4px solid #8b1a2e',
    border: '1px solid #e0d8cc',
    borderLeft: '4px solid #8b1a2e',
  },
  dueText: {
    fontSize: 26,
    fontWeight: 700,
    color: '#8b1a2e',
  },
  partnerRow: {
    padding: '14px 20px',
    background: '#fdf9f3',
    border: '1px solid #e0d8cc',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  partnerName: {
    fontSize: 22,
    fontWeight: 700,
    color: '#2d2416',
  },
  partnerInfo: {
    fontSize: 16,
    color: '#9b8c7e',
    fontStyle: 'italic',
  },
  stepList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  stepRow: {
    display: 'flex',
    gap: 14,
    alignItems: 'flex-start',
    fontSize: 18,
    color: '#4a3f35',
    borderBottom: '1px solid #f0ece4',
    paddingBottom: 12,
  },
  stepNum: {
    color: '#8b1a2e',
    fontWeight: 700,
    flexShrink: 0,
    minWidth: 20,
  },
  stepText: {
    fontStyle: 'italic',
    lineHeight: 1.5,
  },
  warnBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '14px 18px',
    background: '#f5ede8',
    borderLeft: '3px solid #8b1a2e',
    marginTop: 4,
  },
  warnBullet: {
    color: '#8b1a2e',
    fontSize: 20,
    fontWeight: 700,
    flexShrink: 0,
  },
  warnText: {
    color: '#4a3f35',
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 1.6,
  },
  footer: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 720,
    paddingLeft: 6,
    background: '#faf7f2',
  },
  footerLine: {
    height: 1,
    background: '#e0d8cc',
  },
  footerInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 52px 24px',
    gap: 16,
  },
  dashBtn: {
    padding: '10px 24px',
    border: '1.5px solid #c8bfb0',
    background: 'transparent',
    color: '#6b5d4e',
    fontSize: 20,
    fontFamily: 'Caveat, cursive',
    cursor: 'pointer',
    borderRadius: 2,
  },
  paidBtn: {
    padding: '10px 28px',
    border: '2px solid #8b1a2e',
    background: '#8b1a2e',
    color: '#faf7f2',
    fontSize: 20,
    fontWeight: 700,
    fontFamily: 'Caveat, cursive',
    cursor: 'pointer',
    borderRadius: 2,
  },
  confirmedWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '60px 52px',
    gap: 16,
  },
  confirmedLabel: {
    fontSize: 11,
    color: '#9b8c7e',
    letterSpacing: '2.5px',
    fontFamily: '-apple-system, sans-serif',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  confirmedTitle: {
    fontSize: 44,
    fontWeight: 700,
    color: '#4a7c6f',
  },
  confirmedAccent: {
    width: 48,
    height: 3,
    background: '#4a7c6f',
  },
  confirmedSub: {
    fontSize: 20,
    color: '#6b5d4e',
    fontStyle: 'italic',
    lineHeight: 1.6,
    maxWidth: 380,
  },
  homeBtn: {
    alignSelf: 'flex-start',
    marginTop: 8,
    padding: '10px 32px',
    border: '2px solid #2d2416',
    background: '#2d2416',
    color: '#faf7f2',
    fontSize: 22,
    fontWeight: 700,
    fontFamily: 'Caveat, cursive',
    borderRadius: 2,
    cursor: 'pointer',
  },
}
