import { useState, useEffect } from 'react'
import { AddGuestsContainer } from './styles'

const AddGuests = () => {
  const [bgWhiteActive, setBgWhiteActive] = useState(false)

  const handleBgWhiteActive = () => {
    setBgWhiteActive(true)
    handleGrowSearchIcon()
  }

  const clickOutside = (e: MouseEvent) => {
    const wrapper = document.querySelector('.add-guests-wrapper')
    const searchIcon = document.querySelector('.search-wrapper')
    if (wrapper && !wrapper.contains(e.target as Node)) {
      setBgWhiteActive(false)
      if (searchIcon) {
        searchIcon.classList.remove('search-wrapper-ready')
      }
    }
  }

  const handleGrowSearchIcon = () => {
    const searchIcon = document.querySelector('.search-wrapper')
    if (searchIcon) {
      searchIcon.classList.add('search-wrapper-ready')
    }
  }

  useEffect(() => {
    document.addEventListener('click', clickOutside)
    return () => {
      document.removeEventListener('click', clickOutside)
    }
  }, [])

  return (
    <AddGuestsContainer onClick={handleBgWhiteActive}>
      <div className="add-guests-wrapper">
        {bgWhiteActive ? (
          <div className="header-guests">
            <p>Who</p>
            <p>Add guests</p>
          </div>
        ) : (
          <div className="header-guests-two">
            <p>Who</p>
            <p>Add guests</p>
          </div>
        )}
      </div>
    </AddGuestsContainer>
  )
}

export default AddGuests
