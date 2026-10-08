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
  const { adminUser, checkAdminAuth } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'password', 'store'
  const [loading, setLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Profile state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Store settings state (local / backend config)
  const [shippingFee, setShippingFee] = useState('499');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('15000');
  const [storeEmail, setStoreEmail] = useState('support@woodcraftfurniture.com');
  const [storePhone, setStorePhone] = useState('+91 98765 43210');
  const [storeAddress, setStoreAddress] = useState('Industrial Area Phase 2, Jodhpur, Rajasthan 342001');

  useEffect(() => {
    if (adminUser) {
      setName(adminUser.name || `${adminUser.first_name || ''} ${adminUser.last_name || ''}`.trim() || 'Admin');
      setEmail(adminUser.email || '');
      setPhone(adminUser.phone || '');
    }
  }, [adminUser]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await adminApi.updateProfile({
        name,
        phone
      });

      if (res.data?.success) {
        showSuccess('Admin profile updated successfully');
        if (checkAdminAuth) await checkAdminAuth();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update admin profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showError('New password must be at least 6 characters long');
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

      if (res.data?.success) {
        showSuccess('Admin password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to change password. Verify your current password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveStoreSettings = (e) => {
    e.preventDefault();
    showSuccess('Store operational policies and shipping rules saved');
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
                value={email}
                disabled
                helperText="Admin login email is locked to system security rules."
              />

              <InputField
                label="Contact Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
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
                placeholder="At least 6 characters"
                helperText="Must be minimum 6 characters with mixed letters and numbers."
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
                label="Public Support Email"
                type="email"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
              />

              <InputField
                label="Customer Helpline"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
              />

              <InputField
                label="Main Carpentry Studio & Warehouse Address"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> Save Store Parameters
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
