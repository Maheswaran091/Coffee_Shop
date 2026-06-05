import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { tableAPI, bookingAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Booking() {
  const { isAuth } = useAuth();
  const navigate   = useNavigate();
  const [tables, setTables]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors,  setErrors]  = useState({});

  const [tableId,        setTableId]        = useState('');
  const [bookingDate,    setBookingDate]    = useState('');
  const [startTime,      setStartTime]      = useState('');
  const [endTime,        setEndTime]        = useState('');
  const [guests,         setGuests]         = useState(2);
  const [specialReqs,    setSpecialReqs]    = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    tableAPI.list()
      .then(r => {
        const avail = r.data.filter(t => t.status === 'available');
        setTables(avail);
        if (avail.length > 0) setTableId(avail[0].id);
      })
      .catch(() => toast.error('Could not load tables'));
  }, []);

  const validate = () => {
    const e = {};
    if (!tableId)    e.tableId    = 'Please select a table';
    if (!bookingDate) e.bookingDate = 'Please pick a date';
    if (!startTime)  e.startTime  = 'Please set a start time';
    if (!endTime)    e.endTime    = 'Please set an end time';
    if (startTime && endTime && startTime >= endTime)
      e.endTime = 'End time must be after start time';
    if (!guests || guests < 1)
      e.guests = 'At least 1 guest required';
    return e;
  };

  const submit = async e => {
    e.preventDefault();
    if (!isAuth) { toast.error('Please login first'); navigate('/login'); return; }

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('Please fill all required fields');
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      // Build payload — keys must match DeskBookingSerializer exactly
      const payload = {
        table_id:         Number(tableId),
        booking_date:     bookingDate,               // "YYYY-MM-DD"
        start_time:       startTime.length === 5     // "HH:MM" → "HH:MM:00"
                            ? startTime + ':00'
                            : startTime,
        end_time:         endTime.length === 5
                            ? endTime + ':00'
                            : endTime,
        number_of_guests: Number(guests),
        special_requests: specialReqs,
      };

      await bookingAPI.create(payload);
      setSuccess(true);
      toast.success('Table booked successfully! 🎉');
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        // Show each backend error as a toast
        Object.entries(data).forEach(([field, msgs]) => {
          const msg = Array.isArray(msgs) ? msgs.join(', ') : String(msgs);
          toast.error(`${field}: ${msg}`);
        });
      } else {
        toast.error('Booking failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSuccess(false);
    setErrors({});
    setTableId(tables.length > 0 ? tables[0].id : '');
    setBookingDate('');
    setStartTime('');
    setEndTime('');
    setGuests(2);
    setSpecialReqs('');
  };

  // ---------- SUCCESS SCREEN ----------
  if (success) return (
    <div style={{ minHeight:'70vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24, background:'#f5efe6' }}>
      <div style={{ background:'#fff', borderRadius:24, padding:'48px 36px', textAlign:'center', boxShadow:'0 8px 40px rgba(74,44,42,0.15)', maxWidth:420, width:'100%' }}>
        <CheckCircle size={72} color="#4caf50" />
        <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'1.9rem', margin:'20px 0 12px', color:'#2c1a1a' }}>Booking Confirmed!</h2>
        <p style={{ color:'#8d7b72', fontSize:15, marginBottom:32, lineHeight:1.7 }}>Your table has been reserved. See you at BrewHaven!</p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <button className="btn-primary" onClick={() => navigate('/bookings')}>View My Bookings</button>
          <button className="btn-outline" onClick={reset}>Book Another</button>
        </div>
      </div>
    </div>
  );

  // ---------- BOOKING FORM ----------
  return (
    <div>
      <div className="page-hero">
        <h1>Reserve Your Table</h1>
        <p>Book your perfect spot — indoor, outdoor &amp; private rooms available.</p>
      </div>

      <div className="booking-grid">
        {/* FORM */}
        <div className="form-card">
          <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:'1.4rem', marginBottom:24, color:'#2c1a1a' }}>Booking Details</h3>

          <form onSubmit={submit} noValidate>

            {/* TABLE */}
            <div className="form-field">
              <label className="form-label">Select Table *</label>
              <select
                value={tableId}
                onChange={e => { setTableId(Number(e.target.value)); setErrors(p => ({...p, tableId:''})); }}
                className="form-select"
                style={errors.tableId ? { borderColor:'#e53935' } : {}}
              >
                <option value="">-- Choose a table --</option>
                {tables.map(t => (
                  <option key={t.id} value={t.id}>
                    Table {t.table_number} — {t.location} (seats {t.capacity})
                    {t.has_window_view  ? ' | 🪟 Window View'  : ''}
                    {t.has_power_outlet ? ' | 🔌 Power Outlet' : ''}
                  </option>
                ))}
              </select>
              {errors.tableId && <span style={errStyle}>{errors.tableId}</span>}
            </div>

            {/* DATE + GUESTS */}
            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={e => { setBookingDate(e.target.value); setErrors(p => ({...p, bookingDate:''})); }}
                  min={today}
                  className="form-input"
                  style={errors.bookingDate ? { borderColor:'#e53935' } : {}}
                />
                {errors.bookingDate && <span style={errStyle}>{errors.bookingDate}</span>}
              </div>
              <div className="form-field">
                <label className="form-label">Number of Guests *</label>
                <input
                  type="number"
                  value={guests}
                  onChange={e => { setGuests(Number(e.target.value)); setErrors(p => ({...p, guests:''})); }}
                  min="1" max="20"
                  className="form-input"
                  style={errors.guests ? { borderColor:'#e53935' } : {}}
                />
                {errors.guests && <span style={errStyle}>{errors.guests}</span>}
              </div>
            </div>

            {/* START + END TIME */}
            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Start Time *</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={e => { setStartTime(e.target.value); setErrors(p => ({...p, startTime:''})); }}
                  className="form-input"
                  style={errors.startTime ? { borderColor:'#e53935' } : {}}
                />
                {errors.startTime && <span style={errStyle}>{errors.startTime}</span>}
              </div>
              <div className="form-field">
                <label className="form-label">End Time *</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={e => { setEndTime(e.target.value); setErrors(p => ({...p, endTime:''})); }}
                  className="form-input"
                  style={errors.endTime ? { borderColor:'#e53935' } : {}}
                />
                {errors.endTime && <span style={errStyle}>{errors.endTime}</span>}
              </div>
            </div>

            {/* SPECIAL REQUESTS */}
            <div className="form-field">
              <label className="form-label">Special Requests <span style={{ color:'#8d7b72', fontWeight:400 }}>(optional)</span></label>
              <textarea
                value={specialReqs}
                onChange={e => setSpecialReqs(e.target.value)}
                placeholder="Birthday? Anniversary? High chair needed?"
                rows={3}
                className="form-textarea"
              />
            </div>

            {!isAuth && (
              <div style={{ background:'#fff3e0', borderRadius:10, padding:'12px 16px', fontSize:14, color:'#4a2c2a', marginBottom:16, border:'1px solid #ffe0b2' }}>
                🔒 Please <a href="/login" style={{ color:'#d4762a', fontWeight:700 }}>login</a> to book a table.
              </div>
            )}

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? '⏳ Booking...' : '✓ Confirm Booking'}
            </button>
          </form>
        </div>

        {/* INFO */}
        <div>
          <div className="form-card" style={{ marginBottom:20 }}>
            <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:'1.2rem', marginBottom:18, color:'#2c1a1a' }}>Table Options</h3>
            {[
              { icon:'🪟', title:'Window Seats',    desc:'City views with natural light',     seats:'2'   },
              { icon:'🛋️', title:'Indoor Tables',   desc:'Comfortable air-conditioned seating', seats:'2–6' },
              { icon:'🌿', title:'Outdoor Patio',   desc:'Open-air seating for fresh air',    seats:'2–4' },
              { icon:'🤝', title:'Conference Room', desc:'Perfect for meetings & groups',     seats:'8'   },
            ].map(t => (
              <div key={t.title} style={{ display:'flex', gap:12, marginBottom:14, padding:12, borderRadius:10, background:'#f5efe6', alignItems:'flex-start' }}>
                <span style={{ fontSize:22, flexShrink:0 }}>{t.icon}</span>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:'#2c1a1a' }}>{t.title} <span style={{ fontSize:12, color:'#8d7b72', fontWeight:400 }}>({t.seats} seats)</span></div>
                  <div style={{ fontSize:13, color:'#8d7b72', marginTop:2 }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background:'#1a0f0f', color:'#f5efe6', borderRadius:18, padding:'22px 24px' }}>
            <h4 style={{ fontFamily:'Playfair Display,serif', fontSize:'1.1rem', marginBottom:16 }}>⏰ Opening Hours</h4>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10, fontSize:14, flexWrap:'wrap', gap:6 }}>
              <span style={{ opacity:0.8 }}>Monday – Friday</span><strong>7:00 AM – 10:00 PM</strong>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, flexWrap:'wrap', gap:6 }}>
              <span style={{ opacity:0.8 }}>Saturday – Sunday</span><strong>8:00 AM – 11:00 PM</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const errStyle = { color:'#e53935', fontSize:12, marginTop:5, display:'block', fontWeight:600 };
