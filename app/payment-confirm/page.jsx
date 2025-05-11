'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { sendOrderConfirmationEmail } from '../_services/emailService';

function PaymentConfirm() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const { user, isLoaded } = useUser();
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      // الحصول على معرف نية الدفع وحالة الدفع من معلمات البحث
      const paymentIntentId = searchParams.get('payment_intent');
      const paymentStatus = searchParams.get('status');
      
      if (paymentIntentId && paymentStatus === 'succeeded') {
        try {
          // استرجاع بيانات الطلب من التخزين المحلي
          const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
          const cartTotal = parseFloat(localStorage.getItem('cartTotal') || '0');
          
          // إنشاء كائن تفاصيل الطلب
          const orderDetails = {
            id: Math.floor(100000 + Math.random() * 900000).toString(),
            date: new Date().toLocaleDateString('ar-EG'),
            items: cartItems,
            total: cartTotal,
            paymentIntentId: paymentIntentId,
            paymentMethod: 'بطاقة ائتمان',
            status: 'تم الدفع',
            estimatedDelivery: 'خلال 3-5 أيام عمل'
          };
          
          setOrderDetails(orderDetails);
          
          // إعداد بيانات العميل
          const customerData = {
            name: isLoaded && user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'عزيزي العميل',
            // لا نحتاج إلى البريد الإلكتروني هنا لأننا سنستخدم البريد المحدد في خدمة البريد الإلكتروني
          };
          
          // إرسال بريد إلكتروني تأكيد الطلب
          const emailResult = await sendOrderConfirmationEmail(orderDetails, customerData);
          setEmailSent(emailResult.success);
          
          // حفظ الطلب في التخزين المحلي للمستخدم
          const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
          userOrders.push(orderDetails);
          localStorage.setItem('userOrders', JSON.stringify(userOrders));
          
          // مسح سلة التسوق بعد إتمام الطلب
          localStorage.removeItem('cartItems');
          localStorage.removeItem('cartTotal');
        } catch (error) {
          console.error('خطأ في معالجة تفاصيل الطلب:', error);
        }
      }
    };
    
    fetchOrderDetails();
  }, [searchParams, isLoaded, user]);

  return (
    <div className="flex flex-col items-center justify-center px-5 mt-4 min-h-[70vh]">
      <Image src="/verified.gif" alt="تم التأكيد" width={130} height={130} />
      <h2 className="text-[24px] font-bold text-indigo-700 mt-4">تمت عملية الدفع بنجاح!</h2>
      
      {orderDetails && (
        <div className="bg-gray-50 p-4 rounded-lg mt-4 text-center">
          <p className="text-gray-700">رقم الطلب: #{orderDetails.id}</p>
          <p className="text-gray-700">إجمالي الطلب: {orderDetails.total} جنيه</p>
          <p className="text-gray-700">تاريخ الطلب: {orderDetails.date}</p>
          <p className="text-gray-700">موعد التسليم المتوقع: {orderDetails.estimatedDelivery}</p>
        </div>
      )}
      
      <h2 className="text-[17px] text-center mt-6 text-gray-500">
        {emailSent 
          ? 'لقد أرسلنا بريدًا إلكترونيًا يحتوي على تأكيد طلبك مع تفاصيل المنتجات إلى abdoswitkey@gmail.com'
          : 'سيتم إرسال تفاصيل طلبك إلى البريد الإلكتروني قريبًا'}
      </h2>
      
      <div className="flex gap-4 mt-8">
        <Link href="/orders" className="p-3 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors">
          متابعة طلباتي
        </Link>
        <Link href="/" className="p-3 text-white rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}

export default PaymentConfirm;
