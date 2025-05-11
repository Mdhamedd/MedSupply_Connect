import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// إنشاء مثيل من Resend باستخدام مفتاح API
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    // الحصول على بيانات الطلب من الطلب
    const { 
      orderItems, 
      orderTotal, 
      customerEmail, 
      customerName,
      orderId,
      orderDate,
      shippingAddress,
      paymentMethod,
      estimatedDelivery
    } = await request.json();
    
    if (!customerEmail) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني للعميل مطلوب' },
        { status: 400 }
      );
    }
    
    // إنشاء قائمة المنتجات في الطلب
    const productsList = orderItems.map(item => {
      const product = item.product || {};
      const attributes = product.attributes || product || {};
      
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <div style="display: flex; align-items: center;">
              ${attributes.thumbnail ? `<img src="${attributes.thumbnail}" alt="${attributes.title || 'منتج'}" style="width: 50px; height: 50px; object-fit: cover; margin-left: 10px; border-radius: 5px;">` : ''}
              <div>
                <div style="font-weight: bold;">${attributes.title || 'منتج غير معروف'}</div>
                ${attributes.description ? `<div style="font-size: 12px; color: #666;">${attributes.description.substring(0, 50)}${attributes.description.length > 50 ? '...' : ''}</div>` : ''}
              </div>
            </div>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity || 1}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${attributes.price || 0} جنيه</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${(attributes.price || 0) * (item.quantity || 1)} جنيه</td>
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
        <p style="margin-bottom: 5px;"><strong>رقم الهاتف:</strong> ${shippingAddress.phone || ''}</p>
      </div>
    ` : `
      <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #0369a1; margin-top: 0; margin-bottom: 10px;">معلومات التوصيل</h3>
        <p style="margin-bottom: 5px;">سيتم التواصل مع العميل قريبًا لتأكيد عنوان التوصيل.</p>
      </div>
    `;
    
    // إنشاء معلومات التسليم المتوقع
    const deliveryInfo = `
      <div style="background-color: #f0fff4; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #059669; margin-top: 0; margin-bottom: 10px;">معلومات التسليم</h3>
        <p style="margin-bottom: 5px;"><strong>موعد التسليم المتوقع:</strong> ${estimatedDelivery}</p>
        <p style="margin-bottom: 5px;">سيتم إرسال تحديثات حول حالة الشحن عبر البريد الإلكتروني.</p>
      </div>
    `;
    
    // إرسال البريد الإلكتروني
    const { data, error } = await resend.emails.send({
      from: 'MedSupply Connect <onboarding@resend.dev>',
      to: customerEmail,
      subject: `تأكيد طلبك رقم #${orderId} من MedSupply Connect`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" alt="MedSupply Connect" style="max-width: 150px;">
            <h1 style="color: #4f46e5; margin-top: 15px; margin-bottom: 0;">تم استلام طلبك بنجاح!</h1>
          </div>
          
          <p style="margin-bottom: 15px; font-size: 16px;">مرحباً ${customerName}،</p>
          
          <p style="margin-bottom: 20px; font-size: 16px;">نشكرك على طلبك من MedSupply Connect. تم استلام طلبك وسيتم معالجته في أقرب وقت ممكن.</p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #4f46e5; margin-top: 0; margin-bottom: 15px; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">تفاصيل الطلب</h2>
            <p style="margin-bottom: 8px; font-size: 15px;"><strong>رقم الطلب:</strong> <span style="color: #4f46e5; font-weight: bold;">#${orderId}</span></p>
            <p style="margin-bottom: 8px; font-size: 15px;"><strong>تاريخ الطلب:</strong> ${orderDate}</p>
            <p style="margin-bottom: 8px; font-size: 15px;"><strong>طريقة الدفع:</strong> ${paymentMethod}</p>
            <p style="margin-bottom: 8px; font-size: 15px;"><strong>حالة الطلب:</strong> <span style="background-color: #ecfdf5; color: #059669; padding: 3px 8px; border-radius: 4px; font-size: 14px;">تم استلام الطلب</span></p>
          </div>
          
          ${deliveryInfo}
          
          <h3 style="color: #4f46e5; margin-bottom: 15px; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">المنتجات المطلوبة:</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">المنتج</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">الكمية</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">السعر</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              ${productsList}
            </tbody>
            <tfoot>
              <tr style="background-color: #f9fafb;">
                <td colspan="3" style="padding: 12px; text-align: left; font-weight: bold; border-top: 2px solid #e5e7eb;">الإجمالي:</td>
                <td style="padding: 12px; text-align: center; font-weight: bold; border-top: 2px solid #e5e7eb; color: #4f46e5;">${orderTotal} جنيه</td>
              </tr>
            </tfoot>
          </table>
          
          ${addressInfo}
          
          <div style="background-color: #fffbeb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #d97706; margin-top: 0; margin-bottom: 10px;">ملاحظات هامة</h3>
            <ul style="margin: 0; padding-right: 20px;">
              <li style="margin-bottom: 5px;">يرجى التأكد من توفر شخص لاستلام الطلب في العنوان المحدد.</li>
              <li style="margin-bottom: 5px;">سيتم التواصل معك قبل التوصيل لتأكيد موعد التسليم.</li>
              <li style="margin-bottom: 5px;">يمكنك تتبع حالة طلبك من خلال حسابك على موقعنا.</li>
            </ul>
          </div>
          
          <p style="margin-bottom: 15px;">إذا كان لديك أي استفسارات بخصوص طلبك، يرجى التواصل معنا على <a href="mailto:support@medsupplyconnect.com" style="color: #4f46e5; text-decoration: none; font-weight: bold;">support@medsupplyconnect.com</a> أو الاتصال على <span style="color: #4f46e5; font-weight: bold;">01234567890</span>.</p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p style="margin-bottom: 5px;">نشكرك على ثقتك في MedSupply Connect</p>
            <p style="margin-bottom: 5px;">&copy; ${new Date().getFullYear()} MedSupply Connect. جميع الحقوق محفوظة.</p>
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
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('خطأ في API إرسال البريد الإلكتروني:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة الطلب' },
      { status: 500 }
    );
  }
}