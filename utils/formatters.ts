export const format = (date: Date, pattern: string): string => {
  const pad = (n: number) => n.toString().padStart(2, "0");
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
  const yyyy = date.getFullYear().toString();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh24 = date.getHours();
  const hh = pad(((hh24 + 11) % 12) + 1);
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  const ampm = hh24 >= 12 ? "PM" : "AM";

  switch (pattern) {
    case "yyyy-MM-dd":
      return `${yyyy}-${MM}-${dd}`;
    case "hh:mm a":
      return `${hh}:${mm} ${ampm.toLowerCase()}`;
    case "hh:mm:ss a":
      return `${hh}:${mm}:${ss} ${ampm.toLowerCase()}`;
    case "dd MMM yyyy":
      return `${dd} ${months[date.getMonth()]} ${yyyy}`;
    default:
      return date.toISOString();
  }
};

export const secondsToHMS = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const secondsToReadable = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
};

export const formatCurrency = (amount: number): string =>
  `₹${amount.toFixed(2)}`;
