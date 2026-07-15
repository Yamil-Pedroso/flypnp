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
    <div className={`mx-auto flex w-full max-w-xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-[0_32px_100px_-28px_rgba(0,0,0,0.72)] ${className ?? ''}`}>
      <div className="relative flex min-h-24 items-center bg-slate-950 px-5 py-5 text-white sm:px-7">
        <div className="pointer-events-none absolute -right-10 -top-16 size-40 rounded-full bg-rose-500/20 blur-3xl" />
        <button type="button" onClick={closeCreateWishList} aria-label="Close wishlist dialog" className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:rotate-90 hover:bg-white hover:text-slate-950"><IoCloseSharp size={22} /></button>
        <h1 className="relative z-10 ml-4 text-xl font-semibold tracking-tight sm:text-2xl">Create wishlist</h1>
      </div>

      <div className="bg-slate-50 px-5 py-7 sm:px-7 sm:py-8">
        <input
          type="text"
          placeholder="Name your place"
          value={wishListName}
          onChange={handleWishListNameChange}
          aria-invalid={errorCharLimit}
          className={`w-full rounded-2xl border bg-white px-5 py-4 text-base font-medium text-slate-950 shadow-sm outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:ring-4 ${errorCharLimit ? 'border-rose-500 focus:ring-rose-100' : 'border-slate-200 focus:border-slate-950 focus:ring-slate-950/10'}`}
        />
        <div className={`mt-3 flex min-h-5 items-center px-1 text-xs font-medium ${errorCharLimit ? 'text-rose-600' : 'text-slate-500'}`}>
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

      <div className="flex items-center justify-between border-t border-slate-100 bg-white px-5 py-5 sm:px-7">
        <button type="button" onClick={handleClearInputName} className="rounded-full px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950">
          Clear
        </button>
        <button
          onClick={
            wishListName.length > 0 && !errorCharLimit
              ? handleCreateWishList
              : undefined
          }
          className="rounded-full bg-rose-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5 hover:bg-rose-600 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none disabled:hover:translate-y-0"
          disabled={!(wishListName.length > 0 && !errorCharLimit)}
        >
          Create
        </button>
      </div>
    </div>
  )
}

export default CreateWishListBox
