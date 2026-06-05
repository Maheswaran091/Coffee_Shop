import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Leaf } from 'lucide-react';
import { menuAPI } from '../api';
import MenuCard from '../components/MenuCard';

const CATS = [
  { slug:'', label:'All', icon:'🍽️' },
  { slug:'coffee', label:'Coffee', icon:'☕' },
  { slug:'cookies', label:'Cookies', icon:'🍪' },
  { slug:'cakes', label:'Cakes', icon:'🎂' },
  { slug:'biscuits', label:'Biscuits', icon:'🥐' },
  { slug:'snacks', label:'Snacks', icon:'🥪' },
  { slug:'beverages', label:'Beverages', icon:'🧋' },
];

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCat = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCat) params.category = activeCat;
    if (search) params.search = search;
    if (vegOnly) params.veg = true;
    menuAPI.items(params)
      .then(r => setItems(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCat, search, vegOnly]);

  return (
    <div>
      <div className="page-hero">
        <h1>Our Menu</h1>
        <p>Discover our handcrafted selection of coffees, pastries & more</p>
      </div>

      <div className="menu-container">
        {/* Search & Veg Filter */}
        <div className="menu-topbar">
          <div className="search-wrap">
            <Search size={17} className="search-icon" />
            <input
              placeholder="Search menu items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`veg-toggle ${vegOnly ? 'active' : ''}`}
          >
            <Leaf size={15} /> Veg Only
          </button>
        </div>

        {/* Category Tabs */}
        <div className="cat-tabs">
          {CATS.map(c => (
            <button
              key={c.slug}
              onClick={() => setSearchParams(c.slug ? { category: c.slug } : {})}
              className={`cat-tab ${activeCat === c.slug ? 'active' : ''}`}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Count */}
        <p style={{ fontSize:14, color:'#8d7b72', fontWeight:600, marginBottom:20 }}>
          {items.length} item{items.length !== 1 ? 's' : ''} found
        </p>

        {loading ? (
          <div className="spinner" />
        ) : items.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0', color:'#4a2c2a' }}>
            <div style={{ fontSize:56, marginBottom:14 }}>🔍</div>
            <h3 style={{ fontFamily:'Playfair Display, serif', marginBottom:8 }}>No items found</h3>
            <p style={{ color:'#8d7b72' }}>Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="menu-grid">
            {items.map(item => <MenuCard key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </div>
  );
}
