import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Leaf, ChevronRight } from 'lucide-react';
import { menuAPI, offerAPI } from '../api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const IMGS = {
  coffee:'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80',
  cookies:'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80',
  cakes:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
  biscuits:'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80',
  snacks:'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80',
  beverages:'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80',
};
const ICONS = { coffee:'☕', cookies:'🍪', cakes:'🎂', biscuits:'🥐', snacks:'🥪', beverages:'🧋' };

export default function Home() {
  const [featured, setFeatured]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers]         = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    menuAPI.items({ featured: true }).then(r => setFeatured(r.data.slice(0, 6))).catch(() => {});
    menuAPI.categories().then(r => setCategories(r.data)).catch(() => {});
    offerAPI.list().then(r => setOffers(r.data)).catch(() => {});
  }, []);

  const handleAdd = item => { addToCart(item); toast.success(`${item.name} added!`, { icon:'☕' }); };

  return (
    <div>
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-tag">☕ Premium Coffee Experience</span>
          <h1 className="hero-h1">Every Cup Tells<br />a <span style={{ color:'var(--accent)' }}>Story</span></h1>
          <p className="hero-p">Handcrafted beverages, artisan pastries and warm ambiance. Your perfect coffee moment awaits at BrewHaven.</p>
          <div className="hero-btns">
            <Link to="/menu" className="btn-primary">Explore Menu</Link>
            <Link to="/booking" style={{ background:'transparent', color:'#fff', border:'2px solid #fff', padding:'13px 28px', borderRadius:50, textDecoration:'none', fontWeight:700, fontSize:15 }}>Book a Table</Link>
          </div>
          <div className="hero-stats">
            {[['50+','Menu Items'],['4.9★','Rating'],['10K+','Happy Customers']].map(([n,l]) => (
              <div key={l}><span className="stat-num">{n}</span><span className="stat-label">{l}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section" style={{ background:'var(--card-bg)' }}>
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Our Menu Categories</h2>
            <p className="section-sub">From espresso to pastries, discover our full range</p>
          </div>
          <div className="cat-grid">
            {categories.map(cat => (
              <Link key={cat.id} to={`/menu?category=${cat.slug}`} className="cat-card">
                <div style={{ fontSize:38, marginBottom:10 }}>{ICONS[cat.slug] || '🍽️'}</div>
                <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:15, fontWeight:700, marginBottom:4, color:'var(--text)' }}>{cat.name}</h3>
                <p style={{ fontSize:12, color:'var(--text-soft)' }}>{cat.item_count} items</p>
                <ChevronRight size={16} style={{ marginTop:6, color:'var(--accent)' }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="section" style={{ background:'var(--cream)' }}>
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">⭐ Featured Items</h2>
            <p className="section-sub">Our most loved items, handpicked for you</p>
          </div>
          <div className="menu-grid">
            {featured.map(item => (
              <div key={item.id} className="menu-card">
                <div className="menu-card-img-wrap">
                  <img src={item.image_url || IMGS[item.category_slug] || IMGS.coffee} alt={item.name} className="menu-card-img" onError={e => { e.target.src = IMGS.coffee; }} />
                  {item.is_veg && <span className="badge badge-veg" style={{ position:'absolute', top:10, right:10 }}><Leaf size={10} /> Veg</span>}
                </div>
                <div className="menu-card-body">
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontSize:11, color:'var(--text-soft)', fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>{item.category_name}</span>
                    <span style={{ display:'flex', alignItems:'center', gap:3, fontSize:13, fontWeight:700, color:'var(--accent)' }}><Star size={12} fill="var(--accent)" stroke="none" />{item.rating}</span>
                  </div>
                  <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:17, color:'var(--text)' }}>{item.name}</h3>
                  <p style={{ fontSize:13, color:'var(--text-soft)', lineHeight:1.5 }}>{item.description}</p>
                  <div className="menu-card-footer">
                    <span style={{ fontFamily:'Playfair Display,serif', fontSize:20, fontWeight:700, color:'var(--text)' }}>₹{item.price}</span>
                    <button className="add-btn" onClick={() => handleAdd(item)}>+ Add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:40 }}>
            <Link to="/menu" className="btn-primary">View Full Menu →</Link>
          </div>
        </div>
      </section>

      {/* OFFERS */}
      {offers.length > 0 && (
        <section className="section" style={{ background:'var(--card-bg)' }}>
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">🎉 Special Offers</h2>
              <p className="section-sub">Exclusive deals just for you</p>
            </div>
            <div className="offers-grid">
              {offers.map(o => (
                <div key={o.id} style={{ background:'linear-gradient(135deg,var(--espresso),var(--coffee))', borderRadius:20, padding:'28px 26px', color:'#f5efe6' }}>
                  <div style={{ display:'inline-block', background:'var(--accent)', color:'#fff', padding:'5px 16px', borderRadius:50, fontWeight:900, fontSize:22, marginBottom:14 }}>{o.discount_percent}% OFF</div>
                  <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:18, marginBottom:8 }}>{o.title}</h3>
                  <p style={{ fontSize:13, opacity:0.85, marginBottom:18, lineHeight:1.6 }}>{o.description}</p>
                  <div style={{ background:'rgba(255,255,255,0.1)', border:'1.5px dashed rgba(255,255,255,0.4)', padding:'10px 18px', borderRadius:8, fontWeight:800, fontSize:16, letterSpacing:3, marginBottom:10 }}>{o.code}</div>
                  {o.min_order_amount > 0 && <p style={{ fontSize:12, opacity:0.65 }}>Min. order ₹{o.min_order_amount}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WHY US */}
      <section className="section" style={{ background:'var(--footer-bg)' }}>
        <div className="container">
          <div className="section-head">
            <h2 className="section-title" style={{ color:'#f5efe6' }}>Why BrewHaven?</h2>
            <p className="section-sub" style={{ color:'var(--latte)' }}>We pour our heart into every cup</p>
          </div>
          <div className="why-grid">
            {[
              { icon:'🫘', title:'Premium Beans', desc:'Single-origin beans sourced from finest farms worldwide' },
              { icon:'👨‍🍳', title:'Expert Baristas', desc:'Our trained baristas craft each drink with precision' },
              { icon:'🌱', title:'Sustainable', desc:'Eco-friendly practices and compostable packaging' },
              { icon:'💻', title:'Work-Friendly', desc:'High-speed WiFi and power outlets at select tables' },
            ].map(w => (
              <div key={w.title} style={{ textAlign:'center', padding:'0 8px' }}>
                <div style={{ fontSize:44, marginBottom:14 }}>{w.icon}</div>
                <h3 style={{ fontFamily:'Playfair Display,serif', color:'#f5efe6', fontSize:18, marginBottom:8 }}>{w.title}</h3>
                <p style={{ color:'var(--latte)', fontSize:14, lineHeight:1.7 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to experience BrewHaven?</h2>
          <p>Book your table today and get 10% off your first order!</p>
          <div className="hero-btns" style={{ justifyContent:'center' }}>
            <Link to="/booking" style={{ background:'#fff', color:'#4a2c2a', padding:'13px 28px', borderRadius:50, textDecoration:'none', fontWeight:700, fontSize:15, display:'inline-flex', alignItems:'center', gap:8 }}>Book a Table</Link>
            <Link to="/menu" style={{ background:'transparent', color:'#fff', border:'2px solid #fff', padding:'13px 28px', borderRadius:50, textDecoration:'none', fontWeight:700, fontSize:15 }}>Order Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
