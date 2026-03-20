import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => navigate('/goal'), 800)
  }

  return (
    <div style={styles.screen}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>←</button>
        <h2 style={styles.headerTitle}>Create Account</h2>
        <div style={{ width: 36 }} />
      </div>

      <div style={styles.content}>
        <div style={styles.hero}>
          <span style={styles.heroEmoji}>🔒</span>
          <h1 style={styles.appName}>RUrllyLocked?</h1>
          <p style={styles.sub}>Join your Rutgers accountability community</p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              type="text"
              name="name"
              placeholder="Jayden Ramirez"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="abc123@scarletmail.rutgers.edu"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Get Started →'}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{' '}
          <Link to="/" style={styles.link}>Log in</Link>
        </p>
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
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid #f0f0f0',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: '#f5f5f5',
    border: 'none',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#333',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
    padding: '32px 28px 40px',
    display: 'flex',
    flexDirection: 'column',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 36,
  },
  heroEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  appName: {
    fontSize: 26,
    fontWeight: 800,
    color: '#CC0033',
    marginBottom: 6,
  },
  sub: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    marginBottom: 20,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#444',
    letterSpacing: '0.3px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: '1.5px solid #e0e0e0',
    background: '#fafafa',
    color: '#1a1a1a',
    fontSize: 16,
    transition: 'border-color 0.2s',
  },
  btn: {
    marginTop: 4,
    width: '100%',
    padding: '16px',
    borderRadius: 14,
    background: '#CC0033',
    color: '#fff',
    fontSize: 17,
    fontWeight: 700,
    transition: 'opacity 0.2s',
  },
  terms: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 1.5,
  },
  termLink: {
    color: '#CC0033',
    fontWeight: 600,
  },
  switchText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
  link: {
    color: '#CC0033',
    fontWeight: 700,
  },
}
