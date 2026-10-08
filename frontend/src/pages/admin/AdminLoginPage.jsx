import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Armchair } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim() || !password) {
      setFormError('Email and password are required.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await adminApi.login({ email: email.trim(), password });
      if (res.success && res.token && res.admin) {
        adminLogin(res.token, res.admin);
        success('Welcome to WoodCraft Admin Portal!');
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err) {
      setFormError(err.message || 'Invalid admin credentials.');
      toastError(err.message || 'Admin login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <Armchair size={22} />
          <h2>WoodCraft Admin</h2>
          <p>Sign in to manage the furniture store.</p>
        </div>

        {formError && (
          <div
            className="admin-login-error"
          >
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">Admin Email</label>
            <input
              id="admin-email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@furniture.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <div style={{ marginTop: '1.75rem' }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={isLoading}
            >
              <Lock size={16} />
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Admin'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;
