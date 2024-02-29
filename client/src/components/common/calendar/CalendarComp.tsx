import CalendarHeaderOpt from './CalendarHeaderOpt'
import ExactDays from './ExactDays'
import { Container } from './styles'

const CalendarComp = () => {
  return (
    <Container>
      <CalendarHeaderOpt />
      <ExactDays />
    </Container>
  )
}

export default CalendarComp
