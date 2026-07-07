import { Outlet } from "react-router";
import Header from "./Header";


const RootLayout = () => {
  return (
    <main>
      <Header />
      <Outlet />
    </main>
  );
};

export default RootLayout;
