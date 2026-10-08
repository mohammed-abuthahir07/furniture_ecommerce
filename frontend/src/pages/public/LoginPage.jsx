import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Lock, Mail, Armchair } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import customerApi from '../../services/customerApi';
import InputField from '../../components/forms/InputField';
import { useToast } from '../../context/ToastContext';
import { isValidEmail } from '../../utils/validators';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerLogin } = useAuth();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const googleBtnRef = useRef(null);

  const from = location.state?.from?.pathname || '/account';

  // Initialize Google Identity Services
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '901315902348-89q3ktsetb31nlu8jblb8vutn2ma4e6d.apps.googleusercontent.com';

    function handleGoogleCredentialResponse(response) {
      if (response && response.credential) {
        setIsLoading(true);
        customerApi
          .googleLogin(response.credential)
          .then((res) => {
            if (res.success && res.token && res.customer) {
              customerLogin(res.token, res.customer);
              success('Logged in with Google successfully!');
              navigate(from, { replace: true });
            }
          })
          .catch((err) => {
            toastError(err.message || 'Google authentication failed.');
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }

    if (window.google?.accounts?.id && googleBtnRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          width: 380,
          text: 'continue_with',
        });
      } catch (err) {
        console.error('Google Sign-In initialization error:', err);
      }
    } else {
      // If script is not yet loaded, load it dynamically
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google?.accounts?.id && googleBtnRef.current) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
          });
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'continue_with',
          });
        }
      };
      document.body.appendChild(script);
    }
  }, [customerLogin, from, navigate, success, toastError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim() || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    if (!isValidEmail(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await customerApi.login({ email: email.trim(), password });
      if (res.success && res.token && res.customer) {
        customerLogin(res.token, res.customer);
        success('Welcome back to WoodCraft!');
        navigate(from, { replace: true });
      }
    } catch (err) {
      setFormError(err.message || 'Invalid email or password.');
      toastError(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="brand-logo" style={{ justifyContent: 'center', marginBottom: '0.75rem' }}>
            <Armchair size={32} />
            <span>WOODCRAFT</span>
          </Link>
          <h2>Customer Sign In</h2>
          <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem', marginTop: 4 }}>
            Sign in to access your orders, wishlist, and custom furniture designs.
          </p>
        </div>

        {formError && (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'var(--danger-50)',
              color: 'var(--danger-500)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              border: '1px solid rgba(185, 43, 39, 0.2)',
            }}
          >
            {formError}
          </div>
        )}

        {/* Google Login Area */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', minHeight: '44px' }}>
          <div ref={googleBtnRef} style={{ width: '100%' }} />
        </div>

        <div className="auth-divider">or sign in with email</div>

        <form onSubmit={handleSubmit}>
          <InputField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            autoComplete="email"
          />

          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--primary-600)', fontWeight: 600 }}>
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            disabled={isLoading}
          >
            <LogIn size={18} />
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--neutral-600)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
