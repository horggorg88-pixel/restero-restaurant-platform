import { isBefore, parse } from "date-fns";

export const isTimePassed = (timeToCompare: string, currentTime: string) => {
  const [bookingHours, bookingMinutes] = timeToCompare.split(":").map(Number);
  const [currentHours, currentMinutes] = currentTime.split(":").map(Number);

  const bookingTimeDate = parse(
    `${bookingHours}:${bookingMinutes}`,
    "HH:mm",
    new Date()
  );
  const currentTimeDate = parse(
    `${currentHours}:${currentMinutes}`,
    "HH:mm",
    new Date()
  );

  return isBefore(bookingTimeDate, currentTimeDate);
};
