import React from 'react';
import { ShoppingCart, Star, Clock, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const IMAGES = {
  coffee: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80',
  cookies: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80',
  cakes: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
  biscuits: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80',
  snacks: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80',
  beverages: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80',
};

export default function MenuCard({ item }) {
  const { addToCart } = useCart();
  const handleAdd = () => { addToCart(item); toast.success(`${item.name} added!`, { icon: '☕' }); };
  const img = item.image_url || IMAGES[item.category_slug] || IMAGES.coffee;

  return (
    <div className="menu-card">
      <div className="menu-card-img-wrap">
        <img src={img} alt={item.name} className="menu-card-img" onError={e => { e.target.src = IMAGES.coffee; }} />
        {item.is_featured && <span className="badge badge-featured" style={{ position: 'absolute', top: 10, left: 10 }}>⭐ Featured</span>}
        <span className={`badge ${item.is_veg ? 'badge-veg' : 'badge-nonveg'}`} style={{ position: 'absolute', top: 10, right: 10 }}>
          {item.is_veg ? <><Leaf size={10} /> Veg</> : '🍖 Non-Veg'}
        </span>
      </div>
      <div className="menu-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#8d7b72', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{item.category_name}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 13, fontWeight: 700, color: '#d4762a' }}>
            <Star size={12} fill="#d4762a" stroke="none" />{item.rating}
          </span>
        </div>
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, color: '#2c1a1a', lineHeight: 1.3 }}>{item.name}</h3>
        <p style={{ fontSize: 13, color: '#8d7b72', lineHeight: 1.5, flex: 1 }}>{item.description}</p>
        <div style={{ display: 'flex', gap: 12 }}>
          {item.preparation_time > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#8d7b72' }}><Clock size={12} />{item.preparation_time} min</span>}
          {item.calories > 0 && <span style={{ fontSize: 12, color: '#8d7b72' }}>🔥 {item.calories} cal</span>}
        </div>
        <div className="menu-card-footer">
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 21, fontWeight: 700, color: '#4a2c2a' }}>₹{item.price}</span>
          <button className="add-btn" onClick={handleAdd}><ShoppingCart size={15} /> Add</button>
        </div>
      </div>
    </div>
  );
}
