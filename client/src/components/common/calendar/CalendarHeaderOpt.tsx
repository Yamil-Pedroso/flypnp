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
    <div className="relative">
      <div className="mb-5 flex items-center justify-center gap-2">
        {(['date', 'months', 'flexible'] as const).map((option) => (
          <button key={option} type="button" onClick={() => handleClickOptionList(option)} className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${optionList === option ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
            {option === 'date' ? 'Dates' : option}
          </button>
        ))}
      </div>
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
