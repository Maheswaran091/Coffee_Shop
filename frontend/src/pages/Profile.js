import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { authAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { isAuth, user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ phone:'', address:'', avatar:'' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    if (!isAuth) { navigate('/login'); return; }
    authAPI.profile().then(r => {
      setProfile(r.data);
      setForm({ phone: r.data.phone || '', address: r.data.address || '', avatar: r.data.avatar || '' });
    }).catch(() => {}).finally(() => setLoading(false));
  }, [isAuth]);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const save = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile(form);
      setProfile(data);
      toast.success('Profile updated! ✅');
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <div className="page-hero">
        <div style={{ width:80, height:80, borderRadius:'50%', background:'var(--accent)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, fontWeight:900, margin:'0 auto 16px', border:'4px solid rgba(255,255,255,0.3)' }}>
          {user?.username?.[0]?.toUpperCase()}
        </div>
        <h1 style={{ fontSize:'clamp(1.6rem,4vw,2.4rem)' }}>{user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}</h1>
        <p>@{user?.username}</p>
      </div>

      <div className="profile-grid">
        <div className="form-card">
          <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:'1.2rem', marginBottom:22, color:'var(--text)' }}>Account Overview</h3>
          {[['Email', user?.email], ['Username','@'+user?.username], ['Loyalty Points','⭐ '+(profile?.loyalty_points||0)+' pts'], ['Phone', form.phone||'Not set']].map(([k,v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid var(--border)', fontSize:14, flexWrap:'wrap', gap:6 }}>
              <span style={{ color:'var(--text-soft)', fontWeight:600 }}>{k}</span>
              <strong style={{ color:'var(--accent)', wordBreak:'break-all', textAlign:'right' }}>{v}</strong>
            </div>
          ))}
        </div>

        <div className="form-card">
          <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:'1.2rem', marginBottom:22, color:'var(--text)' }}>Edit Profile</h3>
          <form onSubmit={save}>
            <div className="form-field">
              <label className="form-label">Phone Number</label>
              <input name="phone" value={form.phone} onChange={handle} placeholder="+91 98765 43210" className="form-input" />
            </div>
            <div className="form-field">
              <label className="form-label">Delivery Address</label>
              <textarea name="address" value={form.address} onChange={handle} placeholder="Your delivery address" rows={3} className="form-textarea" />
            </div>
            <div className="form-field">
              <label className="form-label">Avatar URL</label>
              <input name="avatar" value={form.avatar} onChange={handle} placeholder="https://..." className="form-input" />
            </div>
            <button type="submit" disabled={saving} className="submit-btn">
              <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
