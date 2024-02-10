import SearchDestination from './search-destination/SearchDestination'
import CheckInCheckOut from './check-in-out/CheckInCheckOut'
import AddGuests from './add-guests/AddGuests'
import { SearchContainer } from './index'

interface SearchProps {
  menuClick: boolean
}

const Search = ({ menuClick }: SearchProps) => {
  return (
    <SearchContainer>
      <SearchDestination />
      <CheckInCheckOut menuClick={menuClick} />
      <AddGuests />
    </SearchContainer>
  )
}

export default Search
