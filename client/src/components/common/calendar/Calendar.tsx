import { useState } from 'react'
import Calendar from 'react-calendar'

type ValuePiece = Date | null

type Value = ValuePiece | [ValuePiece, ValuePiece]

const MyCalendar = () => {
  const [value, onChange] = useState<Value>(new Date())

  return (
    <div>
      <Calendar onChange={onChange} value={value} />
    </div>
  )
}

export default MyCalendar
