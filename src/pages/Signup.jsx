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
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>← back</button>
      </div>

      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.headerLabel}>new entry</div>
          <h1 style={styles.title}>Create Your Journal</h1>
          <div style={styles.accentLine} />
          <p style={styles.sub}>join your rutgers accountability community</p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          {[
            { name: 'name', label: 'full name', type: 'text', placeholder: 'Jayden Ramirez' },
            { name: 'email', label: 'email', type: 'email', placeholder: 'abc123@scarletmail.rutgers.edu' },
            { name: 'password', label: 'password', type: 'password', placeholder: 'at least 8 characters' },
          ].map(field => (
            <div key={field.name} style={styles.inputGroup}>
              <label style={styles.label}>{field.label}</label>
              <input
                style={styles.input}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
                required
              />
              <div style={styles.inputLine} />
            </div>
          ))}

          <button style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }} type="submit" disabled={loading}>
            {loading ? 'setting up...' : '→ get started'}
          </button>
        </form>

        <p style={styles.switchText}>
          already journaling?{' '}
          <Link to="/" style={styles.link}>sign in</Link>
        </p>
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
  topBar: {
    padding: '20px 52px 0',
    borderBottom: '1px solid #e0d8cc',
    paddingBottom: 16,
  },
  backBtn: {
    background: 'transparent',
    border: 'none',
    color: '#8b1a2e',
    fontSize: 20,
    fontFamily: 'Caveat, cursive',
    cursor: 'pointer',
    padding: 0,
  },
  content: {
    flex: 1,
    padding: '44px 52px 40px',
  },
  header: {
    marginBottom: 40,
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
    fontSize: 44,
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
    fontSize: 19,
    fontStyle: 'italic',
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
  switchText: {
    color: '#6b5d4e',
    fontSize: 18,
    marginTop: 8,
  },
  link: {
    color: '#8b1a2e',
    fontWeight: 700,
  },
}
