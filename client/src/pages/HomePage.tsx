import PlaceGallery from '../components/place-gallery/PlaceGallery'
import { useTranslation } from 'react-i18next'

const HomePage = () => {
  const { t } = useTranslation('app', { keyPrefix: 'home' })
  return (
    <main className="min-h-screen bg-[#fbfcfb]">
      <section className="mx-auto max-w-7xl px-4 pb-2 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">{t('eyebrow')}</p>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{t('title')}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{t('description')}</p>
      </section>
      <PlaceGallery />
    </main>
  )
}

export default HomePage
