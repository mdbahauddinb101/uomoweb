import {} from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../firebase.config";
import toast, { Toaster } from "react-hot-toast";
import { ref, set } from "firebase/database";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        
    toast.success("Signin Successfully");
           navigate("/")
      })
      
      .catch((error) => {
        const errorcode = error.code;
        toast.error("something went wrong");
      });
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        set(ref(db, "users/" + user.uid), {
          name: user.displayName,
          email: user.email,
        });
      }).then(() => {
     toast.success("Google Login Successfully");
     navigate("/")
})
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <main className="font-jost text-primary flex min-h-screen items-center justify-center bg-white antialiased">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container px-4 pt-6 pb-16">
        <div className="mx-auto w-full max-w-87.5">
          <div role="tablist" className="mb-6 flex items-center justify-center">
            <button
              role="tab"
              aria-selected="true"
              className="border-primary border-b-2 pb-1 text-xl font-medium"
            >
              Login
            </button>
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"

            className="mb-2 flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          >
            <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            Sign in with Google
          </button>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="rounded border px-3 py-2"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="rounded border px-3 py-2"
            />

            <div className="text-left">
              <Link to="/passforgot">
                <button
                  type="button"

                  className="text-primary cursor-pointer underline underline-offset-2"
                >
                  Lost password?
                </button>
              </Link>
            </div>

            <button
              type="submit"
              className="bg-primary rounded py-2 text-white"
            >
              Login
            </button>
            <p className="text-gray mt-2 text-center text-[13px]">
              Create An Account{" "}
              <Link to="/ragister">
                <button
                  type="button"

                  className="text-primary cursor-pointer underline underline-offset-2"
                >
                  Ragister
                </button>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
