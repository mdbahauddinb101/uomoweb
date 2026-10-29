import ShopAllProducts from "../components/Shop/ShopAllProducts"
import ShopBanner from "../components/Shop/ShopBanner"
import ProductSidebar from "../components/Shop/ProductSidebar"


const ShopPage = () => {
  return (
   <>
   <ShopBanner />
   
    <div className="container mt-6 flex flex-col gap-y-12 px-4 sm:px-6 lg:mt-9 lg:flex-row lg:gap-x-15 lg:gap-y-0 lg:px-0">
   <ProductSidebar />
   <ShopAllProducts />
   </div>
  
   </>
  )
}

export default ShopPage