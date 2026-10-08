import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Armchair, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import customerApi from '../../services/customerApi';
import InputField from '../../components/forms/InputField';
import { useToast } from '../../context/ToastContext';
import { isValidEmail, isValidPassword } from '../../utils/validators';
import AuthVideoBackground from '../../components/common/AuthVideoBackground';

export function RegisterPage() {
  const navigate = useNavigate();
  const { customerLogin } = useAuth();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const { name, email, phone, password, confirm_password } = formData;

    if (!name.trim() || !email.trim() || !password || !confirm_password) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (name.trim().length < 2) {
      setFormError('Name must be at least 2 characters.');
      return;
    }

    if (!isValidEmail(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (!isValidPassword(password)) {
      setFormError('Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, and 1 number.');
      return;
    }

    if (password !== confirm_password) {
      setFormError('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await customerApi.register({
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        password,
        confirm_password,
      });

      if (res.success && res.token && res.customer) {
        customerLogin(res.token, res.customer);
        success('Account created successfully! Welcome to WoodCraft.');
        navigate('/account', { replace: true });
      }
    } catch (err) {
      setFormError(err.message || 'Registration failed.');
      toastError(err.message || 'Registration failed.');
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
          <h2>Create Account</h2>
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

        <form onSubmit={handleSubmit}>
          <InputField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Ananya Patel"
            required
            autoComplete="name"
          />

          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ananya@example.com"
            required
            autoComplete="email"
          />

          <InputField
            label="Phone Number (Optional)"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 9876543210"
            autoComplete="tel"
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Minimum 8 characters (A-Z, a-z, 0-9)"
            required
            hint="Must include at least 1 uppercase, 1 lowercase, and 1 number"
            autoComplete="new-password"
          />

          <InputField
            label="Confirm Password"
            name="confirm_password"
            type="password"
            value={formData.confirm_password}
            onChange={handleChange}
            placeholder="Re-enter your password"
            required
            autoComplete="new-password"
          />

          <div style={{ marginTop: '1.75rem' }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={isLoading}
            >
              <UserPlus size={18} />
              <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--neutral-600)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
