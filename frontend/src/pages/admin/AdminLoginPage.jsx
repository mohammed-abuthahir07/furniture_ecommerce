import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert, Armchair } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import adminApi from '../../services/adminApi';
import InputField from '../../components/forms/InputField';
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
    <div
      style={{
        minHeight: '100vh',
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '420px',
          color: '#ffffff',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-600)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <Armchair size={28} />
          </div>
          <h2 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 800 }}>Admin Portal</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: 4 }}>
            WoodCraft Furniture Management System
          </p>
        </div>

        {formError && (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ color: '#cbd5e1' }}>Admin Email</label>
            <input
              type="email"
              className="form-input"
              style={{ background: '#0f172a', borderColor: '#475569', color: '#fff' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@furniture.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#cbd5e1' }}>Password</label>
            <input
              type="password"
              className="form-input"
              style={{ background: '#0f172a', borderColor: '#475569', color: '#fff' }}
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
