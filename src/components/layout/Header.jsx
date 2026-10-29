import { Link, useNavigate } from "react-router";
import Image from "../common/Image";
import navbardata from "../../api/navbardata.json";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase.config";

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchInputRef = useRef(null);

  const cart = useSelector((state) => state.cart.products);
  const wishlist = useSelector((state) => state.wishlist.products);
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const navigate = useNavigate();

  // Listen to login / logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const query = searchQuery.trim();
    if (!searchOpen || !query) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const response = await axios.get(
          "https://dummyjson.com/products/search",
          { params: { q: query, limit: 6 }, signal: controller.signal }
        );
        setSearchResults(response.data.products ?? []);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Unable to search products", error);
          setSearchResults([]);
        }
      } finally {
        if (!controller.signal.aborted) setSearchLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [searchOpen, searchQuery]);

  const handleCart = () => {
    navigate("/cart");
  };

  return (
    <header className="relative pt-4 pb-4 lg:pt-7.25 lg:pb-7">
      <nav>
        <div className="container">
          <div className="flex flex-col lg:flex-row">
            <div className="flex items-center justify-center">
              <Link to="/">
                <Image src="/public/logo.png" alt="logo" />
              </Link>
            </div>

            <ul className="ml-14 hidden gap-10.75 lg:flex">
              {navbardata.map((item) => (
                <li
                  className="text-primary after:bg-primary relative text-sm leading-6 font-medium after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:duration-500 after:content-[''] hover:after:w-[26.05px]"
                  key={item.id}
                >
                  <Link to={item.path}>{item.title}</Link>
                </li>
              ))}
            </ul>

            <div className="ml-0 flex items-center gap-0 lg:ml-auto lg:gap-8">
              {/* product search */}
              <div className="relative z-50 hidden w-40 lg:block xl:w-48">
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#767676]">
                    <svg width="16" height="16" viewBox="0 0 21 20" fill="none" aria-hidden="true">
                      <circle cx="8.8" cy="8.8" r="7.2" stroke="currentColor" strokeWidth="1.6" />
                      <path d="m14 14 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                    onFocus={() => setSearchOpen(true)}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                      setSearchOpen(true);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") setSearchOpen(false);
                    }}
                    placeholder="Search products"
                    aria-label="Search products"
                    aria-expanded={searchOpen}
                    aria-controls="header-product-search"
                    className="h-10 w-full border border-[#e2e2e2] bg-white pr-9 pl-9 text-xs outline-none transition-colors placeholder:text-[#999] focus:border-[#222]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      aria-label="Clear product search"
                      className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 place-items-center text-[#767676] hover:text-[#222]"
                    >
                      <AiOutlineClose size={14} />
                    </button>
                  )}
                </div>
                {searchOpen && searchQuery.trim() && (
                  <div
                    id="header-product-search"
                    role="search"
                    className="absolute top-full right-0 mt-2 w-[min(360px,calc(100vw-32px))] border border-[#e2e2e2] bg-white p-3 shadow-xl"
                  >
                    <div className="max-h-80 overflow-y-auto" aria-live="polite">
                      {searchLoading ? (
                        <p className="px-2 py-4 text-xs text-[#767676]">Searching...</p>
                      ) : searchResults.length > 0 ? (
                        <ul>
                          {searchResults.map((product) => (
                            <li key={product.id}>
                              <Link
                                to={`/shopsinglepage/${product.id}`}
                                onClick={() => {
                                  setSearchOpen(false);
                                  setSearchQuery("");
                                }}
                                className="flex items-center gap-3 border-b border-[#f0f0f0] p-2 last:border-b-0 hover:bg-[#f7f7f7]"
                              >
                                <img
                                  src={product.thumbnail}
                                  alt=""
                                  className="size-12 shrink-0 bg-[#f2f2f2] object-contain"
                                />
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-xs text-[#222]">{product.title}</span>
                                  <span className="mt-1 block text-[10px] capitalize text-[#767676]">{product.category}</span>
                                </span>
                                <span className="shrink-0 text-xs font-medium text-[#222]">${product.price}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="px-2 py-4 text-xs text-[#767676]">No products found.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* user: profile image if logged in, otherwise user icon */}
              {user ? (
                <button
                  onClick={() => navigate("/profile")}
                  className="hidden cursor-pointer lg:block"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "Profile"}
                      referrerPolicy="no-referrer"
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="8" r="3.5" fill="currentColor" />
                      <path
                        d="M6 18.5C6.8 15.8 9.2 14 12 14C14.8 14 17.2 15.8 18 18.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="hidden cursor-pointer lg:block"
                >
                  <svg
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_6_29)">
                      <path
                        d="M10.0175 11.2652C3.99775 11.2652 0.682495 14.108 0.682495 19.2701C0.682495 19.6732 1.00982 20 1.41369 20H18.6212C19.0251 20 19.3524 19.6732 19.3524 19.2701C19.3524 14.1083 16.0372 11.2652 10.0175 11.2652ZM2.17149 18.5402C2.4591 14.6805 5.09505 12.7251 10.0175 12.7251C14.9399 12.7251 17.5759 14.6805 17.8637 18.5402H2.17149Z"
                        fill="#222222"
                      />
                      <path
                        d="M10.0174 0C7.25222 0 5.16711 2.12336 5.16711 4.93895C5.16711 7.83699 7.34292 10.1944 10.0174 10.1944C12.6918 10.1944 14.8676 7.83699 14.8676 4.93918C14.8676 2.12336 12.7825 0 10.0174 0ZM10.0174 8.7348C8.14917 8.7348 6.6295 7.03211 6.6295 4.93918C6.6295 2.92313 8.05436 1.45984 10.0174 1.45984C11.949 1.45984 13.4053 2.95547 13.4053 4.93918C13.4053 7.03211 11.8856 8.7348 10.0174 8.7348Z"
                        fill="#222222"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_6_29">
                        <rect width="20.0348" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              )}

              {/* wishlist */}
              <Link
                to="/wishlist"
                aria-label={`Wishlist${wishlist.length ? `, ${wishlist.length} items` : ""}`}
                title="Wishlist"
                className="hidden lg:block"
              >
                <svg
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_6_54)">
                    <path
                      d="M18.4252 3.30806C16.2463 1.13349 12.7016 1.13349 10.5232 3.30806L10.0172 3.81285L9.51156 3.30806C7.33321 1.13319 3.78822 1.13319 1.60986 3.30806C-0.524272 5.43848 -0.53813 8.81543 1.57772 11.1634C3.50752 13.3041 9.19902 17.929 9.44051 18.1248C9.60444 18.2578 9.8017 18.3226 9.99777 18.3226C10.0043 18.3226 10.0107 18.3226 10.0169 18.3223C10.2198 18.3317 10.4241 18.2622 10.5934 18.1248C10.8349 17.929 16.5269 13.3041 18.4573 11.1631C20.5729 8.81543 20.559 5.43848 18.4252 3.30806ZM17.1423 9.98189C15.6377 11.6505 11.5018 15.0919 10.0169 16.3131C8.53207 15.0922 4.39708 11.6511 2.89275 9.98218C1.41673 8.34448 1.40287 6.01215 2.86062 4.55694C3.60511 3.81403 4.58284 3.44228 5.56056 3.44228C6.53829 3.44228 7.51601 3.81373 8.26051 4.55694L9.37269 5.66718C9.50508 5.79934 9.67196 5.87822 9.8471 5.90589C10.1313 5.96682 10.4398 5.88764 10.6609 5.66748L11.7737 4.55694C13.2629 3.07082 15.6854 3.07112 17.1739 4.55694C18.6316 6.01215 18.6177 8.34448 17.1423 9.98189Z"
                      fill="#222222"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_6_54">
                      <rect width="20.0348" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </Link>

              {/* cart */}
              <div className="absolute top-4 right-3.75 lg:relative lg:top-auto lg:right-auto">
                <button onClick={handleCart} className="relative cursor-pointer">
                  <svg
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.6869 4.6875H15.3021C14.9912 2.05164 12.74 0 10.0174 0C7.29479 0 5.04353 2.05164 4.73264 4.6875H2.3478C1.91556 4.6875 1.56519 5.03727 1.56519 5.46875V19.2188C1.56519 19.6502 1.91556 20 2.3478 20H17.6869C18.1192 20 18.4696 19.6502 18.4696 19.2188V5.46875C18.4696 5.03727 18.1192 4.6875 17.6869 4.6875ZM10.0174 1.5625C11.8754 1.5625 13.4225 2.91621 13.7214 4.6875H6.31332C6.61228 2.91621 8.1593 1.5625 10.0174 1.5625ZM16.9043 18.4375H3.13041V6.25H4.69563V8.59375C4.69563 9.02523 5.046 9.375 5.47824 9.375C5.91047 9.375 6.26084 9.02523 6.26084 8.59375V6.25H13.7739V8.59375C13.7739 9.02523 14.1243 9.375 14.5565 9.375C14.9887 9.375 15.3391 9.02523 15.3391 8.59375V6.25H16.9043V18.4375Z"
                      fill="#222222"
                    />
                  </svg>
                  <div className="absolute -right-0.75 -bottom-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#B9A16B] text-xs font-bold text-white">
                    {totalItems}
                  </div>
                </button>
              </div>

              {/* mobile menu button */}
              <button
                onClick={() => setActiveMenu(!activeMenu)}
                className="absolute top-6 left-3.75 sm:block lg:hidden"
              >
                <svg
                  width="26"
                  height="18"
                  viewBox="0 0 26 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="25.0435" height="2" fill="#222222" />
                  <rect y="8" width="20.0348" height="2" fill="#222222" />
                  <rect y="16" width="25.0435" height="2" fill="#222222" />
                </svg>
              </button>

              {/* Mobile Menu with smooth transition */}
              <div
                className={`absolute top-0 z-50 h-screen w-full bg-black pt-10 text-center transition-all duration-300 lg:hidden ${
                  activeMenu ? "left-0" : "-left-full"
                }`}
              >
                <ul className="flex flex-col">
                  {navbardata.map((item) => (
                    <li
                      className="p-4 text-sm leading-6 font-medium text-white"
                      key={item.id}
                    >
                      <Link to={item.path} onClick={() => setActiveMenu(false)}>
                        {item.title}
                      </Link>
                    </li>
                  ))}

                  {/* login / profile link inside mobile menu */}
                  <li className="flex items-center justify-center gap-2 p-4 text-sm leading-6 font-medium text-white">
                    <Link
                      to={user ? "/profile" : "/login"}
                      onClick={() => setActiveMenu(false)}
                      className="flex items-center gap-2"
                    >
                      {user?.photoURL && (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || "Profile"}
                          referrerPolicy="no-referrer"
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      )}
                      {user ? user.displayName || "Profile" : "Login"}
                    </Link>
                  </li>
                </ul>

                <button
                  onClick={() => setActiveMenu(false)}
                  className="absolute top-10 right-4"
                >
                  <AiOutlineClose
                    size={30}
                    className="absolute top-1 right-4 text-white"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
