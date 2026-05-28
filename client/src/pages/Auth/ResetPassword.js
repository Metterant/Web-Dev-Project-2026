import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/apiClient';
import './ResetPassword.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== password2) {
      setLoading(false);
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ username, password, confirmPassword: password2 }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || `HTTP ${response.status}`);
      }

      setSuccess(payload.message || 'Password reset successfully');
      setUsername('');
      setPassword('');
      setPassword2('');

      window.setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1200);
    } catch (err) {
      setError(err.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='reset-password'>
      <div className='reset-container'>
        <h1>Reset Your Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              required
              autoFocus
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password2">Confirm Password</label>
            <input type="password"
              id="password2"
              name="password2"
              placeholder="Re-enter your password"
              required
              value={password2}
              onChange={(event) => setPassword2(event.target.value)}
            />
          </div>

          {error ? <p className='reset-password__message reset-password__message--error'>{error}</p> : null}
          {success ? <p className='reset-password__message reset-password__message--success'>{success}</p> : null}

          <Link style={{ textDecoration: 'none' }} to={'/login'}>Back to Log in</Link>

          <button className='reset-container__button' type='submit' disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}