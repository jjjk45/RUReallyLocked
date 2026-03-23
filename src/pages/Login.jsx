import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { colors } from '../styles/colors'
import { shared } from '../styles/shared'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={shared.screen}>
      <div style={styles.content}>
        <div style={styles.coverSection}>
          <h1 style={styles.appName}>RUrllyLocked?</h1>
          <p style={styles.tagline}>New Brunswickians</p>
          <div style={styles.stampWrap}>
            <div style={styles.stamp}>est. 2026</div>
          </div>
        </div>

        <form style={styles.form} onSubmit={handleLogin}>
          <div style={shared.inputGroup}>
            <label style={shared.label}>email</label>
            <input
              style={shared.input}
              type="email"
              placeholder="abc123@scarletmail.rutgers.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <div style={shared.inputLine} />
          </div>

          <div style={shared.inputGroup}>
            <label style={shared.label}>password</label>
            <input
              style={shared.input}
              type="password"
              placeholder="secret code :o"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <div style={shared.inputLine} />
          </div>

          {error && (
            <div style={shared.errorMessage}>
              <span style={shared.errorIcon}>⚠️</span>
              <span style={shared.errorText}>{error}</span>
            </div>
          )}

          <button style={{ ...shared.primaryBtn, opacity: loading ? 0.6 : 1 }} type="submit" disabled={loading}>
            {loading ? 'logging in...' : '→ log in'}
          </button>
        </form>

        <p style={styles.switchText}>
          new here?{' '}
          <Link to="/signup" style={styles.link}>create an account</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
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
  appName: {
    color: colors.text,
    fontSize: 52,
    fontWeight: 700,
    lineHeight: 1.05,
    marginBottom: 14,
  },
  tagline: {
    color: colors.textBody,
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
    color: colors.textMuted,
    fontFamily: '-apple-system, sans-serif',
    border: `1.5px solid ${colors.borderSubtle}`,
    padding: '3px 12px',
    borderRadius: 2,
    letterSpacing: '1px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
    marginBottom: 28,
    maxWidth: 420,
  },
  switchText: {
    color: colors.textBody,
    fontSize: 18,
  },
  link: {
    color: colors.primary,
    fontWeight: 700,
    textDecoration: 'none',
  },
}
