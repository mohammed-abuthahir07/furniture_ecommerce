import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Armchair, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import customerApi from '../../services/customerApi';
import InputField from '../../components/forms/InputField';
import { useToast } from '../../context/ToastContext';
import { isValidEmail } from '../../utils/validators';
import AuthVideoBackground from '../../components/common/AuthVideoBackground';

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
let googleScriptPromise = null;
let initializedGoogleClientId = '';

function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve, reject) => {
    const finish = () => {
      if (window.google?.accounts?.id) resolve();
      else reject(new Error('Google sign-in did not load.'));
    };
    const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', finish, { once: true });
      existing.addEventListener('error', () => reject(new Error('Google sign-in did not load.')), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.onload = finish;
    script.onerror = () => reject(new Error('Google sign-in did not load.'));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

function googleButtonWidth(element) {
  const available = element.parentElement?.clientWidth || 360;
  return Math.max(240, Math.min(400, Math.floor(available)));
}

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
  const onGoogleRef = useRef(() => {});

  const from = location.state?.from?.pathname || '/account';
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  onGoogleRef.current = (response) => {
    if (!response?.credential) return;
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
  };

  useEffect(() => {
    const host = googleBtnRef.current;
    if (!host || !googleClientId) return undefined;

    let cancelled = false;
    let observer;

    const paint = () => {
      if (cancelled || !host.isConnected || !window.google?.accounts?.id) return;
      const width = googleButtonWidth(host);
      if (host.dataset.buttonWidth === String(width) && host.childElementCount > 0) return;
      host.dataset.buttonWidth = String(width);
      host.replaceChildren();
      window.google.accounts.id.renderButton(host, {
        theme: 'outline',
        size: 'large',
        width,
        text: 'continue_with',
      });
    };

    loadGoogleScript()
      .then(() => {
        if (cancelled || !host.isConnected) return;
        if (initializedGoogleClientId !== googleClientId) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: (response) => onGoogleRef.current(response),
          });
          initializedGoogleClientId = googleClientId;
        }
        paint();
        observer = new ResizeObserver(paint);
        if (host.parentElement) observer.observe(host.parentElement);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [googleClientId]);

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
    <div className="auth-page-container auth-has-video">
      <AuthVideoBackground />
      <div className="auth-card">
        <Link to="/" className="auth-close" aria-label="Back to home">
          <X size={16} />
        </Link>
        <div className="auth-header">
          <Link to="/" className="brand-logo" style={{ justifyContent: 'center', marginBottom: '0.45rem' }}>
            <Armchair size={22} />
            <span>WOODCRAFT</span>
          </Link>
          <h2>Sign In</h2>
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
