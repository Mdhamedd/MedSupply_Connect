"use client";

import {
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { CartContext } from "../_context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, ArrowRight, X, Plus, Minus } from "lucide-react";
import CartApis from "../_utils/CartApis";

/**
 * Custom hook for cart operations and state management
 */
export const useCartOperations = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCartOperations must be used within a CartProvider");
  }

  const { cart, setCart } = context;

  // Remove item from cart with animation handling
  const removeFromCart = useCallback(
    async (itemId) => {
      try {
        await CartApis.removeCartItem(itemId);
        setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
      } catch (error) {
        console.error("Error removing product from cart:", error);
        alert("حدث خطأ أثناء محاولة إزالة المنتج من السلة");
      }
    },
    [setCart]
  );

  // Update item quantity
  const updateQuantity = useCallback(
    (itemId, newQuantity) => {
      if (newQuantity < 1) return;

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    },
    [setCart]
  );

  // Calculate total price
  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => {
      const product = item?.product || {};
      const productData = product?.attributes || product || {};
      const price = productData?.price || 0;
      const quantity = item?.quantity || 1;
      return sum + price * quantity;
    }, 0);
  }, [cart]);

  // Get safe product data
  const getProductData = useCallback((item) => {
    const product = item?.product || {};
    const productData = product?.attributes || product || {};

    return {
      title: productData?.title,
      category: productData?.category,
      price: productData?.price,
      bannerUrl:
        productData?.banner?.data?.attributes?.url ||
        productData?.banner?.url ||
        null,
    };
  }, []);

  return {
    cart,
    totalPrice,
    removeFromCart,
    updateQuantity,
    getProductData,
    isEmpty: !cart || cart.length === 0,
  };
};

/**
 * CartItem component - Single item in cart dropdown
 */
const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  const { getProductData } = useCartOperations();
  const { title, category, price, bannerUrl } = getProductData(item);
  const quantity = item?.quantity || 1;
  const [isRemoving, setIsRemoving] = useState(false);
  const [quantityChanged, setQuantityChanged] = useState(false);
  const [priceChanged, setPriceChanged] = useState(false);
  const prevQuantityRef = useRef(quantity);
  const prevPriceRef = useRef(price * quantity);

  useEffect(() => {
    // Animate quantity change
    if (prevQuantityRef.current !== quantity) {
      setQuantityChanged(true);
      const timer = setTimeout(() => setQuantityChanged(false), 300);
      prevQuantityRef.current = quantity;
      return () => clearTimeout(timer);
    }
  }, [quantity]);

  useEffect(() => {
    // Animate price change
    const currentTotalPrice = price * quantity;
    if (prevPriceRef.current !== currentTotalPrice) {
      setPriceChanged(true);
      const timer = setTimeout(() => setPriceChanged(false), 300);
      prevPriceRef.current = currentTotalPrice;
      return () => clearTimeout(timer);
    }
  }, [price, quantity]);

  const handleRemove = () => {
    setIsRemoving(true);
    // Delay actual removal to allow animation to complete
    setTimeout(() => {
      onRemove(item.id);
    }, 300);
  };

  return (
    <div
      className={`flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50 transition-all duration-300 ${
        isRemoving ? "opacity-0 transform translate-x-full" : "opacity-100"
      }`}
    >
      {/* Remove button */}
      <button
        onClick={handleRemove}
        className="text-gray-400 hover:text-red-500 ml-2 transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer"
        aria-label="إزالة من السلة"
      >
        <X size={16} />
      </button>

      {/* Product Info */}
      <div className="flex items-center flex-1">
        {/* Product Image */}
        <div className="relative h-12 w-12 rounded-md overflow-hidden border bg-gray-100 flex-shrink-0 transition-transform duration-300 hover:scale-105">
          {bannerUrl ? (
            <Image src={bannerUrl} alt={title} fill className="object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-300">
              <ShoppingCart size={18} />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="mr-3 flex-1">
          <h3 className="text-sm font-medium text-gray-700" dir="rtl">
            {title}
          </h3>
          <p className="text-xs text-gray-500" dir="rtl">
            {category}
          </p>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onUpdateQuantity(item.id, quantity + 1)}
          className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer"
          aria-label="زيادة الكمية"
        >
          <Plus size={12} />
        </button>

        <span
          className={`text-xs text-center w-4 font-medium transition-all duration-200 ${
            quantityChanged ? "text-indigo-600 scale-125" : ""
          }`}
        >
          {quantity}
        </span>

        <button
          onClick={() => onUpdateQuantity(item.id, Math.max(1, quantity - 1))}
          className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer"
          aria-label="تقليل الكمية"
        >
          <Minus size={12} />
        </button>

        <span
          className={`text-sm text-indigo-600 font-medium mr-2 transition-all duration-200 ${
            priceChanged ? "opacity-70" : "opacity-100"
          }`}
          dir="rtl"
        >
          {price} جنيه
        </span>
      </div>
    </div>
  );
};

/**
 * EmptyCart component - Shown when cart is empty
 */
const EmptyCart = ({ onClose }) => (
  <div className="flex flex-col items-center justify-center py-8 px-4 animate-fadeIn">
    <div className="mb-4 animate-scaleIn">
      <ShoppingCart size={40} className="text-gray-300" />
    </div>
    <p className="text-gray-500 mb-4 text-center animate-fadeIn">
      سلة التسوق فارغة
    </p>
    <div className="animate-fadeInUp">
      <Link
        href="/"
        className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors duration-300 inline-block hover:scale-105 active:scale-95 transform"
        onClick={onClose}
      >
        تصفح المنتجات
      </Link>
    </div>
  </div>
);

/**
 * Cart component - Main component with dropdown
 */
const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, totalPrice, removeFromCart, updateQuantity, isEmpty } =
    useCartOperations();
  const [badgeAnimate, setBadgeAnimate] = useState(false);
  const prevCartCountRef = useRef(cart?.length || 0);
  const [dropdownAnimationClass, setDropdownAnimationClass] = useState("");

  // Animate badge when cart updates
  useEffect(() => {
    const currentCartCount = cart?.length || 0;
    if (currentCartCount > 0 && currentCartCount !== prevCartCountRef.current) {
      setBadgeAnimate(true);
      const timer = setTimeout(() => setBadgeAnimate(false), 300);
      prevCartCountRef.current = currentCartCount;
      return () => clearTimeout(timer);
    }
  }, [cart?.length]);

  // Handle dropdown animation classes
  useEffect(() => {
    if (isOpen) {
      setDropdownAnimationClass("animate-fadeInScale");
    } else {
      setDropdownAnimationClass("animate-fadeOutScale");
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const cartElement = document.getElementById("cart-dropdown");
      const cartButton = document.getElementById("cart-button");

      if (
        isOpen &&
        cartElement &&
        !cartElement.contains(event.target) &&
        cartButton &&
        !cartButton.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Toggle dropdown
  const toggleCart = () => setIsOpen((prev) => !prev);

  // Cart count for badge
  const cartCount = cart?.length || 0;

  return (
    <div className="relative">
      {/* Cart Button */}
      <button
        id="cart-button"
        onClick={toggleCart}
        className="relative p-2 text-gray-600 hover:text-indigo-600 transition-all duration-300 hover:scale-105 active:scale-95 transform cursor-pointer"
        aria-label="عرض سلة التسوق"
      >
        <ShoppingCart size={20} />
        {cartCount > 0 && (
          <span
            className={`absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-transform duration-200 ${
              badgeAnimate ? "animate-pulse scale-110" : ""
            }`}
          >
            {cartCount}
          </span>
        )}
      </button>

      {/* Cart Dropdown */}
      {(isOpen || dropdownAnimationClass === "animate-fadeOutScale") && (
        <div
          id="cart-dropdown"
          className={`absolute left-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-md shadow-lg border z-50 ${dropdownAnimationClass} ${
            !isOpen && dropdownAnimationClass === "animate-fadeOutScale"
              ? "pointer-events-none"
              : ""
          }`}
          onAnimationEnd={() => {
            if (dropdownAnimationClass === "animate-fadeOutScale") {
              setDropdownAnimationClass("");
            }
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-md animate-fadeIn">
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer"
              aria-label="إغلاق"
            >
              <X size={16} />
            </button>
            <h2 className="text-sm font-medium flex items-center gap-2">
              <ShoppingCart size={16} />
              <span>سلة التسوق ({cartCount})</span>
            </h2>
            <span className="text-sm font-medium text-indigo-600 transition-all duration-200">
              {totalPrice} جنيه
            </span>
          </div>

          {/* Cart Content */}
          <div className="max-h-80 overflow-y-auto">
            {isEmpty ? (
              <EmptyCart onClose={() => setIsOpen(false)} />
            ) : (
              <div className="divide-y">
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {!isEmpty && (
            <div className="p-3 border-t bg-gray-50 rounded-b-md animate-fadeInUp">
              <div className="hover:scale-102 active:scale-98 transition-transform duration-200">
                <Link
                  href="/cart"
                  className="block w-full py-2 mb-2 bg-indigo-600 text-white text-sm text-center rounded hover:bg-indigo-700 transition-colors duration-300"
                >
                  عرض السلة
                </Link>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-1 text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center transition-all duration-200 hover:translate-y-px cursor-pointer"
              >
                <ArrowRight size={14} className="ml-1" />
                متابعة التسوق
              </button>
            </div>
          )}
        </div>
      )}

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes fadeOutScale {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease forwards;
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.2s ease-out forwards;
        }

        .animate-fadeOutScale {
          animation: fadeOutScale 0.2s ease-in forwards;
        }
      `}</style>
    </div>
  );
};

export default Cart;
