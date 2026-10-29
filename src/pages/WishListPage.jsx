import { useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addtocart } from "../slices/cartSlice";
import {
  clearWishlist,
  removeFromWishlist,
} from "../slices/wishlistSlice";
import syncUserData from "../utils/syncCartUser";
import Price from "../components/common/Price";
import LocalizedText from "../components/common/LocalizedText";

const SORTS = [
  { value: "newest", label: "Recently added" },
  { value: "low", label: "Price: low to high" },
  { value: "high", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
];

const WishlistCard = ({ item, onRemove, onAddToCart, justAdded }) => (
  <article className="flex flex-col border border-[#CFCDCD] bg-white">
    <Link
      to={`/shopsinglepage/${item.id}`}
      className="block h-56 bg-[#f2f2f2]"
    >
      <img
        src={item.thumbnail}
        alt={item.title}
        loading="lazy"
        className="h-full w-full object-contain"
      />
    </Link>

    <div className="flex flex-1 flex-col gap-3 p-4">
      <div className="flex-1">
        <p className="text-sm capitalize text-[#767676]">
          <LocalizedText text={item.category} />
        </p>
        <h3 className="text-primary text-base leading-6 font-medium">
          <Link to={`/shopsinglepage/${item.id}`}>
            <LocalizedText text={item.title} />
          </Link>
        </h3>
      </div>
      <p className="text-lg font-medium">
        <Price amount={item.price} />
      </p>

      <button
        type="button"
        onClick={() => onAddToCart(item)}
        className="cursor-pointer bg-[#222222] py-3 text-sm font-medium text-white"
      >
        {justAdded ? "Added to cart" : "Add to cart"}
      </button>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="cursor-pointer py-2 text-sm text-[#767676] hover:text-[#d9232d]"
      >
        Remove from wishlist
      </button>
    </div>
  </article>
);

const WishListPage = () => {
  const items = useSelector((state) => state.wishlist.products);
  const dispatch = useDispatch();
  const [sort, setSort] = useState("newest");
  const [addedId, setAddedId] = useState(null);

  const addToCart = (item) => {
    syncUserData(dispatch);

    dispatch(
      addtocart({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.thumbnail,
        quantity: 1,
      }),
    );
    setAddedId(item.id);
    setTimeout(() => setAddedId((current) => (current === item.id ? null : current)), 1500);
  };

  const sorted = [...items].sort((first, second) => {
    if (sort === "low") {
      return first.price - second.price || first.title.localeCompare(second.title);
    }
    if (sort === "high") {
      return second.price - first.price || first.title.localeCompare(second.title);
    }
    if (sort === "name") {
      return first.title.localeCompare(second.title);
    }
    return (
      (second.addedAt || 0) - (first.addedAt || 0) ||
      first.title.localeCompare(second.title)
    );
  });

  const totalValue = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      <section className="bg-[#E4E4E4]">
        <div className="container px-4 py-10 sm:px-6 lg:py-16">
          <h1 className="text-primary text-4xl leading-tight font-medium lg:text-6xl">
            Your wishlist
          </h1>
          <p className="mt-4 text-[#767676]">
            {items.length === 0 ? (
              "Nothing saved yet."
            ) : (
              <>
                {items.length}{" "}
                <LocalizedText text={items.length === 1 ? "item" : "items"} />{" "}
                saved,
                {" worth "}
                <Price amount={totalValue} />
                {" together."}
              </>
            )}
          </p>
        </div>
      </section>

      <main className="container px-4 py-10 sm:px-6 lg:py-14">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-5 py-16 text-center">
            <span className="text-6xl" aria-hidden="true">
              ♡
            </span>
            <h2 className="text-primary text-2xl font-medium">Your wishlist is empty</h2>
            <p className="max-w-sm text-[#767676]">
              Tap the heart on a product to save it here for later.
            </p>
            <Link to="/shop" className="bg-[#222222] px-7 py-3 text-sm font-medium text-white">
              Start browsing
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <label className="flex items-center gap-3 text-sm">
                <span className="text-[#767676]">Sort by</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="border border-[#CFCDCD] bg-white px-3 py-2 outline-none focus:border-[#222222]"
                >
                  {SORTS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      <LocalizedText text={label} />
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => dispatch(clearWishlist())}
                  className="cursor-pointer border border-[#CFCDCD] px-5 py-2 text-sm"
                >
                  Clear wishlist
                </button>
                <button
                  type="button"
                  onClick={() => items.forEach(addToCart)}
                  className="cursor-pointer bg-[#222222] px-5 py-2 text-sm font-medium text-white"
                >
                  Add all to cart
                </button>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sorted.map((item) => (
                <WishlistCard
                  key={item.id}
                  item={item}
                  onRemove={(id) => dispatch(removeFromWishlist(id))}
                  onAddToCart={addToCart}
                  justAdded={addedId === item.id}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default WishListPage;
