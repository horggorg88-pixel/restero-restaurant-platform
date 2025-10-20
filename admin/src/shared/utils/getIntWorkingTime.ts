import { IUser } from "@shared/api/types/bookinglist";

export const getIntWorkingTime = (user: IUser) => {
  const start = user?.restaurant?.data?.start_time
    ? +user.restaurant.data.start_time.slice(0, 5).split(":").join("")
    : 0;
  const end = user?.restaurant?.data?.end_time
    ? +user.restaurant.data.end_time.slice(0, 5).split(":").join("")
    : 0;

  return { start, end };
};
