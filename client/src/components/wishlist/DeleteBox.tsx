import { IoCloseSharp } from "react-icons/io5";

interface DeleteBoxProps {
  className?: string;
  handleCloseDeleteBox: () => void;
  deleteItem: () => void;
  itemIdToDelete?: string;
}

const DeleteBox = ({
  className,
  handleCloseDeleteBox,
  deleteItem,
}: DeleteBoxProps) => {
  return (
    <div className={`delete-box-wrapper ${className}`}>
      <IoCloseSharp
        size={24}
        className="absolute top-2 right-2 cursor-pointer text-black hover:text-gray-800"
        onClick={handleCloseDeleteBox}
      />

      <h3>Are you sure you want to delete this item?</h3>
      <div className="btn-box-wrapper">
        <button className="cancel-btn" onClick={handleCloseDeleteBox}>
          Cancel
        </button>
        <button className="delete-btn" onClick={deleteItem}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteBox;
