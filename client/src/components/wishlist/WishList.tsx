import { useState } from 'react'
import { WishListContainer } from './styles'
import { useWishlist } from '../../../hooks'
import { AiFillDelete } from 'react-icons/ai'
import DeleteBox from './DeleteBox'

interface ShowDeleteIconState {
  [key: string]: boolean
}

const WishList = () => {
  const [showDeleteIcon, setShowDeleteIcon] = useState<ShowDeleteIconState>({})
  const [deleteBoxInfo, setDeleteBoxInfo] = useState({
    show: false,
    itemId: null as string | null,
  })
  const { wishlist, deleteWishlist } = useWishlist()

  const handleShowDeleteBox = (itemId: string) => {
    setDeleteBoxInfo({ show: true, itemId })
  }

  const handleCloseDeleteBox = () => {
    setDeleteBoxInfo({ ...deleteBoxInfo, show: false })
  }

  const overPicture = (place: string) => {
    setShowDeleteIcon((prevState) => ({ ...prevState, [place]: true }))
  }

  const leavePicture = (place: string) => {
    setShowDeleteIcon((prevState) => ({ ...prevState, [place]: false }))
  }

  return (
    <WishListContainer>
      <div className="wishlist-wrapper">
        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <h1>Your wishlist is empty!</h1>
            <p>
              Start adding items to your wishlist by clicking the heart icon on
              the item you want to save.
            </p>
          </div>
        ) : (
          <>
            <div>
              <h1>Your wishlist</h1>
            </div>
            <div className="wishlist-content-wrapper">
              {wishlist.map((wish) => (
                <div
                  key={wish.id}
                  className="content-wrapper"
                  onMouseEnter={() => overPicture(wish.place)}
                  onMouseLeave={() => leavePicture(wish.place)}
                >
                  <div key={wish.id} className="content">
                    <img src={wish.picture} alt={wish.title} />
                  </div>
                  <div
                    className={`text-wrapper ${
                      showDeleteIcon[wish.place] ? 'show' : ''
                    }`}
                  >
                    <AiFillDelete
                      className="close-icon"
                      style={{ cursor: 'pointer' }}
                      size={18}
                      onClick={() => handleShowDeleteBox(wish.place)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <DeleteBox
        className={deleteBoxInfo.show ? 'show' : ''}
        handleCloseDeleteBox={handleCloseDeleteBox}
        deleteItem={() => {
          if (deleteBoxInfo.itemId) {
            deleteWishlist(deleteBoxInfo.itemId)
            handleCloseDeleteBox()
          }
        }}
      />
    </WishListContainer>
  )
}

export default WishList
