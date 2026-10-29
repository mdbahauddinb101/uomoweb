import { useMemo, useState } from "react";
import { Link } from "react-router";

/* Jost matches the shop pages. Keep this import, or load the font
   in index.html / tailwind.config.js instead. */
const FONT_IMPORT =
  '@import url("https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap");';

/* ---------- Data ---------- */
const CATEGORIES = ["All", "Style Guides", "Behind the Seams", "Care & Craft", "Culture"];
const PAGE_SIZE = 6;

const POSTS = [
  { id: 1, title: "How to layer a puffer jacket without the bulk", excerpt: "Lightweight outerwear works best when the layers beneath it are thin, breathable and tonal. Here is the order we get dressed in from October to February.", category: "Style Guides", author: "Maya Ortiz", date: "Oct 24, 2026", read: 6, featured: true },
  { id: 2, title: "Inside the mill: where our merino is spun", excerpt: "A visit to the family-run mill that turns raw fleece into the yarn behind our knitwear.", category: "Behind the Seams", author: "Jonas Weber", date: "Oct 18, 2026", read: 8 },
  { id: 3, title: "Washing wool at home, step by step", excerpt: "Less often, colder and flat to dry. A short guide to keeping knits soft for years.", category: "Care & Craft", author: "Priya Nair", date: "Oct 12, 2026", read: 4 },
  { id: 4, title: "Five ways to wear a cableknit shawl", excerpt: "Draped, belted, folded or pinned: one piece, five quick looks for the cooler months.", category: "Style Guides", author: "Maya Ortiz", date: "Oct 5, 2026", read: 5 },
  { id: 5, title: "The quiet return of the bomber", excerpt: "Why a 1950s flight jacket keeps finding its way back into city wardrobes.", category: "Culture", author: "Lena Fischer", date: "Sep 29, 2026", read: 7 },
  { id: 6, title: "Repairing a seam: a beginner's guide", excerpt: "Three stitches, one needle and ten minutes can add years to a favorite garment.", category: "Care & Craft", author: "Priya Nair", date: "Sep 21, 2026", read: 5 },
  { id: 7, title: "Meet the pattern cutters", excerpt: "Four people, one long table and the small adjustments that make a jacket hang right.", category: "Behind the Seams", author: "Jonas Weber", date: "Sep 14, 2026", read: 9 },
  { id: 8, title: "A capsule wardrobe for the commute", excerpt: "Eight pieces that move from train to desk to dinner without a change of clothes.", category: "Style Guides", author: "Lena Fischer", date: "Sep 7, 2026", read: 6 },
  { id: 9, title: "Why we stopped making fast seasonal drops", excerpt: "Slower releases, smaller runs and what that has changed about how we design.", category: "Culture", author: "Maya Ortiz", date: "Aug 30, 2026", read: 7 },
  { id: 10, title: "Storing knitwear through the summer", excerpt: "Fold, don't hang. Cedar, breathable bags and a few other habits worth keeping.", category: "Care & Craft", author: "Priya Nair", date: "Aug 22, 2026", read: 3 },
];
const TAGS = ["outerwear", "knitwear", "linen", "capsule", "repair", "sustainability", "layering", "travel"];

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c1c1c]";

/* ---------- Placeholder artwork (replace with <img>) ---------- */
function Placeholder({ seed = 0, ratio = "4/3" }) {
  const id = `jp-${seed}`;
  const x = 240 + ((seed * 23) % 50);
  const tri = `${x},40 420,300 130,300`;
  const [w, h] = ratio === "16/10" ? [640, 400] : [400, 300];
  return (
    <svg viewBox="0 0 420 340" preserveAspectRatio="xMidYMid slice" className="block h-full w-full" role="img" aria-label="Article image placeholder" width={w} height={h}>
      <rect width="420" height="340" fill="#e6e6e6" />
      <rect x="220" y="260" width="200" height="80" fill="#ececec" />
      <circle cx="110" cy="270" r="170" fill="#bbbbbb" />
      <polygon points={tri} fill="#bbbbbb" />
      <clipPath id={id}><circle cx="110" cy="270" r="170" /></clipPath>
      <polygon points={tri} fill="#e6e6e6" clipPath={`url(#${id})`} />
    </svg>
  );
}

const Search = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l5 5" /></svg>
);

/* ---------- Small pieces ---------- */
function Meta({ post, className = "" }) {
  return (
    <p className={`text-[11px] text-[#8a8a8a] ${className}`}>
      {post.date} &nbsp;/&nbsp; {post.read} min read
    </p>
  );
}

function PostCard({ post }) {
  return (
    <article className="group">
      <a href={`#post-${post.id}`} className="mb-4 block aspect-[4/3] overflow-hidden bg-[#e6e6e6]">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
          <Placeholder seed={post.id} />
        </div>
      </a>
      <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.06em]">{post.category}</p>
      <h3 className="mb-2 text-[19px] font-normal leading-snug">
        <a href={`#post-${post.id}`} className="hover:underline">{post.title}</a>
      </h3>
      <p className="mb-3 line-clamp-2 text-[13px] leading-relaxed text-[#666]">{post.excerpt}</p>
      <Meta post={post} />
    </article>
  );
}

/* ---------- Page ---------- */
export default function JournalPage() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const featured = POSTS.find((p) => p.featured);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const isDefault = category === "All" && !q;
    return POSTS.filter((p) => {
      if (isDefault && p.featured) return false; // featured post has its own slot
      const inCat = category === "All" || p.category === category;
      const inQuery = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q);
      return inCat && inQuery;
    });
  }, [category, query]);

  const showFeatured = category === "All" && !query.trim();
  const shown = filtered.slice(0, visible);

  const subscribe = (e) => {
    e.preventDefault();
    if (/^\S+@\S+\.\S+$/.test(email)) setSubscribed(true);
  };

  return (
    <div className="min-h-screen bg-white font-['Jost','Helvetica_Neue',Arial,sans-serif] text-sm text-[#1c1c1c]">
      <style>{FONT_IMPORT}</style>

      {/* Header */}
      <header className="border-b border-[#e2e2e2] bg-[#f5f5f5]">
        <div className="mx-auto max-w-[1280px] px-4 py-12 text-center sm:px-6 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center justify-center gap-2 text-[11px] uppercase tracking-[0.04em] text-[#8a8a8a]">
            <Link to="/" className="hover:text-[#1c1c1c]">Home</Link>
            <span aria-hidden="true">/</span>
            {category === "All" && !query.trim() ? (
              <span aria-current="page" className="text-[#1c1c1c]">Journal</span>
            ) : (
              <>
                <Link to="/journal" className="hover:text-[#1c1c1c]">Journal</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page" className="text-[#1c1c1c]">
                  {query.trim() ? `Search: ${query.trim()}` : category}
                </span>
              </>
            )}
          </nav>
          <h1 className="text-4xl font-light tracking-[-0.01em] sm:text-5xl">The Journal</h1>
          <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-[#666]">
            Style notes, stories from the studio and practical advice for making clothes last.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-4 pb-20 sm:px-6">
        {/* Filter bar */}
        <div className="flex flex-col gap-4 border-b border-[#e2e2e2] py-5 md:flex-row md:items-center md:justify-between">
          <div className="-mx-4 flex gap-6 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Categories">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={category === c}
                onClick={() => { setCategory(c); setVisible(PAGE_SIZE); }}
                className={`flex-none whitespace-nowrap border-b py-1 text-[12px] uppercase tracking-[0.04em] transition-colors ${focus} ${
                  category === c ? "border-[#1c1c1c] text-[#1c1c1c]" : "border-transparent text-[#8a8a8a] hover:text-[#1c1c1c]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <label className="relative block md:w-64">
            <span className="sr-only">Search articles</span>
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]"><Search /></span>
            <input
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setVisible(PAGE_SIZE); }}
              placeholder="Search the journal"
              className={`h-10 w-full border border-[#e2e2e2] bg-white pl-9 pr-3 text-[13px] placeholder:text-[#999] ${focus}`}
            />
          </label>
        </div>

        {/* Featured article */}
        {showFeatured && featured && (
          <article className="group grid items-center gap-8 border-b border-[#e2e2e2] py-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14 lg:py-14">
            <a href={`#post-${featured.id}`} className="block aspect-[16/10] overflow-hidden bg-[#e6e6e6]">
              <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.02]">
                <Placeholder seed={featured.id} ratio="16/10" />
              </div>
            </a>
            <div>
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.06em] text-[#d9232d]">
                Latest &nbsp;/&nbsp; {featured.category}
              </p>
              <h2 className="mb-4 text-[28px] font-light leading-tight tracking-[-0.01em] sm:text-[34px]">
                <a href={`#post-${featured.id}`} className="hover:underline">{featured.title}</a>
              </h2>
              <p className="mb-5 max-w-md text-[14px] leading-relaxed text-[#666]">{featured.excerpt}</p>
              <p className="mb-6 text-[12px] text-[#1c1c1c]">By {featured.author}</p>
              <Meta post={featured} className="mb-6" />
              <a
                href={`#post-${featured.id}`}
                className={`inline-block border-b border-[#1c1c1c] pb-0.5 text-[11px] uppercase tracking-[0.08em] ${focus}`}
              >
                Read article
              </a>
            </div>
          </article>
        )}

        {/* Posts + sidebar */}
        <div className="grid gap-12 pt-10 lg:grid-cols-[1fr_260px] lg:gap-14">
          <main>
            <p className="mb-6 text-[13px] text-[#666]" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? "article" : "articles"}
              {category !== "All" && <> in {category}</>}
              {query.trim() && <> matching “{query.trim()}”</>}
            </p>

            {filtered.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-lg font-light">No articles found.</p>
                <p className="mt-2 text-[#666]">Try a different search term or category.</p>
                <button
                  type="button"
                  onClick={() => { setCategory("All"); setQuery(""); }}
                  className={`mt-6 h-11 bg-[#1c1c1c] px-8 text-[11px] uppercase tracking-[0.08em] text-white hover:bg-black ${focus}`}
                >
                  Show all articles
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
                  {shown.map((p) => <PostCard key={p.id} post={p} />)}
                </div>
                {shown.length < filtered.length && (
                  <div className="mt-14 text-center">
                    <button
                      type="button"
                      onClick={() => setVisible((v) => v + PAGE_SIZE)}
                      className={`h-11 border border-[#1c1c1c] px-10 text-[11px] uppercase tracking-[0.08em] transition-colors hover:bg-[#1c1c1c] hover:text-white ${focus}`}
                    >
                      Load more
                    </button>
                  </div>
                )}
              </>
            )}
          </main>

          {/* Sidebar */}
          <aside className="space-y-10 lg:border-l lg:border-[#e2e2e2] lg:pl-10" aria-label="Journal sidebar">
            <section>
              <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.06em]">Most read</h2>
              <ol className="space-y-4">
                {[...POSTS].sort((a, b) => a.read - b.read).slice(0, 4).map((p, i) => (
                  <li key={p.id} className="flex gap-4">
                    <span className="w-5 flex-none text-[22px] font-light leading-none text-[#bbb]">{i + 1}</span>
                    <div>
                      <a href={`#post-${p.id}`} className="block text-[14px] leading-snug hover:underline">{p.title}</a>
                      <Meta post={p} className="mt-1" />
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.06em]">Topics</h2>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setQuery(t); setCategory("All"); setVisible(PAGE_SIZE); }}
                    className={`border border-[#e2e2e2] px-3 py-1 text-[12px] text-[#666] transition-colors hover:border-[#1c1c1c] hover:text-[#1c1c1c] ${focus}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-[#f5f5f5] p-6">
              <h2 className="mb-2 text-[18px] font-light">Get new stories by email</h2>
              <p className="mb-4 text-[13px] leading-relaxed text-[#666]">One email a month. No sales pitches.</p>
              {subscribed ? (
                <p className="text-[13px]" role="status">Thanks, you are subscribed.</p>
              ) : (
                <form onSubmit={subscribe} noValidate>
                  <label className="sr-only" htmlFor="journal-email">Email address</label>
                  <input
                    id="journal-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className={`mb-2 h-11 w-full border border-[#e2e2e2] bg-white px-3 text-[13px] ${focus}`}
                  />
                  <button
                    type="submit"
                    className={`h-11 w-full bg-[#1c1c1c] text-[11px] uppercase tracking-[0.08em] text-white hover:bg-black ${focus}`}
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
