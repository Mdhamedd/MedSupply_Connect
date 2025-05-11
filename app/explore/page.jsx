"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductList from "../_components/ProductList";
import ProductApis from "../_utils/ProductApis";

export default function ExplorePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await ProductApis.getLatestProducts();
        const productsData = response.data.data || [];
        setProducts(productsData);
        
        // استخراج التصنيفات الفريدة
        const uniqueCategories = ["الكل"];
        productsData.forEach(product => {
          if (product.category && !uniqueCategories.includes(product.category)) {
            uniqueCategories.push(product.category);
          }
        });
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("خطأ في جلب المنتجات:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === "الكل" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-4xl font-bold text-indigo-600 mb-4"
          >
            استكشف منتجاتنا
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            تصفح مجموعتنا الواسعة من المستلزمات الطبية عالية الجودة لتلبية احتياجات منشأتك الطبية
          </motion.p>
        </div>

        {/* فلتر التصنيفات */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-indigo-600 text-white shadow-md transform scale-105"
                    : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* عرض المنتجات */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.7 }}
          >
            {filteredProducts.length > 0 ? (
              <ProductList productList={filteredProducts} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">لا توجد منتجات في هذا التصنيف</p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}