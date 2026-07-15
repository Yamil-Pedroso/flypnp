import { FaImages } from "react-icons/fa6";

const ShowAllPhotos = ({ photoCount }: { photoCount: number }) => {
  return (
    <button type="button" className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-white/70 bg-white/95 px-4 py-2.5 text-xs font-bold text-slate-900 shadow-xl backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white active:scale-95 sm:bottom-5 sm:right-5 sm:text-sm">
      <FaImages size={18} />
      <span>Show all {photoCount} photos</span>
    </button>
  );
};

export default ShowAllPhotos;
