import { useEffect, useLayoutEffect } from "react";
import { Outlet } from "react-router";
import { useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import Header from "./Header";
import Footer from "./Footer";
import MobileNav from "./MobileNav";
import { auth } from "../../firebase.config";
import { setCartUser } from "../../slices/cartSlice";
import { setWishlistUser } from "../../slices/wishlistSlice";
import { LocalizationProvider } from "../../localization/LocalizationContext";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const RootLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        dispatch(setCartUser(user?.uid));
        dispatch(setWishlistUser(user?.uid));
      },
      (error) => {
        console.error("Unable to determine cart owner:", error);
        dispatch(setCartUser(null));
        dispatch(setWishlistUser(null));
      },
    );

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <LocalizationProvider>
      <main>
        <ScrollToTop />
        <Header />
        <Outlet />
        <MobileNav />
        <Footer />
      </main>
    </LocalizationProvider>
  );
};

export default RootLayout;
