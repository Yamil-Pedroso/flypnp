import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import type { Value } from "react-calendar/dist/shared/types.js";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-calendar/dist/Calendar.css";
import "./styles.css";

interface MyCalendarProps {
  className?: string;
  checkIn?: string;
  checkOut?: string;
  onDateChange?: (checkIn: string, checkOut: string) => void;
}

const fromDateInput = (value?: string) => value ? new Date(`${value}T00:00:00`) : null;
const toDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const MyCalendar = ({ className, checkIn, checkOut, onDateChange }: MyCalendarProps) => {
  const initialCheckIn = fromDateInput(checkIn) ?? new Date();
  const [checkInMonth, setCheckInMonth] = useState(new Date(initialCheckIn.getFullYear(), initialCheckIn.getMonth(), 1));
  const [checkOutMonth, setCheckOutMonth] = useState(new Date(initialCheckIn.getFullYear(), initialCheckIn.getMonth() + 1, 1));
  const range = useMemo<Value>(() => {
    const start = fromDateInput(checkIn);
    const end = fromDateInput(checkOut);
    return start && end ? [start, end] : start;
  }, [checkIn, checkOut]);

  useEffect(() => {
    const start = fromDateInput(checkIn);
    if (!start) return;
    setCheckInMonth(new Date(start.getFullYear(), start.getMonth(), 1));
    setCheckOutMonth(new Date(start.getFullYear(), start.getMonth() + 1, 1));
  }, [checkIn]);

  const navigateMonths = (direction: number) => {
    setCheckInMonth((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
    setCheckOutMonth((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
  };

  const selectDates = (value: Value) => {
    if (Array.isArray(value)) {
      const [start, end] = value;
      if (start) onDateChange?.(toDateInput(start), end ? toDateInput(end) : "");
    } else if (value) {
      onDateChange?.(toDateInput(value), "");
    }
  };

  const formatMonthYear = (date: Date) => new Intl.DateTimeFormat("default", { year: "numeric", month: "long" }).format(date);
  const minimumDate = new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div className={`calendar-container ${className ?? ""}`}>
      <div className="calendar-months">
        <div className="calendar-wrapper first">
          <div className="month-arrow-first">
            <div className="calendar-header"><p>{formatMonthYear(checkInMonth)}</p></div>
            <button className="arrow-left navigation-arrow" type="button" aria-label="Previous month" onClick={() => navigateMonths(-1)}><ChevronLeft aria-hidden="true" /></button>
          </div>
          <Calendar activeStartDate={checkInMonth} onActiveStartDateChange={({ activeStartDate }) => activeStartDate && setCheckInMonth(activeStartDate)} onChange={selectDates} value={range} minDate={minimumDate} selectRange allowPartialRange showNavigation={false} />
        </div>

        <div className="calendar-wrapper second">
          <div className="month-arrow-second">
            <div className="calendar-header"><p>{formatMonthYear(checkOutMonth)}</p></div>
            <button className="arrow-right navigation-arrow" type="button" aria-label="Next month" onClick={() => navigateMonths(1)}><ChevronRight aria-hidden="true" /></button>
          </div>
          <Calendar activeStartDate={checkOutMonth} onActiveStartDateChange={({ activeStartDate }) => activeStartDate && setCheckOutMonth(activeStartDate)} onChange={selectDates} value={range} minDate={minimumDate} selectRange allowPartialRange showNavigation={false} />
        </div>
      </div>
    </div>
  );
};

export default MyCalendar;
