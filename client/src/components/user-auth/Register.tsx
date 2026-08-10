import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { IoCloseSharp } from "react-icons/io5";
import { useAuth } from "../../lib/hooks";
import { useTranslation } from "react-i18next";

interface RegisterProps {
  closeUserForm: () => void;
  changeToLogin: () => void;
}

const Register = ({ closeUserForm, changeToLogin }: RegisterProps) => {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    avatar: File | null;
  }>({
    name: "",
    email: "",
    password: "",
    avatar: null,
  });

  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    password: false,
    avatar: false,
  });

  const auth = useAuth();
  const { t } = useTranslation("auth", { keyPrefix: "register" });

  const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type !== "file") {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
      setFormErrors({ ...formErrors, [name]: false });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, avatar: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.avatar
    ) {
      setFormErrors({
        name: !formData.name,
        email: !formData.email,
        password: !formData.password,
        avatar: !formData.avatar,
      });
      console.log("Register failed: Missing fields");
      return;
    }

    const response = await auth.register(formData);
    if (response.success) {
      console.log("User registered");
      closeUserForm();
    } else {
      console.log("Couldn't register user");
    }
  };

  const handleGoogleLogin = async (credential?: string) => {
    if (!credential) return;
    const response = await auth.googleLogin(credential);
    if (response.success) {
      closeUserForm();
    } else {
      console.log(response.message);
    }
  };

  return (
    <div className="max-h-[calc(100vh-1.5rem)] w-full overflow-y-auto rounded-[2rem] border border-white/10 bg-white shadow-[0_35px_100px_-28px_rgba(0,0,0,0.75)] sm:max-h-[calc(100vh-3rem)]">
      <div className="relative overflow-hidden bg-slate-950 px-6 py-6 text-white sm:px-8">
        <div className="pointer-events-none absolute -right-12 -top-20 size-52 rounded-full bg-rose-500/20 blur-3xl" />
        <button type="button" onClick={closeUserForm} aria-label={t("close")} className="absolute right-5 top-5 z-10 grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:rotate-90 hover:bg-white hover:text-slate-950">
          <IoCloseSharp className="text-[22px]" />
        </button>
        <div className="relative pr-14">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-300">{t("eyebrow")}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{t("title")}</h1>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-8 sm:py-6">
        <form onSubmit={handleSubmit} className="grid gap-3.5">
          <label className="grid gap-1.5 text-sm font-semibold text-slate-800">
            {t("name")}
            <input type="text" name="name" placeholder={t("namePlaceholder")} value={formData.name} onChange={handleFormData} className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 font-normal text-slate-950 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${formErrors.name ? "border-rose-500 focus:ring-rose-100" : "border-slate-200 focus:border-slate-950 focus:ring-slate-950/10"}`} />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-slate-800">
            {t("email")}
            <input type="email" name="email" placeholder={t("emailPlaceholder")} value={formData.email} onChange={handleFormData} className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 font-normal text-slate-950 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${formErrors.email ? "border-rose-500 focus:ring-rose-100" : "border-slate-200 focus:border-slate-950 focus:ring-slate-950/10"}`} />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-slate-800">
            {t("password")}
            <input type="password" name="password" placeholder="********" value={formData.password} onChange={handleFormData} className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 font-normal text-slate-950 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${formErrors.password ? "border-rose-500 focus:ring-rose-100" : "border-slate-200 focus:border-slate-950 focus:ring-slate-950/10"}`} />
          </label>

          <label className="grid gap-1.5 text-sm font-semibold text-slate-800">
            {t("photo")}
            <input type="file" name="avatar" accept="image/*" onChange={handleFileChange} className={`w-full rounded-2xl border bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-600 outline-none transition file:mr-3 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-slate-800 ${formErrors.avatar ? "border-rose-500" : "border-slate-200"}`} />
          </label>

          <button
            type="submit"
            className="mt-1 rounded-full bg-rose-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5 hover:bg-rose-600"
          >
            {t("submit")}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-slate-400 before:h-px before:flex-1 before:bg-slate-200 after:h-px after:flex-1 after:bg-slate-200">
          <span>{t("or")}</span>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) =>
              handleGoogleLogin(credentialResponse.credential)
            }
            onError={() => console.log("Google login failed")}
            width="280"
          />
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
          <span>{t("member")}</span>
          <button type="button"
            onClick={changeToLogin}
            className="font-bold text-rose-500 transition hover:text-rose-600"
          >
            {t("login")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
