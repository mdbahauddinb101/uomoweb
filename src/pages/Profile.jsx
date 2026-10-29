import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { User, Mail, LogOut } from "lucide-react"; // non-brand icons still work in lucide-react
import { FaGithub, FaGoogle } from "react-icons/fa"; // brand icons come from react-icons
import { auth } from "../firebase.config";
import Price from "../components/common/Price";
import LocalizedText from "../components/common/LocalizedText";

const providerInfo = {
  "google.com": { label: "Google", icon: <FaGoogle size={16} /> },
  "github.com": { label: "GitHub", icon: <FaGithub size={16} /> },
  password: { label: "Email & password", icon: <Mail size={16} /> },
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const wishlist = useSelector((state) => state.wishlist);
  const cartItems = cart.userId === user?.uid ? cart.products : [];
  const wishlistItems = wishlist.userId === user?.uid ? wishlist.products : [];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login"); // not logged in -> go to login
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  const provider = providerInfo[user.providerData?.[0]?.providerId];

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 text-center shadow-lg">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || "Profile"}
            referrerPolicy="no-referrer"
            className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-gray-500">
            <User size={40} />
          </div>
        )}

        <h2 className="text-xl font-semibold text-gray-900">
          {user.displayName || "User"}
        </h2>

        <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-600">
          <Mail size={16} />
          <span>{user.email}</span>
        </div>

        {provider && (
          <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-600">
            {provider.icon}
            <span>Signed in with {provider.label}</span>
          </div>
        )}

        <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
          {[
            { title: "Cart", items: cartItems, href: "/cart" },
            { title: "Wishlist", items: wishlistItems, href: "/wishlist" },
          ].map(({ title, items, href }) => (
            <section key={title} className="rounded-lg border border-gray-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{title}</h3>
                <Link to={href} className="text-xs text-gray-600 underline">
                  View all ({items.length})
                </Link>
              </div>
              {items.length > 0 ? (
                <ul className="space-y-3">
                  {items.slice(0, 3).map((item) => (
                    <li key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.image || item.thumbnail}
                        alt={item.title}
                        className="size-12 rounded bg-gray-100 object-contain"
                      />
                      <div className="min-w-0 text-sm">
                        <p className="truncate font-medium text-gray-800">
                          <LocalizedText text={item.title} />
                        </p>
                        <p className="text-gray-500">
                          <Price amount={item.price} />
                          {title === "Cart" ? ` · Qty ${item.quantity}` : ""}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No items yet.</p>
              )}
            </section>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
