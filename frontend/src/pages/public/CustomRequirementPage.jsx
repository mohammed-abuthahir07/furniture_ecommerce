import { useState } from 'react';
import { Send, CheckCircle2, Sparkles, Armchair } from 'lucide-react';
import publicApi from '../../services/publicApi';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import InputField from '../../components/forms/InputField';
import TextAreaField from '../../components/forms/TextAreaField';
import FileUploadField from '../../components/forms/FileUploadField';
import { useToast } from '../../context/ToastContext';
import { isValidEmail } from '../../utils/validators';

export function CustomRequirementPage() {
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    alternative_address: '',
    requirement: '',
  });
  const [referenceImage, setReferenceImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.requirement.trim()) {
      toastError('Please fill in all required fields.');
      return;
    }

    if (!isValidEmail(formData.email)) {
      toastError('Please enter a valid email address.');
      return;
    }

    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        payload.append(key, formData[key]);
      }
    });

    if (referenceImage) {
      payload.append('reference_image', referenceImage);
    }

    try {
      setIsSubmitting(true);
      const res = await publicApi.submitCustomRequirement(payload);
      if (res.success) {
        success('Your custom furniture requirement has been received!');
        setIsSubmittedSuccess(true);
        setSubmittedId(res.data?.id || res.id);
      }
    } catch (err) {
      toastError(err.message || 'Failed to submit requirement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [
    { label: 'Custom Furniture Studio', to: '/custom-requirement' },
  ];

  return (
    <div className="container">
      <Breadcrumbs items={breadcrumbs} />

      <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={13} /> Bespoke Furniture Studio
          </div>
          <h1>Submit Your Custom Furniture Requirement</h1>
          <p style={{ color: 'var(--neutral-600)', fontSize: '1rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
            Share your space measurements, preferred timber (Sheesham, Teak, Walnut), room blueprint,
            or reference sketches. Our master architects and craftsmen will evaluate your request.
          </p>
        </div>

        {isSubmittedSuccess ? (
          <div
            className="surface-card"
            style={{ textAlign: 'center', padding: '3.5rem 2rem', border: '2px solid var(--success-500)' }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 'var(--radius-full)',
                background: 'var(--success-50)',
                color: 'var(--success-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ color: 'var(--neutral-900)', marginBottom: '0.75rem' }}>
              Requirement Submitted Successfully!
            </h2>
            <p style={{ color: 'var(--neutral-600)', maxWidth: '500px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
              Thank you for trusting WoodCraft Studio. Our design consultant will review your specifications
              and reach out via email or phone within 24-48 business hours.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setIsSubmittedSuccess(false);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                    city: '',
                    state: '',
                    pincode: '',
                    alternative_address: '',
                    requirement: '',
                  });
                  setReferenceImage(null);
                }}
              >
                Submit Another Requirement
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="surface-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--neutral-200)' }}>
              1. Contact Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <InputField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                required
              />
              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. rahul@example.com"
                required
              />
            </div>

            <InputField
              label="Phone / Mobile Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +91 9876543210"
              required
            />

            <h3 style={{ fontSize: '1.2rem', margin: '2rem 0 1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--neutral-200)' }}>
              2. Delivery Location / Site Address
            </h3>

            <InputField
              label="Primary Delivery Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="House/Apartment number, Street, Landmark"
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <InputField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
              />
              <InputField
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
              />
              <InputField
                label="PIN Code"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="6-digit PIN"
              />
            </div>

            <InputField
              label="Alternative Address / Site Notes (Optional)"
              name="alternative_address"
              value={formData.alternative_address}
              onChange={handleChange}
              placeholder="Floor number, elevator availability, etc."
            />

            <h3 style={{ fontSize: '1.2rem', margin: '2rem 0 1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--neutral-200)' }}>
              3. Furniture Requirement Details
            </h3>

            <TextAreaField
              label="Detailed Custom Specifications"
              name="requirement"
              rows={5}
              placeholder="Describe the type of furniture (e.g., 6-seater solid teak dining table, specific dimensions 72x36x30 in, walnut finish, live edge wood top, metal legs)..."
              value={formData.requirement}
              onChange={handleChange}
              required
            />

            <FileUploadField
              label="Upload Reference Sketch / Room Photo (Optional)"
              name="reference_image"
              onChange={setReferenceImage}
              hint="Attach blueprints, Pinterest references, or space photos (PNG, JPG up to 5MB)"
            />

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={isSubmitting}
                style={{ minWidth: '220px' }}
              >
                <Send size={18} />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Custom Order'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CustomRequirementPage;
