import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../api';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart, total, count } = useCart();
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState('dine_in');
  const [tableId, setTableId] = useState('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [payment, setPayment] = useState('cash');
  const [loading, setLoading] = useState(false);

  const tax = total * 0.05;
  const grandTotal = total + tax;

  const placeOrder = async () => {
    if (!isAuth) { toast.error('Please login to place an order'); navigate('/login'); return; }
    if (cart.length === 0) { toast.error('Cart is empty'); return; }
    setLoading(true);
    try {
      await orderAPI.create({
        order_type: orderType,
        table_id: tableId ? parseInt(tableId) : null,
        delivery_address: address,
        special_instructions: instructions,
        payment_method: payment,
        items: cart.map(c => ({ menu_item_id: c.id, quantity: c.quantity, size: c.size })),
      });
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/orders');
    } catch { toast.error('Failed to place order. Try again.'); }
    finally { setLoading(false); }
  };

  if (cart.length === 0) return (
    <div style={{ textAlign:'center', padding:'100px 24px', display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
      <div style={{ fontSize:72 }}>🛒</div>
      <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'1.9rem', color:'#2c1a1a' }}>Your cart is empty</h2>
      <p style={{ color:'#8d7b72', fontSize:15 }}>Add some delicious items from our menu!</p>
      <Link to="/menu" className="btn-primary" style={{ marginTop:8 }}>Browse Menu</Link>
    </div>
  );

  return (
    <div>
      <div className="page-hero">
        <h1>Your Cart</h1>
        <p>{count} item{count !== 1 ? 's' : ''} ready to order</p>
      </div>

      <div className="cart-page-grid">
        {/* Cart Items */}
        <div>
          <h3 style={{ fontFamily:'Playfair Display, serif', fontSize:'1.3rem', marginBottom:18, color:'#2c1a1a' }}>Order Items</h3>
          {cart.map(item => (
            <div key={`${item.id}-${item.size}`} className="cart-item">
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:15, color:'#2c1a1a', marginBottom:3 }}>{item.name}</div>
                <div style={{ fontSize:12, color:'#8d7b72' }}>Size: {item.size} &nbsp;|&nbsp; ₹{item.price} each</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <button onClick={() => updateQty(item.id, item.size, item.quantity - 1)} style={{ width:28, height:28, borderRadius:'50%', border:'2px solid #e8ddd4', background:'#f5efe6', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#4a2c2a' }}><Minus size={13} /></button>
                <span style={{ fontWeight:700, fontSize:15, minWidth:18, textAlign:'center' }}>{item.quantity}</span>
                <button onClick={() => updateQty(item.id, item.size, item.quantity + 1)} style={{ width:28, height:28, borderRadius:'50%', border:'2px solid #e8ddd4', background:'#f5efe6', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#4a2c2a' }}><Plus size={13} /></button>
              </div>
              <span style={{ fontWeight:700, fontSize:15, color:'#4a2c2a', minWidth:65, textAlign:'right' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
              <button onClick={() => removeFromCart(item.id, item.size)} style={{ background:'#ffebee', border:'none', color:'#e53935', width:30, height:30, borderRadius:'50%', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="summary-card">
          <h3 style={{ fontFamily:'Playfair Display, serif', fontSize:'1.3rem', marginBottom:22, color:'#2c1a1a' }}>Order Details</h3>

          <div className="form-field">
            <label className="form-label">Order Type</label>
            <select value={orderType} onChange={e => setOrderType(e.target.value)} className="form-select">
              <option value="dine_in">Dine In</option>
              <option value="takeaway">Takeaway</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          {orderType === 'dine_in' && (
            <div className="form-field">
              <label className="form-label">Table Number</label>
              <input value={tableId} onChange={e => setTableId(e.target.value)} placeholder="e.g., 3" type="number" className="form-input" />
            </div>
          )}

          {orderType === 'delivery' && (
            <div className="form-field">
              <label className="form-label">Delivery Address</label>
              <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter full delivery address" rows={3} className="form-textarea" />
            </div>
          )}

          <div className="form-field">
            <label className="form-label">Special Instructions</label>
            <textarea value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="e.g., extra shot, no sugar" rows={2} className="form-textarea" />
          </div>

          <div className="form-field">
            <label className="form-label">Payment Method</label>
            <select value={payment} onChange={e => setPayment(e.target.value)} className="form-select">
              <option value="cash">Cash on Delivery</option>
              <option value="card">Credit/Debit Card</option>
              <option value="upi">UPI</option>
              <option value="wallet">Digital Wallet</option>
            </select>
          </div>

          {/* Price Breakdown */}
          <div style={{ background:'#f5efe6', borderRadius:12, padding:'16px 14px', margin:'16px 0' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:14 }}><span>Subtotal</span><span>₹{total.toFixed(2)}</span></div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:14 }}><span>GST (5%)</span><span>₹{tax.toFixed(2)}</span></div>
            <hr style={{ border:'none', borderTop:'1px solid #e8ddd4', margin:'10px 0' }} />
            <div style={{ display:'flex', justifyContent:'space-between', fontWeight:800, fontSize:18, color:'#4a2c2a' }}><span>Total</span><span>₹{grandTotal.toFixed(2)}</span></div>
          </div>

          <button className="submit-btn" onClick={placeOrder} disabled={loading}>
            <ShoppingBag size={17} /> {loading ? 'Placing Order...' : 'Place Order'}
          </button>
          <button onClick={clearCart} style={{ width:'100%', background:'transparent', color:'#8d7b72', border:'2px solid #e8ddd4', padding:'11px', borderRadius:50, fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans, sans-serif', marginTop:10 }}>Clear Cart</button>
        </div>
      </div>
    </div>
  );
}
