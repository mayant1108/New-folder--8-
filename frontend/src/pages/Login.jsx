import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import './Auth.css';

const demoCredentials = {
  email: 'demo@shophub.com',
  password: 'demo123'
};

const showcaseHighlights = [
  {
    icon: 'bag',
    title: 'Saved carts wait for you',
    text: 'Jump back into unfinished picks without rebuilding everything.'
  },
  {
    icon: 'sparkles',
    title: 'Personalized drops',
    text: 'Your recent categories and styles stay organized in one place.'
  },
  {
    icon: 'shield',
    title: 'Fast and secure checkout',
    text: 'Track orders, addresses, and support updates from one dashboard.'
  }
];

const trustMetrics = [
  { value: '24/7', label: 'support access' },
  { value: '1-click', label: 'cart restore' },
  { value: '100%', label: 'encrypted sign in' }
];

const socialProviders = [
  {
    id: 'google',
    name: 'Google',
    caption: 'Instant personal access'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    caption: 'Continue with social login'
  }
];

function AuthIcon({ name }) {
  const svgProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true
  };

  switch (name) {
    case 'mail':
      return (
        <svg {...svgProps}>
          <path d="M4 6h16v12H4z" />
          <path d="m4 8 8 6 8-6" />
        </svg>
      );
    case 'lock':
      return (
        <svg {...svgProps}>
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case 'eye':
      return (
        <svg {...svgProps}>
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'eye-off':
      return (
        <svg {...svgProps}>
          <path d="m3 3 18 18" />
          <path d="M10.6 6.3A10.9 10.9 0 0 1 12 6c6.5 0 10 6 10 6a18.5 18.5 0 0 1-3.3 3.8" />
          <path d="M6.7 6.8A18.2 18.2 0 0 0 2 12s3.5 6 10 6a10.8 10.8 0 0 0 4.1-.8" />
          <path d="M9.9 9.8A3 3 0 0 0 14.2 14" />
        </svg>
      );
    case 'arrow':
      return (
        <svg {...svgProps}>
          <path d="M5 12h14" />
          <path d="m13 5 7 7-7 7" />
        </svg>
      );
    case 'bag':
      return (
        <svg {...svgProps}>
          <path d="M6 8h12l-1 12H7L6 8Z" />
          <path d="M9 10V7a3 3 0 0 1 6 0v3" />
        </svg>
      );
    case 'sparkles':
      return (
        <svg {...svgProps}>
          <path d="m12 3 1.4 3.6L17 8l-3.6 1.4L12 13l-1.4-3.6L7 8l3.6-1.4L12 3Z" />
          <path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14Z" />
          <path d="m19 13 .8 2.2L22 16l-2.2.8L19 19l-.8-2.2L16 16l2.2-.8L19 13Z" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...svgProps}>
          <path d="M12 3 5 6v6c0 4.4 3 7.8 7 9 4-1.2 7-4.6 7-9V6l-7-3Z" />
          <path d="m9.5 12 1.8 1.8 3.7-3.8" />
        </svg>
      );
    case 'google':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M21.8 12.2c0-.8-.1-1.5-.2-2.2H12v4.1h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.3c1.9-1.7 3-4.3 3-7.6Z"
          />
          <path
            fill="currentColor"
            d="M12 22c2.7 0 5-.9 6.7-2.3l-3.3-2.6c-.9.6-2.1 1-3.4 1-2.6 0-4.9-1.8-5.7-4.2H2.9v2.7A10 10 0 0 0 12 22Z"
          />
          <path
            fill="currentColor"
            d="M6.3 13.9A6 6 0 0 1 6 12c0-.7.1-1.3.3-1.9V7.4H2.9A10 10 0 0 0 2 12c0 1.6.4 3.1.9 4.5l3.4-2.6Z"
          />
          <path
            fill="currentColor"
            d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9C17 2.9 14.7 2 12 2A10 10 0 0 0 2.9 7.4l3.4 2.6C7.1 7.6 9.4 5.9 12 5.9Z"
          />
        </svg>
      );
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M13.5 22v-7h2.4l.4-3h-2.8v-1.9c0-.9.3-1.5 1.6-1.5h1.3V6c-.2 0-1-.1-1.9-.1-1.9 0-3.1 1.1-3.1 3.3V12H9v3h2.5v7h2Z"
          />
        </svg>
      );
    case 'store':
      return (
        <svg {...svgProps}>
          <path d="M4 8h16" />
          <path d="M6 8V6.5A1.5 1.5 0 0 1 7.5 5h9A1.5 1.5 0 0 1 18 6.5V8" />
          <path d="M5 8h14l-1 4a2 2 0 0 1-2 1.5H8A2 2 0 0 1 6 12L5 8Z" />
          <path d="M7 13.5V19h10v-5.5" />
        </svg>
      );
    default:
      return null;
  }
}

function Login() {
  const { setUser, showToast } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

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
        showToast(data.name ? `Welcome back, ${data.name}!` : 'Welcome back!', 'success');
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

  const handleSocialLogin = (provider) => {
    showToast(`${provider} login will be available soon.`, 'info');
  };

  const handleDemoFill = () => {
    setFormData(demoCredentials);
    setErrors({});
    setRememberMe(true);
    showToast('Demo credentials filled in.', 'info');
  };

  const handleForgotPassword = () => {
    showToast('Password recovery is coming soon. Please contact support for now.', 'info');
  };

  return (
    <div className="auth-page auth-page-login">
      <div className="auth-decoration" aria-hidden="true">
        <div className="decoration-orb orb-one"></div>
        <div className="decoration-orb orb-two"></div>
        <div className="decoration-grid"></div>
      </div>

      <div className={`auth-container auth-container-wide ${isVisible ? 'fade-in' : ''}`}>
        <div className="auth-card auth-card-split">
          <section className="auth-showcase">
            <Link to="/" className="auth-brand-link">
              <span className="auth-brand-mark">
                <AuthIcon name="store" />
              </span>
              <span className="auth-brand-copy">
                <span className="auth-brand-kicker">Members portal</span>
                <span className="auth-logo-text">ShopZone</span>
              </span>
            </Link>

            <span className="showcase-badge">Private style vault</span>
            <h2 className="showcase-title">Your saved picks, profiles, and checkouts are one sign in away.</h2>
            <p className="showcase-subtitle">
              Step back into a smoother storefront with tracked orders, faster checkout, and personalized product discovery.
            </p>

            <div className="showcase-grid">
              {showcaseHighlights.map((item) => (
                <article key={item.title} className="showcase-card">
                  <span className="showcase-icon">
                    <AuthIcon name={item.icon} />
                  </span>
                  <div>
                    <h3 className="showcase-card-title">{item.title}</h3>
                    <p className="showcase-card-text">{item.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="showcase-footer">
              <div className="showcase-metrics">
                {trustMetrics.map((item) => (
                  <div key={item.label} className="metric-item">
                    <span className="metric-value">{item.value}</span>
                    <span className="metric-label">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="showcase-note">
                <p className="showcase-note-label">Need a quick preview?</p>
                <p className="showcase-note-text">Use the seeded demo account and explore the full flow instantly.</p>
                <button type="button" className="demo-fill-btn" onClick={handleDemoFill}>
                  Use demo account
                </button>
              </div>
            </div>
          </section>

          <section className="auth-panel">
            <div className="auth-header auth-header-left">
              <span className="auth-eyebrow">Welcome back</span>
              <h1 className="auth-title">Sign in to continue</h1>
              <p className="auth-subtitle">
                Access saved carts, faster checkout, and order tracking from one clean workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <label htmlFor="email" className="input-label">
                  <span className="label-icon">
                    <AuthIcon name="mail" />
                  </span>
                  Email address
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`input-field ${errors.email ? 'error' : ''}`}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                  />
                  {formData.email && !errors.email && <span className="input-success">OK</span>}
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="password" className="input-label">
                  <span className="label-icon">
                    <AuthIcon name="lock" />
                  </span>
                  Password
                </label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`input-field ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    aria-invalid={Boolean(errors.password)}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <AuthIcon name={showPassword ? 'eye-off' : 'eye'} />
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="auth-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">Keep me signed in</span>
                </label>

                <button type="button" className="forgot-link" onClick={handleForgotPassword}>
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="btn btn-primary btn-block auth-submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <span className="btn-icon-inline">
                      <AuthIcon name="arrow" />
                    </span>
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span className="divider-line"></span>
              <span className="divider-text">or continue with</span>
              <span className="divider-line"></span>
            </div>

            <div className="social-login">
              {socialProviders.map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  className={`social-btn ${provider.id}`}
                  onClick={() => handleSocialLogin(provider.name)}
                >
                  <span className="social-icon">
                    <AuthIcon name={provider.id} />
                  </span>
                  <span className="social-copy">
                    <span className="social-title">Continue with {provider.name}</span>
                    <span className="social-caption">{provider.caption}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="demo-credentials">
              <div className="demo-copy">
                <p className="demo-title">Quick demo access</p>
                <p className="demo-subtitle">
                  {demoCredentials.email}
                  <span className="demo-separator">/</span>
                  {demoCredentials.password}
                </p>
              </div>
              <button type="button" className="demo-action" onClick={handleDemoFill}>
                Fill details
              </button>
            </div>

            <div className="auth-footer auth-footer-inline">
              <p className="footer-text">
                New here?{' '}
                <Link to="/register" className="footer-link">
                  Create an account
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Login;
