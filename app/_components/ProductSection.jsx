"use client";

import React, { useEffect, useState } from "react";
import ProductList from "./ProductList";
import ProductApis from "../_utils/ProductApis";

function ProductSection() {
  const [productList, setProductList] = useState([]);
  useEffect(() => {
    getLatestProduct_();
  }, []);
  const getLatestProduct_ = () => {
    ProductApis.getLatestProducts().then((res) => {
      console.log(res.data.data);
      setProductList(res.data.data);
    });
  };
  return (
    <div className="px-10 md:px-20 bg-white py-10">
      <h1 className="text-2xl font-bold text-indigo-600 mb-5">المضاف حديثا</h1>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900">المنتجات</h2>
        <button className="text-sm text-blue-500 hover:underline hover:text-blue-700 hover:cursor-pointer">
          عرض الكل
        </button>
      </div>
      <ProductList productList={productList} />
    </div>
  );
}

export default ProductSection;
