"use client";

import { useState, useCallback } from "react";
import { CartContext } from "../_context/CartContext";
import Header from "./Header";
import Footer from "./Footer";

export default function ClientWrapper({ children }) {
  const [cart, setCart] = useState([]);

  // Add these functions to be provided through context
  const removeFromCart = useCallback((itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  }, []);

  return (
    <CartContext.Provider value={{ cart, setCart, removeFromCart, updateQuantity }}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </CartContext.Provider>
  );
}
