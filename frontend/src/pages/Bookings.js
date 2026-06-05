import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarCheck, XCircle } from 'lucide-react';
import { bookingAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending:   { bg:'#fff3e0', color:'#f57c00' },
  confirmed: { bg:'#e8f5e9', color:'#2e7d32' },
  cancelled: { bg:'#ffebee', color:'#c62828' },
  completed: { bg:'#e3f2fd', color:'#1565c0' },
};

export default function Bookings() {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuth) { navigate('/login'); return; }
    bookingAPI.list().then(r => setBookings(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [isAuth]);

  const cancel = async id => {
    try {
      await bookingAPI.cancel(id);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status:'cancelled' } : b));
      toast.success('Booking cancelled');
    } catch { toast.error('Cannot cancel this booking'); }
  };

  if (loading) return <div className="spinner" />;

  if (bookings.length === 0) return (
    <div style={{ textAlign:'center', padding:'100px 24px', display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
      <CalendarCheck size={68} color="#c8a882" />
      <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'1.9rem', color:'#2c1a1a' }}>No bookings yet</h2>
      <p style={{ color:'#8d7b72', fontSize:15 }}>Reserve your favourite spot at BrewHaven!</p>
      <Link to="/booking" className="btn-primary" style={{ marginTop:8 }}>Book a Table</Link>
    </div>
  );

  return (
    <div>
      <div className="page-hero">
        <h1>My Bookings</h1>
        <p>{bookings.length} booking{bookings.length !== 1 ? 's' : ''} made</p>
      </div>

      <div className="orders-container">
        <div style={{ textAlign:'right', marginBottom:20 }}>
          <Link to="/booking" className="btn-primary" style={{ fontSize:14, padding:'10px 22px' }}>+ New Booking</Link>
        </div>

        {bookings.map(b => {
          const sc = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
          return (
            <div key={b.id} style={{ background:'#fff', borderRadius:18, padding:'22px 24px', marginBottom:18, boxShadow:'0 4px 20px rgba(74,44,42,0.1)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16, flexWrap:'wrap', gap:10 }}>
                <div>
                  <h3 style={{ fontFamily:'Playfair Display, serif', fontSize:'1.3rem', color:'#2c1a1a' }}>Table {b.table_detail?.table_number || b.table}</h3>
                  <p style={{ color:'#8d7b72', fontSize:13, marginTop:3 }}>{b.table_detail?.location}</p>
                </div>
                <span className="status-badge" style={{ background:sc.bg, color:sc.color }}>{b.status.toUpperCase()}</span>
              </div>

              <div className="meta-grid">
                <div style={{ background:'#f5efe6', borderRadius:10, padding:'11px 14px' }}>
                  <div style={{ fontSize:11, color:'#8d7b72', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>📅 Date</div>
                  <div style={{ fontWeight:700, fontSize:14, color:'#2c1a1a' }}>
                    {new Date(b.booking_date + 'T00:00:00').toLocaleDateString('en-IN',{ weekday:'short', day:'numeric', month:'long', year:'numeric' })}
                  </div>
                </div>
                <div style={{ background:'#f5efe6', borderRadius:10, padding:'11px 14px' }}>
                  <div style={{ fontSize:11, color:'#8d7b72', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>⏰ Time</div>
                  <div style={{ fontWeight:700, fontSize:14, color:'#2c1a1a' }}>{b.start_time} – {b.end_time}</div>
                </div>
                <div style={{ background:'#f5efe6', borderRadius:10, padding:'11px 14px' }}>
                  <div style={{ fontSize:11, color:'#8d7b72', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>👥 Guests</div>
                  <div style={{ fontWeight:700, fontSize:14, color:'#2c1a1a' }}>{b.number_of_guests} person{b.number_of_guests !== 1 ? 's' : ''}</div>
                </div>
                <div style={{ background:'#f5efe6', borderRadius:10, padding:'11px 14px' }}>
                  <div style={{ fontSize:11, color:'#8d7b72', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>🔌 Power Outlet</div>
                  <div style={{ fontWeight:700, fontSize:14, color:'#2c1a1a' }}>{b.table_detail?.has_power_outlet ? '✅ Available' : '❌ Not available'}</div>
                </div>
              </div>

              {b.special_requests && (
                <div style={{ background:'#fff3e0', borderRadius:10, padding:'10px 14px', fontSize:13, color:'#4a2c2a', marginTop:12 }}>
                  <strong>Special Requests:</strong> {b.special_requests}
                </div>
              )}

              {!['cancelled','completed'].includes(b.status) && (
                <button onClick={() => cancel(b.id)} style={{ display:'flex', alignItems:'center', gap:7, marginTop:14, background:'#ffebee', color:'#e53935', border:'none', padding:'9px 20px', borderRadius:50, fontWeight:700, cursor:'pointer', fontFamily:'DM Sans, sans-serif', fontSize:14 }}>
                  <XCircle size={15} /> Cancel Booking
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
