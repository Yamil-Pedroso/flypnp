import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowUpRight,
  Compass,
  Heart,
  Images,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { apiBaseUrl, type WishlistItem } from "../../services";
import { useWishlist } from "../../lib/hooks";
import DeleteBox from "./DeleteBox";

const apiRoot = apiBaseUrl.replace(/\/api\/v1\/?$/, "");
const resolvePicture = (picture?: string) => picture && !picture.startsWith("http") ? `${apiRoot}${picture}` : picture;

const WishList = () => {
  const [itemToDelete, setItemToDelete] = useState<WishlistItem | null>(null);
  const { wishlist, loading, error, refresh, deleteWishlist } = useWishlist();

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    await deleteWishlist(itemToDelete.place);
    toast.success("Successfully deleted the place", { icon: <Trash2 className="size-4" /> });
    setItemToDelete(null);
  };

  return (
    <main className="min-h-screen bg-[#f6f8f6] pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <section className="relative isolate overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-9 text-white shadow-xl shadow-slate-950/10 sm:px-10 sm:py-12 lg:px-14">
          <div className="absolute -right-20 -top-24 size-72 rounded-full border-[3rem] border-emerald-400/10" />
          <div className="absolute bottom-5 right-[28%] size-24 rounded-full bg-emerald-400/20 blur-2xl" />
          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-rose-50"><Heart className="size-5 fill-current" /><span className="text-xs font-semibold uppercase tracking-[0.18em]">Saved for later</span></div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Places you can’t stop thinking about.</h1>
              <p className="mt-4 max-w-xl leading-7 text-rose-50/90">Keep every inspiring stay close, then turn a favorite into your next adventure.</p>
            </div>
            <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/20 bg-white/15 px-5 py-4 backdrop-blur"><Images className="size-6" /><div><p className="text-2xl font-semibold leading-none">{wishlist.length}</p><p className="mt-1 text-xs text-rose-50">Saved place{wishlist.length === 1 ? "" : "s"}</p></div></div>
          </div>
        </section>

        <section className="pt-8 sm:pt-10">
          <div className="flex items-end justify-between gap-4">
            <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Your collection</p><h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">My wishlist</h2></div>
            {wishlist.length > 0 && <Link to="/" className="hidden items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950 sm:flex">Discover more <ArrowUpRight className="size-4" /></Link>}
          </div>

          {loading ? (
            <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Loading wishlist">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-80 animate-pulse rounded-[1.75rem] bg-slate-200" />)}</div>
          ) : error ? (
            <div className="mt-7 rounded-[1.75rem] border border-rose-100 bg-rose-50 px-6 py-12 text-center" role="alert"><RefreshCw className="mx-auto size-8 text-rose-500" /><h3 className="mt-4 text-xl font-semibold text-slate-950">We couldn’t load your wishlist</h3><p className="mt-2 text-slate-600">Your saved places are still safe. Please try again.</p><button type="button" onClick={() => void refresh()} className="mt-5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">Try again</button></div>
          ) : wishlist.length === 0 ? (
            <div className="relative mt-7 overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-6 py-14 text-center shadow-sm sm:px-10 sm:py-20">
              <Sparkles className="absolute left-[20%] top-16 size-5 text-amber-400" /><Sparkles className="absolute right-[22%] top-24 size-4 text-rose-400" />
              <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-rose-50 text-rose-500"><Heart className="size-9" /></div>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950">Your wishlist is ready for inspiration</h3>
              <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-500">Tap the heart on any stay you love and it will be waiting for you here.</p>
              <Link to="/" className="mt-7 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700"><Compass className="size-4" />Explore stays</Link>
            </div>
          ) : (
            <div className="mt-7 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlist.map((wish, index) => {
                const picture = resolvePicture(wish.picture);
                return (
                  <motion.article key={wish._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.2) }} className="group min-w-0">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-slate-200">
                      {picture ? <img src={picture} alt={wish.title} className="size-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex size-full items-center justify-center bg-rose-50 text-rose-400"><Images className="size-10" /></div>}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent opacity-70" />
                      <button type="button" onClick={() => setItemToDelete(wish)} aria-label={`Remove ${wish.title} from wishlist`} className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm backdrop-blur transition hover:scale-105 hover:bg-rose-500 hover:text-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"><Trash2 className="size-4.5" /></button>
                      <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur">Saved stay</span>
                    </div>
                    <div className="px-1 pt-3"><h3 className="truncate text-lg font-semibold text-slate-950">{wish.title}</h3><p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><Heart className="size-3.5 fill-rose-400 text-rose-400" />Ready when you are</p></div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {itemToDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setItemToDelete(null); }}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 12 }} transition={{ duration: 0.2 }} className="w-full max-w-md"><DeleteBox title={itemToDelete.title} handleCloseDeleteBox={() => setItemToDelete(null)} deleteItem={() => void confirmDelete()} /></motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default WishList;
