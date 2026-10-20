import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircleIcon, EyeIcon, EyeOffIcon, UserIcon } from '../components/icons';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('The username or password is incorrect. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-intro">
        <div className="login-brand"><span>E</span><div><strong>EMS</strong><small>Employee management</small></div></div>
        <div className="login-intro__content">
          <p>People operations, simplified</p>
          <h1>Everything your team needs, in one clear workspace.</h1>
          <ul>
            <li><CheckCircleIcon /> Keep employee information organized</li>
            <li><CheckCircleIcon /> Review leave requests quickly</li>
            <li><CheckCircleIcon /> Understand workforce health at a glance</li>
          </ul>
        </div>
        <p className="login-intro__footer">Secure access for your organization</p>
      </section>

      <main className="login-form-side">
        <form className="login-card" onSubmit={handleSubmit}>
          <span className="login-card__icon"><UserIcon /></span>
          <h2>Welcome back</h2>
          <p>Sign in to continue to your EMS workspace.</p>

          <div className="field login-field">
            <label htmlFor="username">Username</label>
            <input id="username" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" required autoFocus />
          </div>
          <div className="field login-field">
            <label htmlFor="password">Password</label>
            <div className="login-password">
              <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
              <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOffIcon /> : <EyeIcon />}</button>
            </div>
          </div>
          {error && <div className="login-error" role="alert">{error}</div>}
          <button className="button button--primary login-submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</button>
          <p className="login-help">Having trouble signing in? Contact your system administrator.</p>
        </form>
      </main>
    </div>
  );
}
