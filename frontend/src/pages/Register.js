import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Coffee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ username:'', email:'', first_name:'', last_name:'', password:'', password2:'' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    if (form.password !== form.password2) { toast.error("Passwords don't match"); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success('Welcome to BrewHaven! ☕');
      navigate('/');
    } catch (err) {
      const errs = err.response?.data;
      if (errs) Object.values(errs).flat().forEach(m => toast.error(m));
      else toast.error('Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth:500 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'center', marginBottom:22 }}>
          <Coffee size={32} color="#d4762a" />
          <span style={{ fontFamily:'Playfair Display, serif', fontSize:22, fontWeight:700, color:'#4a2c2a' }}>BrewHaven</span>
        </div>
        <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'1.7rem', color:'#2c1a1a', textAlign:'center', marginBottom:6 }}>Create Account</h2>
        <p style={{ color:'#8d7b72', textAlign:'center', marginBottom:26, fontSize:14 }}>Join BrewHaven for exclusive benefits</p>

        <form onSubmit={submit}>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">First Name</label>
              <input name="first_name" value={form.first_name} onChange={handle} placeholder="John" className="form-input" />
            </div>
            <div className="form-field">
              <label className="form-label">Last Name</label>
              <input name="last_name" value={form.last_name} onChange={handle} placeholder="Doe" className="form-input" />
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Username *</label>
            <input name="username" value={form.username} onChange={handle} placeholder="yourusername" required className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Email *</label>
            <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" required className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Password *</label>
            <input name="password" type="password" value={form.password} onChange={handle} placeholder="Min 6 characters" required className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Confirm Password *</label>
            <input name="password2" type="password" value={form.password2} onChange={handle} placeholder="Repeat password" required className="form-input" />
          </div>
          <button type="submit" disabled={loading} className="submit-btn">{loading ? 'Creating Account...' : 'Create Account'}</button>
        </form>

        <p style={{ textAlign:'center', marginTop:20, fontSize:14, color:'#8d7b72' }}>
          Already have an account? <Link to="/login" style={{ color:'#d4762a', fontWeight:700, textDecoration:'none' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
