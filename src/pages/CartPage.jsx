import { useState } from "react";
import CartItem from "../components/Cart/CartItem";
import {useSelector} from "react-redux"






export default function CartPage() {



   let cartitems = useSelector(state => state.cart.products)

    console.log(cartitems)
   


   return (
      <main className="px-4 md:px-8 mt-6 ">
         <div className="container mx-auto">
            <div className="mb-12">
               <h1 className="text-2xl font-bold text-slate-900">
                  Shopping Cart
               </h1>
            </div>

            <div className="grid gap-12 lg:grid-cols-3">
               {/* Shopping Cart Items */}
               <div className="lg:col-span-2">
                  <ul className="space-y-12 sm:space-y-8">
                     {cartitems.map((item) => (
                        <CartItem
                           key={item.id}
                           item={item}
                           
                        />
                     ))}
                  </ul>
               </div>

               {/* Order Details */}
               <div className="bg-gray-100 border border-slate-200 rounded-md p-6 h-max md:sticky md:top-0">
                  <h2 className="text-xl font-semibold text-slate-900">
                     Order details
                  </h2>

                  <ul className="text-slate-600 font-medium mt-8 space-y-4">
                     <li className="flex flex-wrap gap-4 text-sm">
                  
                        <span className="ml-auto text-slate-900 font-semibold">
                      
                        </span>
                     </li>
                     <li className="flex flex-wrap gap-4 text-sm">
                        Shipping{" "}
                        <span className="ml-auto text-slate-900 font-semibold">
                       
                        </span>
                     </li>
                     <li className="flex flex-wrap gap-4 text-sm">
                        Tax{" "}
                        <span className="ml-auto text-slate-900 font-semibold">
                         
                        </span>
                     </li>
                     <li className="flex flex-wrap gap-4 text-sm text-slate-900">
                        Total{" "}
                        <span className="ml-auto font-semibold">
                      
                        </span>
                     </li>
                  </ul>

                  <div className="mt-8 space-y-3 text-center">
                     <button
                        type="button"
                        className="w-full px-4 py-2.5 text-white text-sm font-semibold rounded-md cursor-pointer bg-blue-600 hover:bg-blue-700 border border-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                     >
                        Checkout
                     </button>
                     <a
                        href="#"
                        className="inline-block text-blue-700 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                     >
                        Continue Shopping
                     </a>
                  </div>

                  <hr className="my-6 border-slate-300" />

                  
               </div>
            </div>
         </div>
      </main>
   );
}