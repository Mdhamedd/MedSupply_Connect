"use client";

import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import BreadCrumb from "../../_components/BreadCrumb";
import ProductApis from "../../_utils/ProductApis";
import ProductBanner from "./_components/ProductBanner";
import ProductInfo from "./_components/ProductInfo";
import ProductList from "../../_components/ProductList";
import axios from "axios";

function ProductDetails() {
  const path = usePathname();
  console.log("Path: ", path);
  const { productId } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Fetch product directly first
        try {
          const productResponse = await fetchProductById(productId);
          setProductDetails(productResponse);
          await fetchSimilarProducts(productResponse?.category);
        } catch (error) {
          // If product not found, fetch all products and use the first one.
          const productsResponse = await axios.get(
            "http://localhost:1337/api/products?populate=*"
          );
          const products = productsResponse.data.data;
          if (products.length > 0) {
            setProductDetails(products[0]);
            await fetchSimilarProducts(products[0]?.category);
          } else {
            throw new Error("No products available");
          }
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching product:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductData();
  }, [productId]);

  const fetchProductById = async (id) => {
    const response = await ProductApis.getProductById(id);
    return response.data.data;
  };
  const fetchSimilarProducts = async (category) => {
    if (!category) return;

    try {
      const response = await ProductApis.getProductsByCategory(category);
      setSimilarProducts(response.data.data || []);
    } catch (err) {
      console.error("Error fetching similar products:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-600">جاري التحميل...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreadCrumb path={path} />

        {/* Product Details Section */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <ProductBanner product={productDetails} />
          <ProductInfo product={productDetails} />
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              منتجات مماثلة
            </h2>
            <ProductList productList={similarProducts} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
