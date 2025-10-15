import { differenceInSeconds, parse } from "date-fns";

export const calculateBookingTime = (startTime: string, endTime: string) => {
  if (!startTime || !endTime) {
    return "";
  }

  const timeFormat = "HH:mm:ss";
  const start = parse(startTime, timeFormat, new Date());
  const end = parse(endTime, timeFormat, new Date());

  if (end.getTime() <= start.getTime()) {
    end.setDate(end.getDate() + 1);
  }

  const diffInSeconds = Math.abs(differenceInSeconds(end, start));
  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};
