export function convertDate(dateString: string) {
  const date = new Date(dateString);

  const day = date.getDate();
  const year = date.getFullYear();

  const monthNames = [
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
  const monthName = monthNames[date.getMonth()];

  let hours = date.getHours();
  const minutes = date.getMinutes();

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  const minutesFormatted = minutes < 10 ? "0" + minutes : minutes;

  const formattedDate = `${hours}:${minutesFormatted} ${ampm.toLowerCase()} ${day} ${monthName} ${year}`;

  return formattedDate;
}
