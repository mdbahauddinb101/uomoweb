import { createSlice } from '@reduxjs/toolkit'

export const productSlice = createSlice({
  name: 'product',
  initialState: {
    products:{
      products: [],
      filter: []
    },
  },
  reducers: {
    addproduct: (state, action) => {
      state.products.products = action.payload;
    },
    filterproduct: (state, action) => {
      state.products.filter = action.payload;
    },
  },
})

export const { addproduct, filterproduct} = productSlice.actions

export default productSlice.reducer