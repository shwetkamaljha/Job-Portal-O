import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'seeker' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/register', form);
      login(res.data.user);
      showToast('Account created — welcome to Bridge!', 'success');
      navigate(form.role === 'employer' ? '/dashboard' : '/jobs', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Create your account</h1>
        <p className="auth-sub">Takes less than a minute.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>I am a…</label>
            <div className="role-toggle">
              <div
                className={`role-option${form.role === 'seeker' ? ' selected' : ''}`}
                onClick={() => setForm({ ...form, role: 'seeker' })}
              >
                🔎 Job seeker
              </div>
              <div
                className={`role-option${form.role === 'employer' ? ' selected' : ''}`}
                onClick={() => setForm({ ...form, role: 'employer' })}
              >
                🏢 Employer
              </div>
            </div>
          </div>

          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Jane Doe" />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required minLength={6} value={form.password} onChange={handleChange} placeholder="At least 6 characters" />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-foot">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
