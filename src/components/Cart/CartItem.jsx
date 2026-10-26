
import {useDispatch} from "react-redux";
import {decrementQuantity, incrementQuantity, removeproduct }   from "../../slices/cartSlice";


export default function CartItem({ item }) {

const MinusIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 fill-current" viewBox="0 0 124 124">
      <path
         d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
         data-original="#000000"
      />
   </svg>
);

const PlusIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 fill-current" viewBox="0 0 42 42">
      <path
         d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
         data-original="#000000"
      />
   </svg>
);



const dispatch = useDispatch();

const handlePlus = () => {
  dispatch(incrementQuantity(item))
};

const handleMinus = () => {
  dispatch(decrementQuantity(item))
};


   return (
      
     <li className="grid sm:grid-cols-3 items-start gap-4">
         <div className="flex flex-col sm:items-center sm:flex-row gap-6 sm:col-span-2">
            <div className="shrink-0 bg-gray-100 p-2 rounded-md sm:w-28 sm:h-28">
               <img
                  src={item.image}
                  className="w-full h-full object-contain"
                  alt={item.title}
               />
            </div>

            <div>
               <h3 className="text-base font-semibold text-slate-900">
                  {item.title}
               </h3>
               <button
               onClick={() => dispatch(removeproduct(item))}
                  type="button"
             
                  className="text-xs font-medium text-red-600 cursor-pointer mt-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
               >
                  Remove
               </button>

               <div className="flex gap-4 mt-6">
            
                  {/* Quantity Selector */}
                  <div className="flex items-center px-2.5 py-1.5 border border-slate-300 text-slate-900 text-xs rounded-md">
                     <button onClick={handleMinus}
                        type="button"
                        aria-label="Decrease quantity"
                       
                        className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                     >
                        <MinusIcon />
                     </button>
                     <span className="mx-3">{item.quantity}</span>
                     <button
                        onClick={handlePlus}
                        type="button"
                        aria-label="Increase quantity"
                
                        className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                     >
                        <PlusIcon />
                     </button>
                  </div>
               </div>
            </div>
         </div>

         <div className="sm:ml-auto">
            <h3 className="text-base font-semibold text-slate-900">
               ${(item.price * item.quantity).toFixed(2)}
            </h3>
         </div>
      </li>
   );
}