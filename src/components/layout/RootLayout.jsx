import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";


const RootLayout = () => {
  return (
    <main>
      <Header />
      <Outlet />
      <Footer />
    </main>
  );
};

export default RootLayout;
