import { Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
  return (
    <div className='login'>
      <div className='login-container'>
        <h1>Welcome back!</h1>
        <form action={'#logged'} method='post'>
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

          <Link style={{"text-decoration" : "none" }} to={"/reset_password"}>Forgot Password?</Link>

          <button className='login-container__button'>Log in</button>
        </form>
      </div>
    </div>
  )
}