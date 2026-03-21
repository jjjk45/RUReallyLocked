import { useState } from "react"
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDatabase } from '../hooks/useDatabase'

export default function Signup() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const { createProfile } = useDatabase()
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    school: '',
    year: '',
    bio: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')  // ← NEW: Added error state

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')  // ← NEW: Clear previous errors

    try {
      // Create auth user
      const { user } = await signUp(form.email, form.password, {
        full_name: form.full_name,
        school: form.school,    // ← NEW: Pass school to auth metadata
        year: form.year,        // ← NEW: Pass year to auth metadata
        bio: form.bio           // ← NEW: Pass bio to auth metadata
      })

      if (!user) throw new Error('Check your email to confirm your account.')

      // Create profile in profiles table
      await createProfile(user.id, {
        full_name: form.full_name,
        email: form.email,
        school: form.school,    // ← NEW: Save school to database
        year: form.year,        // ← NEW: Save year to database
        bio: form.bio           // ← NEW: Save bio to database
      })

      // Navigate to goal selection
      navigate('/goal')
    } catch (error) {
      setError(error.message)   // ← NEW: Display error to user
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.screen}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Sign Up</h1>
          <div style={styles.accentLine} />
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>

          {/* ========== EXISTING FIELDS (unchanged) ========== */}
          {[
            { name: 'full_name', label: 'full name', type: 'text', placeholder: 'firstname lastname' },
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

          {/* ========== NEW FIELDS - ADD THESE THREE INPUT GROUPS ========== */}

          {/* School dropdown */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>school</label>
            <select
              style={styles.input}
              name="school"
              value={form.school}
              onChange={handleChange}
              required
            >
              <option value="" disabled>select your school</option>
              <option>School of Arts and Sciences</option>
              <option>School of Engineering</option>
              <option>Rutgers Business School</option>
              <option>School of Pharmacy</option>
              <option>School of Nursing</option>
              <option>School of Communication and Information</option>
              <option>School of Environmental and Biological Sciences</option>
              <option>School of Public Health</option>
              <option>School of Social Work</option>
              <option>School of Education</option>
              <option>Ernest Mario School of Pharmacy</option>
              <option>Mason Gross School of the Arts</option>
            </select>
            <div style={styles.inputLine} />
          </div>

          {/* Year radio buttons */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>year</label>
            <div style={styles.radioGroup}>
              {['Freshman', 'Sophomore', 'Junior', 'Senior'].map(yr => (
                <label key={yr} style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="year"
                    value={yr}
                    checked={form.year === yr}
                    onChange={handleChange}
                    required
                    style={styles.radioInput}
                  />
                  {yr}
                </label>
              ))}
            </div>
            <div style={styles.inputLine} />
          </div>

          {/* CHANGE MADE HERE: Bio field (textarea) */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>bio (200 chars max)</label>
            <textarea
              style={styles.textarea}
              name="bio"
              placeholder="Tell us about yourself, your goals, and what you're looking for in an accountability partner..."
              value={form.bio}
              onChange={handleChange}
              maxLength={200}
              rows={3}
              required
            />
            <div style={styles.inputLine} />
            <div style={styles.charCount}>
              {form.bio.length}/200 characters
            </div>
          </div>

          {/* CHANGE MADE HERE: Error message display */}
          {error && (
            <div style={styles.errorMessage}>
              <span style={styles.errorIcon}>⚠️</span>
              <span style={styles.errorText}>{error}</span>
            </div>
          )}

          <button style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }} type="submit" disabled={loading}>
            {loading ? 'setting up...' : '→ create account'}
          </button>
        </form>

        <p style={styles.switchText}>
          already have an account?{' '}
          <Link to="/" style={styles.link}>log in</Link>
        </p>
      </div>
    </div>
  )
}

// CHANGE MADE HERE: Added new styles for textarea, charCount, and error message
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
    fontFamily: 'Patrick Hand',
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
    fontFamily: 'Patrick Hand',
  },
  // CHANGE MADE HERE: New textarea style
  textarea: {
    width: '100%',
    padding: '8px 0',
    border: 'none',
    background: 'transparent',
    color: '#2d2416',
    fontSize: 18,
    fontFamily: 'Patrick Hand',
    resize: 'vertical',
    minHeight: '70px',
  },
  // CHANGE MADE HERE: New character counter style
  charCount: {
    textAlign: 'right',
    fontSize: 11,
    color: '#9b8c7e',
    marginTop: 4,
  },
  select: {
    width: '100%',
    padding: '6px 0',
    border: 'none',
    background: 'transparent',
    color: '#2d2416',
    fontSize: 22,
    fontFamily: 'Patrick Hand',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
  },
  radioGroup: {
    display: 'flex',
    gap: 20,
    flexWrap: 'wrap',
    paddingTop: 6,
    paddingBottom: 6,
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 20,
    fontFamily: 'Patrick Hand',
    color: '#2d2416',
    cursor: 'pointer',
  },
  radioInput: {
    accentColor: '#8b1a2e',
    width: 16,
    height: 16,
    cursor: 'pointer',
  },
  inputLine: {
    width: '100%',
    height: 1.5,
    background: '#c8bfb0',
  },
  // CHANGE MADE HERE: New error message styles
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
    fontFamily: 'Patrick Hand',
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
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
  },
}