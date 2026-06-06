import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import { orderAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending:   { bg:'#fff3e0', color:'#f57c00' },
  confirmed: { bg:'#e3f2fd', color:'#1565c0' },
  preparing: { bg:'#f3e5f5', color:'#6a1b9a' },
  ready:     { bg:'#e8f5e9', color:'#2e7d32' },
  delivered: { bg:'#e8f5e9', color:'#1b5e20' },
  cancelled: { bg:'#ffebee', color:'#c62828' },
};

export default function Orders() {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!isAuth) { navigate('/login'); return; }
    orderAPI.list().then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [isAuth,navigate]);

  const cancel = async id => {
    try {
      await orderAPI.cancel(id);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status:'cancelled' } : o));
      toast.success('Order cancelled');
    } catch { toast.error('Cannot cancel this order'); }
  };

  if (loading) return <div className="spinner" />;

  if (orders.length === 0) return (
    <div style={{ textAlign:'center', padding:'100px 24px', display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
      <Package size={68} color="var(--latte)" />
      <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'1.9rem', color:'var(--text)' }}>No orders yet</h2>
      <p style={{ color:'var(--text-soft)', fontSize:15 }}>Start exploring our menu and place your first order!</p>
      <Link to="/menu" className="btn-primary" style={{ marginTop:8 }}>Browse Menu</Link>
    </div>
  );

  return (
    <div>
      <div className="page-hero">
        <h1>My Orders</h1>
        <p>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
      </div>

      <div className="orders-container">
        {orders.map(order => {
          const sc   = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
          const open = expanded === order.id;
          return (
            <div key={order.id} className="order-card">
              <div className="order-card-head" onClick={() => setExpanded(open ? null : order.id)}>
                <div className="order-info">
                  <span style={{ fontWeight:800, fontSize:15, color:'var(--text)' }}>Order #{order.id}</span>
                  <span className="status-badge" style={{ background:sc.bg, color:sc.color }}>{order.status.toUpperCase()}</span>
                  <span style={{ fontSize:12, color:'var(--text-soft)', fontWeight:600, textTransform:'capitalize' }}>{order.order_type.replace('_',' ')}</span>
                </div>
                <div className="order-meta">
                  <span style={{ fontWeight:800, fontSize:17, color:'var(--text)' }}>₹{parseFloat(order.total_amount).toFixed(2)}</span>
                  <span style={{ fontSize:12, color:'var(--text-soft)' }}>{new Date(order.created_at).toLocaleDateString('en-IN',{ day:'numeric', month:'short', year:'numeric' })}</span>
                  {open ? <ChevronUp size={18} color="var(--text-soft)" /> : <ChevronDown size={18} color="var(--text-soft)" />}
                </div>
              </div>
              {open && (
                <div style={{ borderTop:'1px solid var(--border)', padding:'18px 20px' }}>
                  <h4 style={{ fontWeight:700, marginBottom:12, color:'var(--text)', fontSize:14 }}>Items Ordered</h4>
                  {order.items.map(item => (
                    <div key={item.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 12px', background:'var(--tag-bg)', borderRadius:8, marginBottom:8, gap:8, flexWrap:'wrap' }}>
                      <span style={{ fontWeight:600, fontSize:14, color:'var(--text)', flex:1 }}>{item.menu_item_name}</span>
                      <span style={{ fontSize:13, color:'var(--text-soft)' }}>x{item.quantity} (Size: {item.size})</span>
                      <span style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>₹{parseFloat(item.subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="meta-grid" style={{ marginTop:14 }}>
                    {[['Payment', order.payment_method.toUpperCase()], ['Tax (5%)', '₹' + parseFloat(order.tax).toFixed(2)]].map(([k,v]) => (
                      <div key={k} style={{ background:'var(--tag-bg)', borderRadius:10, padding:'11px 14px' }}>
                        <div style={{ fontSize:11, color:'var(--text-soft)', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>{k}</div>
                        <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {order.special_instructions && (
                    <div style={{ background:'var(--tag-bg)', borderRadius:10, padding:'10px 14px', fontSize:13, color:'var(--text)', marginTop:10 }}>
                      <strong>Instructions:</strong> {order.special_instructions}
                    </div>
                  )}
                  {['pending','confirmed'].includes(order.status) && (
                    <button onClick={() => cancel(order.id)} style={{ marginTop:14, background:'#ffebee', color:'#e53935', border:'none', padding:'9px 20px', borderRadius:50, fontWeight:700, cursor:'pointer', fontFamily:'DM Sans,sans-serif', fontSize:14 }}>
                      Cancel Order
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
