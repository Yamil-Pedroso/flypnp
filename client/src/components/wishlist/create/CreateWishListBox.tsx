/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { CreateWishListContainer } from './styles'
import { IoCloseSharp } from 'react-icons/io5'
import { FaCircleExclamation } from 'react-icons/fa6'
import { useWishlist } from '../../../../hooks'

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

  const handleCreateWishList = () => {
    if (wishListName.trim() && !errorCharLimit) {
      addWishlist(placeId, wishListName, picture)
      console.log(wishListName)
      closeCreateWishList()
      setWishListName('')
    }
  }

  const handleWishListNameChange = (e: any) => {
    const name = e.target.value
    setWishListName(name)

    setErrorCharLimit(name.length > 50)

    if (e.target.value.length > 0) {
      console.log('name is valid')
    } else {
      console.log('name is invalid')
    }
  }

  const handleClearInputName = () => {
    setWishListName('')
    setErrorCharLimit(false)
  }

  return (
    <CreateWishListContainer className={className}>
      <div className="header-wrapper">
        <IoCloseSharp
          onClick={closeCreateWishList}
          size={24}
          className="close-icon"
        />
        <h1>Create wishlist</h1>
      </div>

      <div className="input-wrapper">
        <input
          type="text"
          placeholder="Name your place"
          value={wishListName}
          onChange={handleWishListNameChange}
          className={errorCharLimit ? 'error' : ''}
          style={{ borderColor: errorCharLimit ? 'red' : 'inherit' }}
        />
        <div
          className="limit-chars"
          style={{ color: errorCharLimit ? 'red' : 'inherit' }}
        >
          <span>{wishListName.length}</span>/50
          <p>characters</p>
          {errorCharLimit && (
            <div className="error-text-wrapper" style={{ color: 'red' }}>
              <FaCircleExclamation />
              <p>Over character limit.</p>
            </div>
          )}
        </div>
      </div>

      <div className="btn-wrapper">
        <button onClick={handleClearInputName} className="clear-btn">
          Clear
        </button>
        <button
          onClick={
            wishListName.length > 0 && !errorCharLimit
              ? handleCreateWishList
              : undefined
          }
          className={
            wishListName.length > 0 && !errorCharLimit
              ? 'create-btn'
              : 'disabled'
          }
          disabled={!(wishListName.length > 0 && !errorCharLimit)}
        >
          Create
        </button>
      </div>
    </CreateWishListContainer>
  )
}

export default CreateWishListBox
