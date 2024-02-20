import CalendarHeaderOpt from './CalendarHeaderOpt'
import Calendar from './Calendar'
import ExactDays from './ExactDays'
import { Container } from './styles'

const CalendarComp = () => {
  return (
    <Container>
      <CalendarHeaderOpt />
      <Calendar />
      <ExactDays />
    </Container>
  )
}

export default CalendarComp
