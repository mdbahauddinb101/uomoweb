import CartItem from "../components/Cart/CartItem";
import { useSelector } from "react-redux";
import {  useNavigate } from "react-router";

export default function CartPage() {
  let cartitems = useSelector((state) => state.cart.products);

  let totallprice = cartitems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  let finalBalance = totallprice + 20 + 10;

  let navigate = useNavigate();

const HomepageNavigate = () => {
  navigate("/shop")
};


  return (
    <main className="mt-6 mb-6 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="mb-12">
          <h1 className="text-2xl font-bold text-slate-900">Shopping Cart</h1>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Shopping Cart Items */}
          <div className="lg:col-span-2">
            <ul className="space-y-12 sm:space-y-8">
              {cartitems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </ul>
          </div>

          {/* Order Details */}
          <div className="h-max rounded-md border border-slate-200 bg-gray-100 p-6 md:sticky md:top-0">
            <h2 className="text-xl font-semibold text-slate-900">
              Order details
            </h2>

            <ul className="mt-8 space-y-4 font-medium text-slate-600">
              <li className="flex flex-wrap gap-4 text-sm">
                Prices{" "}
                <span className="ml-auto font-semibold text-slate-900">${Math.floor(totallprice)}</span>
              </li>
              <li className="flex flex-wrap gap-4 text-sm">
                Shipping{" "}
                <span className="ml-auto font-semibold text-slate-900">
                  $20
                </span>
              </li>
              <li className="flex flex-wrap gap-4 text-sm">
                Tax{" "}
                <span className="ml-auto font-semibold text-slate-900">
                  $10
                </span>
              </li>
              <li className="flex flex-wrap gap-4 text-sm text-slate-900">
                Total{" "}
                <span className="ml-auto font-semibold">
                  ${Math.floor(finalBalance)}
                </span>
              </li>
            </ul>

            <div className="mt-8 space-y-3 text-center">
              <button
                type="button"
                className="w-full cursor-pointer rounded-md border border-blue-600 bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Checkout
              </button>
              <button
                onClick={HomepageNavigate}
                className="inline-block text-sm font-semibold text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>

            <hr className="my-6 border-slate-300" />
          </div>
        </div>
      </div>
    </main>
  );
}
