/**
 * Client-side validation helpers matching backend rules.
 */

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim().toLowerCase());
}

export function isValidPassword(password) {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
}

export function isValidPhone(phone) {
  if (!phone) return true; // Optional in some forms
  const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
  return phoneRegex.test(String(phone).trim());
}

export function isValidPincode(pincode) {
  if (!pincode) return false;
  return String(pincode).trim().length >= 4;
}
