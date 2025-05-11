import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { CartContext } from '../../_context/CartContext';
import {useUser} from '@clerk/nextjs'
import axios from 'axios';
import OrderApis from '../../_utils/OrderApis';
import CartApis from '../../_utils/CartApis';

const CheckoutForm = () => {
  const {user} = useUser();
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { cart, setCart } = useContext(CartContext);
  
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // حساب المبلغ الإجمالي للطلب
  const calculateAmount = () => {
    return cart.reduce((total, item) => {
      const product = item.product || {};
      const productData = product.attributes || product || {};
      const price = productData.price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  };
  
  // تجهيز بيانات الطلب
  const prepareOrderData = () => {
    let productIds = [];
    cart.forEach(el => {
      productIds.push(el?.product?.id);
    });
    
    return {
      data: {
        email: user.primaryEmailAddress.emailAddress,
        username: user.fullName,
        amount: calculateAmount(),
        products: productIds,
        status: "completed" // إضافة حالة للطلب
      }
    };
  };
  
  // دالة إنشاء الطلب وحذف العناصر من السلة
  const createOrder = () => {
    const orderData = prepareOrderData();
    
    console.log("بيانات الطلب المرسلة:", orderData); // إضافة سجل للتأكد من البيانات
    
    OrderApis.createOrder(orderData)
      .then((res) => {
        console.log("استجابة إنشاء الطلب:", res); // إضافة سجل للتحقق من الاستجابة
        if(res) {
          // حذف العناصر من السلة بعد إنشاء الطلب بنجاح
          const deletePromises = cart.map(el => CartApis.deleteCartItem(el?.id));
          
          Promise.all(deletePromises)
            .then(() => {
              // تفريغ السلة في حالة النجاح
              setCart([]);
              router.push('/checkout/success');
            })
            .catch(error => {
              console.error('خطأ في حذف عناصر السلة:', error);
            });
        }
      })
      .catch(error => {
        console.error('خطأ في إنشاء الطلب:', error);
      });
  };
  
  useEffect(() => {
    if (!stripe) {
      return;
    }
    
    // تحقق من حالة الدفع عند تحميل الصفحة
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );
    
    if (!clientSecret) {
      return;
    }
    
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('تم الدفع بنجاح!');
          // إنشاء الطلب بعد نجاح الدفع
          createOrder();
          break;
        case 'processing':
          setMessage('جاري معالجة الدفع.');
          break;
        case 'requires_payment_method':
          setMessage('فشلت عملية الدفع السابقة، يرجى المحاولة مرة أخرى.');
          break;
        default:
          setMessage('حدث خطأ ما.');
          break;
      }
    });
  }, [stripe]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // لا يمكن تنفيذ الدفع إذا لم يتم تحميل Stripe بعد
      return;
    }
    
    setIsLoading(true);
    
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });
    
    if (error) {
      // عرض رسالة الخطأ للمستخدم
      setMessage(error.message || "حدث خطأ أثناء معالجة الدفع.");
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // تم الدفع بنجاح
      setMessage("تم الدفع بنجاح!");
      // إنشاء الطلب وتفريغ سلة التسوق
      createOrder();
    }
    
    setIsLoading(false);
  };
  
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">إتمام الدفع</h2>
      
      <div className="mb-6">
        <PaymentElement />
      </div>
      
      <button 
        disabled={isLoading || !stripe || !elements} 
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? "جاري المعالجة..." : "إتمام الدفع"}
      </button>
      
      {message && (
        <div className={`mt-4 p-3 rounded-md ${message.includes('نجاح') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;