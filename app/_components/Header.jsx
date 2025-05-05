"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { CartContext } from "../_context/CartContext";
import CartApis from "../_utils/CartApis";
import Cart from "./Cart";

const NAVIGATION_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/explore", label: "استكشف" },
  { href: "/projects", label: "مشاريع" },
  { href: "/about", label: "عنا" },
  { href: "/contact", label: "اتصل بنا" },
];

function Header() {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useUser();
  const { cart, setCart } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const { user } = useUser();

  // Fetch cart items when the user is signed in
  useEffect(() => {
    if (user) {
      getCartItems();
    }
  }, [user]);

  const getCartItems = async () => {
    try {
      const response = await CartApis.getUsercartItems(
        user?.primaryEmailAddress?.emailAddress
      );
      if (response?.data?.data) {
        console.log("Response from cart item", res?.data?.data);
        res?.data?.data.forEach((citem) => {
          setCart((oldCart) => [
            ...oldCart,
            {
              id: citem?.id,
              product: citem?.attributes?.products?.data[0],
            },
          ]);
        });
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const isAuthPage =
    pathname?.includes("/sign-in") || pathname?.includes("/sign-up");

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen, closeMenu]);

  if (isAuthPage) return null;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md" role="banner">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center"
          aria-label="Go to homepage"
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

        <div className="flex flex-1 items-center justify-end md:justify-between">
          {/* Desktop Navigation */}
          <DesktopNavigation pathname={pathname} />

          {/* Auth Buttons */}
          <AuthButtons
            isLoaded={isLoaded}
            isSignedIn={isSignedIn}
            cartCount={cart?.length || 0}
          />

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="block rounded-lg p-2.5 text-gray-600 transition-colors 
              duration-200 hover:bg-gray-100 focus:outline-none 
              focus:ring-2 focus:ring-gray-300 md:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
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
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileNavigation
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        pathname={pathname}
        menuRef={menuRef}
      />
    </header>
  );
}

function DesktopNavigation({ pathname }) {
  return (
    <nav className="hidden md:block" aria-label="Main navigation">
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
  );
}

function MobileNavigation({ isMenuOpen, toggleMenu, pathname, menuRef }) {
  return (
    <div
      id="mobile-menu"
      ref={menuRef}
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
                  onClick={toggleMenu}
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
}

function AuthButtons({ isLoaded, isSignedIn, cartCount }) {
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

  return (
    <div className="flex items-center gap-5">
      <Link
        href="/cart"
        className="relative cursor-pointer group"
        aria-label="Shopping cart"
      >
        <ShoppingCart className="h-6 w-6 text-gray-600 transition-colors duration-200 group-hover:text-indigo-600" />
        <span
          className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white"
          aria-label="Cart items"
        >
          {cartCount}
        </span>
      </Link>
      <UserButton afterSignOutUrl="/" />
      <Cart/>
    </div>
  );
}

export default Header;
