import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import RootLayout from "./components/layout/RootLayout";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ShopSingle from "./pages/ShopSingle";
import CartPage from "./pages/CartPage";
import Login from "./pages/Login";
import Ragister from "./pages/Ragister";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import ShopSinglePage from "./pages/ShopSinglePage";
import CollectionPage from "./pages/CollectionPage";
import JournalPage from "./pages/JournalPage";
import LookBookPage from "./pages/LookBookPage";
import Pages from "./pages/Pages";
import WishListPage from "./pages/WishListPage";





const App = () => {
const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
       { path: "/shop", Component: ShopPage },
        { path: "shop/:id", Component: ShopSingle },
        { path: "/cart", Component: CartPage },
          { path: "/login", Component: Login },
            { path: "/ragister", Component: Ragister },
             { path: "/passforgot", Component: ForgotPassword },
              { path: "/profile", Component: Profile },
                { path: "/shopsinglepage/:id", Component: ShopSinglePage },
                   { path: "/collection", Component: CollectionPage },
                    { path: "/journal", Component: JournalPage  },
                      { path: "/lookbook", Component: LookBookPage  },
                       { path: "/pages", Component: Pages  },
                          { path: "/wishlist", Component: WishListPage  }
            
       
    
      
     
    ],
  },
]);


  return <RouterProvider router={router} />
    
  
}

export default App