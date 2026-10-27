import { useState } from "react";
import { Link } from "react-router";
import { auth,db } from "../firebase.config";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import { ref, set } from "firebase/database";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: "https://example.com/jane-q-user/profile.jpg",
        })
          .then(() => {
            sendEmailVerification(auth.currentUser).then(() => {
              const user = userCredential.user;
              console.log(user);
              toast.success("Account created Successfully");
              setLoading(false);


set(ref(db, 'users/' + user.uid), {
    name: name,
    email: email,
   
  });


            });
          })
          .catch((error) => {
            setLoading(false);
            const errorcode = error.code;
            if (errorcode.includes("auth/email-already-in-use")) {
              toast.error("Email already in use");
            } else {
              toast.error("something went wrong");
            }
          });
      },
    );
  };

  return (
    <main className="font-jost text-primary flex min-h-screen items-center justify-center bg-white">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-87.5 px-4">
        <h2 className="mb-6 text-center text-xl font-medium">Register</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded border px-3 py-2"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded border px-3 py-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="rounded border px-3 py-2"
          />
          <input
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
