import React from "react";
import { useAuth } from "../../lib/hooks";
import { IoCloseSharp } from "react-icons/io5";
import { KeyRound, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UpdateProfileProps {
  closeUserForm: () => void;
}

const UpdateProfile = ({ closeUserForm }: UpdateProfileProps) => {
  const [formData, setFormData] = React.useState({
    name: "",
    password: "",
  });
  const [formErrors, setFormErrors] = React.useState({
    name: false,
    password: false,
  });
  const auth = useAuth();
  const { user, updateUser } = auth;
  const { t } = useTranslation("auth", { keyPrefix: "update" });

  const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: false,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const response = await updateUser(formData, user._id);
    if (response.success) {
      closeUserForm();
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-white shadow-2xl">
      <div className="border-b border-slate-100 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">{t("eyebrow")}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{t("title")}</h1>
        <button type="button" onClick={closeUserForm} aria-label={t("closeEditor")} className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"><IoCloseSharp className="text-2xl" /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
        <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">{t("displayName")}</span><span className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 transition focus-within:border-slate-500 focus-within:ring-2 focus-within:ring-slate-100"><UserRound className="size-4 text-slate-400" /><input type="text" name="name" id="name" value={formData.name} onChange={handleFormData} placeholder={t("namePlaceholder")} className="w-full bg-transparent py-3 text-slate-800 outline-none placeholder:text-slate-400" /></span></label>

        <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">{t("password")}</span><span className={`flex items-center gap-3 rounded-xl border px-4 transition focus-within:ring-2 ${formErrors.password ? "border-rose-500 focus-within:ring-rose-100" : "border-slate-200 focus-within:border-slate-500 focus-within:ring-slate-100"}`}><KeyRound className="size-4 text-slate-400" /><input type="password" name="password" value={formData.password} onChange={handleFormData} placeholder={t("passwordPlaceholder")} className="w-full bg-transparent py-3 text-slate-800 outline-none placeholder:text-slate-400" /></span></label>

        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-800">{t("hint")}</p>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={closeUserForm}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            {t("close")}
          </button>

          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            {t("submit")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
