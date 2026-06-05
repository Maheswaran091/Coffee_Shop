import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { contactAPI } from '../api';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactAPI.send(form);
      setSent(true);
      toast.success('Message sent successfully!');
    } catch { toast.error('Failed to send. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-hero">
        <h1>Get in Touch</h1>
        <p>We'd love to hear from you. Send us a message anytime!</p>
      </div>

      <div className="contact-grid">
        {/* Info */}
        <div>
          <h3 style={{ fontFamily:'Playfair Display, serif', fontSize:'1.5rem', marginBottom:28, color:'#2c1a1a' }}>Visit Us</h3>
          {[
            { Icon:MapPin, title:'Address', val:'12 MG Road, Anna Nagar\nChennai - 600040, Tamil Nadu' },
            { Icon:Phone, title:'Phone', val:'+91 98765 43210' },
            { Icon:Mail, title:'Email', val:'hello@brewhaven.in' },
            { Icon:Clock, title:'Hours', val:'Mon–Fri: 7:00 AM – 10:00 PM\nSat–Sun: 8:00 AM – 11:00 PM' },
          ].map(({ Icon, title, val }) => (
            <div key={title} style={{ display:'flex', gap:14, marginBottom:24, alignItems:'flex-start' }}>
              <div style={{ width:44, height:44, borderRadius:12, background:'#f5efe6', display:'flex', alignItems:'center', justifyContent:'center', color:'#d4762a', flexShrink:0 }}>
                <Icon size={20} />
              </div>
              <div>
                <div style={{ fontWeight:700, fontSize:12, color:'#8d7b72', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>{title}</div>
                <div style={{ fontSize:15, color:'#2c1a1a', lineHeight:1.6, whiteSpace:'pre-line' }}>{val}</div>
              </div>
            </div>
          ))}

          {/* Map placeholder */}
          <div style={{ background:'#f5efe6', borderRadius:16, height:180, display:'flex', alignItems:'center', justifyContent:'center', marginTop:8 }}>
            <div style={{ textAlign:'center', color:'#8d7b72' }}>
              <MapPin size={36} color="#d4762a" />
              <p style={{ marginTop:8, fontSize:14 }}>12 MG Road, Anna Nagar<br />Chennai, Tamil Nadu</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="form-card">
          {sent ? (
            <div style={{ textAlign:'center', padding:'40px 16px' }}>
              <CheckCircle size={60} color="#4caf50" />
              <h3 style={{ fontFamily:'Playfair Display, serif', fontSize:'1.7rem', margin:'20px 0 12px', color:'#2c1a1a' }}>Message Sent!</h3>
              <p style={{ color:'#8d7b72', fontSize:15, marginBottom:28, lineHeight:1.6 }}>Thanks for reaching out. We'll reply within 24 hours.</p>
              <button className="btn-primary" onClick={() => { setSent(false); setForm({ name:'', email:'', subject:'', message:'' }); }}>Send Another</button>
            </div>
          ) : (
            <>
              <h3 style={{ fontFamily:'Playfair Display, serif', fontSize:'1.4rem', marginBottom:24, color:'#2c1a1a' }}>Send a Message</h3>
              <form onSubmit={submit}>
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Your Name *</label>
                    <input name="name" value={form.name} onChange={handle} placeholder="John Doe" required className="form-input" />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@email.com" required className="form-input" />
                  </div>
                </div>
                <div className="form-field">
                  <label className="form-label">Subject *</label>
                  <input name="subject" value={form.subject} onChange={handle} placeholder="How can we help?" required className="form-input" />
                </div>
                <div className="form-field">
                  <label className="form-label">Message *</label>
                  <textarea name="message" value={form.message} onChange={handle} placeholder="Write your message here..." rows={5} required className="form-textarea" />
                </div>
                <button type="submit" disabled={loading} className="submit-btn">
                  <Send size={16} /> {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
