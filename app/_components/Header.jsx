"use client";

import React, {
  useEffect,
  useState,
  useContext,
  memo,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { CartContext } from "../_context/CartContext";
import CartApis from "../_utils/CartApis";
import Cart from "./Cart";

const NAVIGATION_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/explore", label: "استكشف" },
  // { href: "/projects", label: "مشاريع" },
  { href: "/about", label: "عنا" },
  { href: "/contact", label: "اتصل بنا" },
];

const Header = () => {
  const pathname = usePathname();
  const { isLoaded, isSignedIn, user } = useUser();
  const { cart, setCart } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openCart, setOpenCart] = useState(false);

  // Skip rendering on auth pages
  const isAuthPage =
    pathname?.includes("/sign-in") || pathname?.includes("/sign-up");
  if (isAuthPage) return null;

  return (
    <header
      className="sticky top-0 z-50 bg-white shadow-md dir-rtl"
      role="banner"
    >
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Logo />

        <div className="flex flex-1 items-center justify-end md:justify-between">
          <DesktopNavigation pathname={pathname} />

          <div className="flex items-center gap-5">
            <CartButton
              cart={cart}
              openCart={openCart}
              setOpenCart={setOpenCart}
            />
            <AuthSection isLoaded={isLoaded} isSignedIn={isSignedIn} />
          </div>

          <MobileMenuButton
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        </div>
      </div>

      <MobileNavigation
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        pathname={pathname}
      />
    </header>
  );
};

// Memoized smaller components
const Logo = memo(() => (
  <Link
    href="/"
    className="flex items-center"
    aria-label="الذهاب إلى الصفحة الرئيسية"
  >
    <Image
      src="/logo.svg"
      width={50}
      height={50}
      alt="MedSupply Connect Logo"
      className="transition-transform hover:scale-105"
      priority
    />
  </Link>
));
Logo.displayName = "Logo";

const DesktopNavigation = memo(({ pathname }) => (
  <nav className="hidden md:block" aria-label="التنقل الرئيسي">
    <ul className="flex items-center gap-6 text-sm">
      {NAVIGATION_LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md px-2 py-1 ${
                isActive
                  ? "text-indigo-600 font-medium"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  </nav>
));
DesktopNavigation.displayName = "DesktopNavigation";

const MobileMenuButton = memo(({ isMenuOpen, setIsMenuOpen }) => (
  <button
    onClick={() => setIsMenuOpen(!isMenuOpen)}
    className="block rounded-lg p-2.5 text-gray-600 transition-colors 
      duration-200 hover:bg-gray-100 focus:outline-none 
      focus:ring-2 focus:ring-gray-300 md:hidden"
    aria-expanded={isMenuOpen}
    aria-controls="mobile-menu"
    aria-label="فتح/إغلاق القائمة"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
      />
    </svg>
  </button>
));
MobileMenuButton.displayName = "MobileMenuButton";

const MobileNavigation = memo(({ isMenuOpen, setIsMenuOpen, pathname }) => {
  // Use useEffect to add/remove body scroll lock when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Use useEffect to close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname, setIsMenuOpen]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      const mobileMenu = document.getElementById("mobile-menu");
      const mobileMenuButton = document.getElementById("mobile-menu-button");

      if (
        isMenuOpen &&
        mobileMenu &&
        !mobileMenu.contains(event.target) &&
        !mobileMenuButton?.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, setIsMenuOpen]);

  return (
    <div
      id="mobile-menu"
      className={`transform transition-all duration-300 ease-in-out md:hidden ${
        isMenuOpen
          ? "max-h-64 opacity-100"
          : "max-h-0 opacity-0 overflow-hidden"
      }`}
    >
      <nav className="border-t border-gray-200">
        <ul className="space-y-1 px-4 py-2">
          {NAVIGATION_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-lg px-4 py-2 text-sm transition-colors duration-200 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 font-medium"
                      : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
});
MobileNavigation.displayName = "MobileNavigation";

const CartButton = memo(({ cart, openCart, setOpenCart }) => {
  const cartCount = cart?.length || 0;

  return (
    <div className="relative">
      {/* <button
        onClick={() => setOpenCart(!openCart)}
        className="relative cursor-pointer group"
        aria-label={`عرض سلة التسوق (${cartCount} عنصر)`}
      >
        <ShoppingCart className="h-6 w-6 text-gray-600 transition-colors duration-200 group-hover:text-indigo-600" />
        {cartCount > 0 && (
          <span
            className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white"
            aria-hidden="true"
          >
            {cartCount}
          </span>
        )}
      </button> */}

      <Cart openCart={openCart} setOpenCart={setOpenCart} />
    </div>
  );
});
CartButton.displayName = "CartButton";

const AuthSection = memo(({ isLoaded, isSignedIn }) => {
  if (!isLoaded) {
    return (
      <div className="h-10 w-20 bg-gray-200 animate-pulse rounded-md"></div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="sm:flex sm:gap-4">
        <Link
          href="/sign-in"
          className="block rounded-md bg-indigo-600 px-5 py-2.5 text-sm
            font-medium text-white transition-all duration-200
            hover:bg-indigo-700 focus:outline-none focus:ring-2
            focus:ring-indigo-500 focus:ring-offset-2"
        >
          تسجيل الدخول
        </Link>

        <Link
          href="/sign-up"
          className="hidden rounded-md bg-gray-100 px-5 py-2.5 text-sm
            font-medium text-indigo-600 transition-all duration-200
            hover:bg-gray-200 focus:outline-none focus:ring-2
            focus:ring-gray-300 focus:ring-offset-2 sm:block"
        >
          أنشئ حساب
        </Link>
      </div>
    );
  }

  return <UserButton afterSignOutUrl="/" />;
});
AuthSection.displayName = "AuthSection";

// Cart Data Fetching Hook
const useCartData = (user) => {
  const { setCart } = useContext(CartContext);

  useEffect(() => {
    if (!user) return;

    const getCartItems = async () => {
      try {
        const response = await CartApis.getUsercartItems(
          user?.primaryEmailAddress?.emailAddress
        );

        if (response?.data?.data) {
          // Reset cart before adding items to avoid duplicates
          setCart([]);

          // Add items to cart
          setCart(
            response.data.data.map((citem) => ({
              id: citem?.id,
              product: citem?.attributes?.products?.data[0],
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    getCartItems();
  }, [user, setCart]);
};

// Main component with data fetching
const HeaderWithData = () => {
  const { user } = useUser();
  useCartData(user);

  return <Header />;
};

export default HeaderWithData;
