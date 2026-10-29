import CartItem from "../components/Cart/CartItem";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.config";
import toast, { Toaster } from "react-hot-toast";
import Price from "../components/common/Price";

export default function CartPage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const cart = useSelector((state) => state.cart);
  const cartitems = cart.products;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  let totallprice = cartitems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  let finalBalance = totallprice + 20 + 10;

const HomepageNavigate = () => {
  navigate("/shop")
};

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", {
        state: { from: location.pathname },
      });
      return;
    }

    toast.error("Checkout is not available yet.");
  };

  if (
    authLoading ||
    (user && cart.userId !== user.uid) ||
    (!user && cart.userId !== null)
  ) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-gray-500">
        Loading cart...
      </div>
    );
  }

  return (
    <main className="mt-6 mb-6 px-4 md:px-8">
      <Toaster position="top-center" />
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
                <span className="ml-auto font-semibold text-slate-900">
                  <Price amount={Math.floor(totallprice)} />
                </span>
              </li>
              <li className="flex flex-wrap gap-4 text-sm">
                Shipping{" "}
                <span className="ml-auto font-semibold text-slate-900">
                  <Price amount={20} />
                </span>
              </li>
              <li className="flex flex-wrap gap-4 text-sm">
                Tax{" "}
                <span className="ml-auto font-semibold text-slate-900">
                  <Price amount={10} />
                </span>
              </li>
              <li className="flex flex-wrap gap-4 text-sm text-slate-900">
                Total{" "}
                <span className="ml-auto font-semibold">
                  <Price amount={Math.floor(finalBalance)} />
                </span>
              </li>
            </ul>

            <div className="mt-8 space-y-3 text-center">
              <button
                type="button"
                onClick={handleCheckout}
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
