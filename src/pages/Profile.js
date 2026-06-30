import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../utils/api';
import { toast } from 'react-toastify';
import './Auth.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', password: '' });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('phone', form.phone);
      if (form.password) fd.append('password', form.password);
      if (avatar) fd.append('avatar', avatar);
      const { data } = await updateProfile(fd);
      updateUser(data);
      toast.success('Profile updated!');
      setForm(f => ({ ...f, password: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Edit Profile</h1>
          <p>Update your personal information</p>
        </div>
      </div>

      <div className="auth-page" style={{background:'var(--off-white)'}}>
        <div className="auth-card" style={{maxWidth:'500px'}}>
          <div className="auth-header">
            <img
              src={avatar ? URL.createObjectURL(avatar) : (user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&size=80`)}
              alt="" style={{width:'80px', height:'80px', borderRadius:'50%', objectFit:'cover', border:'3px solid var(--gold)', marginBottom:'0.5rem'}}
            />
            <h1>{user?.name}</h1>
            <p>{user?.email}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Profile Photo</label>
              <input type="file" accept="image/*" className="form-control" onChange={(e) => setAvatar(e.target.files[0])} />
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" className="form-control" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>New Password <span style={{color:'var(--gray-400)', fontSize:'0.8rem'}}>(leave blank to keep current)</span></label>
              <input type="password" name="password" className="form-control" placeholder="New password..."
                value={form.password} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
