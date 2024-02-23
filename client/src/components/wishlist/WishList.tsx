import { WishListContainer } from './styles'

const WishList = () => {
  return (
    <WishListContainer>
      <div className="wishlist-wrapper">
        <h1>Your wishlist is empty!</h1>
        <p>
          Start adding items to your wishlist by clicking the heart icon on the
          item you want to save.
        </p>
      </div>
    </WishListContainer>
  )
}

export default WishList
