import { useEffect, useState } from "react"
import Title from "../common/Title"

import trendydata from "../../api/trendydata.json"
import Product from "../common/Product";
import axios from "axios"


const TrendyProducts = () => {
  let [activeCategory, setActiveCategory] = useState(1);
  let [products, setProducts] = useState([]);

useEffect(() => {
  axios.get("https://dummyjson.com/products").then((res) => {
setProducts(res.data.products)
  }).catch((err) => {
    console.log(err);
  })
}, []);








  return (
    <section className="mt-23.5">
        <div className="container">
            <Title name="OUR TRENDY " namebold="PRODUCTS" />
            <ul className="flex justify-center gap-13.5 mb-10">
               {trendydata.map((item) => (<li key={item.id} className="text-primary text-sm leading-6 font-medium"><button
               onClick={() => setActiveCategory(item.id)} className={`${item.id == activeCategory ? "text-primary" : "text-gray"} text-base font-medium`}>{item.name}</button></li>))}
            </ul>
            <div className="grid grid-cols-4 gap-7.5">
                {products.map((item) => (
                    <Product key={item.id} item={item}/>
                    
                    ))}
            </div>
        </div>
    </section>
  )
}

export default TrendyProducts