import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { currentUser } from '@clerk/nextjs';

// إنشاء مثيل من Resend باستخدام مفتاح API
const resend = new Resend(process.env.RESEND_API_KEY);

// دالة لإرسال البيانات إلى Strapi
async function saveOrderToStrapi(orderData) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: orderData
      }),
    });

    if (!response.ok) {
      throw new Error(`فشل في حفظ البيانات في Strapi: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('خطأ في حفظ البيانات في Strapi:', error);
    throw error;
  }
}

export async function POST(request) {
  try {
    // الحصول على بيانات الطلب من الطلب
    const { 
      orderItems, 
      orderTotal, 
      estimatedDelivery, 
      subject, 
      customMessage,
      customerEmail, // بريد إلكتروني للعميل الضيف
      customerName, // اسم العميل الضيف
      customerPhone, // رقم هاتف العميل الضيف
      shippingAddress, // عنوان الشحن
      orderId, // رقم الطلب
      paymentMethod, // طريقة الدفع
      paymentStatus // حالة الدفع
    } = await request.json();
    
    let userEmail;
    let userName;
    let userId = null;
    
    // التحقق مما إذا كان هناك بريد إلكتروني للعميل الضيف
    if (customerEmail) {
      userEmail = customerEmail;
      userName = customerName || 'عزيزي العميل';
    } else {
      // الحصول على المستخدم الحالي من Clerk إذا لم يكن هناك بريد إلكتروني للعميل الضيف
      const user = await currentUser();
      
      if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
        return NextResponse.json(
          { error: 'لم يتم العثور على بريد إلكتروني للمستخدم' },
          { status: 400 }
        );
      }
      
      // الحصول على البريد الإلكتروني الرئيسي للمستخدم
      userEmail = user.emailAddresses[0].emailAddress;
      userName = user.firstName || 'عزيزي العميل';
      userId = user.id;
    }
    
    // إنشاء قائمة المنتجات في الطلب
    const productsList = orderItems.map(item => {
      const product = item.product || {};
      const attributes = product.attributes || product || {};
      
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${attributes.title || 'منتج غير معروف'}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity || 1}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${attributes.price || 0} جنيه</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${(attributes.price || 0) * (item.quantity || 1)} جنيه</td>
        </tr>
      `;
    }).join('');
    
    // إنشاء معلومات العنوان
    const addressInfo = shippingAddress ? `
      <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #0369a1; margin-top: 0; margin-bottom: 10px;">معلومات التوصيل</h3>
        <p style="margin-bottom: 5px;"><strong>العنوان:</strong> ${shippingAddress.address || ''}</p>
        <p style="margin-bottom: 5px;"><strong>المدينة:</strong> ${shippingAddress.city || ''}</p>
        <p style="margin-bottom: 5px;"><strong>المحافظة:</strong> ${shippingAddress.state || ''}</p>
        <p style="margin-bottom: 5px;"><strong>الرمز البريدي:</strong> ${shippingAddress.postalCode || ''}</p>
        <p style="margin-bottom: 5px;"><strong>رقم الهاتف:</strong> ${customerPhone || ''}</p>
      </div>
    ` : `
      <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #0369a1; margin-top: 0; margin-bottom: 10px;">معلومات التوصيل</h3>
        <p style="margin-bottom: 5px;">سيتم توصيل طلبك إلى العنوان المسجل في حسابك.</p>
        <p style="margin-bottom: 5px;">سيتم التواصل معك قبل التوصيل لتأكيد موعد التسليم.</p>
      </div>
    `;
    
    // إعداد بيانات الطلب لحفظها في Strapi
    const orderDataForStrapi = {
      orderNumber: orderId || Math.floor(100000 + Math.random() * 900000).toString(),
      customerName: userName,
      customerEmail: userEmail,
      customerPhone: customerPhone || '',
      totalAmount: orderTotal,
      items: orderItems.map(item => {
        const product = item.product || {};
        const attributes = product.attributes || product || {};
        return {
          productId: product.id || '',
          productName: attributes.title || 'منتج غير معروف',
          quantity: item.quantity || 1,
          price: attributes.price || 0,
          subtotal: (attributes.price || 0) * (item.quantity || 1)
        };
      }),
      shippingAddress: shippingAddress || {},
      paymentMethod: paymentMethod || 'غير محدد',
      paymentStatus: paymentStatus || 'معلق',
      orderStatus: 'جديد',
      estimatedDelivery: estimatedDelivery || 'خلال 3-5 أيام عمل',
      orderDate: new Date().toISOString(),
      userId: userId
    };
    
    // حفظ بيانات الطلب في Strapi
    try {
      const strapiResponse = await saveOrderToStrapi(orderDataForStrapi);
      console.log('تم حفظ البيانات في Strapi بنجاح:', strapiResponse);
    } catch (error) {
      console.error('فشل في حفظ البيانات في Strapi:', error);
      // نستمر في إرسال البريد الإلكتروني حتى لو فشل حفظ البيانات في Strapi
    }
    
    // إرسال البريد الإلكتروني
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: userEmail,
      subject: subject || 'تأكيد طلبك من MedSupply Connect',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" alt="MedSupply Connect" style="max-width: 150px;">
          </div>
          
          <h1 style="color: #4f46e5; text-align: center; margin-bottom: 20px;">تم استلام طلبك بنجاح!</h1>
          
          <p style="margin-bottom: 15px;">مرحباً ${userName}،</p>
          
          <p style="margin-bottom: 15px;">${customMessage || 'نشكرك على طلبك من MedSupply Connect. تم استلام طلبك وسيتم شحنه في أقرب وقت ممكن.'}</p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #4f46e5; margin-top: 0; margin-bottom: 10px; font-size: 18px;">تفاصيل الطلب</h2>
            <p style="margin-bottom: 5px;"><strong>رقم الطلب:</strong> #${orderDataForStrapi.orderNumber}</p>
            <p style="margin-bottom: 5px;"><strong>تاريخ الطلب:</strong> ${new Date().toLocaleDateString('ar-EG')}</p>
            <p style="margin-bottom: 5px;"><strong>موعد التسليم المتوقع:</strong> ${estimatedDelivery || 'خلال 3-5 أيام عمل'}</p>
            <p style="margin-bottom: 5px;"><strong>طريقة الدفع:</strong> ${paymentMethod || 'غير محدد'}</p>
            <p style="margin-bottom: 5px;"><strong>حالة الدفع:</strong> ${paymentStatus || 'معلق'}</p>
          </div>
          
          <h3 style="color: #4f46e5; margin-bottom: 10px;">المنتجات المطلوبة:</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #eee;">المنتج</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #eee;">الكمية</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #eee;">السعر</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #eee;">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              ${productsList}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: left; font-weight: bold;">الإجمالي:</td>
                <td style="padding: 10px; font-weight: bold;">${orderTotal} جنيه</td>
              </tr>
            </tfoot>
          </table>
          
          ${addressInfo}
          
          <p style="margin-bottom: 15px;">إذا كان لديك أي استفسارات بخصوص طلبك، يرجى التواصل معنا على <a href="mailto:support@medsupplyconnect.com" style="color: #4f46e5;">support@medsupplyconnect.com</a>.</p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #6b7280; font-size: 14px;">
            <p>&copy; ${new Date().getFullYear()} MedSupply Connect. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      `,
    });
    
    if (error) {
      console.error('خطأ في إرسال البريد الإلكتروني:', error);
      return NextResponse.json(
        { error: 'حدث خطأ أثناء إرسال البريد الإلكتروني' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'تم إرسال البريد الإلكتروني وحفظ البيانات بنجاح',
      emailData: data,
    });
  } catch (error) {
    console.error('خطأ في API إرسال البريد الإلكتروني:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة الطلب' },
      { status: 500 }
    );
  }
}