import { axiosInstance } from "./axiosInstance";
import { IBookingSearchParams } from "./types/bookinglist";
import { Restaurant } from "./types/database";

export const getDatabaseData = async (searchParams: IBookingSearchParams) => {
  try {
    const response = await axiosInstance.get("/v1/bookings/guests", {
      params: searchParams,
    });

    return response.data;
  } catch (error) {
    console.error("Error during fetching database data:", error);
    throw error;
  }
};

export const getRestaurantList = async (): Promise<{ data: Restaurant[] }> => {
  try {
    const response = await axiosInstance.get("/v1/restaurants");
    return response.data;
  } catch (error) {
    console.error("Error during fetching restaurant data:", error);
    throw error;
  }
};
