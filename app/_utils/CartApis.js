const { default: axiosClient } = require("./axiosClient");

const addToCart = (payload) => axiosClient.post("/carts", payload);

const getUsercartItems = (email) =>
  axiosClient.get(
    `carts?populate[products][populate]=banner&filters[email][$eq]=${email}`
  );

const removeCartItem = (itemId) => axiosClient.delete(`/carts/${itemId}`);
const updateCartItem = (itemId, payload) =>
  axiosClient.put(`/carts/${itemId}`, payload);

const deleteCartItem = (itemId) => axiosClient.delete(`/carts/${itemId}`);

export default {
  addToCart,
  getUsercartItems,
  removeCartItem,
  updateCartItem,
  deleteCartItem,
};
