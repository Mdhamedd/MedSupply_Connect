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
      <ProductList productList={productList} />
    </div>
  );
}

export default ProductSection;
