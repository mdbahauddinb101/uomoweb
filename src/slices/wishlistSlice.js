import { createSlice } from "@reduxjs/toolkit";
import { auth } from "../firebase.config";

const getWishlistStorageKey = (userId) =>
  `uomo-wishlist:${userId || "guest"}`;

const isApiProduct = (product) =>
  product &&
  (typeof product.id === "number" || typeof product.id === "string") &&
  typeof product.title === "string" &&
  typeof product.price === "number" &&
  typeof product.thumbnail === "string";

const loadWishlist = (userId) => {
  try {
    const storageKey = getWishlistStorageKey(userId);
    let stored = localStorage.getItem(storageKey);
    if (!stored && !userId) {
      stored = localStorage.getItem("uomo-wishlist");
    }

    const parsed = stored ? JSON.parse(stored) : [];
    const products = Array.isArray(parsed) ? parsed.filter(isApiProduct) : [];
    if (stored && !localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify(products));
      localStorage.removeItem("uomo-wishlist");
    }
    return products;
  } catch (error) {
    console.error("Failed to load wishlist from localStorage:", error);
    return [];
  }
};

const saveWishlist = (userId, products) => {
  try {
    localStorage.setItem(
      getWishlistStorageKey(userId),
      JSON.stringify(products),
    );
  } catch (error) {
    console.error("Failed to save wishlist to localStorage:", error);
  }
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    userId: null,
    products: loadWishlist(null),
  },
  reducers: {
    setWishlistUser: (state, action) => {
      const userId = action.payload || null;
      if (state.userId === userId) return;

      state.userId = userId;
      state.products = loadWishlist(userId);
    },
    mergeGuestWishlist: (state, action) => {
      const userId = action.payload;
      if (!userId || auth.currentUser?.uid !== userId) return;

      const guestProducts = loadWishlist(null);
      state.userId = userId;
      state.products = loadWishlist(userId);

      guestProducts.forEach((guestProduct) => {
        if (
          !state.products.some(
            (product) => String(product.id) === String(guestProduct.id),
          )
        ) {
          state.products.push(guestProduct);
        }
      });

      saveWishlist(userId, state.products);
      try {
        localStorage.removeItem(getWishlistStorageKey(null));
      } catch (error) {
        console.error("Failed to clear guest wishlist after sign-up:", error);
      }
    },
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

      saveWishlist(state.userId, state.products);
    },
    removeFromWishlist: (state, action) => {
      state.products = state.products.filter(
        (product) => String(product.id) !== String(action.payload),
      );
      saveWishlist(state.userId, state.products);
    },
    clearWishlist: (state) => {
      state.products = [];
      saveWishlist(state.userId, state.products);
    },
  },
});

export const {
  setWishlistUser,
  mergeGuestWishlist,
  toggleWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
