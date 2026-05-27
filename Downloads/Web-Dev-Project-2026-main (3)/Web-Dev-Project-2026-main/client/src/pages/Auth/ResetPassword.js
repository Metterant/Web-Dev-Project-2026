import { Link } from 'react-router-dom';
import './ResetPassword.css';

export default function ResetPassword() {
  return (
    <div className='reset-password'>
      <div className='reset-container'>
        <h1>Reset Your Password</h1>
        <form action={'#reset-pw'} method='post'>
          <div className="form-group">
            <label for="username">Username</label>
            <input type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              required
              autofocus>
            </input>
          </div>

          <div className="form-group">
            <label for="password">Password</label>
            <input type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required>
            </input>
          </div>

          <div className="form-group">
            <label for="password2">Confirm Password</label>
            <input type="password"
              id="password2"
              name="password2"
              placeholder="Re-enter your password"
              required>
            </input>
          </div>

          <Link style={{"text-decoration" : "none" }} to={"/login"}>Back to Log in</Link>

          <button className='reset-container__button'>Reset Password</button>
        </form>
      </div>
    </div>
  )
}