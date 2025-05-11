import axios from 'axios';

// إنشاء نسخة من axios مع الإعدادات الافتراضية
const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// إضافة معترض الطلبات
axiosClient.interceptors.request.use(
  (config) => {
    // يمكنك إضافة رمز المصادقة أو أي معالجة أخرى هنا
    return config;
  },
  (error) => Promise.reject(error)
);

// إضافة معترض الاستجابات
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // التحقق من وجود response قبل محاولة الوصول إلى data
    const errorMessage = error.response && error.response.data ? error.response.data : error.message;
    
    // استخدام نهج آمن للتسجيل بدون التسبب في مشاكل الـ hydration
    if (process.env.NODE_ENV !== 'production') {
      // تأخير تنفيذ console.error لتجنب مشاكل الـ hydration
      const logError = () => {
        console.error("خطأ في طلب API:", errorMessage);
      };
      
      if (typeof window !== 'undefined') {
        setTimeout(logError, 0);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
