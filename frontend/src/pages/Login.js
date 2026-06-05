import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Coffee, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back! ☕');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'center', marginBottom:24 }}>
          <Coffee size={34} color="#d4762a" />
          <span style={{ fontFamily:'Playfair Display, serif', fontSize:24, fontWeight:700, color:'#4a2c2a' }}>BrewHaven</span>
        </div>
        <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'1.8rem', color:'#2c1a1a', textAlign:'center', marginBottom:6 }}>Welcome Back</h2>
        <p style={{ color:'#8d7b72', textAlign:'center', marginBottom:28, fontSize:14 }}>Sign in to your account to continue</p>

        <form onSubmit={submit}>
          <div className="form-field">
            <label className="form-label">Username</label>
            <input name="username" value={form.username} onChange={handle} placeholder="Enter username" required className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Password</label>
            <div style={{ position:'relative' }}>
              <input name="password" type={show ? 'text' : 'password'} value={form.password} onChange={handle} placeholder="Enter password" required className="form-input" style={{ paddingRight:44 }} />
              <button type="button" onClick={() => setShow(!show)} style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#8d7b72' }}>
                {show ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="submit-btn">{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>

        <div style={{ background:'#f5efe6', borderRadius:10, padding:'12px 16px', fontSize:13, color:'#4a2c2a', marginTop:20, textAlign:'center', lineHeight:1.7 }}>
          <strong>Demo:</strong> username: <code>demo</code> | password: <code>demo123</code>
        </div>
        <p style={{ textAlign:'center', marginTop:20, fontSize:14, color:'#8d7b72' }}>
          Don't have an account? <Link to="/register" style={{ color:'#d4762a', fontWeight:700, textDecoration:'none' }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
