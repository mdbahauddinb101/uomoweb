import { useState, useEffect } from "react";

const LOOKS = [
  {
    id: 1,
    title: "Commuter, quiet mode",
    mood: "Work",
    art: ["#2b2f3a", "#8a93a8"],
    icon: "🧥",
    note: "A charcoal wool overshirt over a crisp tee, tapered trousers and leather derbies. Sharp enough for the office, soft enough for the train.",
    items: [
      ["Wool overshirt", "Outerwear", 128],
      ["Everyday cotton tee", "Tops", 32],
      ["Tapered trousers", "Bottoms", 84],
      ["Leather derby shoes", "Footwear", 139],
    ],
  },
  {
    id: 2,
    title: "Trail day, light pack",
    mood: "Outdoor",
    art: ["#27422f", "#a9c79b"],
    icon: "🥾",
    note: "Ripstop shell, quick-dry layer and stretch hiking trousers. Built to move, dry fast and pack small.",
    items: [
      ["Ripstop shell jacket", "Outerwear", 149],
      ["Quick-dry tee", "Tops", 36],
      ["Stretch hiking trousers", "Bottoms", 92],
      ["Trail shoes", "Footwear", 118],
    ],
  },
  {
    id: 3,
    title: "Studio linen",
    mood: "Weekend",
    art: ["#6f5f8a", "#dccff0"],
    icon: "👕",
    note: "Washed linen shirt, relaxed pleated shorts and a canvas tote. Wrinkles are part of the look.",
    items: [
      ["Washed linen shirt", "Tops", 72],
      ["Pleated shorts", "Bottoms", 58],
      ["Canvas tote", "Accessories", 34],
      ["Leather slides", "Footwear", 64],
    ],
  },
  {
    id: 4,
    title: "Desk to dinner",
    mood: "Work",
    art: ["#3b3224", "#B9A16B"],
    icon: "👔",
    note: "An oxford shirt, soft chinos and a knit tie that gets loosened by seven. Swap the loafers for boots after dark.",
    items: [
      ["Oxford shirt", "Tops", 68],
      ["Stretch chinos", "Bottoms", 79],
      ["Knit tie", "Accessories", 29],
      ["Suede loafers", "Footwear", 124],
    ],
  },
  {
    id: 5,
    title: "Night out",
    mood: "Evening",
    art: ["#3a1f3d", "#f08fc0"],
    icon: "🧣",
    note: "Satin bomber, black straight denim and Chelsea boots. A silk scarf keeps it from looking too serious.",
    items: [
      ["Satin bomber", "Outerwear", 110],
      ["Black straight denim", "Bottoms", 79],
      ["Chelsea boots", "Footwear", 149],
      ["Silk scarf", "Accessories", 45],
    ],
  },
  {
    id: 6,
    title: "Airport, carry-on only",
    mood: "Travel",
    art: ["#18414f", "#9bd6f2"],
    icon: "👖",
    note: "Zip-pocket joggers, a packable jacket and clean canvas sneakers. Comfortable for eight hours in a seat.",
    items: [
      ["Zip-pocket joggers", "Bottoms", 65],
      ["Packable jacket", "Outerwear", 94],
      ["Soft jersey hoodie", "Tops", 58],
      ["Canvas sneakers", "Footwear", 72],
    ],
  },
];

const FILTERS = ["All", "Work", "Weekend", "Outdoor", "Evening", "Travel"];
const total = (look) => look.items.reduce((sum, item) => sum + item[2], 0);

const Art = ({ look, big }) => (
  <div
    className="relative flex h-full w-full items-center justify-center overflow-hidden"
    style={{ background: `linear-gradient(145deg, ${look.art[0]}, ${look.art[1]})` }}
  >
    <div
      className="absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-25"
      style={{ background: look.art[1] }}
    />
    <div className="absolute -bottom-12 -left-6 h-44 w-44 rounded-full bg-white opacity-20" />
    <span className={big ? "text-8xl" : "text-6xl"} aria-hidden="true">
      {look.icon}
    </span>
  </div>
);

const LookCard = ({ look, index, saved, onSave, onOpen }) => {
  const feature = index === 0;
  return (
    <article
      className={`flex flex-col overflow-hidden border border-[#CFCDCD] bg-white ${
        feature ? "sm:col-span-2 lg:row-span-2" : ""
      }`}
    >
      <button
        onClick={() => onOpen(look)}
        aria-label={`Open ${look.title}`}
        className={`block cursor-pointer text-left ${
          feature ? "min-h-72 flex-1" : "h-52"
        }`}
      >
        <Art look={look} big={feature} />
      </button>
      <div className="flex items-start justify-between gap-3 p-4">
        <div>
          <h3 className="text-primary text-lg leading-6 font-medium">{look.title}</h3>
          <p className="mt-1 text-sm text-[#767676]">
            {look.mood} · {look.items.length} pieces · ${total(look)}
          </p>
        </div>
        <button
          onClick={() => onSave(look.id)}
          aria-pressed={saved}
          aria-label={saved ? "Remove from saved" : "Save look"}
          className={`h-10 w-10 shrink-0 cursor-pointer rounded-full border text-lg ${
            saved
              ? "border-[#B9A16B] bg-[#B9A16B] text-white"
              : "border-[#CFCDCD] text-[#222222]"
          }`}
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>
    </article>
  );
};

const LookModal = ({ look, saved, onSave, onClose }) => {
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
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="grid max-h-[92vh] w-full max-w-3xl overflow-auto bg-white sm:grid-cols-2"
      >
        <div className="h-56 sm:h-auto sm:min-h-104">
          <Art look={look} big />
        </div>
        <div className="flex flex-col p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-primary text-2xl leading-8 font-medium">{look.title}</h3>
            <button
              onClick={onClose}
              aria-label="Close"
              className="cursor-pointer px-2 text-2xl leading-none"
            >
              ×
            </button>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#767676]">{look.note}</p>

          <ul className="mt-5 divide-y divide-[#CFCDCD] border-y border-[#CFCDCD]">
            {look.items.map(([name, type, price]) => (
              <li key={name} className="flex justify-between py-3 text-sm">
                <span>
                  {name} <span className="text-[#767676]">· {type}</span>
                </span>
                <span className="font-medium">${price}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex justify-between font-medium">
            <span>Whole look</span>
            <span>${total(look)}</span>
          </div>

          <div className="mt-auto flex gap-3 pt-6">
            {/* Hook this up to your cart slice, e.g. dispatch(addToCart(...)) for each item */}
            <button className="flex-1 cursor-pointer bg-[#222222] py-3 text-sm font-medium text-white">
              Add all to cart
            </button>
            <button
              onClick={() => onSave(look.id)}
              className="cursor-pointer border border-[#CFCDCD] px-5 text-sm"
            >
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LookBookPage = () => {
  const [filter, setFilter] = useState("All");
  const [saved, setSaved] = useState([]);
  const [open, setOpen] = useState(null);

  const toggleSave = (id) =>
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const looks = LOOKS.filter((look) => filter === "All" || look.mood === filter);

  return (
    <>
      <section className="bg-[#E4E4E4]">
        <div className="container grid items-end gap-10 py-12 md:grid-cols-5 lg:py-20">
          <div className="md:col-span-3">
            <h1 className="text-primary text-5xl leading-[1.05] font-medium lg:text-7xl">
              Outfits, already put together.
            </h1>
            <p className="mt-6 max-w-md text-lg text-[#767676]">
              Six complete looks for work, weekends, trails and travel. Open one to see
              every piece and its price.
            </p>
            <a
              href="#looks"
              className="mt-8 inline-block bg-[#222222] px-7 py-3 text-sm font-medium text-white"
            >
              Browse the looks
            </a>
          </div>
          <div className="grid h-56 grid-cols-3 gap-3 md:col-span-2 md:h-72" aria-hidden="true">
            {[LOOKS[0], LOOKS[1], LOOKS[4]].map((look, i) => (
              <div key={look.id} className={`overflow-hidden ${i === 1 ? "mt-8" : ""}`}>
                <Art look={look} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <main id="looks" className="container py-12 lg:py-16">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-primary text-3xl leading-10 font-medium">
            This season
            {saved.length > 0 && (
              <span className="ml-3 text-sm font-normal text-[#767676]">
                {saved.length} saved
              </span>
            )}
          </h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter looks">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`cursor-pointer border px-4 py-2 text-sm ${
                  filter === f
                    ? "border-[#222222] bg-[#222222] text-white"
                    : "border-[#CFCDCD] text-[#222222]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {looks.map((look, i) => (
            <LookCard
              key={look.id}
              look={look}
              index={i}
              saved={saved.includes(look.id)}
              onSave={toggleSave}
              onOpen={setOpen}
            />
          ))}
        </div>
      </main>

      {open && (
        <LookModal
          look={open}
          saved={saved.includes(open.id)}
          onSave={toggleSave}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
};

export default LookBookPage;
