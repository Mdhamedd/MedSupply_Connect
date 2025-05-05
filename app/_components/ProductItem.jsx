import React from "react";
import Image from "next/image";
import { List } from "lucide-react";
import Link from "next/link";

function ProductItem({ product }) {
  return (
    <Link
      href={`/product-details/${product?.id}`}
      className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out bg-gray-50 hover:cursor-pointer rounded-b-lg"
    >
      {/* Image Section */}
      <div className="overflow-hidden">
        <Image
          src={product?.banner?.url}
          alt={product?.title || "Product Image"}
          width={400}
          height={350}
          className="h-[300px] w-full object-cover transform transition-transform duration-300 ease-in-out hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Details Section */}
      <div className="p-3">
        {/* Title and Price in one row */}
        <div className="flex items-center justify-between">
          <h2 className="text-gray-900 font-semibold text-sm truncate">
            {product?.title}
          </h2>
          {/* Category */}
          <div className="flex items-center gap-2 mt-1 text-gray-400 text-xs">
            <List className="w-3.5 h-3.5" />
            <span className="truncate">{product?.category}</span>
          </div>
        </div>
        <p className="text-gray-900 font-bold text-base">{product?.price} ج</p>
      </div>
    </Link>
  );
}

export default ProductItem;
