import { IUser } from "@shared/api/types/bookinglist";

export const getWorkingTime = (user: IUser | undefined): string => {
  if (!user) {
    return "";
  }

  const end = user?.restaurant?.data.end_time;
  const start = user?.restaurant?.data.start_time;

  if (!start || !end) {
    return "";
  }

  return `${start.slice(0, 5)} - ${end.slice(0, 5)}`;
};
