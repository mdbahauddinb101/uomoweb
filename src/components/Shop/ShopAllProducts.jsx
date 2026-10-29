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
  const [sortOrder, setSortOrder] = useState("default");

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
  const sortedList =
    sortOrder === "asc"
      ? [...list].sort((first, second) => first.price - second.price)
      : sortOrder === "desc"
        ? [...list].sort((first, second) => second.price - first.price)
        : list;
  const totalPages = Math.ceil(sortedList.length / PER_PAGE);
  const visibleProducts = sortedList.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const gridColumns =
    view === 1
      ? "grid-cols-1"
      : view === 2
      ? "grid-cols-2"
      : view === 3
        ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4";

  if (loading) {
    return (
      <div className="grid w-full min-w-0 grid-cols-1 gap-5 content-start sm:grid-cols-2 lg:gap-7.5">
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
    <section className="flex min-w-0 w-full flex-col">
      <div className="mb-6 flex w-full flex-col gap-4 border-b border-gray/20 pb-5 sm:gap-5 lg:mb-7 lg:flex-row lg:items-center lg:gap-6">
        <div className="min-w-0">
          <BreadCrumb />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap sm:justify-end sm:gap-5 lg:ml-auto">
          <select
            id="product-sorting"
            aria-label="Sort products"
            value={sortOrder}
            onChange={(event) => {
              setSortOrder(event.target.value);
              setCurrentPage(1);
            }}
            className="block min-w-32.5 flex-1 border border-gray/30 bg-white px-2 py-2 text-xs font-medium leading-5 outline-none focus:border-primary sm:w-44 sm:flex-none sm:px-3 lg:w-48"
          >
            <option value="default">DEFAULT SORTING</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>

          <div className="flex shrink-0 items-center gap-2 border-l border-gray/30 pl-3 sm:gap-3 sm:pl-5">
            <span className="text-[11px] font-medium tracking-wide text-gray">
              VIEW
            </span>
            <div
              role="group"
              aria-label="Product grid columns"
              className="inline-flex border border-gray/30 p-1"
            >
                {[1, 2, 3, 4].map((columns) => (
                <button
                  key={columns}
                  type="button"
                  onClick={() => setView(columns)}
                  aria-pressed={view === columns}
                  className={`${columns === 1 ? "grid sm:hidden" : columns > 2 ? "hidden sm:grid" : "grid"} size-6 cursor-pointer place-items-center text-xs transition-colors sm:size-7 ${
                    view === columns
                      ? "bg-primary font-semibold text-white"
                      : "text-primary hover:bg-gray/10"
                  }`}
                >
                  {columns}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* show all products */}
      <div
        className={`grid w-full min-w-0 gap-5 sm:gap-7.5 ${gridColumns}`}
      >
        {visibleProducts.map((item) => (
          <div key={item.id} className="flex justify-center">
            <Product item={item} />
          </div>
        ))}
      </div>

      {totalPages > 0 && (
        <div className="mt-8">
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