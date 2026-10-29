import { configureStore } from '@reduxjs/toolkit'
import  productSlice from '../slices/productSlice'
import  addtocart  from '../slices/cartSlice'
import wishlistSlice from '../slices/wishlistSlice'

export const store = configureStore({
  reducer: {
    product:productSlice,
    cart:addtocart,
    wishlist:wishlistSlice
  },
})