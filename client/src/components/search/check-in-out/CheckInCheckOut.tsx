import { useState, useEffect } from 'react'
import { CheckInOutContainer } from './styles'
import CalendarComp from '../../common/calendar/CalendarComp'

interface CheckInCheckOutProps {
  menuClick: boolean
}

const CheckInCheckOut = ({ menuClick }: CheckInCheckOutProps) => {
  const [bgWhiteActive, setBgWhiteActive] = useState(false)
  const [bgWhiteActiveTwo, setBgWhiteActiveTwo] = useState(false)

  const handleBgWhiteActive = (type: 'check-in' | 'check-out') => {
    if (type === 'check-in') {
      setBgWhiteActive(true)
      setBgWhiteActiveTwo(false)
    } else {
      setBgWhiteActive(false)
      setBgWhiteActiveTwo(true)
    }

    handleGrowSearchIcon()
  }

  const clickOutside = (e: MouseEvent) => {
    const wrapper = document.querySelector('.check-in, .check-out')
    const searchIcon = document.querySelector('.search-wrapper')
    if (wrapper && !wrapper.contains(e.target as Node)) {
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
    <CheckInOutContainer>
      <div className="check-in-out-wrapper">
        <div className="check-in-out-divider"></div>
        {menuClick ? (
          bgWhiteActive ? (
            <div className="check-date">
              <p className="check-date-text">Date</p>
              <p>Check in</p>
            </div>
          ) : (
            <div className="check-date-two">
              <p className="check-date-text">Date</p>
              <p>Add dates</p>
            </div>
          )
        ) : (
          <>
            <div
              className={bgWhiteActive ? 'check-in' : 'check-in-two'}
              onClick={() => handleBgWhiteActive('check-in')}
            >
              <p className="check-in-text">Check in</p>
              <p>Add dates</p>
            </div>
            <div className="check-in-out-divider"></div>
            <div
              className={bgWhiteActiveTwo ? 'check-out' : 'check-out-two'}
              onClick={() => handleBgWhiteActive('check-out')}
            >
              <p className="check-out-text">Check out</p>
              <p>Add dates</p>
            </div>
          </>
        )}
        <div className="check-in-out-divider"></div>
      </div>
      {bgWhiteActive || bgWhiteActiveTwo ? (
        <div className="test-check-menu">
          <CalendarComp />
        </div>
      ) : null}
    </CheckInOutContainer>
  )
}

export default CheckInCheckOut
