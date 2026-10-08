import { useState, useEffect } from 'react';
import { Save, User, Mail, Phone, Camera, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import customerApi from '../../services/customerApi';
import InputField from '../../components/forms/InputField';
import FileUploadField from '../../components/forms/FileUploadField';
import { useToast } from '../../context/ToastContext';
import { getImageUrl } from '../../utils/imageUrl';

export function MyProfilePage() {
  const { customer, updateCustomerState } = useAuth();
  const { success, error: toastError } = useToast();

  const [name, setName] = useState(customer?.name || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (customer) {
      setName(customer.name || '');
      setPhone(customer.phone || '');
    }
  }, [customer]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toastError('Name is required.');
      return;
    }

    const trimmedPhone = phone.trim();
    if (trimmedPhone && !/^[0-9+\-\s()]{7,20}$/.test(trimmedPhone)) {
      toastError('Please provide a valid phone number.');
      return;
    }

    const payload = new FormData();
    payload.append('name', name.trim());
    payload.append('phone', trimmedPhone);
    if (profileImageFile) {
      payload.append('profile_image', profileImageFile);
    }

    try {
      setIsSaving(true);
      const res = await customerApi.updateProfile(payload);
      if (res.success && res.customer) {
        updateCustomerState(res.customer);
        success('Profile updated successfully!');
        setProfileImageFile(null);
      }
    } catch (err) {
      toastError(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="surface-card" style={{ maxWidth: '650px', padding: '2.5rem' }}>
      <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--neutral-200)' }}>
        <h2>My Profile & Personal Info</h2>
        <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem' }}>
          Manage your account profile, avatar, and contact details.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 'var(--radius-full)',
            background: 'var(--primary-100)',
            color: 'var(--primary-800)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            fontWeight: 700,
            overflow: 'hidden',
            border: '2px solid var(--primary-300)',
          }}
        >
          {customer?.profile_image ? (
            <img
              src={getImageUrl(customer.profile_image)}
              alt={customer.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            customer?.name?.charAt(0)?.toUpperCase() || 'C'
          )}
        </div>

        <div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--neutral-900)' }}>
            {customer?.name}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--neutral-500)' }}>{customer?.email}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--neutral-400)', marginTop: 2 }}>
            Account Status: <span style={{ color: 'var(--success-500)', fontWeight: 600 }}>Active</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <InputField
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          required
        />

        <InputField
          label="Email Address (Linked to Account)"
          value={customer?.email || ''}
          disabled
          hint="Email address cannot be changed directly."
        />

        <InputField
          label="Phone Number"
          type="tel"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
          autoComplete="tel"
          hint="You can update the phone number on this account."
        />

        <FileUploadField
          label="Update Profile Avatar"
          onChange={setProfileImageFile}
          hint="Upload a new square avatar photo (PNG or JPG)"
        />

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary btn-md" disabled={isSaving}>
            <Save size={16} />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default MyProfilePage;
