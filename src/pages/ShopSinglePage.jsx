import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { addtocart, decrementQuantity } from "../slices/cartSlice";
import { toggleWishlist } from "../slices/wishlistSlice";
import syncUserData from "../utils/syncCartUser";
import Price from "../components/common/Price";
import LocalizedText from "../components/common/LocalizedText";
import "swiper/css";
import "swiper/css/navigation";

/* Jost is used for the typography. Either keep this import, or add the <link>
   to your index.html and/or extend `fontFamily` in tailwind.config.js. */
const FONT_IMPORT =
  '@import url("https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap");';

/* ---------- Placeholder artwork (replace with real <img> tags) ---------- */
function Placeholder({ variant = 0, className = "" }) {
  const id = `clip-${variant}`;
  const shift = [0, 6, -6, 12][variant % 4];
  const tri = `${255 + shift},30 400,235 150,235`;
  return (
    <svg
      className={`block h-full w-full ${className}`}
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Product image placeholder"
    >
      <rect width="400" height="400" fill="#e6e6e6" />
      <rect x="200" y="300" width="200" height="100" fill="#ececec" />
      <circle cx="105" cy="290" r="170" fill="#bbbbbb" />
      <polygon points={tri} fill="#bbbbbb" />
      <clipPath id={id}>
        <circle cx="105" cy="290" r="170" />
      </clipPath>
      <polygon points={tri} fill="#e6e6e6" clipPath={`url(#${id})`} />
    </svg>
  );
}

/* ---------- Icons ---------- */
const HeartIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#d9232d" : "none"} stroke={filled ? "#d9232d" : "currentColor"} strokeWidth="1.6" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3 5 6.4 5c2 0 3.5 1.1 4.2 2.3h.8C12.1 6.1 13.6 5 15.6 5 19 5 20.8 8.6 19.5 11.8 19.5 11.8 12 21 12 21z" />
  </svg>
);
const ShareIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <circle cx="6" cy="12" r="2.6" />
    <circle cx="18" cy="5.5" r="2.6" />
    <circle cx="18" cy="18.5" r="2.6" />
    <path d="M8.3 10.7l7.4-4M8.3 13.3l7.4 4" />
  </svg>
);
const Chevron = ({ dir }) => (
  <svg width="8" height="10" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
    <path d={dir === "left" ? "M6 1L1 6l5 5" : "M2 1l5 5-5 5"} />
  </svg>
);

/* ---------- Data ---------- */
const SIZES = ["XS", "S", "M", "L", "XL"];
const COLORS = [
  { name: "Black", hex: "#1c1c1c", ring: "border-[#1c1c1c]" },
  { name: "Red", hex: "#d9232d", ring: "border-[#d9232d]" },
  { name: "Light grey", hex: "#e4e4e4", ring: "border-[#bbbbbb]" },
];
const TABS = [
  { id: "description", label: "Description" },
  { id: "additional", label: "Additional information" },
  { id: "reviews", label: "Reviews (3)" },
];
const REVIEWS = [
  { name: "Amelia R.", rating: 5, text: "Warm without being bulky. The hood sits well and the fit is true to size." },
  { name: "Daniel K.", rating: 4, text: "Great jacket for the price. The red is a little deeper than in the photos." },
  { name: "Sofia M.", rating: 5, text: "Light enough for autumn evenings and packs down small for travel." },
];
const BULLETS = [
  "Crest by cotton fibric with soft and smooth",
  "Simple, Configurable (e.g. size, color, etc.), bundled",
  "Downloadable/Digital Products, Virtual Products",
];
const NUMBERED = [
  "Create Store-specific attributes on the fly",
  "Simple, Configurable (e.g. size, color, etc.), bundled",
  "Downloadable/Digital Products, Virtual Products",
];
const META = [
  ["SKU:", "N/A"],
  ["Categories:", "Casual & Urban Wear, Jackets, Men"],
  ["Tags:", "biker, black, bomber, leather"],
];

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c1c1c]";

/* ---------- Page ---------- */
export default function ShopSinglePage() {
  const { id: currentProductId } = useParams();
  const dispatch = useDispatch();
  const cartItem = useSelector((state) =>
    state.cart.products.find((item) => String(item.id) === currentProductId)
  );
  const wishlist = useSelector((state) => state.wishlist.products);
  const [activeThumb, setActiveThumb] = useState(0);
  const [size, setSize] = useState("S");
  const [color, setColor] = useState(1);
  const [draftQty, setDraftQty] = useState(1);
  const [tab, setTab] = useState("description");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let active = true;

    axios
      .get("https://dummyjson.com/products?limit=100")
      .then((response) => {
        if (active) setRelatedProducts(response.data.products);
      })
      .catch((error) => {
        console.error("Unable to load related products", error);
      })
      .finally(() => {
        if (active) setRelatedLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setActiveThumb(0);
    setDraftQty(1);
  }, [currentProductId]);

  const currentProduct = relatedProducts.find(
    (product) => String(product.id) === currentProductId
  );
  const wished = wishlist.some(
    (product) => String(product.id) === currentProductId
  );
  const productImages = currentProduct
    ? currentProduct.images?.length
      ? currentProduct.images
      : currentProduct.thumbnail
        ? [currentProduct.thumbnail]
        : []
    : [];
  const activeImage = productImages[activeThumb] || productImages[0];
  const qty = Math.max(0, cartItem?.quantity ?? draftQty);

  const visibleRelatedProducts = relatedProducts
    .filter((product) => String(product.id) !== currentProductId)
    .slice(0, 12);

  const addToCart = () => {
    syncUserData(dispatch);
    if (!currentProduct || qty === 0) return;

    dispatch(
      addtocart({
        id: currentProduct.id,
        title: currentProduct.title,
        price: currentProduct.price,
        image: currentProduct.thumbnail,
        quantity: cartItem ? 1 : qty,
      })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const toggleProductWishlist = (product) => {
    if (!product) return;
    syncUserData(dispatch);
    dispatch(toggleWishlist(product));
  };

  const decreaseCartQuantity = () => {
    if (qty === 0) return;

    setDraftQty(qty - 1);
    if (cartItem) {
      dispatch(decrementQuantity({ id: cartItem.id }));
    }
  };

  const increaseCartQuantity = () => {
    syncUserData(dispatch);
    if (!currentProduct) return;

    const nextQuantity = qty + 1;
    setDraftQty(nextQuantity);
    dispatch(
      addtocart({
        id: currentProduct.id,
        title: currentProduct.title,
        price: currentProduct.price,
        image: currentProduct.thumbnail,
        quantity: cartItem ? 1 : nextQuantity,
      })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="mx-auto max-w-[1240px] bg-white px-4 pb-14 pt-4 font-['Jost','Helvetica_Neue',Arial,sans-serif] text-sm leading-relaxed text-[#1c1c1c] sm:px-6 sm:pb-20 sm:pt-6">
      <style>{FONT_IMPORT}</style>

      {/* ===== Product section ===== */}
      <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.25fr_1fr]">
        {/* Gallery */}
        <div className="flex flex-col-reverse gap-1.5 sm:flex-row">
          <ul className="flex flex-none gap-1.5 sm:w-[46px] sm:flex-col">
            {productImages.length > 0
              ? productImages.map((image, index) => (
                  <li key={`${currentProduct.id}-${image}`}>
                    <button
                      type="button"
                      onClick={() => setActiveThumb(index)}
                      aria-label={`Show image ${index + 1}`}
                      aria-pressed={activeThumb === index}
                      className={`block h-[46px] w-[46px] overflow-hidden border transition-opacity ${focus} ${
                        activeThumb === index
                          ? "border-[#1c1c1c] opacity-100"
                          : "border-transparent opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${currentProduct.title} view ${index + 1}`}
                        loading="lazy"
                        className="h-full w-full object-contain"
                      />
                    </button>
                  </li>
                ))
              : [0, 1, 2, 3].map((index) => (
                  <li key={index}>
                    <button
                      type="button"
                      aria-label={`Product image ${index + 1} loading`}
                      disabled
                      className="block h-[46px] w-[46px] overflow-hidden border border-transparent"
                    >
                      <Placeholder variant={index} />
                    </button>
                  </li>
                ))}
          </ul>
          <div className="aspect-square min-w-0 flex-1">
            {activeImage ? (
              <img
                src={activeImage}
                alt={currentProduct.title}
                className="h-full w-full bg-[#f2f2f2] object-contain"
              />
            ) : (
              <Placeholder variant={activeThumb} />
            )}
          </div>
        </div>

        {/* Details */}
        <div className="pt-0.5">
          <div className="mb-7 flex items-center justify-between text-[11px] uppercase tracking-[0.02em]">
            <nav aria-label="Breadcrumb" className="min-w-0 truncate">
              <Link to="/" className="hover:underline">Home</Link>
              <span aria-hidden="true"> / </span>
              <Link to="/shop" className="hover:underline">Shop</Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page" className="truncate">
                <LocalizedText text={currentProduct?.title ?? "Product"} />
              </span>
            </nav>
            <div className="flex gap-[18px]">
              <a href="#prev" className="inline-flex items-center gap-1.5">
                <Chevron dir="left" /> Prev
              </a>
              <a href="#next" className="inline-flex items-center gap-1.5">
                Next <Chevron dir="right" />
              </a>
            </div>
          </div>

          <h1 className="mb-2 text-[25px] font-normal leading-tight tracking-[-0.005em]">
            <LocalizedText
              text={
                currentProduct?.title ??
                (relatedLoading ? "Loading product..." : "Product not found")
              }
            />
          </h1>
          <p className="mb-[18px] text-[17px] font-medium">
            {currentProduct && <Price amount={currentProduct.price} />}
          </p>

          <p className="mb-[26px] max-w-[520px] text-xs leading-[1.7]">
            Phasellus sed volutpat orci. Fusce eget lore mauris vehicula elementum gravida nec dui.
            Aenean aliquam varius ipsum, non ultricies tellus sodales eu. Donec dignissim viverra nunc,
            ut aliquet magna posuere eget.
          </p>

          {/* Sizes */}
          <div className="mb-[18px] flex flex-wrap items-center gap-4">
            <span className="w-[52px] text-[11px] uppercase tracking-[0.03em]">Sizes</span>
            <div className="flex flex-1 gap-2" role="radiogroup" aria-label="Size">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={size === s}
                  onClick={() => setSize(s)}
                  className={`h-[22px] min-w-[30px] border px-1.5 text-[10px] uppercase transition-colors ${focus} ${
                    size === s ? "border-[#1c1c1c]" : "border-[#e2e2e2] hover:border-[#999]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <a
              href="#size-guide"
              className="border-b border-[#1c1c1c] pb-px text-[11px] uppercase leading-snug"
            >
              Size guide
            </a>
          </div>

          {/* Colors */}
          <div className="mb-[18px] flex items-center gap-4">
            <span className="w-[52px] text-[11px] uppercase tracking-[0.03em]">Color</span>
            <div className="flex items-center gap-2" role="radiogroup" aria-label="Color">
              {COLORS.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  role="radio"
                  aria-checked={color === i}
                  aria-label={c.name}
                  title={c.name}
                  onClick={() => setColor(i)}
                  className={`grid h-[18px] w-[18px] place-items-center rounded-full border-[1.5px] ${focus} ${
                    color === i ? c.ring : "border-transparent"
                  }`}
                >
                  <span className="block h-2.5 w-2.5 rounded-full" style={{ background: c.hex }} />
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Add to cart */}
          <div className="mb-[22px] mt-[30px] flex gap-3">
            <div className="flex h-[46px] w-[58px] items-center justify-between border border-[#e2e2e2] px-2 text-xs">
              <button
                type="button"
                onClick={decreaseCartQuantity}
                disabled={!cartItem || qty === 0}
                aria-label="Decrease quantity"
                className={`w-3.5 text-sm text-[#8a8a8a] hover:text-[#1c1c1c] disabled:cursor-not-allowed disabled:opacity-40 ${focus}`}
              >
                -
              </button>
              <span aria-live="polite">{qty}</span>
              <button
                type="button"
                onClick={increaseCartQuantity}
                disabled={!currentProduct}
                aria-label="Increase quantity"
                className={`w-3.5 text-sm text-[#8a8a8a] hover:text-[#1c1c1c] disabled:cursor-not-allowed disabled:opacity-40 ${focus}`}
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={addToCart}
              disabled={!currentProduct || qty === 0}
              className={`h-[46px] flex-1 bg-[#1c1c1c] text-[11px] uppercase tracking-[0.06em] text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 sm:w-[200px] sm:flex-none ${focus}`}
            >
              {added ? "Added to cart" : "Add to cart"}
            </button>
          </div>

          {/* Wishlist + share */}
          <div className="mb-6 flex gap-[22px]">
            <button
              type="button"
              onClick={() => toggleProductWishlist(currentProduct)}
              aria-pressed={wished}
              className={`inline-flex items-center gap-[7px] border-b border-[#1c1c1c] pb-[3px] text-[11px] uppercase tracking-[0.02em] ${focus}`}
            >
              <HeartIcon filled={wished} /> {wished ? "In wishlist" : "Add to wishlist"}
            </button>
            <button
              type="button"
              className={`inline-flex items-center gap-[7px] pb-[3px] text-[11px] uppercase tracking-[0.02em] ${focus}`}
            >
              <ShareIcon /> Share
            </button>
          </div>

          {/* Meta */}
          <dl className="text-[10px] leading-[1.9]">
            {META.map(([k, v]) => (
              <div key={k} className="flex gap-1">
                <dt className="uppercase text-[#8a8a8a]">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ===== Tabs ===== */}
      <section className="mx-auto mt-20 max-w-[760px]">
        <div className="mb-[34px] flex flex-wrap justify-center gap-x-[18px] gap-y-2 sm:gap-x-9" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => setTab(t.id)}
              className={`border-b py-1 text-[11px] uppercase tracking-[0.03em] ${focus} ${
                tab === t.id
                  ? "border-[#1c1c1c] text-[#1c1c1c]"
                  : "border-transparent text-[#666] hover:text-[#1c1c1c]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          className="text-[10.5px] leading-[1.9]"
        >
          {tab === "description" && (
            <>
              <h3 className="mb-2.5 text-[11px] font-medium">Sed do eiusmod tempor incididunt ut labore</h3>
              <p className="mb-6">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis
                unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
                aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta
                sunt explicabo.
              </p>

              <div className="mb-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="mb-2.5 text-[11px] font-medium">Why choose product?</h3>
                  <ul>
                    {BULLETS.map((b) => (
                      <li key={b} className="relative pl-4">
                        <span className="absolute left-[3px] top-[10px] h-[3px] w-[3px] rounded-full bg-[#8a8a8a]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2.5 text-[11px] font-medium">Sample Number List</h3>
                  <ol>
                    {NUMBERED.map((n, i) => (
                      <li key={n} className="relative pl-4">
                        <span className="absolute left-0 text-[#8a8a8a]">{i + 1}</span>
                        {n}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <h3 className="mb-2.5 text-[11px] font-medium">Lining</h3>
              <p>100% Polyester, Main: 100% Polyester.</p>
            </>
          )}

          {tab === "additional" && (
            <table className="w-full border-collapse">
              <tbody>
                {[
                  ["Size", "XS, S, M, L, XL"],
                  ["Color", COLORS.map((c) => c.name).join(", ")],
                  ["Lining", "100% Polyester"],
                  ["Main fabric", "100% Polyester"],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <th className="w-40 border-b border-[#e2e2e2] py-2.5 text-left font-normal text-[#8a8a8a]">{k}</th>
                    <td className="border-b border-[#e2e2e2] py-2.5 text-left">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === "reviews" && (
            <ul>
              {REVIEWS.map((r) => (
                <li key={r.name} className="border-b border-[#e2e2e2] py-3.5">
                  <div className="flex justify-between">
                    <strong className="font-medium">{r.name}</strong>
                    <span className="tracking-[2px]" aria-label={`${r.rating} out of 5`}>
                      {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </span>
                  </div>
                  <p className="mt-1">{r.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ===== Related products ===== */}
      <section className="mt-16 border-t border-[#e2e2e2] pt-8 sm:mt-20">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-light uppercase">
          Related <strong className="font-semibold">Products</strong>
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous related products"
              className={`related-products-prev grid size-9 place-items-center border border-[#e2e2e2] hover:border-[#1c1c1c] ${focus}`}
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              aria-label="Next related products"
              className={`related-products-next grid size-9 place-items-center border border-[#e2e2e2] hover:border-[#1c1c1c] ${focus}`}
            >
              <Chevron dir="right" />
            </button>
          </div>
        </div>
        {relatedLoading ? (
          <p className="py-10 text-center text-xs text-[#8a8a8a]" aria-live="polite">
            Loading related products...
          </p>
        ) : visibleRelatedProducts.length > 0 ? (
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: ".related-products-prev",
              nextEl: ".related-products-next",
            }}
            spaceBetween={12}
            slidesPerView={1.4}
            breakpoints={{
              480: { slidesPerView: 2, spaceBetween: 16 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
            }}
          >
            {visibleRelatedProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <article>
                  <Link
                    to={`/shopsinglepage/${product.id}`}
                    className="mb-2.5 block aspect-square overflow-hidden bg-[#f2f2f2]"
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <div className="flex items-center justify-between text-[10px] text-[#8a8a8a]">
                    <span className="capitalize">
                      <LocalizedText text={product.category} />
                    </span>
                    <button
                      type="button"
                      aria-label={wishlist.some((item) => item.id === product.id) ? "Remove from wishlist" : "Add to wishlist"}
                      aria-pressed={wishlist.some((item) => item.id === product.id)}
                      onClick={() => toggleProductWishlist(product)}
                      className={`grid h-7 w-7 place-items-center text-[#8a8a8a] hover:text-[#1c1c1c] ${focus}`}
                    >
                      <HeartIcon filled={wishlist.some((item) => item.id === product.id)} />
                    </button>
                  </div>
                  <Link
                    to={`/shopsinglepage/${product.id}`}
                    className="block text-[11.5px] leading-normal hover:underline"
                  >
                    <LocalizedText text={product.title} />
                  </Link>
                  <p className="text-[11.5px]">
                    <Price amount={product.price} />
                  </p>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="py-10 text-center text-xs text-[#8a8a8a]">
            No related products available.
          </p>
        )}
      </section>
    </div>
  );
}
