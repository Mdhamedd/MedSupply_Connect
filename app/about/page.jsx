"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
  // تأثيرات الحركة للعناصر
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* قسم الترويسة */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white py-20 relative overflow-hidden"
      >
        {/* صورة خلفية للترويسة */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1587370560942-ad2a04eabb6d?q=80&w=2070"
            alt="خلفية طبية"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            من نحن
          </motion.h1>
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl max-w-3xl mx-auto"
          >
            أول منصة إلكترونية لربط شركات الأدوية بالصيدليات لتفادي نقص الأدوية وتنظيم التوريد بسهولة
          </motion.p>
        </div>
      </motion.section>

      {/* قسم رؤيتنا */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold text-indigo-600 mb-6">رؤيتنا</h2>
              <p className="text-gray-700 text-lg mb-4">
                نسعى لأن نكون المنصة الرائدة في مجال توريد المستلزمات الطبية في الشرق الأوسط، من خلال تقديم حلول مبتكرة تربط بين الشركات المصنعة والمستشفيات والصيدليات.
              </p>
              <p className="text-gray-700 text-lg">
                هدفنا هو القضاء على مشكلة نقص الأدوية والمستلزمات الطبية من خلال نظام توريد ذكي وفعال يضمن وصول المنتجات الطبية إلى من يحتاجها في الوقت المناسب.
              </p>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              className="relative h-80 rounded-lg overflow-hidden shadow-xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070"
                alt="رؤيتنا"
                fill
                className="object-cover"
                onError={(e) => {
                  e.target.src = "/Hero.svg";
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* قسم قيمنا */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold text-center text-indigo-600 mb-12"
          >
            قيمنا
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "الجودة",
                description: "نلتزم بتقديم منتجات طبية عالية الجودة تلبي المعايير العالمية",
                icon: "🏆",
                image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=2072"
              },
              {
                title: "الابتكار",
                description: "نسعى دائمًا لتطوير حلول مبتكرة لتحسين سلسلة التوريد الطبية",
                icon: "💡",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070"
              },
              {
                title: "الموثوقية",
                description: "نبني علاقات قائمة على الثقة والشفافية مع جميع شركائنا",
                icon: "🤝",
                image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="h-40 relative mb-4 rounded-md overflow-hidden">
                  <Image
                    src={value.image}
                    alt={value.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.src = "/Hero.svg";
                    }}
                  />
                </div>
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* قسم فريقنا */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold text-center text-indigo-600 mb-12"
          >
            فريقنا
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "أحمد محمد",
                role: "المؤسس والرئيس التنفيذي",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974"
              },
              {
                name: "سارة علي",
                role: "مدير العمليات",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976"
              },
              {
                name: "محمد خالد",
                role: "مدير تطوير الأعمال",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070"
              },
              {
                name: "نورا أحمد",
                role: "مدير تكنولوجيا المعلومات",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="h-64 relative">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.target.src = "/Hero.svg";
                    }}
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                  <p className="text-indigo-600">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* قسم شركاؤنا - قسم جديد */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold text-center text-indigo-600 mb-12"
          >
            شركاؤنا
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              "https://images.unsplash.com/photo-1572021335469-31706a17aaef?q=80&w=2070",
              "https://images.unsplash.com/photo-1565301660306-29e08751cc53?q=80&w=1974",
              "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?q=80&w=2070",
              "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=1770"
            ].map((logo, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center h-32"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={logo}
                    alt={`شريك ${index + 1}`}
                    fill
                    className="object-contain p-4"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}