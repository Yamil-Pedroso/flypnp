/* eslint-disable @typescript-eslint/no-explicit-any */
import { WishListContainer } from './styles'
import { useWishlist } from '../../../hooks'
import { AiFillDelete } from 'react-icons/ai'

const WishList = () => {
  //const [items, setItems] = useState<string[]>([])
  //const [inputValues, setInputValues] = useState<string[]>([])
  const { wishlist, deleteWishlist } = useWishlist()
  console.log('wishlist', wishlist)

  const handleDeleteWishlist = async (placeId: any) => {
    await deleteWishlist(placeId)
  }

  //const addItemToWishList = () => {
  //  const newItem = `Item ${
  //    items.length + 1
  //  } - ${new Date().toLocaleTimeString()}`
  //  setItems((prevItems) => [...prevItems, newItem])
  //  setInputValues((prevInputValues) => [...prevInputValues, ''])
  //}
  //
  //const updateItemInWishList = (index: number) => {
  //  const updatedItems = [...items]
  //  updatedItems[index] = inputValues[index]
  //  setItems(updatedItems)
  //  const updatedInputValues = [...inputValues]
  //  updatedInputValues[index] = ''
  //  setInputValues(updatedInputValues)
  //}
  //
  //const deleteItemFromWishList = (index: number) => {
  //  setItems((prevItems) => prevItems.filter((_item, i) => i !== index))
  //  setInputValues((prevInputValues) =>
  //    prevInputValues.filter((_item, i) => i !== index),
  //  )
  //}
  //
  //const handleInputChange = (
  //  e: React.ChangeEvent<HTMLInputElement>,
  //  index: number,
  //) => {
  //  const newInputValues = [...inputValues]
  //  newInputValues[index] = e.target.value
  //  setInputValues(newInputValues)
  //}

  return (
    <WishListContainer>
      <div className="wishlist-wrapper">
        <h1>Your wishlist is empty!</h1>
        <p>
          Start adding items to your wishlist by clicking the heart icon on the
          item you want to save.
        </p>

        {/*<button onClick={addItemToWishList}>Add item</button>

        <div className="wishlist-items">
          {items.map((item, index) => (
            <div key={index} className="wishlist-item">
              <p>{item}</p>
              <button onClick={() => deleteItemFromWishList(index)}>
                Delete
              </button>

              <input
                type="text"
                value={inputValues[index]}
                onChange={(e) => handleInputChange(e, index)}
              />

              <button onClick={() => updateItemInWishList(index)}>
                Update
              </button>
            </div>
          ))}
        </div> */}
        <div className="wishlist-content-wrapper">
          {wishlist.map((wish: any) => (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div key={wish._id} className="content">
                <img src={wish.picture} alt={wish.title} />
              </div>
              <p>{wish.title}</p>
              <AiFillDelete
                className="close-icon"
                style={{ cursor: 'pointer' }}
                size={18}
                onClick={() => handleDeleteWishlist(wish.placeId)}
              />
            </div>
          ))}
        </div>
      </div>
    </WishListContainer>
  )
}

export default WishList
