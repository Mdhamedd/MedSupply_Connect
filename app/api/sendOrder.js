import { API_URL } from "../_utils/ApiUrl";

/**
 * إرسال تأكيد الطلب وحفظ البيانات في Strapi
 * @param {Object} orderData - بيانات الطلب
 * @param {Object} customerData - بيانات العميل
 * @returns {Promise<boolean>} - نجاح أو فشل العملية
 */
const sendOrderConfirmationAndSaveToStrapi = async (orderData, customerData) => {
  try {
    // التحقق من البيانات المطلوبة
    if (!orderData || !customerData || !customerData.email) {
      console.error("بيانات الطلب أو العميل غير مكتملة");
      return false;
    }

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderItems: orderData.items || [],
        orderTotal: orderData.total || 0,
        estimatedDelivery: orderData.estimatedDelivery || 'خلال 3-5 أيام عمل',
        orderId: orderData.id || `ORD-${Date.now()}`,
        customerEmail: customerData.email,
        customerName: customerData.name || 'عزيزي العميل',
        customerPhone: customerData.phone || '',
        shippingAddress: customerData.shippingAddress || null,
        paymentMethod: orderData.paymentMethod || 'غير محدد',
        paymentStatus: orderData.paymentStatus || 'معلق',
        subject: 'تأكيد طلبك من MedSupply Connect',
        customMessage: orderData.customMessage || null
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('تم إرسال البريد الإلكتروني وحفظ البيانات بنجاح:', data);
      return {
        success: true,
        data
      };
    } else {
      console.error('خطأ في إرسال البريد الإلكتروني:', data.error);
      return {
        success: false,
        error: data.error
      };
    }
  } catch (error) {
    console.error('خطأ في استدعاء API:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// إضافة وظيفة لتتبع حالة الطلب
const trackOrder = async (orderId) => {
  try {
    const response = await fetch(`${API_URL}/api/orders/${orderId}?populate=*`);
    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        data: data.data
      };
    } else {
      return {
        success: false,
        error: data.error
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export { sendOrderConfirmationAndSaveToStrapi, trackOrder };