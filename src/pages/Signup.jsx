import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDatabase } from '../hooks/useDatabase'
import { colors } from '../styles/colors'
import { shared } from '../styles/shared'

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
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { user } = await signUp(form.email, form.password, {
        full_name: form.full_name,
        school: form.school,
        year: form.year,
        bio: form.bio
      })

      if (!user) throw new Error('Check your email to confirm your account.')

      await createProfile(user.id, {
        full_name: form.full_name,
        email: form.email,
        school: form.school,
        year: form.year,
        bio: form.bio
      })

      navigate('/goal')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={shared.screen}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Sign Up</h1>
          <div style={shared.accentLine} />
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          {[
            { name: 'full_name', label: 'full name', type: 'text', placeholder: 'firstname lastname' },
            { name: 'email',     label: 'email',     type: 'email',    placeholder: 'abc123@scarletmail.rutgers.edu' },
            { name: 'password',  label: 'password',  type: 'password', placeholder: 'at least 8 characters' },
          ].map(field => (
            <div key={field.name} style={shared.inputGroup}>
              <label style={shared.label}>{field.label}</label>
              <input
                style={shared.input}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
                required
              />
              <div style={shared.inputLine} />
            </div>
          ))}

          <div style={shared.inputGroup}>
            <label style={shared.label}>school</label>
            <select
              style={shared.input}
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
            <div style={shared.inputLine} />
          </div>

          <div style={shared.inputGroup}>
            <label style={shared.label}>year</label>
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
            <div style={shared.inputLine} />
          </div>

          <div style={shared.inputGroup}>
            <label style={shared.label}>bio (200 chars max)</label>
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
            <div style={shared.inputLine} />
            <div style={styles.charCount}>{form.bio.length}/200 characters</div>
          </div>

          {error && (
            <div style={shared.errorMessage}>
              <span style={shared.errorIcon}>⚠️</span>
              <span style={shared.errorText}>{error}</span>
            </div>
          )}

          <button style={{ ...shared.primaryBtn, opacity: loading ? 0.6 : 1 }} type="submit" disabled={loading}>
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

const styles = {
  content: {
    flex: 1,
    padding: '44px 52px 40px',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    color: colors.text,
    fontSize: 44,
    fontWeight: 700,
    lineHeight: 1.1,
    marginBottom: 12,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
    marginBottom: 28,
    maxWidth: 420,
  },
  textarea: {
    width: '100%',
    padding: '8px 0',
    border: 'none',
    background: 'transparent',
    color: colors.text,
    fontSize: 18,
    fontFamily: 'Patrick Hand',
    resize: 'vertical',
    minHeight: '70px',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
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
    color: colors.text,
    cursor: 'pointer',
  },
  radioInput: {
    accentColor: colors.primary,
    width: 16,
    height: 16,
    cursor: 'pointer',
  },
  switchText: {
    color: colors.textBody,
    fontSize: 18,
    marginTop: 8,
  },
  link: {
    color: colors.primary,
    fontWeight: 700,
    textDecoration: 'none',
  },
}
