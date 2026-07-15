import PlaceGallery from '../components/place-gallery/PlaceGallery'

const HomePage = () => {
  return (
    <main className="min-h-screen bg-[#fbfcfb]">
      <section className="mx-auto max-w-7xl px-4 pb-2 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Find your next place</p>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Stay somewhere that feels like a story worth telling.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">Distinctive homes, simple booking and memorable escapes—all in one place.</p>
      </section>
      <PlaceGallery />
    </main>
  )
}

export default HomePage
