import { colors } from '../styles/colors'

export default function ReportPopup({ show, onClose, onSubmit }) {
  if (!show) return null
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.popup} onClick={e => e.stopPropagation()}>
        <div style={styles.popupLabel}>report</div>
        <h3 style={styles.popupTitle}>Report Partner</h3>
        <div style={styles.popupAccent} />
        <p style={styles.popupText}>
          if your partner has made you uncomfortable in any way, you can report them here.
          your partnership will be reviewed and may be dissolved.
        </p>
        <div style={styles.popupBtns}>
          <button style={styles.popupCancel} onClick={onClose}>cancel</button>
          <button style={styles.popupConfirm} onClick={onSubmit}>→ submit report</button>
        </div>
      </div>
    </div>
  )
}

const styles = {
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
  popup: {
    width: '100%',
    maxWidth: 440,
    background: colors.bg,
    border: `1px solid ${colors.border}`,
    padding: '32px 36px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    boxShadow: '4px 4px 24px rgba(0,0,0,0.15)',
  },
  popupLabel: {
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: '2.5px',
    fontFamily: '-apple-system, sans-serif',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  popupTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: colors.text,
  },
  popupAccent: {
    width: 36,
    height: 3,
    background: colors.primary,
  },
  popupText: {
    fontSize: 18,
    color: colors.textBody,
    lineHeight: 1.6,
    fontStyle: 'italic',
  },
  popupBtns: {
    display: 'flex',
    gap: 12,
    marginTop: 4,
  },
  popupCancel: {
    flex: 1,
    padding: '10px',
    border: `1.5px solid ${colors.borderSubtle}`,
    background: 'transparent',
    fontSize: 19,
    fontWeight: 600,
    color: colors.textBody,
    cursor: 'pointer',
    fontFamily: 'Caveat, cursive',
    borderRadius: 2,
  },
  popupConfirm: {
    flex: 1,
    padding: '10px',
    border: `2px solid ${colors.primary}`,
    background: colors.primary,
    fontSize: 19,
    fontWeight: 700,
    color: colors.bg,
    cursor: 'pointer',
    fontFamily: 'Caveat, cursive',
    borderRadius: 2,
  },
}
