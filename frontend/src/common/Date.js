const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

export const getDay = (timestamp) => {
  const date = new Date(timestamp);
  const dayOfWeek = days[date.getDay()];
  const month = months[date.getMonth()];
  const dayOfMonth = date.getDate();

  return `${dayOfWeek}, ${month} ${dayOfMonth}`;
};
