import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addproduct, filterproduct  } from "../../slices/productSlice";
import { SlidersHorizontal } from "lucide-react";
import Price from "../common/Price";
import { useLocalization } from "../../localization/LocalizationContext";
import LocalizedText from "../common/LocalizedText";
import LocalizedInput from "../common/LocalizedInput";

/* ---------- Data (swap with props / API data) ---------- */



const COLORS = [
  { name: "Navy", value: "#0f2a6b" },
  { name: "Gold", value: "#d4b13a" },
  { name: "Black", value: "#222222" },
  { name: "Sky", value: "#a9d3e8" },
  { name: "Brown", value: "#9a6b2f" },
  { name: "Mustard", value: "#d6a03c" },
  { name: "Peach", value: "#e8a98d" },
  { name: "Grey", value: "#b5b5b5" },
  { name: "Red", value: "#d9605f" },
  { name: "Mint", value: "#b9dcc4" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const BRANDS = [
  { name: "Adidas", count: 2 },
  { name: "Balmain", count: 7 },
  { name: "Balenciaga", count: 10 },
  { name: "Burberry", count: 39 },
  { name: "Kenzo", count: 95 },
  { name: "Givenchy", count: 1092 },
  { name: "Zara", count: 48 },
];

const PRICE_MIN = 0;
const PRICE_MAX = 1000;

/* ---------- Icons ---------- */

const ChevronIcon = ({ open }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={`transition-transform duration-200 ${open ? "" : "rotate-180"}`}
  >
    <path d="M2 7.5 6 3.5l4 4" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="7" cy="7" r="5" />
    <path d="m11 11 3.5 3.5" />
  </svg>
);

/* ---------- Collapsible section ---------- */

function FilterSection({ title, defaultOpen = true, centered = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`relative flex w-full cursor-pointer items-center ${centered ? "justify-center text-center lg:justify-between lg:text-left" : "justify-between text-left"}`}
      >
        <h3 className="text-base font-medium uppercase text-primary">
          <LocalizedText text={title} />
        </h3>
        <span className={`text-primary ${centered ? "absolute right-0 lg:static" : ""}`}>
          <ChevronIcon open={open} />
        </span>
      </button>
      {open && <div className="mt-4">{children}</div>}
    </section>
  );
}

/* ---------- Price range (dual thumb) ---------- */

const thumb =
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-white " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-solid [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-white";

function PriceRange({ value, onChange }) {
  const [min, max] = value;
  const { rate } = useLocalization();
  const displayRate = rate || 1;
  const pct = (v) =>
    ((v - PRICE_MIN * displayRate) /
      ((PRICE_MAX - PRICE_MIN) * displayRate)) *
    100;

  return (
    <div>
      <div className="relative h-3.5">
        {/* track */}
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gray/20" />
        {/* active range */}
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 bg-primary"
          style={{
            left: `${pct(min * displayRate)}%`,
            width: `${pct(max * displayRate) - pct(min * displayRate)}%`,
          }}
        />
        <input
          type="range"
          min={PRICE_MIN * displayRate}
          max={PRICE_MAX * displayRate}
          value={min * displayRate}
          disabled={!Number.isFinite(rate)}
          aria-label="Minimum price"
          onChange={(e) =>
            onChange([
              Math.min(+e.target.value / displayRate, max - 1),
              max,
            ])
          }
          className={`pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent ${thumb}`}
        />
        <LocalizedInput
          type="range"
          min={PRICE_MIN * displayRate}
          max={PRICE_MAX * displayRate}
          value={max * displayRate}
          disabled={!Number.isFinite(rate)}
          aria-label="Maximum price"
          onChange={(e) =>
            onChange([
              min,
              Math.max(+e.target.value / displayRate, min + 1),
            ])
          }
          className={`pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent ${thumb}`}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-gray">
        <span>
          Min Price: <span className="font-medium text-primary"><Price amount={min} /></span>
        </span>
        <span>
          Max Price: <span className="font-medium text-primary"><Price amount={max} /></span>
        </span>
      </div>
    </div>
  );
}

/* ---------- Sidebar ---------- */

export default function ProductSidebar({ onChange }) {
  let products = useSelector(state => state.product.products.products);
  let dispatch = useDispatch();
 let categories = products.map((item)=>{
        return item.category
 })

 const CATEGORIES = [...new Set(categories)]
  
;

  const [category, setCategory] = useState("All");
  const [color, setColor] = useState("Grey");
  const [sizes, setSizes] = useState([]);
  const [brandQuery, setBrandQuery] = useState("");
  const [brands, setBrands] = useState([]);
  const [price, setPrice] = useState([29, 937]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggle = (list, setList, item) =>
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);

  const visibleBrands = useMemo(
    () =>
      BRANDS.filter((b) =>
        b.name.toLowerCase().includes(brandQuery.trim().toLowerCase())
      ),
    [brandQuery]
  );

  const handleActiveCategory = (name) =>{
    setCategory(name);

    let filterProduct = products.filter((item) => item.category === name);
    dispatch(filterproduct(filterProduct));
    

  } 

  // Optional: notify the parent whenever filters change
  // useEffect(() => onChange?.({ category, color, sizes, brands, price }), [...]);

  return (
    <aside className="w-full shrink-0 font-jost text-primary lg:mb-40 lg:max-w-56">
      <button
        type="button"
        onClick={() => setFiltersOpen((open) => !open)}
        aria-expanded={filtersOpen}
        className="mx-auto mb-5 flex w-fit items-center justify-center gap-2 border border-gray/30 px-4 py-2.5 text-xs font-medium uppercase tracking-wide transition-colors hover:border-primary lg:hidden"
      >
        <SlidersHorizontal size={16} aria-hidden="true" />
        <span>Filters</span>
        <span className="ml-1">
          <ChevronIcon open={filtersOpen} />
        </span>
      </button>
      <div
        className={`${filtersOpen ? "block" : "hidden"} lg:block`}
      >
      <div className="flex flex-col gap-9">
        {/* Categories */}
        <FilterSection title="Product Categories" centered>
          <ul className="grid grid-cols-2 justify-items-center gap-2 sm:grid-cols-3 lg:flex lg:flex-col lg:items-start lg:gap-2.5">
            <li className="text-center lg:text-left">
              <button
                type="button"
                onClick={() => handleActiveCategory("All")}
                className={`w-full cursor-pointer text-center text-xs capitalize transition-colors hover:text-gray sm:text-sm lg:w-auto lg:text-left ${
                  category === "All" ? "font-medium text-primary" : "text-primary"
                }`}
              >
                All
              </button>
            </li>
            {CATEGORIES.map((name) => (
              <li key={name} className="text-center lg:text-left">
                <button
                  type="button"
                  onClick={() => handleActiveCategory(name)}
                  className={`w-full cursor-pointer text-center text-xs capitalize transition-colors hover:text-gray sm:text-sm lg:w-auto lg:text-left ${
                    category === name ? "font-medium text-primary" : "text-primary"
                  }`}
                >
                  <LocalizedText text={name} />
                </button>
              </li>
            ))}
          </ul>
        </FilterSection>

        {/* Color */}
        <FilterSection title="Color">
          <div className="flex flex-wrap gap-x-4 gap-y-3.5">
            {COLORS.map((c) => (
              <button
                key={c.name}
                type="button"
                title={c.name}
                aria-label={c.name}
                aria-pressed={color === c.name}
                onClick={() => setColor(color === c.name ? null : c.name)}
                style={{ backgroundColor: c.value }}
                className={`size-3 cursor-pointer rounded-full outline-offset-4 transition ${
                  color === c.name ? "outline outline-1 outline-primary" : ""
                }`}
              />
            ))}
          </div>
        </FilterSection>

        {/* Sizes */}
        <FilterSection title="Sizes">
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => {
              const active = sizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(sizes, setSizes, s)}
                  className={`h-8 min-w-9 cursor-pointer border px-3 text-xs transition-colors ${
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-gray/30 text-primary hover:border-primary"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Brands */}
        <FilterSection title="Brands">
          <div className="relative">
            <input
              type="text"
              value={brandQuery}
              onChange={(e) => setBrandQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search brands"
              className="h-11 w-full border border-gray/30 bg-white pl-3 pr-10 text-xs text-primary outline-none placeholder:text-gray focus:border-primary"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray">
              <SearchIcon />
            </span>
          </div>

          <ul className="mt-4 flex flex-col gap-3.5">
            {visibleBrands.map((b) => (
              <li key={b.name}>
                <label className="flex cursor-pointer items-center gap-2.5 text-xs">
                  <input
                    type="checkbox"
                    checked={brands.includes(b.name)}
                    onChange={() => toggle(brands, setBrands, b.name)}
                    className="size-3.5 shrink-0 cursor-pointer appearance-none border border-gray/50 bg-white checked:border-primary checked:bg-primary checked:shadow-[inset_0_0_0_2px_white]"
                  />
                  <span className="flex-1 text-primary">
                    <LocalizedText text={b.name} />
                  </span>
                  <span className="text-gray">{b.count}</span>
                </label>
              </li>
            ))}
            {visibleBrands.length === 0 && (
              <li className="text-xs text-gray">No brands match “{brandQuery}”.</li>
            )}
          </ul>
        </FilterSection>

        {/* Price */}
        <FilterSection title="Price">
          <PriceRange value={price} onChange={setPrice} />
        </FilterSection>
      </div>
      </div>
    </aside>
  );
}