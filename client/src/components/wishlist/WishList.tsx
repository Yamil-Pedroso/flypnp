import { useState } from "react";
import { useWishlist } from "../../../hooks";
import { AiFillDelete } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import images from "../../assets/images/index";
import { motion, AnimatePresence } from "framer-motion";

interface ShowDeleteIconState {
  [key: string]: boolean;
}

const WishList = () => {
  const [showDeleteIcon, setShowDeleteIcon] = useState<ShowDeleteIconState>({});
  const [deleteBoxInfo, setDeleteBoxInfo] = useState({
    show: false,
    itemId: null as string | null,
  });
  const { wishlist, deleteWishlist } = useWishlist();

  const handleShowDeleteBox = (itemId: string) => {
    setDeleteBoxInfo({ show: true, itemId });
  };

  const handleCloseDeleteBox = () => {
    setDeleteBoxInfo({ ...deleteBoxInfo, show: false });
  };

  const overPicture = (place: string) => {
    setShowDeleteIcon((prevState) => ({ ...prevState, [place]: true }));
  };

  const leavePicture = (place: string) => {
    setShowDeleteIcon((prevState) => ({ ...prevState, [place]: false }));
  };

  return (
    <div className="flex flex-col p-4 border-t border-gray-200 relative">
      <div className="flex flex-col gap-2 px-[20rem]">
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-medium text-gray-600">
              Your wishlist is empty!
            </h1>
            <p className="text-[1.1rem] text-gray-500 font-light leading-6 w-1/2 mt-1">
              Start adding items to your wishlist by clicking the heart icon on
              the item you want to save.
            </p>
            <div className="flex justify-center items-center p-4 rounded-md">
              <img
                src={images.emptyBox}
                alt="wishlist"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-lg font-medium text-gray-600">Your wishlist</h1>
            <div className="flex flex-wrap items-center gap-4 w-[80rem]">
              {wishlist.map((wish) => (
                <div
                  key={wish.id}
                  className="flex flex-col relative"
                  onMouseEnter={() => overPicture(wish.place)}
                  onMouseLeave={() => leavePicture(wish.place)}
                >
                  <div className="w-[15rem] h-[15rem] shadow-md rounded-[10px] border border-gray-200 overflow-hidden m-2 p-2">
                    <img
                      src={wish.picture}
                      alt={wish.title}
                      className="w-full h-full object-cover rounded-[10px]"
                    />
                  </div>
                  <div
                    className={`flex justify-center items-center mt-4 w-8 h-8 bg-white rounded-full shadow-lg absolute right-0 -top-4 transition-opacity duration-200 ${
                      showDeleteIcon[wish.place] ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <AiFillDelete
                      className="cursor-pointer"
                      size={18}
                      onClick={() => handleShowDeleteBox(wish.place)}
                    />
                  </div>
                  <div className="w-[15rem] text-center">
                    <strong>{wish.title}</strong>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {deleteBoxInfo.show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4 p-8 w-[22rem] h-[20rem] bg-white rounded-lg shadow-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100]"
          >
            <IoCloseSharp
              size={24}
              className="absolute top-2 right-2 cursor-pointer text-gray-600 hover:text-gray-800"
              onClick={handleCloseDeleteBox}
            />
            <h3 className="text-lg text-gray-700">
              Are you sure you want to delete this item?
            </h3>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (deleteBoxInfo.itemId) {
                    deleteWishlist(deleteBoxInfo.itemId);
                    handleCloseDeleteBox();
                  }
                }}
                className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={handleCloseDeleteBox}
                className="px-4 py-2 bg-gray-200 text-white rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WishList;
