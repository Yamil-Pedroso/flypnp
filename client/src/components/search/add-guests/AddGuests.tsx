import { FaSearch } from 'react-icons/fa'

const AddGuests = () => {
  return (
    <div className="add-guests-container">
      <div className="add-guests-wrapper">
        <div className="header-guests">
          <p>Who</p>
          <p>Add guests</p>
        </div>

        <div className={`search-guests-wrapper`}>
          <FaSearch className="search-icon" />
          <p>Search</p>
        </div>
      </div>
    </div>
  )
}

export default AddGuests
