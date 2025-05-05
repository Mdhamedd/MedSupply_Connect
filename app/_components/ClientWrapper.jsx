"use client";

import { useState } from "react";
import { CartContext } from "../_context/CartContext";
import Header from "./Header";
import Footer from "./Footer";

export default function ClientWrapper({ children }) {
  const [cart, setCart] = useState([]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </CartContext.Provider>
  );
}
