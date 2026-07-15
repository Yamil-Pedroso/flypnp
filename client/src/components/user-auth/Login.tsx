import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { IoCloseSharp } from "react-icons/io5";
import { useAuth } from "../../lib/hooks";

interface LoginProps {
  closeUserForm: () => void;
  changeToRegister: () => void;
}

const Login = ({ closeUserForm, changeToRegister }: LoginProps) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({
    email: false,
    password: false,
  });
  const auth = useAuth();

  const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: false });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setFormErrors({ email: !formData.email, password: !formData.password });
      console.log("Login failed: Missing fields");
      return;
    }
    const response = await auth.login(formData);
    if (response.success) {
      console.log("User logged in");
      closeUserForm();
    } else {
      console.log("Login failed: Invalid credentials");
      setFormErrors({ email: true, password: true });
    }
  };

  const handleGoogleLogin = async (credential?: string) => {
    if (!credential) return;
    const response = await auth.googleLogin(credential);
    if (response.success) {
      console.log("User logged in with Google");
      closeUserForm();
    } else {
      console.log(response.message);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-[0_35px_100px_-28px_rgba(0,0,0,0.75)]">
      <div className="relative overflow-hidden bg-slate-950 px-6 py-7 text-white sm:px-8">
        <div className="pointer-events-none absolute -right-12 -top-20 size-52 rounded-full bg-emerald-500/20 blur-3xl" />
        <button type="button" onClick={closeUserForm} aria-label="Close login dialog" className="absolute right-5 top-5 z-10 grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:rotate-90 hover:bg-white hover:text-slate-950">
          <IoCloseSharp className="text-[22px]" />
        </button>
        <div className="relative pr-14">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Welcome back</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Login</h1>
        </div>
      </div>

      <div className="px-5 py-6 sm:px-8 sm:py-7">
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <label className="grid gap-2 text-sm font-semibold text-slate-800">
            Email address
            <input
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleFormData}
              className={`w-full rounded-2xl border bg-slate-50 px-4 py-3.5 font-normal text-slate-950 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${formErrors.email ? "border-rose-500 focus:ring-rose-100" : "border-slate-200 focus:border-slate-950 focus:ring-slate-950/10"}`}
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-800">
            Password
            <input
              name="password"
              type="password"
              placeholder="password"
              value={formData.password}
              onChange={handleFormData}
              className={`w-full rounded-2xl border bg-slate-50 px-4 py-3.5 font-normal text-slate-950 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${formErrors.password ? "border-rose-500 focus:ring-rose-100" : "border-slate-200 focus:border-slate-950 focus:ring-slate-950/10"}`}
            />
          </label>
          <button
            type="submit"
            className="mt-1 rounded-full bg-rose-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5 hover:bg-rose-600"
          >
            Login
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-slate-400 before:h-px before:flex-1 before:bg-slate-200 after:h-px after:flex-1 after:bg-slate-200">
          <span>or</span>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) =>
              handleGoogleLogin(credentialResponse.credential)
            }
            onError={() => console.log("Login Failed")}
            text="continue_with"
            width="280"
          />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2 border-t border-slate-100 pt-5 text-sm text-slate-600">
          <span>Don't have an account yet?</span>
          <button type="button"
            onClick={changeToRegister}
            className="font-bold text-rose-500 transition hover:text-rose-600"
          >
            Register now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
