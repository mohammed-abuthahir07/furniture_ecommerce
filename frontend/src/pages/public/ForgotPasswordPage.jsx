import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, KeyRound, Lock, CheckCircle2, Armchair, ArrowLeft } from 'lucide-react';
import customerApi from '../../services/customerApi';
import InputField from '../../components/forms/InputField';
import { useToast } from '../../context/ToastContext';
import { isValidEmail, isValidPassword } from '../../utils/validators';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSuccessComplete, setIsSuccessComplete] = useState(false);

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!isValidEmail(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await customerApi.sendForgotOtp(email.trim());
      if (res.success) {
        success(res.message || 'OTP sent to your email!');
        setStep(2);
      }
    } catch (err) {
      setFormError(err.message || 'Failed to send OTP. Please check your email.');
      toastError(err.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!otp.trim()) {
      setFormError('Please enter the 6-digit OTP code.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await customerApi.verifyForgotOtp(email.trim(), otp.trim());
      if (res.success) {
        success(res.message || 'OTP verified successfully!');
        setStep(3);
      }
    } catch (err) {
      setFormError(err.message || 'Invalid or expired OTP code.');
      toastError(err.message || 'Invalid OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!isValidPassword(newPassword)) {
      setFormError('Password must contain at least 8 characters with uppercase, lowercase, and numeric digits.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await customerApi.resetPassword(
        email.trim(),
        otp.trim(),
        newPassword,
        confirmPassword
      );

      if (res.success) {
        success(res.message || 'Password reset successfully! You can now sign in.');
        setIsSuccessComplete(true);
      }
    } catch (err) {
      setFormError(err.message || 'Failed to reset password.');
      toastError(err.message || 'Failed to reset password.');
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
          <h2>Reset Your Password</h2>
          <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem', marginTop: 4 }}>
            {step === 1 && 'Enter your registered email address to receive an OTP code.'}
            {step === 2 && `Enter the OTP verification code sent to ${email}.`}
            {step === 3 && 'Create a new secure password for your account.'}
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

        {isSuccessComplete ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--radius-full)',
                background: 'var(--success-50)',
                color: 'var(--success-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>Password Reset Complete!</h3>
            <p style={{ color: 'var(--neutral-600)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Your password has been successfully updated. You can now sign in with your new password.
            </p>
            <Link to="/login" className="btn btn-primary btn-lg btn-block">
              Proceed to Sign In
            </Link>
          </div>
        ) : (
          <>
            {/* Step 1: Send OTP */}
            {step === 1 && (
              <form onSubmit={handleSendOtp}>
                <InputField
                  label="Registered Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                />

                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                  style={{ marginTop: '1.5rem' }}
                  disabled={isLoading}
                >
                  <Mail size={18} />
                  <span>{isLoading ? 'Sending OTP...' : 'Send Verification OTP'}</span>
                </button>
              </form>
            )}

            {/* Step 2: Verify OTP */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp}>
                <InputField
                  label="6-Digit OTP Code"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP (e.g. 123456)"
                  required
                  maxLength={6}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{ fontSize: '0.85rem', color: 'var(--neutral-500)', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    <ArrowLeft size={14} /> Change Email
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    style={{ fontSize: '0.85rem', color: 'var(--primary-600)', fontWeight: 600 }}
                  >
                    Resend OTP
                  </button>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                  disabled={isLoading}
                >
                  <KeyRound size={18} />
                  <span>{isLoading ? 'Verifying...' : 'Verify OTP Code'}</span>
                </button>
              </form>
            )}

            {/* Step 3: Reset Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword}>
                <InputField
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  hint="At least 1 uppercase, 1 lowercase, and 1 numeric digit"
                />

                <InputField
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                />

                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                  style={{ marginTop: '1.5rem' }}
                  disabled={isLoading}
                >
                  <Lock size={18} />
                  <span>{isLoading ? 'Updating Password...' : 'Save New Password'}</span>
                </button>
              </form>
            )}
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--neutral-600)' }}>
          Remembered your password?{' '}
          <Link to="/login" style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
