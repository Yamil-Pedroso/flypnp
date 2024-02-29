/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import Calendar from 'react-calendar'
import './styles.css'
import 'react-calendar/dist/Calendar.css'
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa'

interface MyCalendarProps {
  className?: string
}

const MyCalendar = ({ className }: MyCalendarProps) => {
  const [checkInMonth, setCheckInMonth] = useState(new Date())
  const [checkOutMonth, setCheckOutMonth] = useState(
    new Date(new Date().setMonth(new Date().getMonth() + 1)),
  )

  const navigateMonths = (direction: any) => {
    setCheckInMonth(
      new Date(checkInMonth.setMonth(checkInMonth.getMonth() + direction)),
    )
    setCheckOutMonth(
      new Date(checkOutMonth.setMonth(checkOutMonth.getMonth() + direction)),
    )
  }

  const formatMonthYear = (date: any) => {
    const options = { year: 'numeric', month: 'long' }
    return date.toLocaleDateString('default', options)
  }

  return (
    <div className={`calendar-container ${className}`}>
      <div className="calendar-wrapper" style={{ display: 'flex' }}>
        <div className="calendar-wrapper first">
          <div className="month-arrow-first">
            <div className="calendar-header">
              <p>{formatMonthYear(checkInMonth)}</p>
            </div>
            <button
              className="arrow-left navigation-arrow"
              onClick={() => navigateMonths(-1)}
            >
              <FaArrowAltCircleLeft
                style={{ color: '#949494', fontSize: '1.5rem' }}
              />
            </button>
          </div>
          <Calendar
            onChange={() => {}}
            value={checkInMonth}
            showNavigation={false}
          />
        </div>

        <div className="calendar-wrapper second">
          <div className="month-arrow-second">
            <div className="calendar-header">
              <p>{formatMonthYear(checkOutMonth)}</p>
            </div>
            <button
              className="arrow-right navigation-arrow"
              onClick={() => navigateMonths(1)}
            >
              <FaArrowAltCircleRight
                style={{ color: '#949494', fontSize: '1.5rem' }}
              />
            </button>
          </div>
          <Calendar
            onChange={() => {}}
            value={checkOutMonth}
            showNavigation={false}
          />
        </div>
      </div>
    </div>
  )
}

export default MyCalendar
