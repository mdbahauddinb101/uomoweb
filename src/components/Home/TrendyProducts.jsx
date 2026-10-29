import { useEffect, useState } from "react";
import Title from "../common/Title";

import trendydata from "../../api/trendydata.json";
import Product from "../common/Product";
import axios from "axios";
import LocalizedText from "../common/LocalizedText";

const TrendyProducts = () => {
  let [activeCategory, setActiveCategory] = useState("ALL");
  let [products, setProducts] = useState([]);
  let [filterProducts, setFilterProducts] = useState([]);
  const [showAllProducts, setShowAllProducts] = useState(false);

  useEffect(() => {
    axios
      .get("https://dummyjson.com/products")
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((err) => {
        console.log(err);
      });
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
    <section className="mt-23.5 mb-12.5 lg:mb-25">
      <div className="container">
        <Title name="OUR TRENDY " namebold="PRODUCTS" />
        <ul className="mt-7.5 mb-10 flex flex-wrap justify-center gap-4 px-4 lg:gap-13.5">
          {trendydata.map((item) => (
            <li key={item.id} className="text-sm font-medium">
              <button
                onClick={() => handleTabs(item.category)}
                className={`after:bg-primary relative pb-1 text-base font-medium transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all after:duration-300 after:content-[''] ${
                  item.category === activeCategory
                    ? "text-primary after:w-full"
                    : "text-gray hover:text-primary after:w-0 hover:after:w-full"
                }`}
              >
                <LocalizedText text={item.name} />
              </button>
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-2 gap-4 bg-gray-100 p-3.75 lg:grid-cols-4 lg:gap-7.5 lg:bg-white">
          {filterProducts.length > 0
            ? filterProducts.map((item) => (
                <Product key={item.id} item={item} />
              ))
            : showAllProducts
              ? products.map((item) => <Product key={item.id} item={item} />)
              : products
                  .slice(0, 8)
                  .map((item) => <Product key={item.id} item={item} />)}
        </div>
        <div className="text-center">
          <button
            onClick={handleShowAllProducts}
            className="text-primary after:bg-primary relative  cursor-pointer text-sm leading-6 font-medium after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:duration-500 after:content-[''] hover:after:w-full mt-5  lg:mt-10"
          >
            {showAllProducts ? "SHOW LESS" : "SHOW ALL"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrendyProducts;
