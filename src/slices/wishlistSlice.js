import { createSlice } from "@reduxjs/toolkit";

const isApiProduct = (product) =>
  product &&
  (typeof product.id === "number" || typeof product.id === "string") &&
  typeof product.title === "string" &&
  typeof product.price === "number" &&
  typeof product.thumbnail === "string";

const loadWishlist = () => {
  try {
    const stored = localStorage.getItem("uomo-wishlist");
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter(isApiProduct) : [];
  } catch (error) {
    console.error("Failed to load wishlist from localStorage:", error);
    return [];
  }
};

const saveWishlist = (products) => {
  try {
    localStorage.setItem("uomo-wishlist", JSON.stringify(products));
  } catch (error) {
    console.error("Failed to save wishlist to localStorage:", error);
  }
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    products: loadWishlist(),
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const existingProduct = state.products.find(
        (product) => String(product.id) === String(action.payload.id),
      );

      if (existingProduct) {
        state.products = state.products.filter(
          (product) => String(product.id) !== String(action.payload.id),
        );
      } else {
        state.products.push({ ...action.payload, addedAt: Date.now() });
      }

      saveWishlist(state.products);
    },
    removeFromWishlist: (state, action) => {
      state.products = state.products.filter(
        (product) => String(product.id) !== String(action.payload),
      );
      saveWishlist(state.products);
    },
    clearWishlist: (state) => {
      state.products = [];
      saveWishlist(state.products);
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
