import { useState, useEffect } from "react";
// Adjust these two paths to wherever Header.jsx and Footer.jsx live in your project
import LocalizedText from "../components/common/LocalizedText";
import LocalizedInput from "../components/common/LocalizedInput";

const POSTS = [
  {
    id: 1,
    title: "How to build a capsule wardrobe in ten pieces",
    category: "Style guide",
    date: "Oct 24, 2026",
    read: 6,
    author: "Maya Ortega",
    art: ["#2b2f3a", "#8a93a8"],
    icon: "🧥",
    excerpt:
      "Ten well-chosen pieces can make thirty outfits. Here is how to pick them, and what to leave out.",
    body: [
      "A capsule wardrobe is not about owning less for its own sake. It is about owning pieces that work together so you never stand in front of a full closet with nothing to wear.",
      "Start with a color base of two neutrals, such as navy and grey, then add one accent you genuinely like. Every piece should match at least three others.",
      "A solid ten: two shirts, one knit, one jacket, two pairs of trousers, one pair of denim, one pair of sneakers and one pair of leather shoes. Add or swap as the seasons change.",
      "Before you buy anything new, wear each piece in three different outfits. If you cannot, it does not belong in the capsule.",
    ],
  },
  {
    id: 2,
    title: "Linen, cotton or wool: choosing fabric for the season",
    category: "Fabrics",
    date: "Oct 17, 2026",
    read: 5,
    author: "Daniel Reyes",
    art: ["#6f5f8a", "#dccff0"],
    icon: "🧵",
    excerpt:
      "The fabric matters more than the label. A quick guide to what each material does well and where it struggles.",
    body: [
      "Linen breathes and dries quickly, which makes it the best choice for heat. It also wrinkles, so lean into a relaxed fit instead of fighting it.",
      "Cotton is the all-rounder. Heavier weaves like twill and oxford hold their shape, while jersey is softer and better for layering.",
      "Wool regulates temperature in both directions. Merino is fine enough to wear against the skin and rarely needs washing.",
      "Check the care label before you buy. A fabric you cannot wash easily is a fabric you will wear less.",
    ],
  },
  {
    id: 3,
    title: "Layering for cold mornings and warm afternoons",
    category: "Seasonal",
    date: "Oct 9, 2026",
    read: 4,
    author: "Maya Ortega",
    art: ["#27422f", "#a9c79b"],
    icon: "🧣",
    excerpt:
      "Three thin layers beat one thick one. How to dress for a day that changes its mind.",
    body: [
      "Think in three layers: a base that touches the skin, a mid-layer for warmth and an outer layer for wind or rain.",
      "Keep the base thin and breathable. Cotton or merino tees work well. The mid-layer can be a light knit or an overshirt you can tie around your waist.",
      "Choose an outer layer that packs small. A shell or a packable jacket fits into a bag when the afternoon warms up.",
    ],
  },
  {
    id: 4,
    title: "Getting the fit right: five checks before you buy",
    category: "Fit and tailoring",
    date: "Oct 2, 2026",
    read: 5,
    author: "Sofia Lindqvist",
    art: ["#3b3224", "#B9A16B"],
    icon: "📏",
    excerpt:
      "Size labels vary from brand to brand. These five checks tell you if something fits, whatever the tag says.",
    body: [
      "Shoulders first. The seam should sit at the edge of your shoulder bone. If it droops or pulls, no tailor can fix it cheaply.",
      "Next, sleeve length. A shirt cuff should end at the wrist bone, and a jacket sleeve should show a little shirt cuff.",
      "Check that you can sit, reach and raise your arms without the fabric pulling across your back or chest.",
      "Trousers should sit without a belt doing all the work. Hems and waists are easy to adjust, so focus on the seat and thigh.",
      "Finally, take a photo from the side and back. You see more in a picture than in the fitting-room mirror.",
    ],
  },
  {
    id: 5,
    title: "Caring for knitwear so it lasts a decade",
    category: "Care",
    date: "Sep 26, 2026",
    read: 4,
    author: "Daniel Reyes",
    art: ["#18414f", "#9bd6f2"],
    icon: "🧶",
    excerpt:
      "Most knitwear is ruined in the wash, not by wear. Simple habits that stop pilling and stretching.",
    body: [
      "Wash less often. Airing a sweater overnight is enough after most wears, and wool naturally resists odor.",
      "When you do wash, use cool water and a gentle wool wash. Press the water out with a towel instead of wringing the knit.",
      "Dry flat, away from direct heat. Hanging a wet sweater stretches the shoulders for good.",
      "Fold knitwear in a drawer rather than hanging it, and remove pills with a fabric comb, not a razor.",
    ],
  },
  {
    id: 6,
    title: "Second-hand shopping: what to look for",
    category: "Sustainable fashion",
    date: "Sep 18, 2026",
    read: 6,
    author: "Sofia Lindqvist",
    art: ["#3a1f3d", "#f08fc0"],
    icon: "♻️",
    excerpt:
      "Buying used is the lowest-impact way to refresh a wardrobe. How to spot quality in a crowded rack.",
    body: [
      "Look at fabric before style. Natural fibers like wool, silk, linen and heavy cotton last longer and resell better than thin synthetics.",
      "Check seams, underarms, collars and cuffs, the places where clothes wear out first. Hold the garment up to the light to spot thin patches.",
      "Skip anything with a smell you cannot identify. Some odors never wash out.",
      "Go in with a short list and a budget. It is easy to buy a bargain you will never wear.",
    ],
  },
];

const CATEGORIES = ["All", ...new Set(POSTS.map((p) => p.category))];

const Art = ({ post, big }) => (
  <div
    className="relative flex h-full w-full items-center justify-center overflow-hidden"
    style={{ background: `linear-gradient(145deg, ${post.art[0]}, ${post.art[1]})` }}
  >
    <div
      className="absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-25"
      style={{ background: post.art[1] }}
    />
    <div className="absolute -bottom-12 -left-6 h-44 w-44 rounded-full bg-white opacity-20" />
    <span className={big ? "text-8xl" : "text-6xl"} aria-hidden="true">
      {post.icon}
    </span>
  </div>
);

const Meta = ({ post }) => (
  <p className="text-sm text-[#767676]">
    <LocalizedText text={post.category} /> · {post.date} · {post.read} min read
  </p>
);

const PostCard = ({ post, onOpen }) => (
  <article className="flex flex-col border border-[#CFCDCD] bg-white">
    <button
      onClick={() => onOpen(post)}
      aria-label={`Read ${post.title}`}
      className="block h-48 cursor-pointer"
    >
      <Art post={post} />
    </button>
    <div className="flex flex-1 flex-col gap-3 p-5">
      <Meta post={post} />
      <h3 className="text-primary text-xl leading-7 font-medium">
        <LocalizedText text={post.title} />
      </h3>
      <p className="text-sm leading-6 text-[#767676]">
        <LocalizedText text={post.excerpt} />
      </p>
      <button
        onClick={() => onOpen(post)}
        className="mt-auto w-fit cursor-pointer text-sm font-medium text-[#222222] underline underline-offset-4"
      >
        Read article
      </button>
    </div>
  </article>
);

const Reader = ({ post, onClose }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <article
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-2xl overflow-auto bg-white"
      >
        <div className="h-48">
          <Art post={post} big />
        </div>
        <div className="p-6 lg:p-8">
          <div className="flex items-start justify-between gap-4">
            <Meta post={post} />
            <button
              onClick={onClose}
              aria-label="Close"
              className="cursor-pointer px-2 text-2xl leading-none"
            >
              ×
            </button>
          </div>
          <h2 className="text-primary mt-3 text-3xl leading-10 font-medium">
            <LocalizedText text={post.title} />
          </h2>
          <p className="mt-2 text-sm text-[#767676]">By {post.author}</p>
          <div className="mt-6 flex flex-col gap-4 leading-7 text-[#222222]">
            {post.body.map((para, i) => (
              <p key={i}>
                <LocalizedText text={para} />
              </p>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};

const Pages = () => {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(null);

  const q = query.trim().toLowerCase();
  const posts = POSTS.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      (!q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q))
  );

  const [featured, ...rest] = posts;

  return (
    <>
  

      <section className="bg-[#E4E4E4]">
        <div className="container px-4 py-12 sm:px-6 lg:py-20">
          <h1 className="text-primary max-w-2xl text-5xl leading-[1.05] font-medium lg:text-7xl">
            The clothing journal
          </h1>
          <p className="mt-6 max-w-lg text-lg text-[#767676]">
            Style guides, fabric notes and care tips for people who like their clothes to
            last.
          </p>
        </div>
      </section>

      <main className="container px-4 py-10 sm:px-6 lg:py-14">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter articles">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`cursor-pointer border px-4 py-2 text-sm ${
                  category === c
                    ? "border-[#222222] bg-[#222222] text-white"
                    : "border-[#CFCDCD] text-[#222222]"
                }`}
              >
                <LocalizedText text={c} />
              </button>
            ))}
          </div>
          <LocalizedInput
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles"
            aria-label="Search articles"
            className="w-full border border-[#CFCDCD] bg-white px-4 py-3 text-sm outline-none focus:border-[#222222] lg:w-72"
          />
        </div>

        {posts.length === 0 ? (
          <p className="py-16 text-center text-[#767676]">
            No articles match that search. Try a different word or choose All.
          </p>
        ) : (
          <>
            <article className="mb-8 grid border border-[#CFCDCD] bg-white md:grid-cols-2">
              <button
                onClick={() => setOpen(featured)}
                aria-label={`Read ${featured.title}`}
                className="block h-64 cursor-pointer md:h-auto md:min-h-80"
              >
                <Art post={featured} big />
              </button>
              <div className="flex flex-col justify-center gap-4 p-6 lg:p-10">
                <Meta post={featured} />
                <h2 className="text-primary text-3xl leading-10 font-medium">
                  <LocalizedText text={featured.title} />
                </h2>
                <p className="leading-7 text-[#767676]">
                  <LocalizedText text={featured.excerpt} />
                </p>
                <button
                  onClick={() => setOpen(featured)}
                  className="w-fit cursor-pointer bg-[#222222] px-7 py-3 text-sm font-medium text-white"
                >
                  Read article
                </button>
              </div>
            </article>

            {rest.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <PostCard key={post.id} post={post} onOpen={setOpen} />
                ))}
              </div>
            )}
          </>
        )}
      </main>


      {open && <Reader post={open} onClose={() => setOpen(null)} />}
    </>
  );
};

export default Pages;
