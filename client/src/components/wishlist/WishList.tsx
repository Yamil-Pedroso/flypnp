/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { WishListContainer } from './styles'

const WishList = () => {
  const [items, setItems] = useState<string[]>([])
  const [inputValues, setInputValues] = useState<string[]>([])

  const addItemToWishList = () => {
    const newItem = `Item ${
      items.length + 1
    } - ${new Date().toLocaleTimeString()}`
    setItems((prevItems) => [...prevItems, newItem])
    setInputValues((prevInputValues) => [...prevInputValues, ''])
  }

  const updateItemInWishList = (index: number) => {
    const updatedItems = [...items]
    updatedItems[index] = inputValues[index]
    setItems(updatedItems)
    const updatedInputValues = [...inputValues]
    updatedInputValues[index] = ''
    setInputValues(updatedInputValues)
  }

  const deleteItemFromWishList = (index: number) => {
    setItems((prevItems) => prevItems.filter((_item, i) => i !== index))
    setInputValues((prevInputValues) =>
      prevInputValues.filter((_item, i) => i !== index),
    )
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newInputValues = [...inputValues]
    newInputValues[index] = e.target.value
    setInputValues(newInputValues)
  }

  return (
    <WishListContainer>
      <div className="wishlist-wrapper">
        <h1>Your wishlist is empty!</h1>
        <p>
          Start adding items to your wishlist by clicking the heart icon on the
          item you want to save.
        </p>

        <button onClick={addItemToWishList}>Add item</button>

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
        </div>
      </div>
    </WishListContainer>
  )
}

export default WishList
