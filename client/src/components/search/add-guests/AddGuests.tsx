/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { AddGuestsContainer } from './styles'
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa'

const AddGuests = () => {
  const [bgWhiteActive, setBgWhiteActive] = useState(false)
  const [adult, setAdult] = useState(0)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [pets, setPets] = useState(0)

  const handleClickAdults = (count: number) => {
    if ((children > 0 || infants > 0 || pets > 0) && count < 1) return

    if (count >= 0 && count <= 16) {
      setAdult(count)
    }
  }

  const handleClickChildren = (count: number) => {
    if (count < 0) return
    if (adult === 0 && children === 0) {
      setAdult(1)
      setChildren(1)
    }
    if (count >= 0 && count <= 15) {
      setChildren(count)
    }
  }

  const handleClickInfants = (count: number) => {
    if (count < 0) return
    if (adult === 0 && infants === 0) {
      setAdult(1)
      setInfants(1)
    }
    if (count >= 0 && count <= 5) {
      setInfants(count)
    }
  }

  const handleClickPets = (count: number) => {
    if (count < 0) return
    if (adult === 0 && pets === 0) {
      setAdult(1)
      setPets(1)
    }
    if (count >= 0 && count <= 5) {
      setPets(count)
    }
  }

  const handleBgWhiteActive = (e: any) => {
    e.stopPropagation()
    setBgWhiteActive(!bgWhiteActive)
    handleGrowSearchIcon()
  }

  const clickOutside = (e: any) => {
    const wrapper = document.querySelector('.add-guests-wrapper')
    const headerGuests = document.querySelector(
      '.header-guests, .header-guests-two',
    ) as HTMLElement
    if (
      wrapper &&
      !wrapper.contains(e.target) &&
      !headerGuests.contains(e.target)
    ) {
      setBgWhiteActive(false)
      const searchIcon = document.querySelector('.search-wrapper')
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

  const handleDropdownClick = (e: any) => {
    e.stopPropagation()
  }

  return (
    <AddGuestsContainer onClick={handleBgWhiteActive}>
      <div className="add-guests-wrapper" onClick={handleDropdownClick}>
        {bgWhiteActive ? (
          <div className="header-guests" onClick={handleBgWhiteActive}>
            <p>Who</p>
            {adult + children > 0 ? (
              <p>
                {adult + children} guests
                {infants > 0 || pets > 0
                  ? `, ${
                      infants
                        ? infants === 1
                          ? infants + ' infant'
                          : infants + ' infants'
                        : ''
                    }
                  ${pets ? (pets === 1 ? pets + ' pet' : pets + ' pets') : ''}`
                  : ''}
              </p>
            ) : (
              <p>Add guests</p>
            )}
          </div>
        ) : (
          <div className="header-guests-two" onClick={handleBgWhiteActive}>
            <p>Who</p>
            <p>Add guests</p>
          </div>
        )}
        <div className={`guests-dropdown ${bgWhiteActive ? 'show' : ''}`}>
          <div className="section adults-cont">
            <div className="guest">
              <p>Adults</p>
              <span>Age 13 or above</span>
            </div>
            <div className="counter">
              <FaMinusCircle
                onClick={() => handleClickAdults(adult - 1)}
                className={`counter-icon ${
                  adult === 0 || children >= 1 || infants >= 1 || pets >= 1
                    ? 'disabled'
                    : ''
                }`}
              />

              <span>{adult}</span>

              <FaPlusCircle
                onClick={() => handleClickAdults(adult + 1)}
                className="counter-icon"
              />
            </div>
          </div>
          <div className="section children-cont">
            <div className="guest">
              <p>Children</p>
              <span>Age 2-12</span>
            </div>
            <div className="counter">
              <FaMinusCircle
                onClick={() => handleClickChildren(children - 1)}
                className={`counter-icon ${children === 0 ? 'disabled' : ''}`}
              />

              <span>{children}</span>
              <FaPlusCircle
                onClick={() => handleClickChildren(children + 1)}
                className="counter-icon"
              />
            </div>
          </div>
          <div className="section infants-cont">
            <div className="guest">
              <p>Infants</p>
              <span>Under 2</span>
            </div>
            <div className="counter">
              <FaMinusCircle
                onClick={() => handleClickInfants(infants - 1)}
                className={`counter-icon ${infants === 0 ? 'disabled' : ''}`}
              />

              <span>{infants}</span>

              <FaPlusCircle
                onClick={() => handleClickInfants(infants + 1)}
                className="counter-icon"
              />
            </div>
          </div>
          <div className="section pets-cont">
            <div className="guest">
              <p>Pets</p>
              <span>
                <a href="#">Bringing a service animal?</a>
              </span>
            </div>
            <div className="counter">
              <FaMinusCircle
                onClick={() => handleClickPets(pets - 1)}
                className={`counter-icon ${pets === 0 ? 'disabled' : ''}`}
              />

              <span>{pets}</span>

              <FaPlusCircle
                onClick={() => handleClickPets(pets + 1)}
                className="counter-icon"
              />
            </div>
          </div>
        </div>
      </div>
    </AddGuestsContainer>
  )
}

export default AddGuests
