import React, { useState, useEffect } from 'react';
import { Tag, Copy, CheckCheck } from 'lucide-react';
import { offerAPI } from '../api';
import toast from 'react-hot-toast';

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    offerAPI.list().then(r => setOffers(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const copy = code => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(code);
      toast.success(`Code "${code}" copied!`);
      setTimeout(() => setCopied(''), 2500);
    });
  };

  return (
    <div>
      <div className="page-hero">
        <div style={{ fontSize:52, marginBottom:14 }}>🎉</div>
        <h1>Special Offers</h1>
        <p>Exclusive deals and discounts — just for you!</p>
      </div>

      <div className="container" style={{ padding:'56px 24px' }}>
        {loading ? (
          <div className="spinner" />
        ) : offers.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
            <Tag size={56} color="#c8a882" />
            <h3 style={{ fontFamily:'Playfair Display, serif', color:'#2c1a1a' }}>No active offers right now</h3>
            <p style={{ color:'#8d7b72' }}>Check back soon for exciting deals!</p>
          </div>
        ) : (
          <div className="offers-grid">
            {offers.map(o => (
              <div key={o.id} style={{ background:'linear-gradient(135deg, #2c1a1a 0%, #4a2c2a 100%)', borderRadius:22, padding:'32px 28px', color:'#fff', boxShadow:'0 8px 32px rgba(74,44,42,0.3)' }}>
                <div style={{ display:'inline-block', background:'#d4762a', color:'#fff', padding:'5px 18px', borderRadius:50, fontWeight:900, fontSize:28, marginBottom:16, lineHeight:1.4 }}>
                  {o.discount_percent}% <span style={{ fontSize:16, fontWeight:500 }}>OFF</span>
                </div>
                <h3 style={{ fontFamily:'Playfair Display, serif', fontSize:19, marginBottom:10 }}>{o.title}</h3>
                <p style={{ fontSize:14, opacity:0.85, lineHeight:1.7, marginBottom:22 }}>{o.description}</p>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, flexWrap:'wrap' }}>
                  <span style={{ background:'rgba(255,255,255,0.1)', border:'1.5px dashed rgba(255,255,255,0.4)', padding:'10px 18px', borderRadius:8, fontWeight:800, fontSize:17, letterSpacing:3, flex:1, textAlign:'center', minWidth:120 }}>
                    {o.code}
                  </span>
                  <button onClick={() => copy(o.code)} style={{ display:'flex', alignItems:'center', gap:6, background:'#d4762a', color:'#fff', border:'none', padding:'11px 18px', borderRadius:10, fontWeight:700, cursor:'pointer', fontSize:14, fontFamily:'DM Sans, sans-serif', whiteSpace:'nowrap' }}>
                    {copied === o.code ? <><CheckCheck size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                  </button>
                </div>
                {o.min_order_amount > 0 && <p style={{ fontSize:12, opacity:0.7, marginBottom:4 }}>Min. order: ₹{o.min_order_amount}</p>}
                <p style={{ fontSize:11, opacity:0.55 }}>
                  Valid until {new Date(o.valid_until).toLocaleDateString('en-IN',{ day:'numeric', month:'long', year:'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
