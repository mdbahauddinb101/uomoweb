import { useEffect, useState } from "react"
import Title from "../common/Title"

import trendydata from "../../api/trendydata.json"
import Product from "../common/Product";
import axios from "axios"


const TrendyProducts = () => {

  
  let [activeCategory, setActiveCategory] = useState("ALL");
  let [products, setProducts] = useState([]);
  let [filterProducts, setFilterProducts] = useState([]);
  const [showAllProducts, setShowAllProducts] = useState(false);

useEffect(() => {
  axios.get("https://dummyjson.com/products").then((res) => {
setProducts(res.data.products)
  }).catch((err) => {
    console.log(err);
  })
}, []);


const handleTabs = (category) => {
  setActiveCategory(category);


  let filterProduct = products.filter((item) => item.category === category);
 setFilterProducts(filterProduct);

};


const handleShowAllProducts = () => {
  setShowAllProducts(!showAllProducts);
};








  return (
    <section className="mt-23.5 mb-25">
        <div className="container">
            <Title name="OUR TRENDY " namebold="PRODUCTS" />
            <ul className="mt-7.5 flex justify-center gap-13.5 mb-10">
               {trendydata.map((item) => (<li key={item.id} className="text-primary text-sm leading-6 font-medium"><button
               onClick={() => handleTabs(item.category)} className={`${item.category == activeCategory ? "text-primary" : "text-gray"} text-base font-medium`}>{item.name}</button></li>))}
            </ul>
            <div className="grid grid-cols-4 gap-7.5">
                {filterProducts.length > 0 ? filterProducts.map((item) => (<Product key={item.id} item={item}/>)) : showAllProducts ? products.map((item) => (<Product key={item.id} item={item}/>)) : products.slice(0, 8).map((item) => (<Product key={item.id} item={item}/>))}
            </div>
        <div className="text-center ">
             <button onClick={handleShowAllProducts} className="text-primary mt-10  after:bg-primary relative text-sm leading-6 font-medium after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:duration-500 after:content-[''] hover:after:w-full cursor-pointer">{showAllProducts ? "SHOW LESS" : "SHOW ALL"}</button>
        </div>
        </div>
    </section>
  )
}

export default TrendyProducts