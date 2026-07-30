export const localDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const isDateOnlyOnOrAfter = (isoDate: string, dateKey: string) =>
  isoDate.slice(0, 10) >= dateKey;
