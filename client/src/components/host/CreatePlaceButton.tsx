import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const CreatePlaceButton = ({ compact = false }: { compact?: boolean }) => (
  <Link
    to="/host/listings/new"
    className={`inline-flex items-center justify-center gap-2 rounded-full bg-rose-500 font-bold text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5 hover:bg-rose-600 ${
      compact ? "px-4 py-2.5 text-sm" : "px-5 py-3 text-sm"
    }`}
  >
    <Plus className="size-4" /> List a new place
  </Link>
);

export default CreatePlaceButton;
