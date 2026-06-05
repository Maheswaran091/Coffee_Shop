import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Coffee, LogOut, User, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout, isAuth } = useAuth();
  const { count } = useCart();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu,   setUserMenu]   = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); setUserMenu(false); setMobileOpen(false); };
  const isActive = path => location.pathname === path ? 'active' : '';
  const close = () => { setMobileOpen(false); setUserMenu(false); };

  const links = [
    { to:'/', label:'Home' },
    { to:'/menu', label:'Menu' },
    { to:'/booking', label:'Book a Table' },
    { to:'/offers', label:'Offers' },
    { to:'/contact', label:'Contact' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={close}>
          <Coffee size={24} color="#d4762a" />
          <span className="navbar-logo-text">BrewHaven</span>
        </Link>

        {/* Desktop links */}
        <div className="navbar-links">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={`navbar-link ${isActive(l.to)}`} onClick={close}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Dark / Light toggle */}
          <button className="theme-toggle" onClick={toggle} title={dark ? 'Switch to Light' : 'Switch to Dark'}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Cart */}
          <Link to="/cart" className="cart-btn" onClick={close}>
            <ShoppingCart size={20} />
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>

          {/* User menu */}
          {isAuth ? (
            <div style={{ position:'relative' }}>
              <button className="user-btn" onClick={() => setUserMenu(!userMenu)}>
                <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
                <span className="user-name">{user?.first_name || user?.username}</span>
              </button>
              {userMenu && (
                <div className="dropdown">
                  <Link to="/profile"  className="drop-item" onClick={close}><User size={15} /> My Profile</Link>
                  <Link to="/orders"   className="drop-item" onClick={close}>📦 My Orders</Link>
                  <Link to="/bookings" className="drop-item" onClick={close}>📅 My Bookings</Link>
                  <hr style={{ border:'none', borderTop:'1px solid var(--border)', margin:'4px 0' }} />
                  <button className="drop-item" style={{ color:'var(--red)' }} onClick={handleLogout}>
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-btn" onClick={close}>Sign In</Link>
          )}

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {links.map(l => (
          <Link key={l.to} to={l.to} className="mobile-link" onClick={close}>{l.label}</Link>
        ))}
        <hr style={{ border:'none', borderTop:'1px solid var(--border)', margin:'6px 0' }} />
        {/* Theme toggle in mobile */}
        <button
          onClick={() => { toggle(); }}
          className="mobile-link"
          style={{ border:'none', background:'none', cursor:'pointer', textAlign:'left', width:'100%', fontFamily:'DM Sans,sans-serif', fontSize:15, display:'flex', alignItems:'center', gap:10, color:'var(--text)' }}
        >
          {dark ? <><Sun size={16} /> Light Mode</> : <><Moon size={16} /> Dark Mode</>}
        </button>
        <hr style={{ border:'none', borderTop:'1px solid var(--border)', margin:'6px 0' }} />
        {isAuth ? (
          <>
            <Link to="/profile"  className="mobile-link" onClick={close}>👤 My Profile</Link>
            <Link to="/orders"   className="mobile-link" onClick={close}>📦 My Orders</Link>
            <Link to="/bookings" className="mobile-link" onClick={close}>📅 My Bookings</Link>
            <button className="mobile-link" style={{ border:'none', background:'none', color:'var(--red)', cursor:'pointer', textAlign:'left', width:'100%', fontFamily:'DM Sans,sans-serif', fontSize:15 }} onClick={handleLogout}>
              🚪 Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="mobile-link" onClick={close}>🔑 Sign In</Link>
        )}
      </div>
    </nav>
  );
}
