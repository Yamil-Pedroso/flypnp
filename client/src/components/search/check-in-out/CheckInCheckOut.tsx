/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { CheckInOutContainer } from './styles'
import CalendarComp from '../../common/calendar/CalendarComp'

interface CheckInCheckOutProps {
  menuClick: boolean
}

const CheckInCheckOut = ({ menuClick }: CheckInCheckOutProps) => {
  const [bgWhiteActive, setBgWhiteActive] = useState(false)
  const [bgWhiteActiveTwo, setBgWhiteActiveTwo] = useState(false)

  const handleBgWhiteActive = (type: 'check-in' | 'check-out', e: any) => {
    e.stopPropagation()
    if (type === 'check-in') {
      setBgWhiteActive(true)
      setBgWhiteActiveTwo(false)
    } else {
      setBgWhiteActive(false)
      setBgWhiteActiveTwo(true)
    }

    handleGrowSearchIcon()
  }

  useEffect(() => {
    const clickOutside = (e: any) => {
      // Asegúrate de seleccionar el contenedor principal del calendario o los elementos específicos adecuadamente
      const wrapper = document.querySelector('.check-in-out-wrapper')
      if (wrapper && !wrapper.contains(e.target)) {
        setBgWhiteActive(false)
        setBgWhiteActiveTwo(false)
        const searchIcon = document.querySelector('.search-wrapper')
        if (searchIcon) {
          searchIcon.classList.remove('search-wrapper-ready')
        }
      }
    }

    // Agrega el listener al documento
    document.addEventListener('click', clickOutside)
    return () => {
      // Asegura remover el listener al desmontar
      document.removeEventListener('click', clickOutside)
    }
  }, [])

  const handleGrowSearchIcon = () => {
    const searchIcon = document.querySelector('.search-wrapper')
    if (searchIcon) {
      searchIcon.classList.add('search-wrapper-ready')
    }
  }

  const handleInnerClick = (e: any) => {
    e.stopPropagation()
  }

  return (
    <CheckInOutContainer onClick={handleInnerClick}>
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
              onClick={(e: any) => handleBgWhiteActive('check-in', e)}
            >
              <p className="check-in-text">Check in</p>
              <p>Add dates</p>
            </div>
            <div className="check-in-out-divider"></div>
            <div
              className={bgWhiteActiveTwo ? 'check-out' : 'check-out-two'}
              onClick={(e) => handleBgWhiteActive('check-out', e)}
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
