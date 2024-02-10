import { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'

const AddGuests = () => {
  const [bgWhiteActive, setBgWhiteActive] = useState(false)

  const handleBgWhiteActive = () => {
    setBgWhiteActive(true)
    handleGrowSearchIcon()
  }

  const clickOutside = (e: MouseEvent) => {
    const wrapper = document.querySelector('.add-guests-wrapper')
    const searchIcon = document.querySelector('.search-guests-wrapper')
    if (wrapper && !wrapper.contains(e.target as Node)) {
      setBgWhiteActive(false)
      if (searchIcon) {
        searchIcon.classList.remove('search-guests-wrapper-redy')
      }
    }
  }

  const handleGrowSearchIcon = () => {
    const searchIcon = document.querySelector('.search-guests-wrapper')
    if (searchIcon) {
      searchIcon.classList.add('search-guests-wrapper-redy')
    }
  }

  useEffect(() => {
    document.addEventListener('click', clickOutside)
    return () => {
      document.removeEventListener('click', clickOutside)
    }
  }, [])


  return (
    <div className="add-guests-container" onClick={handleBgWhiteActive}>
      <div className="add-guests-wrapper">
        {
          bgWhiteActive ? (
        <div className="header-guests">
          <p>Who</p>
          <p>Add guests</p>
        </div>

          ) : (
        <div className="header-guests-two">
          <p>Who</p>
          <p>Add guests</p>
        </div>

          )
        }

        <div className={`search-guests-wrapper`}>
          <FaSearch className="search-icon" />
          <p>Search</p>
        </div>
      </div>
    </div>
  )
}

export default AddGuests
