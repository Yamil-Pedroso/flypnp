import { FaImages } from 'react-icons/fa6'

const ShowAllPhotos = () => {
  return (
    <button type="button" className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl border border-slate-900 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-lg transition active:scale-90">
      <FaImages size={24} />
      <span>Show all photos</span>
    </button>
  )
}

export default ShowAllPhotos
