import {} from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.config";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    toast.success("Login Successfull");
    // ...
  })
  .catch((error) => {
            const errorcode = error.code;
           toast.error("something went wrong");
          });

  };

  return (
    <main className="min-h-screen bg-white font-jost text-primary antialiased flex justify-center items-center">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container px-4 pb-16 pt-6">
        <div className="mx-auto w-full max-w-87.5">
          <div role="tablist" className="flex items-center justify-center mb-6">
            <button
              role="tab"
              aria-selected="true"
              className="text-xl font-medium border-b-2 border-primary pb-1"
            >
              Login
            </button>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="border rounded px-3 py-2"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="border rounded px-3 py-2"
            />
            <button
              type="submit"
              className="bg-primary text-white rounded py-2"
            >
              Login
            </button>
   <p className="mt-2 text-center text-[13px] text-gray">
        Create An Account{" "}
        <Link to="/ragister">
        <button
          type="button"
         
         
          className="cursor-pointer text-primary underline underline-offset-2"
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