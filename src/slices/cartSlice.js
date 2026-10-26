import { createSlice } from "@reduxjs/toolkit";

const loadCart = () => {
  try {
    const stored = localStorage.getItem("cart");
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
    return [];
  }
};

const initialState = {
  products: loadCart(),
};
export const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addtocart: (state, action) => {
      let findproduct = state.products.find(
        (item) => item.id === action.payload.id,
      );

      if (findproduct) {
        (findproduct.quantity++,
          localStorage.setItem("cart", JSON.stringify(state.products)));
      } else {
        state.products.push({ ...action.payload, quantity: 1 });
        localStorage.setItem("cart", JSON.stringify(state.products));
      }
    },

    incrementQuantity: (state, action) => {
      let findproduct = state.products.find(
        (item) => item.id === action.payload.id,
      );

      if (findproduct) {
        (findproduct.quantity++,
          localStorage.setItem("cart", JSON.stringify(state.products)));
      }
    },

    decrementQuantity: (state, action) => {
  const findproduct = state.products.find(
    (item) => item.id === action.payload.id
  );

 

  if (findproduct.quantity <= 1) {
    // remove the item
    state.products = state.products.filter(
      (item) => item.id !== action.payload.id
    );
  } else {
    findproduct.quantity--;
  }

  // save AFTER the state has been updated
  localStorage.setItem("cart", JSON.stringify(state.products));
},

    removeproduct: (state, action) => {
      state.products = state.products.filter(
        (item) => item.id !== action.payload.id,
      );
      localStorage.setItem("cart", JSON.stringify(state.products));
    },
  },
}); 

export const {
  addtocart,
  incrementQuantity,
  decrementQuantity,
  removeproduct,
} = cartSlice.actions;

export default cartSlice.reducer;
