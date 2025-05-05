import React from "react";
import PropTypes from "prop-types";
import ProductItem from "./ProductItem";

const ProductList = ({ productList = [], onProductClick }) => {
  if (!Array.isArray(productList)) {
    console.error("ProductList: productList prop must be an array");
    return null;
  }

  if (productList.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        لا توجد منتجات متاحة
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {productList.map((product) => (
        <div 
          key={product?.id || Math.random()} 
          onClick={() => product?.id && onProductClick?.(product.id)}
          className="cursor-pointer hover:shadow-lg transition-shadow duration-300 
            rounded-lg p-4 bg-white hover:bg-gray-50"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              product?.id && onProductClick?.(product.id);
            }
          }}
        >
          <ProductItem product={product} />
        </div>
      ))}
    </div>
  );
};

ProductList.propTypes = {
  productList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      // Add other product shape validations as needed
    })
  ).isRequired,
  onProductClick: PropTypes.func,
};

ProductList.defaultProps = {
  onProductClick: () => {},
};

export default React.memo(ProductList);
