import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Coffee size={28} color="#d4762a" />
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#f5efe6' }}>BrewHaven</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.8, maxWidth: 260, marginBottom: 20 }}>
            Where every sip tells a story. Crafted with passion, served with love.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(200,168,130,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c8a882', textDecoration: 'none' }}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ fontFamily: 'Playfair Display, serif', color: '#f5efe6', marginBottom: 18, fontSize: 17 }}>Quick Links</h4>
          {[['/', 'Home'], ['/menu', 'Menu'], ['/booking', 'Book a Table'], ['/offers', 'Offers'], ['/contact', 'Contact']].map(([to, label]) => (
            <Link key={to} to={to} style={{ display: 'block', color: '#c8a882', textDecoration: 'none', marginBottom: 10, fontSize: 14, opacity: 0.85 }}>{label}</Link>
          ))}
        </div>

        <div>
          <h4 style={{ fontFamily: 'Playfair Display, serif', color: '#f5efe6', marginBottom: 18, fontSize: 17 }}>Menu</h4>
          {[['coffee', 'Coffee'], ['cookies', 'Cookies'], ['cakes', 'Cakes'], ['biscuits', 'Biscuits'], ['beverages', 'Beverages']].map(([cat, label]) => (
            <Link key={cat} to={`/menu?category=${cat}`} style={{ display: 'block', color: '#c8a882', textDecoration: 'none', marginBottom: 10, fontSize: 14, opacity: 0.85 }}>{label}</Link>
          ))}
        </div>

        <div>
          <h4 style={{ fontFamily: 'Playfair Display, serif', color: '#f5efe6', marginBottom: 18, fontSize: 17 }}>Contact</h4>
          {[
            [MapPin, '12 MG Road, Anna Nagar, Chennai - 600040'],
            [Phone, '+91 98765 43210'],
            [Mail, 'hello@brewhaven.in'],
            [Clock, 'Mon–Sun: 7:00 AM – 10:00 PM'],
          ].map(([Icon, text], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12, fontSize: 14, opacity: 0.85 }}>
              <Icon size={15} style={{ marginTop: 2, flexShrink: 0 }} /><span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 BrewHaven Coffee Shop. All rights reserved.</p>
        <p style={{ opacity: 0.6 }}>Made with ☕ in Chennai</p>
      </div>
    </footer>
  );
}
