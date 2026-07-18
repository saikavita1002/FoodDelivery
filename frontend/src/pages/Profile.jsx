import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../services/userService';

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', mobile: user?.mobile || '', address: user?.address || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [pwMessage, setPwMessage] = useState('');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await updateProfile(form);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwMessage('');
    try {
      await changePassword(pwForm);
      setPwMessage('Password changed successfully.');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPwMessage(err.response?.data?.message || 'Password change failed');
    }
  };

  return (
    <div className="page auth-page">
      <form className="auth-form" onSubmit={handleProfileSubmit}>
        <h2>My Profile</h2>
        <label>Email</label>
        <input value={user?.email} disabled />

        <label>Name</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <label>Mobile</label>
        <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />

        <label>Address</label>
        <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />

        {message && <p className="success-text">{message}</p>}
        <button type="submit">Save Changes</button>
      </form>

      <form className="auth-form" onSubmit={handlePasswordSubmit}>
        <h2>Change Password</h2>
        <label>Current Password</label>
        <input
          type="password"
          value={pwForm.currentPassword}
          onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
          required
        />
        <label>New Password</label>
        <input
          type="password"
          value={pwForm.newPassword}
          onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
          minLength={6}
          required
        />
        {pwMessage && <p className={pwMessage.includes('success') ? 'success-text' : 'error-text'}>{pwMessage}</p>}
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default Profile;
