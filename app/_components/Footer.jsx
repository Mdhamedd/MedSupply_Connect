"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";

function Footer() {
  const { user } = useUser();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const controls = useAnimation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      const mouseX = clientX - windowWidth / 2;
      const mouseY = clientY - windowHeight / 2;
      
      setMousePosition({ x: mouseX, y: mouseY });
      x.set(mouseX / 10);
      y.set(mouseY / 10);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [x, y]);
  
  if (!user) return null;
  
  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  const glowAnimation = {
    initial: { opacity: 0.5, scale: 1 },
    animate: {
      opacity: [0.5, 0.8, 0.5],
      scale: [1, 1.05, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  const textReveal = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };
  
  const staggerItems = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const linkHover = {
    initial: { width: "0%" },
    hover: {
      width: "100%",
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  return (
    <div dir="rtl">
      <motion.footer
        className="relative overflow-hidden bg-gradient-to-b from-indigo-950 to-purple-950 text-white"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* خلفية متحركة */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-indigo-500/10"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                filter: "blur(8px)",
              }}
              animate={{
                y: [0, Math.random() * 100 - 50, 0],
                x: [0, Math.random() * 100 - 50, 0],
                scale: [1, Math.random() * 0.5 + 1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* تأثير الضوء المتحرك */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-3xl pointer-events-none"
          animate={{
            x: mousePosition.x / 2,
            y: mousePosition.y / 2,
          }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* القسم العلوي */}
          <motion.div
            className="mb-16 relative"
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          >
            <motion.div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl"
              variants={glowAnimation}
              initial="initial"
              animate="animate"
            />

            <motion.div
              className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 rounded-2xl bg-gradient-to-l from-indigo-900/40 to-purple-900/40 backdrop-blur-sm border border-indigo-800/50"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="flex items-center gap-6"
                variants={floatingAnimation}
                initial="initial"
                animate="animate"
              >
                <motion.div
                  className="relative h-24 w-24"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Image
                    src="/logo.svg"
                    alt="MedSupply Connect Logo"
                    fill
                    className="object-contain invert drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                  />
                </motion.div>

                <div>
                  <motion.h2
                    className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-indigo-200 to-purple-200"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    MedSupply Connect
                  </motion.h2>
                  <motion.p
                    className="text-indigo-200/80 mt-2 max-w-md"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    منصة متكاملة لتوريد المستلزمات الطبية بأفضل الأسعار وأعلى
                    جودة.
                  </motion.p>
                </div>
              </motion.div>

              <motion.div
                className="flex flex-wrap gap-3 justify-center md:justify-end"
                variants={staggerItems}
                initial="initial"
                animate="animate"
              >
                {[
                  {
                    text: "تواصل معنا",
                    href: "/contact",
                    color: "from-blue-500 to-indigo-500",
                  },
                  {
                    text: "منتجاتنا",
                    href: "/products",
                    color: "from-purple-500 to-pink-500",
                  },
                ].map((btn, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Link href={btn.href}>
                      <div
                        className={`px-6 py-3 rounded-full bg-gradient-to-l ${btn.color} text-white font-medium shadow-lg shadow-indigo-900/30 hover:shadow-indigo-700/40 transition-shadow`}
                      >
                        {btn.text}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* القسم الرئيسي */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {/* القسم الأول - الروابط السريعة */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-indigo-600/10 blur-2xl"
                variants={glowAnimation}
                initial="initial"
                animate="animate"
              />

              <motion.h3
                className="text-xl font-bold mb-6 text-right text-transparent bg-clip-text bg-gradient-to-l from-indigo-200 to-purple-200"
                variants={textReveal}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                روابط سريعة
              </motion.h3>

              <motion.ul
                className="space-y-4 text-right"
                variants={staggerItems}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {[
                  { href: "/", text: "الرئيسية" },
                  { href: "/products", text: "المنتجات" },
                  { href: "/categories", text: "التصنيفات" },
                  { href: "/about", text: "من نحن" },
                  { href: "/contact", text: "اتصل بنا" },
                ].map((link, index) => (
                  <motion.li
                    key={index}
                    variants={textReveal}
                    className="overflow-hidden"
                  >
                    <Link href={link.href} className="group block">
                      <div className="flex items-center justify-end gap-2 py-2">
                        <span className="text-indigo-200 group-hover:text-white transition-colors duration-300">
                          {link.text}
                        </span>
                        <motion.span
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-800/50 group-hover:bg-indigo-600/80 transition-colors duration-300"
                          whileHover={{ rotate: 45 }}
                        >
                          →
                        </motion.span>
                        <motion.div
                          className="h-[1px] bg-gradient-to-l from-indigo-400 to-purple-400"
                          variants={linkHover}
                          initial="initial"
                          whileHover="hover"
                        />
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* القسم الثاني - معلومات الاتصال */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div
                className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-purple-600/10 blur-2xl"
                variants={glowAnimation}
                initial="initial"
                animate="animate"
              />

              <motion.h3
                className="text-xl font-bold mb-6 text-right text-transparent bg-clip-text bg-gradient-to-l from-indigo-200 to-purple-200"
                variants={textReveal}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                تواصل معنا
              </motion.h3>

              <motion.ul
                className="space-y-5 text-right"
                variants={staggerItems}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {[
                  {
                    text: "القاهرة، مصر",
                    icon: "📍",
                    color: "from-red-500/20 to-orange-500/20",
                  },
                  {
                    text: "+20 123 456 7890",
                    icon: "📞",
                    color: "from-green-500/20 to-teal-500/20",
                  },
                  {
                    text: "info@medsupply.com",
                    icon: "✉️",
                    color: "from-blue-500/20 to-indigo-500/20",
                  },
                ].map((item, index) => (
                  <motion.li key={index} variants={textReveal}>
                    <motion.div
                      className={`flex items-center justify-end gap-3 py-3 px-4 rounded-xl bg-gradient-to-l ${item.color} backdrop-blur-sm border border-white/5`}
                      whileHover={{
                        y: -5,
                        boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.3)",
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        },
                      }}
                    >
                      <span className="text-white">{item.text}</span>
                      <motion.div
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
                        whileHover={{
                          scale: 1.2,
                          rotate: [0, 10, -10, 0],
                          transition: { duration: 0.5 },
                        }}
                      >
                        <span className="text-xl">{item.icon}</span>
                      </motion.div>
                    </motion.div>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* القسم الثالث - النشرة البريدية */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div
                className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-blue-600/10 blur-2xl"
                variants={glowAnimation}
                initial="initial"
                animate="animate"
              />

              <motion.h3
                className="text-xl font-bold mb-6 text-right text-transparent bg-clip-text bg-gradient-to-l from-indigo-200 to-purple-200"
                variants={textReveal}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                النشرة البريدية
              </motion.h3>

              <motion.div
                className="p-6 rounded-xl bg-gradient-to-l from-indigo-900/40 to-purple-900/40 backdrop-blur-sm border border-indigo-800/50"
                variants={textReveal}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <motion.p className="text-indigo-200 text-sm mb-4 text-right">
                  اشترك في نشرتنا البريدية للحصول على أحدث العروض والمنتجات
                </motion.p>

                <div className="flex flex-col space-y-3">
                  <motion.div
                    className="relative overflow-hidden rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="email"
                      placeholder="البريد الإلكتروني"
                      className="w-full px-4 py-3 bg-indigo-900/50 border border-indigo-700/50 rounded-lg text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-right"
                    />
                  </motion.div>

                  <motion.button
                    className="px-4 py-3 rounded-lg bg-gradient-to-l from-indigo-600 to-purple-600 text-white font-medium shadow-lg shadow-indigo-900/30 hover:shadow-indigo-700/40 transition-shadow"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    اشتراك
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* شريط الحقوق */}
          <motion.div
            className="pt-8 border-t border-indigo-800/30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <motion.p
                className="text-sm text-indigo-200/60 order-2 md:order-1 mt-4 md:mt-0"
                whileHover={{ color: "#ffffff" }}
              >
                &copy; {new Date().getFullYear()} MedSupply Connect كونكت. جميع الحقوق
                محفوظة.
              </motion.p>

              <motion.div
                className="flex space-x-6 space-x-reverse order-1 md:order-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {[
                  { href: "/privacy", text: "سياسة الخصوصية" },
                  { href: "/terms", text: "شروط الاستخدام" },
                ].map((link, index) => (
                  <motion.div key={index} whileHover={{ y: -2 }}>
                    <Link
                      href={link.href}
                      className="text-sm text-indigo-200/60 hover:text-white relative group"
                    >
                      <span>{link.text}</span>
                      <motion.span
                        className="absolute bottom-0 right-0 w-0 h-0.5 bg-gradient-to-l from-indigo-400 to-purple-400 group-hover:w-full"
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}

export default Footer;
