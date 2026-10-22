import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import RootLayout from "./components/layout/RootLayout";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ShopSingle from "./pages/ShopSingle";



const App = () => {
const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
       { path: "/shop", Component: ShopPage },
        { path: "shop/:id", Component: ShopSingle },
       
    
      
     
    ],
  },
]);


  return <RouterProvider router={router} />
    
  
}

export default App