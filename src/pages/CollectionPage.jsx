import { useMemo, useState } from "react";
import { Link } from "react-router";

/* Jost matches the single product page. Keep this import, or load the font
   in index.html / tailwind.config.js instead. */
const FONT_IMPORT =
  '@import url("https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap");';

/* ---------- Data ---------- */
const COLOR_HEX = {
  Black: "#1c1c1c",
  White: "#f1f1f1",
  Red: "#d9232d",
  Navy: "#1f2a44",
  Beige: "#d8c8ae",
  Grey: "#9a9a9a",
};
const ALL_SIZES = ["XS", "S", "M", "L", "XL"];
const CATEGORIES = ["All", "Jackets", "Knitwear", "T-Shirts", "Shorts", "Dresses"];
const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "new", label: "Newest" },
  { id: "low", label: "Price: low to high" },
  { id: "high", label: "Price: high to low" },
  { id: "az", label: "Name: A to Z" },
];
const MAX_PRICE = 300;
const PAGE_SIZE = 8;

const PRODUCTS = [
  { id: 1, name: "Lightweight Puffer Jacket", category: "Jackets", price: 249, sizes: ["S", "M", "L"], colors: ["Black", "Red", "Grey"], tag: "New" },
  { id: 2, name: "Cropped Faux Leather Jacket", category: "Jackets", price: 129, oldPrice: 169, sizes: ["XS", "S", "M"], colors: ["Black"], tag: "Sale" },
  { id: 3, name: "Cableknit Shawl", category: "Knitwear", price: 99, oldPrice: 129, sizes: ["M", "L"], colors: ["Beige", "Grey"], tag: "Sale" },
  { id: 4, name: "Calvin Shorts", category: "Shorts", price: 62, sizes: ["S", "M", "L", "XL"], colors: ["Navy", "Beige"] },
  { id: 5, name: "Kirby T-Shirt", category: "T-Shirts", price: 17, sizes: ["XS", "S", "M", "L", "XL"], colors: ["White", "Black", "Red"] },
  { id: 6, name: "Merino Crew Sweater", category: "Knitwear", price: 118, sizes: ["S", "M", "L"], colors: ["Navy", "Grey"], tag: "New" },
  { id: 7, name: "Linen Wrap Dress", category: "Dresses", price: 145, sizes: ["XS", "S", "M"], colors: ["Beige", "White"] },
  { id: 8, name: "Hooded Windbreaker", category: "Jackets", price: 189, sizes: ["M", "L", "XL"], colors: ["Navy", "Black"] },
  { id: 9, name: "Boxy Pocket Tee", category: "T-Shirts", price: 29, sizes: ["S", "M", "L"], colors: ["Grey", "White"] },
  { id: 10, name: "Pleated Midi Dress", category: "Dresses", price: 175, oldPrice: 220, sizes: ["XS", "S", "M", "L"], colors: ["Red", "Black"], tag: "Sale" },
  { id: 11, name: "Ribbed Cardigan", category: "Knitwear", price: 89, sizes: ["S", "M", "L", "XL"], colors: ["Beige", "Navy"] },
  { id: 12, name: "Tailored Bermuda Shorts", category: "Shorts", price: 54, sizes: ["S", "M", "L"], colors: ["Grey", "Black"], tag: "New" },
];

/* ---------- Placeholder artwork (replace with <img>) ---------- */
function Placeholder({ seed = 0 }) {
  const id = `ph-${seed}`;
  const x = 230 + ((seed * 17) % 40);
  const tri = `${x},60 400,330 120,330`;
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="block h-full w-full" role="img" aria-label="Product image placeholder">
      <rect width="400" height="500" fill="#e6e6e6" />
      <rect x="180" y="380" width="220" height="120" fill="#ececec" />
      <circle cx="110" cy="360" r="190" fill="#bbbbbb" />
      <polygon points={tri} fill="#bbbbbb" />
      <clipPath id={id}><circle cx="110" cy="360" r="190" /></clipPath>
      <polygon points={tri} fill="#e6e6e6" clipPath={`url(#${id})`} />
    </svg>
  );
}

/* ---------- Icons ---------- */
const Heart = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#d9232d" : "none"} stroke={filled ? "#d9232d" : "currentColor"} strokeWidth="1.6" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3 5 6.4 5c2 0 3.5 1.1 4.2 2.3h.8C12.1 6.1 13.6 5 15.6 5 19 5 20.8 8.6 19.5 11.8 19.5 11.8 12 21 12 21z" />
  </svg>
);
const Close = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" /></svg>
);
const Sliders = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></svg>
);
const GridIcon = ({ cols }) => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="currentColor" aria-hidden="true">
    {Array.from({ length: cols }).map((_, i) => {
      const w = (18 - (cols - 1) * 2) / cols;
      return <rect key={i} x={i * (w + 2)} y="0" width={w} height="14" />;
    })}
  </svg>
);

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c1c1c]";

/* ---------- Filter panel (used in sidebar + mobile drawer) ---------- */
function FilterPanel({ filters, setFilters, counts }) {
  const toggle = (key, value) =>
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));

  const Group = ({ title, children }) => (
    <fieldset className="border-b border-[#e2e2e2] py-6 first:pt-0">
      <legend className="mb-3.5 text-[11px] font-medium uppercase tracking-[0.06em]">{title}</legend>
      {children}
    </fieldset>
  );

  return (
    <div>
      <Group title="Category">
        <ul className="space-y-2">
          {CATEGORIES.map((c) => (
            <li key={c}>
              <button
                type="button"
                onClick={() => setFilters((f) => ({ ...f, category: c }))}
                aria-pressed={filters.category === c}
                className={`flex w-full items-center justify-between text-[13px] ${focus} ${
                  filters.category === c ? "font-medium text-[#1c1c1c]" : "text-[#666] hover:text-[#1c1c1c]"
                }`}
              >
                <span>{c}</span>
                <span className="text-[11px] text-[#8a8a8a]">{counts[c]}</span>
              </button>
            </li>
          ))}
        </ul>
      </Group>

      <Group title="Size">
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => {
            const on = filters.sizes.includes(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={on}
                onClick={() => toggle("sizes", s)}
                className={`h-8 min-w-[40px] border px-2 text-[11px] uppercase transition-colors ${focus} ${
                  on ? "border-[#1c1c1c] bg-[#1c1c1c] text-white" : "border-[#e2e2e2] hover:border-[#999]"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Color">
        <div className="flex flex-wrap gap-3">
          {Object.entries(COLOR_HEX).map(([name, hex]) => {
            const on = filters.colors.includes(name);
            return (
              <button
                key={name}
                type="button"
                aria-label={name}
                aria-pressed={on}
                title={name}
                onClick={() => toggle("colors", name)}
                className={`grid h-7 w-7 place-items-center rounded-full border-[1.5px] ${focus} ${on ? "border-[#1c1c1c]" : "border-transparent"}`}
              >
                <span className="block h-[18px] w-[18px] rounded-full border border-black/10" style={{ background: hex }} />
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Price">
        <input
          type="range"
          min="10"
          max={MAX_PRICE}
          step="5"
          value={filters.maxPrice}
          onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))}
          aria-label="Maximum price"
          className="w-full accent-[#1c1c1c]"
        />
        <div className="mt-2 flex justify-between text-xs text-[#666]">
          <span>$10</span>
          <span className="font-medium text-[#1c1c1c]">Up to ${filters.maxPrice}</span>
        </div>
      </Group>
    </div>
  );
}

/* ---------- Product card ---------- */
function ProductCard({ p, wished, onWish, onAdd, added }) {
  return (
    <article className="group">
      <div className="relative mb-3 aspect-[4/5] overflow-hidden bg-[#e6e6e6]">
        <a href={`#product-${p.id}`} className="block h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
          <Placeholder seed={p.id} />
        </a>

        {p.tag && (
          <span className={`absolute left-3 top-3 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] ${p.tag === "Sale" ? "bg-[#d9232d] text-white" : "bg-white text-[#1c1c1c]"}`}>
            {p.tag}
          </span>
        )}

        <button
          type="button"
          onClick={onWish}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
          className={`absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[#1c1c1c] transition hover:bg-white ${focus}`}
        >
          <Heart filled={wished} />
        </button>

        <button
          type="button"
          onClick={onAdd}
          className={`absolute inset-x-0 bottom-0 h-11 translate-y-full bg-[#1c1c1c] text-[11px] uppercase tracking-[0.08em] text-white transition-transform duration-300 focus-visible:translate-y-0 group-hover:translate-y-0 max-lg:translate-y-0 max-lg:bg-white/95 max-lg:text-[#1c1c1c] ${focus}`}
        >
          {added ? "Added to cart" : "Quick add"}
        </button>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.04em] text-[#8a8a8a]">{p.category}</p>
          <a href={`#product-${p.id}`} className="block truncate text-[13px] hover:underline">{p.name}</a>
        </div>
        <p className="flex-none text-[13px]">
          {p.oldPrice && <s className="mr-1.5 text-[#8a8a8a]">${p.oldPrice}</s>}
          <span className={p.oldPrice ? "text-[#d9232d]" : ""}>${p.price}</span>
        </p>
      </div>

      <div className="mt-2 flex gap-1.5">
        {p.colors.map((c) => (
          <span key={c} title={c} className="h-3 w-3 rounded-full border border-black/15" style={{ background: COLOR_HEX[c] }} />
        ))}
      </div>
    </article>
  );
}

/* ---------- Page ---------- */
const GRID = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };
const INITIAL = { category: "All", sizes: [], colors: [], maxPrice: MAX_PRICE };

export default function CollectionPage() {
  const [filters, setFilters] = useState(INITIAL);
  const [sort, setSort] = useState("featured");
  const [cols, setCols] = useState(3);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [drawer, setDrawer] = useState(false);
  const [wishlist, setWishlist] = useState({});
  const [addedId, setAddedId] = useState(null);

  const setF = (updater) => {
    setFilters(updater);
    setVisible(PAGE_SIZE);
  };

  // Counts per category reflect the other active filters
  const matches = (p, f, ignoreCategory) =>
    (ignoreCategory || f.category === "All" || p.category === f.category) &&
    (f.sizes.length === 0 || f.sizes.some((s) => p.sizes.includes(s))) &&
    (f.colors.length === 0 || f.colors.some((c) => p.colors.includes(c))) &&
    p.price <= f.maxPrice;

  const counts = useMemo(() => {
    const base = PRODUCTS.filter((p) => matches(p, filters, true));
    const out = { All: base.length };
    CATEGORIES.slice(1).forEach((c) => (out[c] = base.filter((p) => p.category === c).length));
    return out;
  }, [filters]);

  const results = useMemo(() => {
    const list = PRODUCTS.filter((p) => matches(p, filters, false));
    const sorters = {
      featured: () => 0,
      new: (a, b) => b.id - a.id,
      low: (a, b) => a.price - b.price,
      high: (a, b) => b.price - a.price,
      az: (a, b) => a.name.localeCompare(b.name),
    };
    return [...list].sort(sorters[sort]);
  }, [filters, sort]);

  const chips = [
    ...(filters.category !== "All" ? [{ label: filters.category, clear: () => setF((f) => ({ ...f, category: "All" })) }] : []),
    ...filters.sizes.map((s) => ({ label: `Size ${s}`, clear: () => setF((f) => ({ ...f, sizes: f.sizes.filter((x) => x !== s) })) })),
    ...filters.colors.map((c) => ({ label: c, clear: () => setF((f) => ({ ...f, colors: f.colors.filter((x) => x !== c) })) })),
    ...(filters.maxPrice < MAX_PRICE ? [{ label: `Under $${filters.maxPrice}`, clear: () => setF((f) => ({ ...f, maxPrice: MAX_PRICE })) }] : []),
  ];

  const handleAdd = (id) => {
    setAddedId(id);
    setTimeout(() => setAddedId((cur) => (cur === id ? null : cur)), 1600);
  };

  const shown = results.slice(0, visible);

  return (
    <div className="min-h-screen bg-white font-['Jost','Helvetica_Neue',Arial,sans-serif] text-sm text-[#1c1c1c]">
      <style>{FONT_IMPORT}</style>

      {/* Header */}
      <header className="border-b border-[#e2e2e2] bg-[#f5f5f5]">
        <div className="mx-auto max-w-[1280px] px-4 py-12 text-center sm:px-6 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center justify-center gap-2 text-[11px] uppercase tracking-[0.04em] text-[#8a8a8a]">
            <Link to="/" className="hover:text-[#1c1c1c]">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/shop" className="hover:text-[#1c1c1c]">Shop</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-[#1c1c1c]">
              {filters.category === "All" ? "Collection" : filters.category}
            </span>
          </nav>
          <h1 className="text-4xl font-light tracking-[-0.01em] sm:text-5xl">Autumn Collection</h1>
          <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-[#666]">
            Light layers, soft knits and everyday basics for the cooler months.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-4 pb-20 sm:px-6">
        {/* Toolbar */}
        <div className="sticky top-0 z-20 -mx-4 flex items-center justify-between gap-4 border-b border-[#e2e2e2] bg-white/95 px-4 py-3.5 backdrop-blur sm:-mx-6 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className={`inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.06em] lg:hidden ${focus}`}
            >
              <Sliders /> Filters{chips.length > 0 && ` (${chips.length})`}
            </button>
            <p className="text-[13px] text-[#666]" aria-live="polite">
              {results.length} {results.length === 1 ? "product" : "products"}
            </p>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden items-center gap-3 lg:flex" role="group" aria-label="Columns">
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCols(n)}
                  aria-pressed={cols === n}
                  aria-label={`${n} columns`}
                  className={`transition-colors ${focus} ${cols === n ? "text-[#1c1c1c]" : "text-[#bbb] hover:text-[#666]"}`}
                >
                  <GridIcon cols={n} />
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-[12px]">
              <span className="hidden text-[#8a8a8a] sm:inline">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className={`cursor-pointer border border-[#e2e2e2] bg-white py-1.5 pl-2.5 pr-7 text-[12px] ${focus}`}
              >
                {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
          </div>
        </div>

        <div className="grid gap-10 pt-8 lg:grid-cols-[220px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-[72px]">
              <FilterPanel filters={filters} setFilters={setF} counts={counts} />
            </div>
          </aside>

          {/* Results */}
          <main>
            {chips.length > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {chips.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={c.clear}
                    className={`inline-flex items-center gap-2 border border-[#e2e2e2] px-3 py-1 text-[12px] hover:border-[#1c1c1c] ${focus}`}
                  >
                    {c.label} <Close />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setF(INITIAL)}
                  className={`ml-1 border-b border-[#1c1c1c] text-[11px] uppercase tracking-[0.04em] ${focus}`}
                >
                  Clear all
                </button>
              </div>
            )}

            {results.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-lg font-light">No products match these filters.</p>
                <p className="mt-2 text-[#666]">Try removing a filter or raising the price limit.</p>
                <button
                  type="button"
                  onClick={() => setF(INITIAL)}
                  className={`mt-6 h-11 bg-[#1c1c1c] px-8 text-[11px] uppercase tracking-[0.08em] text-white hover:bg-black ${focus}`}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className={`grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 ${GRID[cols]}`}>
                  {shown.map((p) => (
                    <ProductCard
                      key={p.id}
                      p={p}
                      wished={!!wishlist[p.id]}
                      onWish={() => setWishlist((w) => ({ ...w, [p.id]: !w[p.id] }))}
                      onAdd={() => handleAdd(p.id)}
                      added={addedId === p.id}
                    />
                  ))}
                </div>

                <div className="mt-14 text-center">
                  <p className="text-[12px] text-[#666]">Showing {shown.length} of {results.length}</p>
                  <div className="mx-auto mt-3 h-px w-40 bg-[#e2e2e2]">
                    <div className="h-px bg-[#1c1c1c]" style={{ width: `${(shown.length / results.length) * 100}%` }} />
                  </div>
                  {shown.length < results.length && (
                    <button
                      type="button"
                      onClick={() => setVisible((v) => v + PAGE_SIZE)}
                      className={`mt-6 h-11 border border-[#1c1c1c] px-10 text-[11px] uppercase tracking-[0.08em] transition-colors hover:bg-[#1c1c1c] hover:text-white ${focus}`}
                    >
                      Load more
                    </button>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div className={`fixed inset-0 z-40 lg:hidden ${drawer ? "" : "pointer-events-none"}`} aria-hidden={!drawer}>
        <div
          onClick={() => setDrawer(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${drawer ? "opacity-100" : "opacity-0"}`}
        />
        <div
          role="dialog"
          aria-label="Filters"
          className={`absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-white transition-transform duration-300 ${drawer ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between border-b border-[#e2e2e2] px-5 py-4">
            <h2 className="text-[13px] font-medium uppercase tracking-[0.06em]">Filters</h2>
            <button type="button" onClick={() => setDrawer(false)} aria-label="Close filters" className={`p-1 ${focus}`}>
              <Close />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <FilterPanel filters={filters} setFilters={setF} counts={counts} />
          </div>
          <div className="flex gap-3 border-t border-[#e2e2e2] p-4">
            <button
              type="button"
              onClick={() => setF(INITIAL)}
              className={`h-11 flex-1 border border-[#e2e2e2] text-[11px] uppercase tracking-[0.08em] ${focus}`}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setDrawer(false)}
              className={`h-11 flex-[2] bg-[#1c1c1c] text-[11px] uppercase tracking-[0.08em] text-white ${focus}`}
            >
              Show {results.length} results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
