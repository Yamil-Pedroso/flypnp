interface CheckInCheckOutProps {
  menuClick: boolean
}

const CheckInCheckOut = ({ menuClick }: CheckInCheckOutProps) => {
  return (
    <div className="check-in-out-container">
      <div className="check-in-out">
        <div className="check-in-out-divider"></div>
        {menuClick ? (
          <div className="check-date">
            <p className="check-date-text">Date</p>
            <p>Add dates</p>
          </div>
        ) : (
          <>
            <div className="check-in">
              <p className="check-in-text">Check in</p>
              <p>Add dates</p>
            </div>
            <div className="check-in-out-divider"></div>
            <div className="check-out">
              <p className="check-out-text">Check out</p>
              <p>Add dates</p>
            </div>
          </>
        )}
        <div className="check-in-out-divider"></div>
      </div>
    </div>
  )
}

export default CheckInCheckOut
