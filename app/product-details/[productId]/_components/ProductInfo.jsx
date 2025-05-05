import React, { useState, useCallback, useContext } from "react";
import { AlertOctagon, BadgeCheck, ShoppingCart } from "lucide-react";
import SkeletonProductInfo from "./SekeltonProductInfo";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import CartApis from "../../../_utils/CartApis.js";
import { CartContext } from "../../../_context/CartContext";

const MESSAGES = {
  ERROR_ADDING_PRODUCT: "لا يمكن إضافة هذا المنتج للسلة",
  SUCCESS_ADDING_PRODUCT: "تمت إضافة المنتج للسلة بنجاح",
  GENERAL_ERROR: "حدث خطأ أثناء إضافة المنتج للسلة",
};

const MESSAGE_TYPES = {
  ERROR: "error",
  SUCCESS: "success",
};

function ProductInfo({ product }) {
  const { user } = useUser();
  const router = useRouter();
  const { cart, setCart } = useContext(CartContext);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: null, text: "" });

  if (!product?.id) return <SkeletonProductInfo />;

  const handleAddToCart = useCallback(async () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    try {
      setIsLoading(true);
      setMessage({ type: null, text: "" });

      const payload = {
        data: {
          username: user.fullName,
          email: user.primaryEmailAddress.emailAddress,
          products: {
            connect: [{ id: product?.id }],
          },
        },
      };

      const { data } = await CartApis.addToCart(payload);

      // Update the cart state immutably
      setCart((prevCart) => [
        ...prevCart,
        {
          id: data?.data?.id,
          product,
        },
      ]);

      setMessage({
        type: MESSAGE_TYPES.SUCCESS,
        text: MESSAGES.SUCCESS_ADDING_PRODUCT,
      });
    } catch (error) {
      console.error(
        "Error adding product to cart:",
        error.response?.data || error
      );
      setMessage({
        type: MESSAGE_TYPES.ERROR,
        text: error?.response?.data?.error?.message || MESSAGES.GENERAL_ERROR,
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, product, router, setCart]);

  const { title, category, discreption, instantDelivery, price } = product;

  return (
    <div className="product-info p-4 rounded-lg">
      <h2 className="text-[20px] font-semibold text-black">{title}</h2>
      <h3 className="text-[14px] text-gray-500 mb-5">{category}</h3>
      <p className="text-[16px] text-black mb-3">{discreption}</p>

      <div className="text-[11px] text-gray-400 flex gap-2 mt-2 items-center">
        {instantDelivery ? (
          <BadgeCheck className="text-green-500 h-5 w-5" aria-hidden="true" />
        ) : (
          <AlertOctagon className="text-gray-500 h-5 w-5" aria-hidden="true" />
        )}
        <span>مؤهلة للتسليم الفوري</span>
      </div>

      <h2 className="text-[32px] mt-3 text-indigo-700">{price} جنيه</h2>

      {message.type && (
        <p
          className={`text-sm mt-2 ${
            message.type === MESSAGE_TYPES.ERROR
              ? "text-red-500"
              : "text-green-500"
          }`}
          role="status"
        >
          {message.text}
        </p>
      )}

      <button
        onClick={handleAddToCart}
        disabled={isLoading}
        className={`flex gap-2 p-3 text-white rounded-lg transition-colors duration-200 ${
          isLoading
            ? "bg-indigo-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-800 cursor-pointer"
        }`}
        aria-busy={isLoading}
      >
        {isLoading ? (
          "جاري الإضافة..."
        ) : (
          <>
            إضافة إلى السلة <ShoppingCart aria-hidden="true" />
          </>
        )}
      </button>
    </div>
  );
}

export default ProductInfo;
