import { API_URL } from "./ApiUrl";
import axios from "axios";

const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/api/orders`, orderData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    console.log("استجابة API لإنشاء الطلب:", response.data);
    return response.data;
  } catch (error) {
    console.error("خطأ في API إنشاء الطلب:", error.response?.data || error.message);
    throw error;
  }
};

const getOrdersByUser = async (email) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/orders?filters[email][$eq]=${email}&populate=*`
    );
    return response.data;
  } catch (error) {
    console.error("خطأ في جلب طلبات المستخدم:", error);
    throw error;
  }
};

const OrderApis = {
  createOrder,
  getOrdersByUser,
};

export default OrderApis;
