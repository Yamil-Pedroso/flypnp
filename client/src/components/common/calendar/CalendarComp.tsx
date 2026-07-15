import CalendarHeaderOpt from './CalendarHeaderOpt'
import ExactDays from './ExactDays'

const CalendarComp = () => {
  return (
    <div className="relative flex flex-col items-center justify-center box-border">
      <CalendarHeaderOpt />
      <ExactDays />
    </div>
  )
}

export default CalendarComp
