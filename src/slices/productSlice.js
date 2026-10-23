import { createSlice } from '@reduxjs/toolkit'

export const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
  },
  reducers: {
    addproduct: (state, action) => {
      state.products = action.payload;
    },
    filterproduct: (state, action) => {
      state.products = action.payload;
    },
  },
})

export const { addproduct, filterproduct} = productSlice.actions

export default productSlice.reducer