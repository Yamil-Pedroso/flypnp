import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Award,
  Bath,
  BedDouble,
  Copy,
  Globe,
  Heart,
  House,
  Link,
  MapPin,
  MessageCircle,
  Share2,
  Sparkles,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { usePlaces, useWishlist } from "../../../lib/hooks";
import CreateWishListBox from "../../wishlist/create/CreateWishListBox";
import ReserveBox from "./ReserveBox";
import ShowAllPhotos from "./ShowAllPhotos";

const stayHighlights = [
  {
    icon: BedDouble,
    title: "Room in a chalet",
    text: "Your own room in the home, plus access to shared spaces.",
  },
  {
    icon: House,
    title: "Shared common spaces",
    text: "You'll share part of the home with the host and other guests.",
  },
  {
    icon: Bath,
    title: "Shared bathroom",
    text: "You'll share a bathroom with the host and other guests in the home.",
  },
  {
    icon: Award,
    title: "Jane is a Superhost",
    text: "An experienced, highly rated host committed to memorable stays.",
  },
];

const PlaceDetails = () => {
  const { id, category } = useParams<{ id: string; category: string }>();
  const { places, loading, error, refresh } = usePlaces();
  const { wishlist, deleteWishlist } = useWishlist();
  const [reserveBoxVisible, setReserveBoxVisible] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [showCreateWishList, setShowCreateWishList] = useState(false);

  if (loading) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8" aria-label="Loading place">
        <div className="h-8 w-2/3 rounded-full bg-slate-200" />
        <div className="mt-5 h-72 rounded-[2rem] bg-slate-200 sm:h-[30rem]" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_23rem]">
          <div className="space-y-4"><div className="h-7 w-3/4 rounded-full bg-slate-200" /><div className="h-24 rounded-3xl bg-slate-200" /></div>
          <div className="hidden h-96 rounded-3xl bg-slate-200 lg:block" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-xl items-center px-4 text-center">
        <div className="w-full rounded-[2rem] border border-rose-100 bg-rose-50 p-8">
          <h1 className="text-2xl font-semibold text-slate-950">We couldn't load this stay</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Please check your connection and try again.</p>
          <button type="button" onClick={refresh} className="mt-5 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">Try again</button>
        </div>
      </main>
    );
  }

  const place = places.find(
    (candidate) => candidate._id === id && candidate.category === category,
  );

  if (!place) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-xl items-center px-4 text-center">
        <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <Sparkles className="mx-auto size-8 text-emerald-600" />
          <h1 className="mt-4 text-2xl font-semibold text-slate-950">Place not found</h1>
          <p className="mt-2 text-sm text-slate-500">This stay may no longer be available.</p>
        </div>
      </main>
    );
  }

  const mainPhoto = place.photos[0]?.main || "";
  const thumbnails = place.photos[0]?.thumbnails || [];
  const photoCount = 1 + thumbnails.length;
  const isSaved = wishlist.some((wish) => wish.place === place._id);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out ${place.title} on Flypnp!`;

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, "_blank");
    setShareOpen(false);
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
    setShareOpen(false);
  };

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, "_blank");
    setShareOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!", { icon: <Link className="size-4" /> });
    setShareOpen(false);
  };

  const handleSave = () => {
    if (isSaved) {
      deleteWishlist(place._id);
      toast("Removed from wishlist", { icon: <Trash2 className="size-4" /> });
    } else {
      setShowCreateWishList(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbfcfb] pb-28 lg:pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-5 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1 font-semibold text-slate-900"><Star className="size-4 fill-current" /> {place.rating}</span>
              <span className="font-medium underline decoration-slate-300 underline-offset-4">{place.reviews} reviews</span>
              <span className="inline-flex min-w-0 items-center gap-1"><MapPin className="size-4 shrink-0 text-emerald-600" /><span className="truncate">{place.address}</span></span>
            </div>
            <h1 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">{place.title}</h1>
          </div>
          <div className="flex shrink-0 gap-1 sm:gap-2">
            <div className="relative">
              <button type="button" onClick={() => setShareOpen(!shareOpen)} aria-label="Share this place" className="group flex size-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-white hover:shadow-sm sm:size-auto sm:gap-2 sm:px-4 sm:py-2.5">
                <Share2 className="size-5 transition group-hover:-translate-y-0.5" /><span className="hidden text-sm font-semibold sm:inline">Share</span>
              </button>
              {shareOpen && (
                <>
                  <div className="fixed inset-0 z-50" onClick={() => setShareOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <p className="px-4 pt-3.5 pb-1 text-xs font-bold uppercase tracking-[0.17em] text-slate-400">Share this place</p>
                    <button type="button" onClick={handleShareWhatsApp} className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700">
                      <MessageCircle className="size-5 text-emerald-600" /> WhatsApp
                    </button>
                    <button type="button" onClick={handleShareFacebook} className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700">
                      <Globe className="size-5 text-blue-600" /> Facebook
                    </button>
                    <button type="button" onClick={handleShareTwitter} className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950">
                      <span className="grid size-5 place-items-center text-sm font-bold text-slate-900">X</span> X (Twitter)
                    </button>
                    <div className="border-t border-slate-100" />
                    <button type="button" onClick={handleCopyLink} className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950">
                      <Copy className="size-5" /> Copy link
                    </button>
                  </div>
                </>
              )}
            </div>
            <button type="button" onClick={handleSave} aria-label={isSaved ? "Remove from wishlist" : "Save this place"} className={`group flex size-10 items-center justify-center rounded-full transition sm:size-auto sm:gap-2 sm:px-4 sm:py-2.5 ${isSaved ? "text-rose-600 hover:bg-rose-50" : "text-slate-700 hover:bg-rose-50 hover:text-rose-600"}`}>
              <Heart className={`size-5 transition group-hover:scale-110 ${isSaved ? "fill-rose-500" : ""}`} /><span className="hidden text-sm font-semibold sm:inline">{isSaved ? "Saved" : "Save"}</span>
            </button>
            <a href="#reservation" className="hidden items-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-slate-800 lg:flex">
              Reserve
            </a>
          </div>
        </header>

        <section className="relative">
          <div className="grid h-72 grid-cols-1 gap-1 overflow-hidden rounded-[1.75rem] bg-slate-200 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.55)] sm:h-[30rem] lg:grid-cols-[1.15fr_0.85fr]">
            <div className="group relative overflow-hidden">
              <img src={mainPhoto} alt={place.title} className="size-full object-cover transition duration-700 group-hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent lg:hidden" />
            </div>
            <div className="hidden grid-cols-2 gap-1 lg:grid">
              {thumbnails.slice(0, 4).map((photo, index) => (
                <div key={photo} className="group min-h-0 overflow-hidden">
                  <img src={photo} alt={`${place.title} view ${index + 2}`} className="size-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-slate-950/85 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md sm:left-5 sm:top-5">
            <Sparkles className="size-4 text-amber-300" /> Guest favorite
          </div>
          <ShowAllPhotos photoCount={photoCount} />
        </section>

        <div className="grid gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-14">
          <section className="min-w-0">
            <div className="border-b border-slate-200 pb-8">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">About this stay</span>
              <h2 className="mt-3 max-w-3xl text-2xl font-semibold leading-tight tracking-[-0.02em] text-slate-950 sm:text-3xl">{place.description}</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {place.perks.map((perk) => <span key={perk} className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm">{perk}</span>)}
              </div>
            </div>

            <div className="my-8 overflow-hidden rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-[0_22px_55px_-35px_rgba(15,23,42,0.8)] sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-md">
                  <div className="flex items-center gap-2 text-amber-300"><Sparkles className="size-5" /><span className="text-xs font-bold uppercase tracking-[0.2em]">Loved by travelers</span></div>
                  <h3 className="mt-3 text-2xl font-semibold">A Flypnp guest favorite</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">One of the most loved homes, according to guests who keep coming back.</p>
                </div>
                <div className="flex items-center gap-7 rounded-2xl bg-white/8 px-5 py-4 ring-1 ring-white/10">
                  <div><p className="text-2xl font-semibold">{place.rating}</p><div className="mt-1 flex gap-0.5 text-amber-300">{Array.from({ length: 5 }, (_, index) => <Star key={index} className="size-3 fill-current" />)}</div></div>
                  <div className="h-10 w-px bg-white/15" />
                  <div><p className="text-2xl font-semibold">{place.reviews}</p><p className="text-xs text-slate-400">reviews</p></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b border-slate-200 pb-8">
              <div className="relative size-16 shrink-0">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop" alt="Host Jane" className="size-full rounded-full object-cover ring-4 ring-white shadow-md" />
                <span className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full bg-rose-500 text-white ring-2 ring-white"><Award className="size-4" /></span>
              </div>
              <div><p className="text-lg font-semibold text-slate-950">Hosted by Jane</p><p className="mt-0.5 text-sm text-slate-500">Superhost · 4 years hosting</p></div>
            </div>

            <div className="grid gap-3 py-8 sm:grid-cols-2">
              {stayHighlights.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
                  <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="size-5" /></span>
                  <h3 className="mt-4 font-semibold text-slate-950">{title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-500">{text}</p>
                </article>
              ))}
            </div>
          </section>

          <aside id="reservation" className="hidden scroll-mt-32 lg:block">
            <div className="sticky top-32"><ReserveBox /></div>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-12px_35px_-25px_rgba(15,23,42,0.55)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div><p className="text-lg font-semibold text-slate-950">{place.price} CHF <span className="text-sm font-normal text-slate-500">night</span></p><p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-slate-700"><Star className="size-3.5 fill-current" /> {place.rating} · <span className="underline">{place.reviews} reviews</span></p></div>
          <button type="button" onClick={() => setReserveBoxVisible(true)} className="rounded-full bg-rose-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition active:scale-95">Reserve</button>
        </div>
      </div>

      {reserveBoxVisible && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/55 p-0 backdrop-blur-sm lg:hidden" role="dialog" aria-modal="true" aria-label="Reserve this place">
          <button type="button" aria-label="Close reservation overlay" onClick={() => setReserveBoxVisible(false)} className="absolute inset-0 cursor-default" />
          <div className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] bg-[#fbfcfb] p-4 pb-8 shadow-2xl sm:mx-auto sm:mb-4 sm:max-w-md sm:rounded-[2rem]">
            <div className="mb-3 flex items-center justify-between px-1"><div className="h-1.5 w-10 rounded-full bg-slate-300 sm:hidden" /><p className="hidden text-sm font-semibold text-slate-950 sm:block">Complete your reservation</p><button type="button" aria-label="Close reservation" onClick={() => setReserveBoxVisible(false)} className="grid size-9 place-items-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-200"><X className="size-5" /></button></div>
            <ReserveBox />
          </div>
        </div>
      )}

      {showCreateWishList && (
        <div className="fixed inset-0 z-[999] grid place-items-center overflow-y-auto bg-slate-950/65 p-4 backdrop-blur-md sm:p-6">
          <CreateWishListBox
            closeCreateWishList={() => setShowCreateWishList(false)}
            placeId={place._id}
            title={place.title}
            picture={mainPhoto}
          />
        </div>
      )}
    </main>
  );
};

export default PlaceDetails;
