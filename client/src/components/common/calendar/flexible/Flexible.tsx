import { useTranslation } from "react-i18next";

const Flexible = () => {
  const { t } = useTranslation("search");
  return (
    <div className="flex h-80 w-full max-w-3xl items-center justify-center">
      <h1 className="text-2xl font-semibold text-slate-900">{t("flexible")}</h1>
    </div>
  )
}

export default Flexible
