import SearchDestination from './search-destination/SearchDestination'
import CheckInCheckOut from './check-in-out/CheckInCheckOut'
import AddGuests from './add-guests/AddGuests'
import { SearchContainer } from './index'
import { FaSearch } from 'react-icons/fa'

interface SearchProps {
  menuClick: boolean
}

const Search = ({ menuClick }: SearchProps) => {
  return (
    <SearchContainer>
      <SearchDestination />
      <CheckInCheckOut menuClick={menuClick} />
      <AddGuests />
      <div className={`search-wrapper`}>
        <FaSearch className="search-icon" />
        <p>Search</p>
      </div>
    </SearchContainer>
  )
}

export default Search
