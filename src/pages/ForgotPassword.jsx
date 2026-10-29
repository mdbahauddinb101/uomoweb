import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { sendPasswordResetEmail } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import { auth } from "../firebase.config";
import { ref, set } from "firebase/database";
import LocalizedInput from "../components/common/LocalizedInput";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();


sendPasswordResetEmail(auth , email)
  .then(() => {
    toast.success("Email Sent Successfull");
    navigate("/login")
  })
  .catch((error) => {
    const errorcode = error.code;
           toast.error("something went wrong");
  });






    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setError("");
    // TODO: call your API here, e.g.
    // await fetch("/api/forgot-password", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email }),
    // });
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
         <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        {submitted ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
              ✓
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              Check your email
            </h2>
            <p className="text-sm text-gray-600">
              We sent a password reset link to{" "}
              <span className="font-medium text-gray-900">{email}</span>.
            </p>
          </div>
        ) : (
          <>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              Forgot password?
            </h2>
            <p className="mb-6 text-sm text-gray-600">
              Enter your email and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <LocalizedInput
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 ${
                  error
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Send reset link
              </button>
              <p className="text-left text-sm my-5">
           Back to{" "}
            <Link to="/login" className="underline">
              Login
            </Link>
            </p>              
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;