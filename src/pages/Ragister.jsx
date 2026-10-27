import { useState } from "react";

/* Floating-label input: the label sits inside the field and moves onto the
   border when the field is focused or has a value. */
function FloatingInput({ id, label, type = "text", className = "", ...props }) {
  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        name={id}
        type={type}
        placeholder=" "
        className="peer h-9.5 w-full border border-[#e5e5e5] bg-white px-3 text-sm text-primary outline-none transition-colors focus:border-2 focus:border-primary"
        {...props}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 bg-white px-1 text-[13px] text-gray transition-all
                   peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary
                   peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs"
      >
        {label}
      </label>
    </div>
  );
}

// function Tab({ active, onClick, children }) {
//   return (
//     <button
//       type="button"
//       role="tab"
//       aria-selected={active}
//       onClick={onClick}
//       className={`cursor-pointer border-b-2 pb-1 text-sm uppercase transition-colors ${
//         active
//           ? "border-primary text-primary"
//           : "border-transparent text-gray hover:text-primary"
//       }`}
//     >
//       {children}
//     </button>
//   );
// }

function SubmitButton({ children }) {
  return (
    <button
      type="submit"
      className="mt-6 h-[42px] w-full cursor-pointer bg-primary text-sm uppercase text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {children}
    </button>
  );
}

export function RegisterForm({ onCreateAccount }) {
  const [form, setForm] = useState({ username: "", password: "", remember: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call your login API with `form`
    console.log("login", form);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <FloatingInput
        id="username"
        label="Username or email address *"
        autoComplete="username"
        required
        value={form.username}
        onChange={handleChange}
     
   
      />

      <FloatingInput
        id="password"
        label="Password *"
        type="password"
        autoComplete="current-password"
        required
        className="mt-6"
        value={form.password}
        onChange={handleChange}
        
      />

      <div className="mt-4 flex items-center justify-between text-[13px]">
        <label className="flex cursor-pointer items-center gap-2 text-gray">
          <span className="relative flex size-4 shrink-0">
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
              className="peer size-4 cursor-pointer appearance-none rounded-xs border border-[#d4d4d4] bg-white transition-colors checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            />
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="white"
              strokeWidth="2"
              className="pointer-events-none absolute inset-0 hidden size-4 peer-checked:block"
              aria-hidden="true"
            >
              <path d="M3.5 8.5l3 3 6-6.5" />
            </svg>
          </span>
          Remember me
        </label>

        <a href="/lost-password" className="text-primary underline underline-offset-2">
          Lost password?
        </a>
      </div>

      <SubmitButton>Ragister</SubmitButton>

      <p className="mt-6 text-center text-[13px] text-gray">
        Have an account?{" "}
        <button
          type="button"
          onClick={onCreateAccount}
          className="cursor-pointer text-primary underline underline-offset-2"
        >
          
        </button>
      </p>
    </form>
  );
}



export default function Ragister() {


  return (
    <main className="min-h-screen bg-white font-jost text-primary antialiased flex justify-center items-center">
      <div className="container px-4 pb-16 pt-6">
        <div className="mx-auto w-full max-w-87.5  ">
          <div role="tablist" className="flex items-center justify-center">
            
            Ragister
            
         
          </div>

         
            <RegisterForm />
        </div>
      </div>
    </main>
  );
}