import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CreatePlaceButton = ({ compact = false }: { compact?: boolean }) => {
  const { t } = useTranslation("places");
  return (
  <Link
    to="/host/listings/new"
    className={`inline-flex items-center justify-center gap-2 rounded-full bg-rose-500 font-bold text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5 hover:bg-rose-600 ${
      compact ? "px-4 py-2.5 text-sm" : "px-5 py-3 text-sm"
    }`}
  >
    <Plus className="size-4" /> {t("host.newPlace")}
  </Link>
  );
};

export default CreatePlaceButton;
