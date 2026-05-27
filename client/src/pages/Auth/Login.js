import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/apiClient';
import { useUser } from '../../context/UserContext';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fromPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || `HTTP ${response.status}`);
      }

      // Server sets httpOnly cookie; response includes user info
      await response.json();
      
      // Update UserContext with new user data
      await login();
      
      navigate(fromPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login'>
      <div className='login-container'>
        <h1>Welcome back!</h1>
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
              // required
              value={password}
              onChange={(event) => setPassword(event.target.value)} />
          </div>

          {error ? <p className='login-error'>{error}</p> : null}

          <Link style={{ textDecoration: 'none' }} to={'/reset_password'}>Forgot Password?</Link>

          <button className='login-container__button' type='submit' disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  )
}