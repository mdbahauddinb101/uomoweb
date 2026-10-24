import { useEffect, useState } from "react";
import BreadCrumb from "../common/BreadCrumb";
import axios from "axios";
import Product from "../common/Product";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic-light-dark.css";
import { useDispatch, useSelector } from "react-redux";
import { addproduct } from "../../slices/productSlice";

const PER_PAGE = 9;

const ShopAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState(3);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const filterProducts =
    useSelector((state) => state.product.products.filter) || [];
  const dispatch = useDispatch();

  // fetch once
  useEffect(() => {
    axios
      .get("https://dummyjson.com/products?limit=100")
      .then((res) => {
        setProducts(res.data.products);
        dispatch(addproduct(res.data.products));
      })
      .catch((err) => {
        console.error("Something went wrong", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // go back to page 1 whenever the filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterProducts]);

  // derived values: always correct on first render, reload, and filter change
  const list = filterProducts.length > 0 ? filterProducts : products;
  const totalPages = Math.ceil(list.length / PER_PAGE);
  const visibleProducts = list.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const columns = view === 2 ? 2 : view === 3 ? 3 : 4;

  if (loading) {
    return (
      <div className="grid grid-cols-3 w-full gap-7.5 content-start">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="mx-auto h-50 w-full max-w-sm rounded-md p-4">
            <div className="flex animate-pulse space-x-4">
              <div className="size-10 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 rounded bg-gray-200" />
                {Array.from({ length: 3 }, (_, j) => (
                  <div key={j} className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 h-2 rounded bg-gray-200" />
                      <div className="col-span-1 h-2 rounded bg-gray-200" />
                    </div>
                    <div className="h-2 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="flex flex-col min-h-300">
      <div className="full">
        <div className="flex items-center justify-between">
          <BreadCrumb />

          <select
            id="countries"
            defaultValue="default"
            className="border-gray py-0.5 block w-40 border-b-2 pr-3 text-[14px] leading-6 font-medium outline-none"
          >
            <option value="default">DEFAULT SORTING</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>

          <div className="ml-15 border-l-4 border-[#E4E4E4] pl-15">
            <ul className="text-primary flex gap-2.75 text-sm font-medium">
              <li>VIEW</li>
              <li className="cursor-pointer" onClick={() => setView(2)}>2</li>
              <li className="cursor-pointer" onClick={() => setView(3)}>3</li>
              <li className="cursor-pointer" onClick={() => setView(4)}>4</li>
            </ul>
          </div>
        </div>
      </div>

      {/* show all products */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
        className="gap-7.5 w-250"
      >
        {visibleProducts.map((item) => (
          <div key={item.id} className="flex justify-center">
            <Product item={item} />
          </div>
        ))}
      </div>

      {totalPages > 0 && (
        <div className="mt-auto ">
        <ResponsivePagination
          current={currentPage}
          total={totalPages}
          onPageChange={setCurrentPage}
        />
        </div>
      )}
    </section>
  );
};

export default ShopAllProducts;