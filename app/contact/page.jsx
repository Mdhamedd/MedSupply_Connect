"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // محاكاة إرسال النموذج
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus({ success: true, message: "تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا." });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setSubmitStatus({ success: false, message: "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* قسم الترويسة */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            اتصل بنا
          </motion.h1>
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl max-w-3xl mx-auto"
          >
            نحن هنا للإجابة على استفساراتك ومساعدتك في كل ما تحتاجه
          </motion.p>
        </div>
      </motion.section>

      {/* قسم معلومات الاتصال والنموذج */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* معلومات الاتصال */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-2xl font-bold text-indigo-600 mb-8"
              >
                معلومات الاتصال
              </motion.h2>
              
              <div className="space-y-6">
                <motion.div variants={itemVariants} className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="mr-4">
                    <h3 className="text-lg font-medium text-gray-800">العنوان</h3>
                    <p className="text-gray-600 mt-1">123 شارع النيل، القاهرة، مصر</p>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="mr-4">
                    <h3 className="text-lg font-medium text-gray-800">الهاتف</h3>
                    <p className="text-gray-600 mt-1" dir="ltr">+20 123 456 7890</p>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="mr-4">
                    <h3 className="text-lg font-medium text-gray-800">البريد الإلكتروني</h3>
                    <p className="text-gray-600 mt-1">info@medsupply.com</p>
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                variants={itemVariants}
                className="mt-10 p-6 bg-indigo-50 rounded-lg"
              >
                <h3 className="text-lg font-medium text-indigo-800 mb-2">ساعات العمل</h3>
                <p className="text-gray-700">الأحد - الخميس: 9:00 صباحًا - 5:00 مساءً</p>
                <p className="text-gray-700">الجمعة - السبت: مغلق</p>
              </motion.div>
            </motion.div>
            
            {/* نموذج الاتصال */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-2xl font-bold text-indigo-600 mb-8"
              >
                أرسل لنا رسالة
              </motion.h2>
              
              <motion.form 
                variants={containerVariants}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <motion.div variants={itemVariants}>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    الموضوع
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    الرسالة
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  ></textarea>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center px-6 py-3 rounded-md text-white font-medium transition-colors ${
                      isSubmitting ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="mr-2">جاري الإرسال</span>
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      </>
                    ) : (
                      <>
                        <span className="mr-2">إرسال الرسالة</span>
                        <Send className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </motion.div>
                
                {submitStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-md ${
                      submitStatus.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                    }`}
                  >
                    {submitStatus.message}
                  </motion.div>
                )}
              </motion.form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}