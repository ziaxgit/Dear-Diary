export function convertDate(dateString: string) {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "numeric",
    minute: "2-digit",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour12: true,
  });

  return formatter.format(date);
}
