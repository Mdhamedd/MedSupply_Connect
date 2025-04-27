import React from "react";
import Image from "next/image";

function ProductItem({ product }) {
  return (
    <div>
      <div className="rounded-t-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
        <Image
          src={product?.banner?.url}
          alt="banner-card"
          width={400}
          height={350}
          className="transform transition-transform duration-300 ease-in-out hover:scale-110 h-[300px] object-cover"
        />
      </div>
      <div className="p-4 bg-white rounded-b-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
        <h2 className="text-indigo-600 font-semibold text-[15px]">
          {product?.title}
        </h2>
        <h3 className="text-gray-500 text-[12px] font-medium mt-1">
          {product?.category}
        </h3>
      </div>
    </div>
  );
}

export default ProductItem;
