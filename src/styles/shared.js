import { colors } from './colors'

export const shared = {
  // Page wrapper — used by every screen
  screen: {
    minHeight: '100vh',
    background: colors.bg,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 6,
  },

  // Burgundy accent bar under headings
  accentLine: {
    width: 48,
    height: 3,
    background: colors.primary,
    marginBottom: 10,
  },

  // Primary dark CTA button
  primaryBtn: {
    padding: '10px 32px',
    border: `2px solid ${colors.text}`,
    background: colors.text,
    color: colors.bg,
    fontSize: 22,
    fontWeight: 700,
    borderRadius: 2,
    transition: 'opacity 0.2s',
    cursor: 'pointer',
  },

  // Form field wrapper
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },

  // Form field label
  label: {
    color: colors.primary,
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 2,
  },

  // Form text input
  input: {
    width: '100%',
    padding: '6px 0',
    border: 'none',
    background: 'transparent',
    color: colors.text,
    fontSize: 24,
    fontFamily: 'Patrick Hand',
  },

  // Underline beneath form inputs
  inputLine: {
    width: '100%',
    height: 1.5,
    background: colors.borderSubtle,
  },

  // Error block (icon + message)
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 16px',
    background: '#fff5f5',
    borderLeft: `4px solid ${colors.primary}`,
  },
  errorIcon: {
    fontSize: 18,
  },
  errorText: {
    color: colors.primary,
    fontSize: 14,
    flex: 1,
    fontFamily: 'Patrick Hand',
  },

  // • label ──── section divider
  sectionDivider: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  bullet: {
    color: colors.primary,
    fontSize: 18,
    flexShrink: 0,
  },
  sectionLabel: {
    color: colors.textBody,
    fontSize: 16,
    fontStyle: 'italic',
    flexShrink: 0,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: colors.border,
  },

  // Onboarding progress bar
  progressTrack: {
    height: 2,
    background: colors.border,
    borderRadius: 1,
    overflow: 'hidden',
    maxWidth: 200,
  },
  progressFill: {
    height: '100%',
    background: colors.primary,
    transition: 'width 0.3s',
  },

  // Sticky footer bar (GoalSelect / CollateralSelect)
  footer: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 720,
    paddingLeft: 6,
    background: colors.bg,
  },
  footerLine: {
    height: 1,
    background: colors.border,
  },
  footerInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 52px 24px',
  },
  footerNote: {
    color: colors.textMuted,
    fontSize: 17,
    fontStyle: 'italic',
  },
}
