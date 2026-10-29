import { createSlice } from "@reduxjs/toolkit";
import { auth } from "../firebase.config";

const getCartStorageKey = (userId) => `cart:${userId || "guest"}`;

const loadCart = (userId) => {
  try {
    const storageKey = getCartStorageKey(userId);
    let stored = localStorage.getItem(storageKey);

    if (!stored && !userId) {
      stored = localStorage.getItem("cart");
    }

    const parsed = stored ? JSON.parse(stored) : [];
    const products = Array.isArray(parsed) ? parsed : [];

    if (stored && !localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify(products));
      localStorage.removeItem("cart");
    }

    return products;
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
    return [];
  }
};

const saveCart = (userId, products) => {
  try {
    localStorage.setItem(getCartStorageKey(userId), JSON.stringify(products));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
};

const initialState = {
  userId: null,
  products: loadCart(null),
};
export const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    setCartUser: (state, action) => {
      const userId = action.payload || null;
      if (state.userId === userId) return;

      state.userId = userId;
      state.products = loadCart(userId);
    },
    mergeGuestCart: (state, action) => {
      const userId = action.payload;
      if (!userId || auth.currentUser?.uid !== userId) return;

      const accountProducts = loadCart(userId);
      const guestProducts = loadCart(null);
      state.userId = userId;
      state.products = accountProducts;

      guestProducts.forEach((guestProduct) => {
        const existingProduct = state.products.find(
          (product) => product.id === guestProduct.id,
        );
        if (existingProduct) {
          existingProduct.quantity += guestProduct.quantity;
        } else {
          state.products.push(guestProduct);
        }
      });

      saveCart(userId, state.products);
      try {
        localStorage.removeItem(getCartStorageKey(null));
      } catch (error) {
        console.error("Failed to clear guest cart after sign-up:", error);
      }
    },
    addtocart: (state, action) => {
      if (
        (state.userId && auth.currentUser?.uid !== state.userId) ||
        (!state.userId && auth.currentUser)
      ) {
        return;
      }

      const quantity = Math.max(1, Number(action.payload.quantity) || 1);
      const findproduct = state.products.find(
        (item) => item.id === action.payload.id,
      );

      if (findproduct) {
        findproduct.quantity += quantity;
      } else {
        state.products.push({ ...action.payload, quantity });
      }
      saveCart(state.userId, state.products);
    },

    incrementQuantity: (state, action) => {
      if (
        (state.userId && auth.currentUser?.uid !== state.userId) ||
        (!state.userId && auth.currentUser)
      ) {
        return;
      }

      const findproduct = state.products.find(
        (item) => item.id === action.payload.id,
      );

      if (findproduct) {
        findproduct.quantity++;
        saveCart(state.userId, state.products);
      }
    },

    decrementQuantity: (state, action) => {
      if (
        (state.userId && auth.currentUser?.uid !== state.userId) ||
        (!state.userId && auth.currentUser)
      ) {
        return;
      }

      const findproduct = state.products.find(
        (item) => item.id === action.payload.id
      );

      if (!findproduct) return;

      if (findproduct.quantity <= 1) {
        state.products = state.products.filter(
          (item) => item.id !== action.payload.id
        );
      } else {
        findproduct.quantity--;
      }

      saveCart(state.userId, state.products);
    },
    removeproduct: (state, action) => {
      if (
        (state.userId && auth.currentUser?.uid !== state.userId) ||
        (!state.userId && auth.currentUser)
      ) {
        return;
      }

      state.products = state.products.filter(
        (item) => item.id !== action.payload.id,
      );
      saveCart(state.userId, state.products);
    },
  },
});

export const {
  setCartUser,
  mergeGuestCart,
  addtocart,
  incrementQuantity,
  decrementQuantity,
  removeproduct,
} = cartSlice.actions;

export default cartSlice.reducer;
