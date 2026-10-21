import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import MobileNav from "./MobileNav";


const RootLayout = () => {
  return (
    <main>
      <Header />
      <Outlet />
      <MobileNav />
      <Footer />
    </main>
  );
};

export default RootLayout;
