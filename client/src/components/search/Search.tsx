import { useState, useEffect } from 'react'
import SearchDestination from './search-destination/SearchDestination'
import CheckInCheckOut from './check-in-out/CheckInCheckOut'
import AddGuests from './add-guests/AddGuests'
import { SearchContainer } from './index'
import { FaSearch } from 'react-icons/fa'

interface SearchProps {
  menuClick: boolean
}

const Search = ({ menuClick }: SearchProps) => {
  const [clickMainContainer, setClickMainContainer] = useState(false)

  const handleClickedMainContainer = () => {
    setClickMainContainer(true)
    handleGrowSearchIcon()
  }

  const handleGrowSearchIcon = () => {
    const searchIcon = document.querySelector('.search-wrapper')
    if (searchIcon) {
      searchIcon.classList.add('search-wrapper-ready')
    }
  }

  useEffect(() => {}, [])

  return (
    <SearchContainer onClick={handleClickedMainContainer}>
      <SearchDestination />
      <CheckInCheckOut menuClick={menuClick} />
      <AddGuests />
      <div
        className={`search-wrapper ${
          clickMainContainer ? 'search-wrapper-ready' : ''
        }`}
      >
        <FaSearch className="search-icon" />
        <p>Search</p>
      </div>
    </SearchContainer>
  )
}

export default Search
