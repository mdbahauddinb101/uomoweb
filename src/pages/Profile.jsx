import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { User, Mail, LogOut } from "lucide-react"; // non-brand icons still work in lucide-react
import { FaGithub, FaGoogle } from "react-icons/fa"; // brand icons come from react-icons
import { auth } from "../firebase.config";

const providerInfo = {
  "google.com": { label: "Google", icon: <FaGoogle size={16} /> },
  "github.com": { label: "GitHub", icon: <FaGithub size={16} /> },
  password: { label: "Email & password", icon: <Mail size={16} /> },
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
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
