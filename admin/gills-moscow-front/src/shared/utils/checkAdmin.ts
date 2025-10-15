import { IBookingList } from "@shared/api/types/bookinglist";

export const checkAdmin = (reservation: IBookingList) => {
  const name = reservation?.administrator.name;

  if (typeof name === "string") {
    return name;
  }

  return "";
};
