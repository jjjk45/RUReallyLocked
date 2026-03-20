import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => navigate('/dashboard'), 800)
  }

  return (
    <div style={styles.screen}>
      <div style={styles.top}>
        <div style={styles.logoWrap}>
          <span style={styles.logoEmoji}>🔒</span>
        </div>
        <h1 style={styles.appName}>RUrllyLocked?</h1>
        <p style={styles.tagline}>Your Rutgers accountability partner</p>
      </div>

      <form style={styles.form} onSubmit={handleLogin}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="you@rutgers.edu"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p style={styles.switchText}>
        Don't have an account?{' '}
        <Link to="/signup" style={styles.link}>Sign up</Link>
      </p>

      <div style={styles.rutgersBar}>
        <span style={styles.rutgersText}>THE STATE UNIVERSITY OF NEW JERSEY</span>
      </div>
    </div>
  )
}

const styles = {
  screen: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 28px',
    background: 'linear-gradient(160deg, #CC0033 0%, #8B0022 50%, #1a1a2e 100%)',
  },
  top: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 72,
    paddingBottom: 48,
  },
  logoWrap: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255,255,255,0.3)',
  },
  logoEmoji: {
    fontSize: 36,
  },
  appName: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 800,
    letterSpacing: '-0.5px',
    marginBottom: 8,
  },
  tagline: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 15,
    fontWeight: 400,
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: '1.5px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.12)',
    color: '#fff',
    fontSize: 16,
    backdropFilter: 'blur(10px)',
  },
  btn: {
    marginTop: 8,
    width: '100%',
    padding: '16px',
    borderRadius: 14,
    background: '#fff',
    color: '#CC0033',
    fontSize: 17,
    fontWeight: 700,
    letterSpacing: '0.2px',
    transition: 'opacity 0.2s',
  },
  switchText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 24,
  },
  link: {
    color: '#fff',
    fontWeight: 700,
  },
  rutgersBar: {
    position: 'absolute',
    bottom: 24,
    display: 'flex',
    alignItems: 'center',
  },
  rutgersText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '1.5px',
  },
}
