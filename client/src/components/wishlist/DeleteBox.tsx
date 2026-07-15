import { AlertTriangle, X } from "lucide-react";

interface DeleteBoxProps {
  handleCloseDeleteBox: () => void;
  deleteItem: () => void;
  title?: string;
}

const DeleteBox = ({ handleCloseDeleteBox, deleteItem, title }: DeleteBoxProps) => (
  <div role="dialog" aria-modal="true" aria-label="Remove saved place" className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
    <div className="px-6 pb-6 pt-7">
      <button type="button" onClick={handleCloseDeleteBox} aria-label="Close remove dialog" className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"><X className="size-5" /></button>
      <span className="flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600"><AlertTriangle className="size-6" /></span>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">Remove from wishlist?</h2>
      <p className="mt-2 leading-6 text-slate-500">{title ? <><span className="font-medium text-slate-700">{title}</span> will no longer appear in your saved places.</> : "This place will no longer appear in your saved collection."}</p>
    </div>
    <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
      <button type="button" onClick={handleCloseDeleteBox} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white">Keep it</button>
      <button type="button" onClick={deleteItem} className="rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600">Remove place</button>
    </div>
  </div>
);

export default DeleteBox;
