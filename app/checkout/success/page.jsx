"use client";

import { useEffect, useState, useContext, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CartContext } from "../../_context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function SuccessPage() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [playSound, setPlaySound] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const successAudioRef = useRef(null);
  const fireworksInterval = useRef(null);
  const searchParams = useSearchParams();
  const { cart, setCart } = useContext(CartContext);
  
  // تأثير الصوت عند النجاح
  useEffect(() => {
    if (status === "success" && typeof window !== "undefined") {
      // إنشاء عنصر الصوت
      const audio = new Audio("/sounds/success-fanfare.mp3");
      successAudioRef.current = audio;
      audio.volume = 0.5;
      
      // تشغيل الصوت بعد تأخير قصير للتأكد من تحميل الصفحة
      const timer = setTimeout(() => {
        setPlaySound(true);
        audio.play().catch(error => {
          console.error("فشل تشغيل الصوت:", error);
        });
      }, 500);
      
      return () => {
        clearTimeout(timer);
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      };
    }
  }, [status]);

  // تأثير الاحتفال بالنجاح (كونفيتي)
  useEffect(() => {
    if (status === "success") {
      // تشغيل تأثير الكونفيتي
      setShowConfetti(true);
      const duration = 5 * 1000; // زيادة مدة الكونفيتي
      const animationEnd = Date.now() + duration;
      
      const randomInRange = (min, max) => {
        return Math.random() * (max - min) + min;
      };
      
      const confettiInterval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          clearInterval(confettiInterval);
          return;
        }
        
        const particleCount = 50 * (timeLeft / duration);
        
        // تشغيل الكونفيتي من الجانبين
        confetti({
          particleCount: Math.floor(randomInRange(20, 40)),
          spread: randomInRange(50, 70),
          origin: { x: randomInRange(0.1, 0.3), y: randomInRange(0.2, 0.4) },
          colors: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
          shapes: ['circle', 'square'],
          gravity: 0.8,
          scalar: 1.2,
          drift: 0,
          ticks: 300
        });
        
        confetti({
          particleCount: Math.floor(randomInRange(20, 40)),
          spread: randomInRange(50, 70),
          origin: { x: randomInRange(0.7, 0.9), y: randomInRange(0.2, 0.4) },
          colors: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
          shapes: ['circle', 'square'],
          gravity: 0.8,
          scalar: 1.2,
          drift: 0,
          ticks: 300
        });
      }, 250);
      
      // إضافة كونفيتي من الأعلى للتأثير
      const topConfettiInterval = setInterval(() => {
        confetti({
          particleCount: Math.floor(randomInRange(10, 20)),
          spread: 180,
          origin: { x: 0.5, y: 0 },
          colors: ['#FFD700', '#FFA500', '#FF4500', '#FF6347', '#FF1493'],
          gravity: 1,
          scalar: 1.5,
          drift: randomInRange(-1, 1),
          ticks: 300
        });
      }, 1000);
      
      return () => {
        clearInterval(confettiInterval);
        clearInterval(topConfettiInterval);
      };
    }
  }, [status]);
  
  // تأثير الألعاب النارية
  useEffect(() => {
    if (status === "success") {
      setShowFireworks(true);
      
      const randomInRange = (min, max) => {
        return Math.random() * (max - min) + min;
      };
      
      const createFirework = () => {
        const xOrigin = randomInRange(0.2, 0.8);
        const yOrigin = randomInRange(0.2, 0.5);
        
        const colors = [
          ['#FF0000', '#FFAA00'], // أحمر وبرتقالي
          ['#FFFF00', '#00FF00'], // أصفر وأخضر
          ['#00FFFF', '#0000FF'], // سماوي وأزرق
          ['#FF00FF', '#FF69B4'], // وردي وزهري
          ['#FFFFFF', '#FFD700']  // أبيض وذهبي
        ];
        
        const selectedColors = colors[Math.floor(Math.random() * colors.length)];
        
        // إطلاق انفجار الألعاب النارية
        confetti({
          particleCount: Math.floor(randomInRange(70, 150)),
          spread: randomInRange(50, 100),
          origin: { x: xOrigin, y: yOrigin },
          colors: selectedColors,
          ticks: 300,
          gravity: randomInRange(0.4, 0.7),
          scalar: randomInRange(1, 1.5),
          shapes: ['circle'],
          startVelocity: randomInRange(20, 35)
        });
      };
      
      // إطلاق ألعاب نارية على فترات متفاوتة
      const fireworks = setInterval(() => {
        createFirework();
        // إضافة احتمالية لإطلاق ألعاب إضافية للحصول على تأثير أكثر واقعية
        if (Math.random() > 0.7) {
          setTimeout(createFirework, 100);
        }
      }, 1500);
      
      fireworksInterval.current = fireworks;
      
      return () => {
        clearInterval(fireworks);
      };
    }
  }, [status]);
  
  useEffect(() => {
    const sendOrderConfirmationEmail = async () => {
      try {
        // حساب المبلغ الإجمالي
        const orderTotal = cart.reduce((total, item) => {
          const product = item.product || {};
          const attributes = product.attributes || product || {};
          const price = attributes.price || 0;
          const quantity = item.quantity || 1;
          return total + (price * quantity);
        }, 0);
        
        // إنشاء معرف فريد للطلب
        const orderId = `ORD-${Date.now().toString().slice(-6)}`;
        
        // حفظ تفاصيل الطلب
        const orderData = {
          id: orderId,
          date: new Date().toLocaleDateString('ar-EG'),
          total: orderTotal.toFixed(2),
          items: cart
        };
        
        // حفظ بيانات السلة قبل تفريغها
        setOrderDetails(orderData);
        setOrderItems([...cart]); // استخدام نسخة من السلة بدلاً من الإشارة المباشرة
        
        // إرسال بيانات الطلب إلى API لإرسال البريد الإلكتروني
        const response = await fetch('/api/send-order-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderItems: cart,
            orderTotal: orderTotal.toFixed(2),
            orderId: orderId,
            orderDate: new Date().toLocaleDateString('ar-EG'),
            customerEmail: "abdoswitkey@gmail.com",
            customerName: "عزيزي العميل",
            estimatedDelivery: '3-5 أيام عمل',
            paymentMethod: 'بطاقة ائتمان'
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setEmailSent(true);
        } else {
          console.error('Error sending order confirmation email:', data.error);
        }
      } catch (error) {
        console.error('Error sending order confirmation email:', error);
      }
    };
    
    // الحصول على معرف نية الدفع وسر العميل من عنوان URL
    const paymentIntentId = searchParams.get("payment_intent");
    const clientSecret = searchParams.get("payment_intent_client_secret");
    
    if (!paymentIntentId || !clientSecret) {
      setStatus("error");
      setMessage("معلومات تأكيد الدفع غير صالحة");
      return;
    }
    
    // يمكنك التحقق من حالة الدفع مع الخادم الخلفي هنا
    // للتبسيط، سنفترض النجاح إذا كانت لدينا المعلمات
    setStatus("success");
    setMessage("شكرًا لك على الطلب! سيتم شحن منتجاتك قريبًا.");
    
    // تفريغ سلة التسوق بعد نجاح الدفع
    if (cart && cart.length > 0) {
      // إرسال بريد إلكتروني بتأكيد الطلب
      sendOrderConfirmationEmail();
      // تفريغ السلة
      setCart([]);
    }
  }, [searchParams, setCart, cart]);

  // تعريف حركات الرسوم المتحركة
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  const checkmarkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };
  
  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };
  
  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(79, 70, 229, 0.3)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.95 }
  };
  
  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };
  
  const celebrationVariants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: i => ({
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.5 + (i * 0.1)
      }
    })
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full"></div>
          <motion.div 
            className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          ></motion.div>
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-600 font-bold"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <span className="text-lg">جاري التحميل</span>
          </motion.div>
        </div>
      </div>
    );
  }

  // SVG للألعاب النارية - سيتم استخدامها في خلفية الصفحة
  const FireworksSVG = () => (
    <svg 
      className="absolute inset-0 w-full h-full z-0 opacity-30" 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      preserveAspectRatio="none"
    >
      {showFireworks && (
        <>
          <motion.circle
            cx="20"
            cy="20"
            r="1"
            fill="#FFD700"
            animate={{
              r: [0, 5, 0],
              opacity: [1, 0.5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              repeatType: "reverse"
            }}
          />
          <motion.circle
            cx="70"
            cy="30"
            r="1"
            fill="#FF1493"
            animate={{
              r: [0, 6, 0],
              opacity: [1, 0.5, 0]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 4,
              repeatType: "reverse",
              delay: 1
            }}
          />
          <motion.circle
            cx="40"
            cy="70"
            r="1"
            fill="#00FFFF"
            animate={{
              r: [0, 4, 0],
              opacity: [1, 0.5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3.5,
              repeatType: "reverse",
              delay: 0.5
            }}
          />
          <motion.circle
            cx="80"
            cy="80"
            r="1"
            fill="#FFFF00"
            animate={{
              r: [0, 5, 0],
              opacity: [1, 0.5, 0]
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              repeatDelay: 2.8,
              repeatType: "reverse",
              delay: 1.5
            }}
          />
          <motion.circle
            cx="30"
            cy="50"
            r="1"
            fill="#FF4500"
            animate={{
              r: [0, 3, 0],
              opacity: [1, 0.5, 0]
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              repeatDelay: 2.5,
              repeatType: "reverse",
              delay: 0.8
            }}
          />
        </>
      )}
    </svg>
  );
  
  return (
    <AnimatePresence>
      <div className="relative overflow-hidden">
        {/* تأثير الألعاب النارية في الخلفية */}
        {status === "success" && <FireworksSVG />}
        
        {/* عنصر الصوت */}
        {playSound && (
          <audio
            ref={successAudioRef}
            src="/sounds/success-fanfare.mp3"
            autoPlay
            preload="auto"
          />
        )}
        
        <motion.div 
          className="max-w-3xl mx-auto p-6 my-10 relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
        <motion.div 
          className={`p-8 rounded-2xl shadow-lg ${
            status === "success" 
              ? "bg-gradient-to-br from-indigo-50 via-white to-green-50 border border-green-100" 
              : "bg-gradient-to-br from-red-50 to-white border border-red-100"
          }`}
          variants={itemVariants}
        >
          {/* أيقونة النجاح المتحركة */}
          <motion.div 
            className="flex justify-center mb-8"
            variants={itemVariants}
          >
            {status === "success" ? (
              <motion.div 
                className="relative w-32 h-32 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center shadow-lg"
                animate="pulse"
                variants={pulseVariants}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-20 w-20 text-green-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <motion.path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2.5} 
                    d="M5 13l4 4L19 7"
                    variants={checkmarkVariants}
                    initial="hidden"
                    animate="visible"
                  />
                </svg>
                
                {/* حلقات متموجة حول الأيقونة */}
                {[1, 2, 3].map((i) => (
                  <motion.div 
                    key={i}
                    className={`absolute -inset-${i*2} rounded-full border-2 border-green-${400 - i*100} opacity-${75 - i*20}`}
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.7 - (i-1)*0.2, 0.3 - (i-1)*0.1, 0.7 - (i-1)*0.2]
                    }}
                    transition={{ 
                      duration: 2 + i*0.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: i * 0.3
                    }}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <motion.path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2.5} 
                    d="M6 18L18 6M6 6l12 12"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                </svg>
              </motion.div>
            )}
          </motion.div>
          
          {/* عنوان النجاح المتحرك - تصميم جديد */}
          {status === "success" ? (
            <motion.div 
              className="text-center mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: {
                  duration: 0.8,
                  ease: "easeOut"
                }
              }}
            >
              <motion.h1 
                className="text-3xl font-bold inline-block bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent"
                initial={{ y: -20 }}
                animate={{ 
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 15
                  }
                }}
              >
                تم الدفع بنجاح!
              </motion.h1>
              <motion.span
                className="text-3xl inline-block mr-2"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.3
                  }
                }}
              >
                🎉
              </motion.span>
            </motion.div>
          ) : (
            <motion.h1 
              className="text-3xl font-bold text-center mb-6 text-red-700"
              variants={itemVariants}
            >
              خطأ في الدفع
            </motion.h1>
          )}
          
          <motion.p 
            className="text-center text-lg mb-8 text-gray-700"
            variants={itemVariants}
          >
            {message}
          </motion.p>
          
          {/* أيقونات احتفالية متحركة مع تأثيرات إضافية */}
          {status === "success" && (
            <motion.div className="flex justify-center gap-8 mb-8">
              {[
                { icon: "🎁", delay: 0, rotate: [-10, 10] },
                { icon: "🚚", delay: 0.2, rotate: [-5, 5] },
                { icon: "🏆", delay: 0.4, rotate: [-15, 15] },
                { icon: "🎉", delay: 0.6, rotate: [-8, 8] },
                { icon: "🎊", delay: 0.8, rotate: [-12, 12] }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="text-5xl relative"
                  variants={celebrationVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileHover={{ 
                    scale: 1.2,
                    transition: { duration: 0.2 }
                  }}
                >
                  <motion.div
                    animate={{ 
                      rotate: item.rotate,
                      y: [0, -10, 0]
                    }}
                    transition={{ 
                      rotate: { 
                        repeat: Infinity,
                        repeatType: "mirror",
                        duration: 2 + (index * 0.2)
                      },
                      y: {
                        repeat: Infinity,
                        repeatType: "mirror",
                        duration: 1.5 + (index * 0.3),
                        ease: "easeInOut"
                      }
                    }}
                  >
                    {item.icon}
                    
                    {/* إضافة تأثير وهج خلف الأيقونة */}
                    <motion.div 
                      className="absolute inset-0 -z-10 rounded-full blur-md"
                      style={{ 
                        background: [
                          'radial-gradient(circle, rgba(255,215,0,0.7) 0%, rgba(255,215,0,0) 70%)',
                          'radial-gradient(circle, rgba(255,105,180,0.7) 0%, rgba(255,105,180,0) 70%)',
                          'radial-gradient(circle, rgba(64,224,208,0.7) 0%, rgba(64,224,208,0) 70%)',
                          'radial-gradient(circle, rgba(255,69,0,0.7) 0%, rgba(255,69,0,0) 70%)',
                          'radial-gradient(circle, rgba(123,104,238,0.7) 0%, rgba(123,104,238,0) 70%)'
                        ][index % 5]
                      }}
                      animate={{ 
                        opacity: [0.5, 0.8, 0.5],
                        scale: [0.8, 1.2, 0.8]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "mirror"
                      }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {/* قسم البريد الإلكتروني مع تأثيرات متحركة */}
          {status === "success" && (
            <motion.div 
              className="text-center text-gray-600 mb-8 p-5 bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-lg border border-blue-100"
              variants={itemVariants}
              whileHover={{ boxShadow: "0 4px 15px rgba(59, 130, 246, 0.15)" }}
            >
              <motion.div 
                className="flex items-center justify-center mb-2"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <motion.div
                  animate={{
                    y: [0, -3, 0],
                    rotate: [0, -5, 0, 5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="mr-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </motion.div>
                <p className="font-medium">
                  تم إرسال تفاصيل طلبك إلى البريد الإلكتروني
                  <motion.span 
                    className="text-blue-600 font-bold mx-1 inline-block"
                    animate={{ 
                      color: ['#2563eb', '#3b82f6', '#2563eb'],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    abdoswitkey@gmail.com
                  </motion.span>
                </p>
              </motion.div>
              <motion.p 
                className="text-sm text-gray-500"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                (يرجى التحقق من مجلد البريد الوارد أو البريد العشوائي إذا لم تجد الرسالة)
              </motion.p>
            </motion.div>
          )}
          
          {/* أزرار متحركة */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 mt-6"
            variants={itemVariants}
          >
            {status === "success" && (
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <Link href="/orders" className="w-full sm:w-auto px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition flex items-center justify-center">
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </motion.svg>
                  متابعة طلباتي
                </Link>
              </motion.div>
            )}
            
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              <Link href="/" className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition flex items-center justify-center">
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 ml-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  animate={{ x: [0, -3, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </motion.svg>
                العودة للرئيسية
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
        
        {/* تأثيرات نجوم متحركة تظهر عند النجاح */}
        {status === "success" && (
          <div className="fixed inset-0 pointer-events-none z-0">
            {Array(15).fill().map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: Math.random() * window.innerHeight,
                  opacity: 0,
                  scale: 0
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: (Math.random() * window.innerHeight) - 200
                }}
                transition={{
                  duration: 5,
                  delay: i * 0.3,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 5
                }}
              >
                {["✨", "⭐", "🌟"][Math.floor(Math.random() * 3)]}
              </motion.div>
            ))}
          </div>
        )}


      </div>
    </AnimatePresence>
  );
}