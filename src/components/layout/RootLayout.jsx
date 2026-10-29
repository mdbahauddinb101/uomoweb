import { useLayoutEffect } from "react";
import { Outlet } from "react-router";
import { useLocation } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import MobileNav from "./MobileNav";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const RootLayout = () => {
  return (
    <main>
      <ScrollToTop />
      <Header />
      <Outlet />
      <MobileNav />
      <Footer />
    </main>
  );
};

export default RootLayout;
