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

export const getFullDay = (timestamp) => {
  const date = new Date(timestamp);
  const month = months[date.getMonth()];
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();

  return `${dayOfMonth} ${month} ${year}`;
};

export const getFullDayWithTime = (timestamp) => {
  const date = new Date(timestamp);
  const month = months[date.getMonth()];
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();
  let hours = date.getHours();
  const amPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${dayOfMonth} ${month} ${year} ${hours}:${minutes} ${amPm}`;
};
