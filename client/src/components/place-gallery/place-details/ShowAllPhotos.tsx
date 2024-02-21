import { useState } from 'react'
import { FaImages } from 'react-icons/fa6'

const ShowAllPhotos = () => {
  const [clickButton, setClickButton] = useState(false)

  const handleClick = () => {
    setClickButton(!clickButton)
  }

  return (
    <div
      onClick={handleClick}
      className={`show-all-photos-container ${clickButton ? 'reboundBtn' : ''}`}
    >
      <FaImages size={24} />
      <p>Show all photos</p>
    </div>
  )
}

export default ShowAllPhotos
