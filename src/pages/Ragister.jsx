import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { auth,db } from "../firebase.config";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import { ref, set } from "firebase/database";
import { mergeGuestCart } from "../slices/cartSlice";
import { mergeGuestWishlist } from "../slices/wishlistSlice";
import LocalizedInput from "../components/common/LocalizedInput";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      dispatch(mergeGuestCart(user.uid));
      dispatch(mergeGuestWishlist(user.uid));
      toast.success("Account created successfully");
      navigate("/profile", { replace: true });

      try {
        await sendEmailVerification(user);
      } catch (error) {
        console.error("Unable to send email verification:", error);
        toast.error("Account created, but verification email could not be sent");
      }

      try {
        await set(ref(db, `users/${user.uid}`), { name, email });
      } catch (error) {
        console.error("Unable to save user profile:", error);
        toast.error("Account created, but profile details could not be saved");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(
        error.code === "auth/email-already-in-use"
          ? "Email already in use"
          : "Unable to create account",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="font-jost text-primary flex min-h-screen items-center justify-center bg-white">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-87.5 px-4">
        <h2 className="mb-6 text-center text-xl font-medium">Register</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <LocalizedInput
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded border px-3 py-2"
          />
          <LocalizedInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded border px-3 py-2"
          />
          <LocalizedInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="rounded border px-3 py-2"
          />
          <LocalizedInput
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="rounded border px-3 py-2"
          />
          {loading ? (
            <button type="button" class="bg-indigo-500 ..." disabled>
              <svg
                class="mr-3 size-5 animate-spin ..."
                viewBox="0 0 24 24"
              ></svg>
              Processing…
            </button>
          ) : (
            <button
              type="submit"
              className="bg-primary rounded py-2 text-white"
            >
              Register
            </button>
          )}

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
