import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fix: Add 'async' keyword here
  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')  // Clear previous errors

    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (error) {
      setError(error.message)  // Show error message
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.screen}>
      <div style={styles.content}>

        <div style={styles.coverSection}>
          <div style={styles.coverLabel}>ACCOUNTABILITY JOURNAL</div>
          <h1 style={styles.appName}>RUrllyLocked?</h1>
          <div style={styles.accentBar} />
          <p style={styles.tagline}>your accountability tested</p>
          <div style={styles.stampWrap}>
            <div style={styles.stamp}>est. 2025</div>
          </div>
        </div>

        <form style={styles.form} onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="you@rutgers.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <div style={styles.inputLine} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="secret"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <div style={styles.inputLine} />
          </div>

          {/* 🔴 ADD ERROR DISPLAY HERE - Right before the button */}
          {error && (
            <div style={styles.errorMessage}>
              <span style={styles.errorIcon}>⚠️</span>
              <span style={styles.errorText}>{error}</span>
            </div>
          )}

          <button style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }} type="submit" disabled={loading}>
            {loading ? 'logging in...' : '→ log in'}
          </button>
        </form>

        <p style={styles.switchText}>
          new here?{' '}
          <Link to="/signup" style={styles.link}>create an account</Link>
        </p>

        <div style={styles.decorLines}>
          <div style={styles.decorLine} />
          <div style={styles.decorLine} />
          <div style={styles.decorLine} />
        </div>
      </div>

      <div style={styles.footer}>
        <span style={styles.footerText}>rutgers university · new brunswick, nj</span>
      </div>
    </div>
  )
}

// Add error message styles to your existing styles object
const styles = {
  screen: {
    minHeight: '100vh',
    background: '#faf7f2',
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 6,
  },
  content: {
    flex: 1,
    padding: '56px 52px 40px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  coverSection: {
    marginBottom: 44,
  },
  coverLabel: {
    fontSize: 11,
    color: '#9b8c7e',
    letterSpacing: '2.5px',
    fontFamily: '-apple-system, sans-serif',
    fontWeight: 600,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  appName: {
    color: '#2d2416',
    fontSize: 52,
    fontWeight: 700,
    lineHeight: 1.05,
    marginBottom: 14,
  },
  accentBar: {
    width: 60,
    height: 3,
    background: '#8b1a2e',
    marginBottom: 12,
  },
  tagline: {
    color: '#6b5d4e',
    fontSize: 20,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  stampWrap: {
    display: 'inline-block',
  },
  stamp: {
    display: 'inline-block',
    fontSize: 13,
    color: '#9b8c7e',
    fontFamily: '-apple-system, sans-serif',
    border: '1.5px solid #c8bfb0',
    padding: '3px 12px',
    borderRadius: 2,
    letterSpacing: '1px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 32,
  },
  dividerBullet: {
    color: '#8b1a2e',
    fontSize: 22,
    fontWeight: 700,
    flexShrink: 0,
  },
  dividerText: {
    color: '#2d2416',
    fontSize: 20,
    fontStyle: 'italic',
    flexShrink: 0,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: '#e0d8cc',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
    marginBottom: 28,
    maxWidth: 420,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  label: {
    color: '#8b1a2e',
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 2,
  },
  input: {
    width: '100%',
    padding: '6px 0',
    border: 'none',
    background: 'transparent',
    color: '#2d2416',
    fontSize: 24,
  },
  inputLine: {
    width: '100%',
    height: 1.5,
    background: '#c8bfb0',
  },
  btn: {
    alignSelf: 'flex-start',
    marginTop: 8,
    padding: '10px 32px',
    border: '2px solid #2d2416',
    background: '#2d2416',
    color: '#faf7f2',
    fontSize: 22,
    fontWeight: 700,
    borderRadius: 2,
    transition: 'opacity 0.2s',
    cursor: 'pointer',
  },

  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: '#fff5f5',
    borderLeft: '4px solid #8b1a2e',
    marginTop: '-8px',
    marginBottom: '-8px',
  },
  errorIcon: {
    fontSize: '18px',
  },
  errorText: {
    color: '#8b1a2e',
    fontSize: '14px',
    flex: 1,
    fontFamily: '-apple-system, sans-serif',
  },
  switchText: {
    color: '#6b5d4e',
    fontSize: 18,
  },
  link: {
    color: '#8b1a2e',
    fontWeight: 700,
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  decorLines: {
    position: 'absolute',
    bottom: 52,
    right: 52,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    opacity: 0.35,
  },
  decorLine: {
    width: 72,
    height: 1,
    background: '#c8bfb0',
  },
  footer: {
    padding: '14px 52px',
    borderTop: '1px solid #e0d8cc',
  },
  footerText: {
    fontSize: 11,
    color: '#9b8c7e',
    fontFamily: '-apple-system, sans-serif',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
  },
}