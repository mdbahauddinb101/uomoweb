import { useEffect, useState } from "react";
import BreadCrumb from "../common/BreadCrumb";
import axios from "axios";
import Product from "../common/Product";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';

const ShopAllProducts = () => {
  let [products, setProducts] = useState([]);
  const [view, setView] = useState(3);
  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotallPages] = useState(0)
 


  useEffect(() => {
    axios
      .get("https://dummyjson.com/products?limit=30")
      .then((res) => {
        setProducts(res.data.products);
        setLoading(false);
         let total = Math.floor(res.data.products.length / 9);
         setTotallPages(total);
      })
      .catch(() => {
        setLoading(false)
        throw new Error("Something went wrong")
     
      });
  }, []);

  const handleView = (view) => {
    setView(view);
  };


  if(loading){
    return(
      <div className="grid grid-cols-3 w-full gap-7.5 content-start">
{Array.from({length: 12 },()=>{
  return (
 <div className="mx-auto h-50 w-full max-w-sm rounded-md  p-4">
  <div className="flex animate-pulse space-x-4">
    <div className="size-10 rounded-full bg-gray-200" />
    <div className="flex-1 space-y-6 py-1">
      <div className="h-2 rounded bg-gray-200" />
   <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 h-2 rounded bg-gray-200" />
          <div className="col-span-1 h-2 rounded bg-gray-200" />
        </div>
        <div className="h-2 rounded bg-gray-200" />
      </div>
<div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 h-2 rounded bg-gray-200" />
          <div className="col-span-1 h-2 rounded bg-gray-200" />
        </div>
        <div className="h-2 rounded bg-gray-200" />
      </div>
<div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 h-2 rounded bg-gray-200" />
          <div className="col-span-1 h-2 rounded bg-gray-200" />
        </div>
        <div className="h-2 rounded bg-gray-200" />
      </div>

    </div>
  </div>
</div>
  )
  
      } )}

      </div>
      
    )
  }
   
  

  return (
    <section className="flex flex-col w-full justify-center">
      <div className="w-full">
        <div className="flex items-center justify-between">
          <BreadCrumb />

          <select
            id="countries"
            className="border-gray py-0.5 block w-40 border-b-2 pr-3 text-[14px] leading-6 font-medium outline-none"
          >
            <option selected>DEFAULT SORTING</option>
            <option>Low to High</option>
            <option value="CA">High to Low</option>
          </select>
          
          <div className="ml-15 border-l-4 border-[#E4E4E4] pl-15">
            <ul className="text-primary flex gap-2.75 text-sm font-medium">
              <li>VIEW</li>
              <li className="cursor-pointer" onClick={() => handleView(2)}>2</li>
              <li className="cursor-pointer" onClick={() => handleView(3)}>3</li>
              <li className="cursor-pointer" onClick={() => handleView(4)}>4</li>
            </ul>
          </div>
        </div>
      </div>

      {/* show all products */}
      <div style={view == 2? {display: "grid" , gridTemplateColumns: "1fr 1fr"}: view ==3 ?
      {display:"grid", gridTemplateColumns: "1fr 1fr 1fr"}:{display:"grid", gridTemplateColumns: "1fr 1fr 1fr 1fr"} } className="gap-7.5">
        {products.slice((currentPage-1) * 9 , currentPage * 9).map((item) => (
          <div className="flex justify-center">
          <Product item={item} key={item.id} />
          </div>
        ))}
      </div>


        <ResponsivePagination
      current={currentPage}
      total={totalPages}
      onPageChange={setCurrentPage}
    />

    </section>
  );
};

export default ShopAllProducts;
