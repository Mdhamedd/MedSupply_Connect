import React from "react";
import Image from "next/image";

function ProductBanner({ product }) {
  const imageUrl = product?.banner?.url ? product.banner.url : null;

  return (
    <div>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="product-details-banner"
          width={400}
          height={400}
          className="rounded-lg"
        />
      ) : (
        <div className="w-[400px] h-[225px] bg-slate-200 rounded-lg animate-pulse"></div>
      )}
    </div>
  );
}

export default ProductBanner;
