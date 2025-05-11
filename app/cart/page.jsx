"use client";
import React, { useContext, useState } from "react";
import { CartContext } from "../_context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Cart() {
  const { cart, setCart } = useContext(CartContext);
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(false);

  // تأكد من أن السلة لا تحتوي على عناصر فارغة
  const filteredCart = cart.filter(item => item && item.id);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cart.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  };

  const removeItem = (itemId) => {
    const updatedCart = cart.filter((item) => item.id !== itemId);
    setCart(updatedCart);
  };

  // Safely extract product data with proper null checking
  const getProductData = (item) => {
    if (!item) return defaultProductData;

    const product = item.product || {};
    const attributes = product.attributes || {};
    const banner = product.banner || {};
    const bannerData = banner.data || {};
    const bannerAttributes = bannerData.attributes || {};

    // Safely extract banner URL with proper fallback logic
    let bannerUrl = "/placeholder.jpg"; // Default fallback image

    if (typeof banner.url === "function") {
      bannerUrl = banner.url();
    } else if (typeof banner.url === "string") {
      bannerUrl = banner.url;
    } else if (bannerAttributes.url) {
      bannerUrl = bannerAttributes.url;
    }

    return {
      title: product.title || attributes.title || "منتج غير معروف",
      category: product.category || attributes.category || "غير مصنف",
      price: parseFloat(product.price || attributes.price || 0),
      description: product.discreption || attributes.discreption || "",
      bannerUrl,
    };
  };

  // Default product data for fallback
  const defaultProductData = {
    title: "منتج غير معروف",
    category: "غير مصنف",
    price: 0,
    description: "",
    bannerUrl: "/placeholder.jpg",
  };

  // Calculate totals with safe type handling
  const subtotal = filteredCart.reduce((total, item) => {
    const { price } = getProductData(item);
    const quantity = item?.quantity || 1;
    return total + price * quantity;
  }, 0);

  const VAT_RATE = 0.2; // Extract constants
  const DISCOUNT_THRESHOLD = 2;
  const DISCOUNT_AMOUNT = 20;

  const vat = subtotal * VAT_RATE;
  const discount = filteredCart.length > DISCOUNT_THRESHOLD ? DISCOUNT_AMOUNT : 0;
  const total = subtotal + vat - discount;

  // دالة للتعامل مع إتمام الشراء
  const handleCheckout = (e) => {
    e.preventDefault();

    // إظهار الإشعار
    setShowNotification(true);

    // إخفاء الإشعار بعد 5 ثوانٍ والانتقال إلى صفحة الشكر
    setTimeout(() => {
      setShowNotification(false);
      router.push("/checkout");
    }, 5000);
  };

  return (
    <section
      dir="rtl"
      className="bg-gradient-to-b from-gray-50 to-white min-h-screen relative"
    >
      {/* إشعار النجاح */}
      {showNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
          <div className="bg-white border-r-4 border-green-500 shadow-lg rounded-lg p-4 flex items-start max-w-md">
            <div className="flex-shrink-0 mr-4">
              <svg
                className="h-6 w-6 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg mb-1">
                تم استلام طلبك بنجاح!
              </h3>
              <p className="text-gray-600">
                تم إرسال تفاصيل الطلب إلى بريدك الإلكتروني.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                سيتم التواصل معك قريباً لتأكيد الطلب.
              </p>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="mr-auto text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <header className="text-center mb-10">
            <h1 className="text-2xl font-bold text-blue-600 sm:text-4xl">
              سلة التسوق
            </h1>
            <p className="mt-2 text-sm text-gray-500">مراجعة وتعديل منتجاتك</p>
          </header>

          <div className="mt-12 bg-white rounded-2xl shadow-lg overflow-hidden">
            {filteredCart.length === 0 ? (
              <div className="text-center py-16">
                <div className="flex justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <p className="text-xl font-medium text-gray-500">
                  سلة التسوق فارغة
                </p>
                <p className="mt-2 text-gray-400">قم بإضافة منتجات للمتابعة</p>
                <div className="mt-6">
                  <a
                    href="/"
                    className="inline-flex items-center px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    تصفح المنتجات
                  </a>
                </div>
              </div>
            ) : (
              <>
                <div className="border-b border-gray-100">
                  <div className="px-6 py-4 grid grid-cols-12 text-sm font-medium text-gray-500">
                    <div className="col-span-6">المنتج</div>
                    <div className="col-span-2 text-center">السعر</div>
                    <div className="col-span-2 text-center">الكمية</div>
                    <div className="col-span-2 text-center">الإجمالي</div>
                  </div>
                </div>

                <ul className="divide-y divide-gray-100">
                  {filteredCart.map((item) => {
                    const { title, category, price, bannerUrl } =
                      getProductData(item);
                    const quantity = item.quantity || 1;
                    const itemTotal = price * quantity;

                    return (
                      <li
                        key={item.id}
                        className="px-6 py-5 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-6">
                            <div className="flex items-center">
                              <div className="h-20 w-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                <Image
                                  src={bannerUrl}
                                  alt={title}
                                  width={80}
                                  height={80}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.target.src = "/placeholder.jpg";
                                  }}
                                />
                              </div>
                              <div className="mr-4">
                                <h3 className="font-medium text-gray-800">
                                  {title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                  {category}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-2 text-center text-gray-700">
                            {price.toFixed(2)} جنيه
                          </div>

                          {quantity > 1 && (
                            <div className="col-span-2">
                              <div className="flex justify-center">
                                <div className="flex items-center border border-gray-200 rounded-lg">
                                  <button
                                    onClick={() =>
                                      updateQuantity(item.id, quantity - 1)
                                    }
                                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 cursor-pointer"
                                    disabled={quantity <= 1}
                                    aria-label="تقليل الكمية"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="text"
                                    value={quantity}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value, 10);
                                      if (!isNaN(value) && value > 0) {
                                        updateQuantity(item.id, value);
                                      }
                                    }}
                                    className="w-10 text-center border-r border-l border-gray-200 py-1 bg-transparent font-medium text-gray-700 cursor-pointer"
                                    aria-label="الكمية"
                                  />
                                  <button
                                    onClick={() =>
                                      updateQuantity(item.id, quantity + 1)
                                    }
                                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 cursor-pointer"
                                    aria-label="زيادة الكمية"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="col-span-2 flex items-center justify-end space-x-2 space-x-reverse">
                            <div className="font-medium text-gray-800">
                              {itemTotal.toFixed(2)} جنيه
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500 transition p-1 cursor-pointer"
                              aria-label="إزالة العنصر"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.5"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="bg-gray-50 p-6 rounded-b-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                      <h3 className="font-medium text-gray-700 mb-3">
                        لديك كوبون خصم؟
                      </h3>
                      <div className="flex">
                        <input
                          type="text"
                          placeholder="أدخل رمز الكوبون"
                          className="flex-1 border text-blue-600 text-smibold border-gray-200 rounded-r-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-l-lg hover:bg-blue-700 transition cursor-pointer">
                          تطبيق
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                        <h3 className="font-medium text-gray-700 mb-4">
                          ملخص الطلب
                        </h3>

                        <dl className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-gray-600">المجموع الفرعي</dt>
                            <dd className="font-medium text-gray-800">
                              {subtotal.toFixed(2)} جنيه
                            </dd>
                          </div>

                          <div className="flex justify-between">
                            <dt className="text-gray-600">
                              ضريبة القيمة المضافة ({VAT_RATE * 100}%)
                            </dt>
                            <dd className="font-medium text-gray-800">
                              {vat.toFixed(2)} جنيه
                            </dd>
                          </div>

                          {discount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <dt>الخصم</dt>
                              <dd className="font-medium">
                                -{discount.toFixed(2)} جنيه
                              </dd>
                            </div>
                          )}

                          <div className="border-t border-gray-100 pt-3 mt-3">
                            <div className="flex justify-between text-base">
                              <dt className="font-medium text-gray-900">
                                الإجمالي
                              </dt>
                              <dd className="font-bold text-blue-600">
                                {total.toFixed(2)} جنيه
                              </dd>
                            </div>
                          </div>
                        </dl>

                        {discount > 0 && (
                          <div className="mt-4 bg-green-50 rounded-lg px-4 py-2">
                            <div className="flex items-center text-green-700">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 ml-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.5"
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <p className="text-sm">
                                تم تطبيق خصم بمبلغ {discount.toFixed(2)} جنيه
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="mt-6">
                          <Link
                            href="/checkout"
                            className="block w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                          >
                            إتمام الشراء
                          </Link>
                          <Link
                            href="/"
                            className="block w-full mt-2 text-center text-blue-600 text-sm hover:underline"
                          >
                            مواصلة التسوق
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// إضافة الأنيميشن للإشعار
const styles = `
@keyframes slideDown {
  0% {
    transform: translate(-50%, -100%);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out forwards;
}
`;

export default Cart;
