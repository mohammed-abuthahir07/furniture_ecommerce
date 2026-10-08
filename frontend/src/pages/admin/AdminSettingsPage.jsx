import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import InputField from '../../components/forms/InputField';
import Loader from '../../components/common/Loader';
import { 
  Settings, 
  User, 
  Lock, 
  ShieldCheck, 
  Truck, 
  Save, 
  CheckCircle2, 
  Store 
} from 'lucide-react';

const AdminSettingsPage = () => {
  const { admin, refreshAdmin } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'password', 'store'
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingStore, setSavingStore] = useState(false);

  // Profile state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Store delivery settings
  const [shippingFee, setShippingFee] = useState('0');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('0');
  const [defaultDeliveryDays, setDefaultDeliveryDays] = useState('7');
  const [codEnabled, setCodEnabled] = useState(true);
  const [onlineEnabled, setOnlineEnabled] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadSettings() {
      try {
        const [profileRes, storeRes] = await Promise.all([
          adminApi.getSettingsProfile(),
          adminApi.getStoreSettings(),
        ]);
        if (!active) return;
        const profile = profileRes.profile || admin;
        if (profile) {
          setName(profile.name || '');
          setEmail(profile.email || '');
        }
        const settings = storeRes.settings;
        if (settings) {
          setShippingFee(String(settings.shipping_charge ?? '0'));
          setFreeShippingThreshold(String(settings.free_shipping_threshold ?? '0'));
          setDefaultDeliveryDays(String(settings.default_delivery_days ?? '7'));
          setCodEnabled(Boolean(Number(settings.cod_enabled ?? settings.cod_enabled === true)));
          setOnlineEnabled(Boolean(Number(settings.online_payment_enabled ?? 1)));
        }
      } catch (err) {
        if (active) showError(err.message || 'Failed to load store settings');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadSettings();
    return () => { active = false; };
  }, [admin]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await adminApi.updateSettingsProfile({
        name,
        email,
      });

      if (res.success) {
        showSuccess('Admin profile updated successfully');
        if (res.profile) {
          setName(res.profile.name || name);
          setEmail(res.profile.email || email);
        }
        if (refreshAdmin) await refreshAdmin();
      }
    } catch (err) {
      showError(err.message || 'Failed to update admin profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      showError('Password must be at least 8 characters and include uppercase, lowercase, and a number.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showError('New password and confirm password do not match');
      return;
    }

    try {
      setSavingPassword(true);
      const res = await adminApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      });

      if (res.success) {
        showSuccess('Admin password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      showError(err.message || 'Failed to change password. Verify your current password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveStoreSettings = async (e) => {
    e.preventDefault();
    try {
      setSavingStore(true);
      const res = await adminApi.updateStoreSettings({
        shipping_charge: Number(shippingFee),
        free_shipping_threshold: Number(freeShippingThreshold),
        default_delivery_days: Number(defaultDeliveryDays),
        cod_enabled: codEnabled,
        online_payment_enabled: onlineEnabled,
      });
      if (res.success) {
        showSuccess(res.message || 'Delivery settings saved');
      }
    } catch (err) {
      showError(err.message || 'Failed to save delivery settings');
    } finally {
      setSavingStore(false);
    }
  };

  return (
    <div className="admin-settings-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Store & Admin Settings</h1>
          <p className="admin-page-subtitle">Configure administrative credentials, security parameters, and store delivery policies.</p>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', marginBottom: '24px' }}>
        <button
          className={`btn btn-sm ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('profile')}
          style={{ borderRadius: '6px 6px 0 0', borderBottom: 'none' }}
        >
          <User size={15} /> Administrator Profile
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'password' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('password')}
          style={{ borderRadius: '6px 6px 0 0', borderBottom: 'none' }}
        >
          <Lock size={15} /> Security & Password
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'store' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('store')}
          style={{ borderRadius: '6px 6px 0 0', borderBottom: 'none' }}
        >
          <Store size={15} /> Store Policies & Shipping
        </button>
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <div className="admin-card" style={{ maxWidth: '640px' }}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">Personal Credentials</h3>
          </div>
          <div style={{ padding: '24px' }}>
            <form onSubmit={handleUpdateProfile}>
              <InputField
                label="Administrator Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <InputField
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                helperText="This is the email used to sign in to the admin portal."
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                  <Save size={16} /> {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Password */}
      {activeTab === 'password' && (
        <div className="admin-card" style={{ maxWidth: '640px' }}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">Change Administrative Password</h3>
          </div>
          <div style={{ padding: '24px' }}>
            <form onSubmit={handleChangePassword}>
              <InputField
                label="Current Password"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />

              <InputField
                label="New Password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                helperText="Use at least 8 characters with uppercase, lowercase, and a number."
              />

              <InputField
                label="Confirm New Password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary" disabled={savingPassword}>
                  <ShieldCheck size={16} /> {savingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Store & Shipping */}
      {activeTab === 'store' && (
        <div className="admin-card" style={{ maxWidth: '680px' }}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">Store Logistics & Dispatch Policies</h3>
          </div>
          <div style={{ padding: '24px' }}>
            <form onSubmit={handleSaveStoreSettings}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <InputField
                  label="Standard Heavy Logistics Fee (₹)"
                  type="number"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(e.target.value)}
                  helperText="Applies for orders below free shipping limit."
                />

                <InputField
                  label="Free Furniture Shipping Threshold (₹)"
                  type="number"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(e.target.value)}
                  helperText="Orders exceeding this get complimentary shipping."
                />
              </div>

              <InputField
                label="Default Furniture Delivery Days"
                type="number"
                min="1"
                value={defaultDeliveryDays}
                onChange={(e) => setDefaultDeliveryDays(e.target.value)}
                helperText="Shown to customers when a product does not set its own delivery window."
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <label className="form-group">
                  <span className="form-label">Cash on Delivery</span>
                  <select className="form-select" value={codEnabled ? 'true' : 'false'} onChange={(e) => setCodEnabled(e.target.value === 'true')}>
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </label>
                <label className="form-group">
                  <span className="form-label">Online Payment</span>
                  <select className="form-select" value={onlineEnabled ? 'true' : 'false'} onChange={(e) => setOnlineEnabled(e.target.value === 'true')}>
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary" disabled={savingStore || loading}>
                  <Save size={16} /> {savingStore ? 'Saving...' : 'Save Delivery Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsPage;
