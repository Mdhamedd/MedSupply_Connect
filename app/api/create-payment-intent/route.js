import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// التأكد من وجود مفتاح Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error('مفتاح Stripe السري غير موجود في متغيرات البيئة');
}

const stripe = new Stripe(stripeSecretKey);

export async function POST(request) {
  try {
    // التحقق من صحة البيانات المستلمة
    const body = await request.json();
    const { amount, currency = 'egp', metadata = {} } = body;
    
    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'مبلغ الدفع غير صالح' },
        { status: 400 }
      );
    }
    
    // إنشاء نية دفع جديدة مع بيانات وصفية إضافية
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // التأكد من أن المبلغ عدد صحيح
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        ...metadata,
        created_at: new Date().toISOString(),
      },
      description: 'طلب من MedSupply Connect',
    });
    
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('خطأ في إنشاء نية الدفع:', error);
    
    // إرجاع رسالة خطأ مناسبة
    const errorMessage = error.message || 'حدث خطأ أثناء إنشاء جلسة الدفع';
    const statusCode = error.statusCode || 500;
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}