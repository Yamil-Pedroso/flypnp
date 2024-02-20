import { useState } from 'react'
import { FaPlusMinus } from 'react-icons/fa6'

const daysOptions = [
  { text: 'day' },
  { text: 'days' },
  { text: 'days' },
  { text: 'days' },
]

const ExactDays = () => {
  const [selected, setSelected] = useState<number | null>(null)

  const handleSelection = (index: number) => () => {
    setSelected(index)
  }

  return (
    <div className="exact-days-container">
      <div
        onClick={handleSelection(0)}
        className={`exact-days-text ${selected === 0 ? 'black-border' : ''}`}
      >
        <p>Exact days</p>
      </div>
      <div className="exact-days-options-wrapper">
        {daysOptions.map((option, index) => (
          <div
            key={index}
            className={`exact-days-option ${
              selected === index + 1 ? 'black-border' : ''
            }`}
            onClick={handleSelection(index + 1)}
          >
            <div className="content">
              <div className="icon">
                <FaPlusMinus size={14} />
              </div>
              <div className="number">
                <p>{index + 1}</p>
              </div>
              <div className="text">
                <p>{option.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExactDays
