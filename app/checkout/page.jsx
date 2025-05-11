'use client'
import React, { useState, useEffect, useContext } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './_components/CheckoutForm';
import { CartContext } from '../_context/CartContext';
import { useRouter } from 'next/navigation';

// تأكد من استدعاء loadStripe خارج مكون الرندر لتجنب إعادة إنشاء كائن Stripe في كل مرة
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const { cart } = useContext(CartContext);
  const router = useRouter();
  
  useEffect(() => {
    // تحقق من وجود منتجات في السلة
    if (!cart || cart.length === 0) {
      router.push('/cart');
      return;
    }
    
    // حساب المبلغ الإجمالي
    const amount = cart.reduce((total, item) => {
      const product = item.product || {};
      const productData = product.attributes || product || {};
      const price = productData.price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
    
    // إنشاء جلسة دفع جديدة
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amount * 100 }), // تحويل إلى وحدات صغيرة (سنت)
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [cart, router]);

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#4f46e5',
    },
  };
  
  const options = {
    clientSecret,
    appearance,
    locale: 'ar',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-indigo-600">إتمام الطلب</h1>
          <p className="mt-2 text-gray-600">أدخل بيانات الدفع لإتمام عملية الشراء</p>
        </div>
        
        {clientSecret ? (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        ) : (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        )}
      </div>
    </div>
  );
}