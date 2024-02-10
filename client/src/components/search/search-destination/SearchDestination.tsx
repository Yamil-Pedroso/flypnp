import { useState, useEffect } from 'react'
import images from '../../../assets/images'

interface SearchDestinationProps {
  img?: string
  title: string
}

const searchDestinationData: SearchDestinationProps[] = [
  {
    img: images.map1,
    title: "I'm flexible",
  },
  {
    img: images.map2,
    title: 'Southeast Asia',
  },
  {
    img: images.map3,
    title: 'Germany',
  },
  {
    img: images.map4,
    title: 'United States',
  },
  {
    img: images.map5,
    title: 'Italy',
  },
  {
    img: images.map6,
    title: 'Africa',
  },
]

const SearchDestination = () => {
  const [bgWhiteActive, setBgWhiteActive] = useState(false)

  const handleBgWhiteActive = () => {
    setBgWhiteActive(true)
    handleGrowSearchIcon()
    //const bgGray = document.querySelector('.search-dest-container')
    //if (bgGray instanceof HTMLElement) {
    //  bgGray.style.backgroundColor = '#4d4d4d'
    //}
  }

  const clickOutside = (e: MouseEvent) => {
    const wrapper = document.querySelector('.search-dest-wrapper')
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
    <div className="search-dest-container" onClick={handleBgWhiteActive}>
      {bgWhiteActive ? (
        <div className="search-dest-wrapper">
          <div className="input-wrapper">
            <label htmlFor="">Where</label>
            <input type="text" placeholder="Search destinations" />
          </div>
        </div>
      ) : (
        <div className="default-search-dest-wrapper">
          <p>Where</p>
          <p>Search destinations</p>
        </div>
      )}
      {bgWhiteActive && (
        <div className="search-dest-menu-box">
          <p>Search by region</p>
          <div className="search-dest-menu-wrapper">
            {searchDestinationData.map((item, index) => (
              <div key={index} className="search-dest-menu-item">
                <img src={item.img} alt="map" />
                <p>{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchDestination
