/**
 * خدمة إرسال البريد الإلكتروني
 * @param {Object} orderData - بيانات الطلب
 * @param {Object} customerData - بيانات العميل (اختياري)
 * @returns {Promise<Object>} - نتيجة إرسال البريد الإلكتروني
 */
export const sendOrderConfirmationEmail = async (orderData, customerData = {}) => {
  try {
    if (!orderData) {
      console.error('بيانات الطلب غير مكتملة');
      return { success: false, error: 'بيانات الطلب غير مكتملة' };
    }

    const response = await fetch('/api/send-order-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderItems: orderData.items || [],
        orderTotal: orderData.total || 0,
        orderId: orderData.id || `ORD-${Date.now()}`,
        orderDate: orderData.date || new Date().toLocaleDateString('ar-EG'),
        customerEmail: "abdoswitkey@gmail.com", // استخدام البريد الإلكتروني المحدد دائمًا
        customerName: customerData?.name || 'عزيزي العميل',
        shippingAddress: customerData?.shippingAddress || null,
        paymentMethod: orderData.paymentMethod || 'بطاقة ائتمان',
        estimatedDelivery: orderData.estimatedDelivery || 'خلال 3-5 أيام عمل'
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('تم إرسال البريد الإلكتروني بنجاح:', data);
      return { success: true, data };
    } else {
      console.error('خطأ في إرسال البريد الإلكتروني:', data.error);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error('خطأ في استدعاء API إرسال البريد الإلكتروني:', error);
    return { success: false, error: error.message };
  }
};