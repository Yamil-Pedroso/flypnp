import { useState } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "../../lib/hooks";
import type { Experience } from "../../services";
import CreateWishListBox from "../wishlist/create/CreateWishListBox";
import { useTranslation } from "react-i18next";

const ExperienceWishlistButton = ({
  experience,
  className = "",
}: {
  experience: Experience;
  className?: string;
}) => {
  const { t } = useTranslation("experiences");
  const [open, setOpen] = useState(false);
  const { wishlist } = useWishlist();
  const isSaved = wishlist.some((wish) => wish.experience === experience._id);

  return (
    <>
      <button
        type="button"
        aria-label={t("card.save", { title: experience.title })}
        aria-pressed={isSaved}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
        className={`flex size-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-sm backdrop-blur transition hover:scale-105 hover:text-rose-500 ${className}`}
      >
        <Heart className={`size-5 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[999] grid place-items-center overflow-y-auto bg-slate-950/65 p-4 backdrop-blur-md sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <CreateWishListBox
            closeCreateWishList={() => setOpen(false)}
            className="wishlist-box"
            placeId={experience._id}
            title={experience.title}
            picture={experience.images[0] ?? ""}
            itemType="experience"
          />
        </div>
      )}
    </>
  );
};

export default ExperienceWishlistButton;
