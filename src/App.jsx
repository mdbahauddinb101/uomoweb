import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import RootLayout from "./components/layout/RootLayout";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";


const App = () => {
const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
       { path: "/shop", Component: ShopPage },
    
      
     
    ],
  },
]);


  return <RouterProvider router={router} />
    
  
}

export default App