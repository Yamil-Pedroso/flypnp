import { useState } from 'react'
import MyCalendar from './Calendar'
import Months from './months/Months'
import Flexible from './flexible/Flexible'

type OptionListState = 'date' | 'months' | 'flexible'

const CalendarHeaderOpt = () => {
  const [optionList, setOptionList] = useState<OptionListState>('date')

  const handleClickOptionList = (option: OptionListState) => {
    setOptionList(option)
  }

  return (
    <div className="calendar-opt-container">
      <ul>
        <div className="date">
          <li onClick={() => handleClickOptionList('date')}>Dates</li>
          <span
            className={optionList === 'date' ? 'horizontal-line' : ''}
          ></span>
        </div>
        <div className="months">
          <li onClick={() => handleClickOptionList('months')}>Months</li>
          <span
            className={optionList === 'months' ? 'horizontal-line' : ''}
          ></span>
        </div>

        <div className="flexible">
          <li onClick={() => handleClickOptionList('flexible')}>Flexible</li>
          <span
            className={optionList === 'flexible' ? 'horizontal-line' : ''}
          ></span>
        </div>
      </ul>
      {optionList === 'date' ? (
        <div className="my-calendar-wrapper">
          <MyCalendar />
        </div>
      ) : optionList === 'months' ? (
        <div className="months-wrapper">
          <Months />
        </div>
      ) : (
        <div className="flexible-wrapper">
          <Flexible />
        </div>
      )}
    </div>
  )
}

export default CalendarHeaderOpt
