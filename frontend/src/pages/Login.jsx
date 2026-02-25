import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import './Auth.css';

function Login() {
  const { setUser, showToast } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        showToast('Welcome back!', 'success');
        navigate('/');
      } else {
        showToast(data.message || 'Login failed', 'error');
      }
    } catch (error) {
      showToast('Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to continue shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your email"
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your password"
              />
            </div>

            <div className="auth-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Sign up</Link></p>
          </div>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="social-login">
            <button className="social-btn">
              <span>🔵</span> Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
