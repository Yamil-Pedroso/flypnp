import { useState, type ChangeEvent } from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import { FaCircleExclamation } from 'react-icons/fa6'
import { useWishlist } from '../../../lib/hooks'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface CreateWishListProps {
  closeCreateWishList: () => void
  className?: string
  placeId: string
  title: string
  picture: string
}

const CreateWishListBox = ({
  closeCreateWishList,
  className,
  placeId,
  picture,
}: CreateWishListProps) => {
  const [wishListName, setWishListName] = useState('')
  const [errorCharLimit, setErrorCharLimit] = useState(false)
  const { addWishlist } = useWishlist()
  const notify = () => toast('Wishlist created successfully!')

  const handleCreateWishList = () => {
    if (wishListName.trim() && !errorCharLimit) {
      addWishlist(placeId, wishListName, picture)
      closeCreateWishList()
      notify()
      setWishListName('')
    }
  }

  const handleWishListNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setWishListName(name)

    setErrorCharLimit(name.length > 50)

  }

  const handleClearInputName = () => {
    setWishListName('')
    setErrorCharLimit(false)
  }

  return (
    <div className={`mx-auto mt-[15vh] flex w-[calc(100%-2rem)] max-w-xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl ${className ?? ''}`}>
      <div className="flex items-center border-b border-slate-200 px-5 py-4">
        <button type="button" onClick={closeCreateWishList} aria-label="Close wishlist dialog" className="flex size-9 items-center justify-center rounded-full transition hover:bg-slate-100"><IoCloseSharp size={24} /></button>
        <h1 className="ml-3 text-xl font-semibold text-slate-950">Create wishlist</h1>
      </div>

      <div className="px-5 py-6">
        <input
          type="text"
          placeholder="Name your place"
          value={wishListName}
          onChange={handleWishListNameChange}
          aria-invalid={errorCharLimit}
          className={`w-full rounded-xl border px-4 py-3 text-base text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-2 ${errorCharLimit ? 'border-rose-500 focus:ring-rose-200' : 'border-slate-300 focus:border-slate-700 focus:ring-slate-200'}`}
        />
        <div className={`mt-2 flex items-center text-sm ${errorCharLimit ? 'text-rose-600' : 'text-slate-500'}`}>
          <span>{wishListName.length}</span>/50
          <p className="ml-1">characters</p>
          {errorCharLimit && (
            <div className="ml-4 flex items-center gap-1.5">
              <FaCircleExclamation />
              <p>Over character limit.</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between border-t border-slate-200 px-5 py-4">
        <button type="button" onClick={handleClearInputName} className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50">
          Clear
        </button>
        <button
          onClick={
            wishListName.length > 0 && !errorCharLimit
              ? handleCreateWishList
              : undefined
          }
          className="rounded-xl bg-rose-500 px-5 py-2.5 font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={!(wishListName.length > 0 && !errorCharLimit)}
        >
          Create
        </button>
      </div>
    </div>
  )
}

export default CreateWishListBox
