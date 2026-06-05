import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item, qty = 1, size = 'M') => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id && c.size === size);
      if (existing) return prev.map(c => c.id === item.id && c.size === size ? { ...c, quantity: c.quantity + qty } : c);
      return [...prev, { ...item, quantity: qty, size }];
    });
  };

  const removeFromCart = (id, size) => setCart(prev => prev.filter(c => !(c.id === id && c.size === size)));

  const updateQty = (id, size, qty) => {
    if (qty <= 0) return removeFromCart(id, size);
    setCart(prev => prev.map(c => c.id === id && c.size === size ? { ...c, quantity: qty } : c));
  };

  const clearCart = () => setCart([]);
  const total = cart.reduce((s, c) => s + c.price * c.quantity, 0);
  const count = cart.reduce((s, c) => s + c.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
