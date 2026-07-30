import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ImagePlus, LoaderCircle, Save, ShieldAlert, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../lib/hooks";
import { getErrorMessage, placesService, type PlaceInput } from "../../services";

const emptyForm: PlaceInput = {
  title: "",
  address: "",
  photos: [],
  category: "trending",
  description: "",
  perks: [],
  extraInfo: "",
  maxGuests: 1,
  price: 1,
};

const PlacesForm = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [form, setForm] = useState<PlaceInput>(emptyForm);
  const [perksText, setPerksText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const userId = user?._id;

  useEffect(() => {
    if (!id || !userId) return;
    let active = true;
    placesService.get(id)
      .then((place) => {
        if (!active) return;
        setForm({
          title: place.title,
          address: place.address,
          photos: place.photos,
          category: place.category,
          description: place.description,
          perks: place.perks,
          extraInfo: place.extraInfo,
          maxGuests: place.maxGuests,
          price: place.price,
        });
        setPerksText(place.perks.join(", "));
      })
      .catch((cause) => { if (active) setError(getErrorMessage(cause, "Could not load this listing")); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, userId]);

  const setField = <K extends keyof PlaceInput>(key: K, value: PlaceInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const addImages = (urls: string[]) => {
    setForm((current) => ({
      ...current,
      photos: [
        ...current.photos,
        ...urls.filter(Boolean).map((url) => ({ main: url, thumbnails: [] })),
      ],
    }));
  };

  const uploadFiles = async (files: File[]) => {
    if (!files.length) return;
    try {
      setUploading(true);
      addImages(await placesService.uploadImages(files));
      toast.success("Photos uploaded");
    } catch (cause) {
      toast.error(getErrorMessage(cause, "Could not upload these photos"));
    } finally {
      setUploading(false);
    }
  };

  const uploadLink = async () => {
    if (!imageUrl.trim()) return;
    try {
      setUploading(true);
      addImages([await placesService.uploadFromLink(imageUrl.trim())]);
      setImageUrl("");
      toast.success("Photo added");
    } catch (cause) {
      toast.error(getErrorMessage(cause, "Could not add this image"));
    } finally {
      setUploading(false);
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) {
      setError("Log in before creating a listing.");
      return;
    }
    if (form.photos.length === 0) {
      setError("Add at least one photo.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      const payload = {
        ...form,
        perks: perksText.split(",").map((perk) => perk.trim()).filter(Boolean),
      };
      if (id) await placesService.update(id, payload);
      else await placesService.create(payload);
      toast.success(id ? "Listing updated" : "Your home is now listed");
      navigate("/host");
    } catch (cause) {
      setError(getErrorMessage(cause, "Could not save this listing"));
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-[#f6f8f6] px-4">
        <div className="max-w-lg rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-900/5">
          <ShieldAlert className="mx-auto size-10 text-rose-500" />
          <h1 className="mt-5 text-2xl font-semibold text-slate-950">Log in to list your home</h1>
          <p className="mt-2 text-slate-500">Use the user menu to log in before creating or editing a property.</p>
          <Link to="/" className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white">Back to Flypnp</Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return <main className="grid min-h-[70vh] place-items-center bg-[#f6f8f6]"><span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"><LoaderCircle className="size-5 animate-spin" />Loading listing…</span></main>;
  }

  return (
    <main className="min-h-screen bg-[#f6f8f6] pb-16">
      <div className="mx-auto w-full max-w-5xl px-4 pt-7 sm:px-6 sm:pt-10 lg:px-8">
        <Link to="/host" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950"><ArrowLeft className="size-4" />Host dashboard</Link>
        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <form onSubmit={submit} className="space-y-6">
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">{editing ? "Edit your place" : "Create a listing"}</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{editing ? "Keep your listing fresh." : "Tell travelers about your home."}</h1>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <label className="sm:col-span-2"><span className="text-sm font-semibold text-slate-800">Listing title</span><input required value={form.title} onChange={(event) => setField("title", event.target.value)} placeholder="Quiet alpine apartment" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50" /></label>
                <label className="sm:col-span-2"><span className="text-sm font-semibold text-slate-800">Address</span><input required value={form.address} onChange={(event) => setField("address", event.target.value)} placeholder="Street, city and country" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50" /></label>
                <label><span className="text-sm font-semibold text-slate-800">Category</span><select value={form.category} onChange={(event) => setField("category", event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500"><option value="trending">Trending</option><option value="beachFront">Beachfront</option><option value="iconicCities">Iconic city</option></select></label>
                <label><span className="text-sm font-semibold text-slate-800">Nightly price (CHF)</span><input required type="number" min="1" step="0.01" value={form.price} onChange={(event) => setField("price", Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" /></label>
                <label><span className="text-sm font-semibold text-slate-800">Maximum guests</span><input required type="number" min="1" value={form.maxGuests} onChange={(event) => setField("maxGuests", Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" /></label>
                <label><span className="text-sm font-semibold text-slate-800">Perks</span><input aria-label="Perks" value={perksText} onChange={(event) => setPerksText(event.target.value)} placeholder="Wi-Fi, kitchen, parking" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" /><span className="mt-1 block text-xs text-slate-400">Separate each perk with a comma.</span></label>
                <label className="sm:col-span-2"><span className="text-sm font-semibold text-slate-800">Description</span><textarea required rows={5} value={form.description} onChange={(event) => setField("description", event.target.value)} placeholder="What makes this place memorable?" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" /></label>
                <label className="sm:col-span-2"><span className="text-sm font-semibold text-slate-800">House rules and extra information</span><textarea required rows={4} value={form.extraInfo} onChange={(event) => setField("extraInfo", event.target.value)} placeholder="Check-in instructions, quiet hours and anything guests should know." className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" /></label>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-sky-50 text-sky-700"><ImagePlus className="size-5" /></span><div><h2 className="text-xl font-semibold text-slate-950">Photos</h2><p className="text-sm text-slate-500">Add at least one clear image.</p></div></div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="Paste a public image URL" className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" />
                <button type="button" disabled={uploading || !imageUrl.trim()} onClick={() => void uploadLink()} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">Add link</button>
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700"><Upload className="size-4" />Upload<input type="file" accept="image/*" multiple className="hidden" onChange={(event) => void uploadFiles(Array.from(event.target.files ?? []))} /></label>
              </div>
              {uploading && <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-500"><LoaderCircle className="size-3.5 animate-spin" />Uploading photos…</p>}
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {form.photos.map((photo, index) => (
                  <div key={`${photo.main}-${index}`} className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
                    <img src={photo.main} alt="" className="size-full object-cover" />
                    <button type="button" aria-label={`Remove photo ${index + 1}`} onClick={() => setField("photos", form.photos.filter((_, photoIndex) => photoIndex !== index))} className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/90 text-rose-600 opacity-100 shadow-sm transition sm:opacity-0 sm:group-hover:opacity-100"><Trash2 className="size-3.5" /></button>
                  </div>
                ))}
              </div>
            </section>

            {error && <p role="alert" className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-rose-100">{error}</p>}
            <button type="submit" disabled={saving || uploading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-rose-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-600 disabled:opacity-50"><Save className="size-4" />{saving ? "Saving…" : editing ? "Save changes" : "Publish listing"}</button>
          </form>

          <aside className="rounded-[1.75rem] bg-slate-950 p-6 text-white lg:sticky lg:top-28">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">A thoughtful listing</p>
            <h2 className="mt-3 text-2xl font-semibold">Help guests imagine the stay.</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
              <li>Use bright, recent photos.</li>
              <li>Describe the neighborhood honestly.</li>
              <li>Set clear house rules and guest capacity.</li>
              <li>Choose a nightly price you can maintain.</li>
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default PlacesForm;
