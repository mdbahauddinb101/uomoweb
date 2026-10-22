import ShopAllProducts from "../components/Shop/ShopAllProducts"
import ShopBanner from "../components/Shop/ShopBanner"
import ProductSidebar from "../components/Shop/ProductSidebar"


const ShopPage = () => {
  return (
   <>
   <ShopBanner />
   
    <div className="container flex justify-between gap-15 mt-9">
   <ProductSidebar />
   <ShopAllProducts />
   </div>
  
   </>
  )
}

export default ShopPage