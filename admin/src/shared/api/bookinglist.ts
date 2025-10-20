import { axiosInstance } from "./axiosInstance";
import {
  IBookingListResponse,
  IBookingSearchParams,
} from "./types/bookinglist";

export const getBookingListWithPagination = async (
  searchParams: IBookingSearchParams
): Promise<IBookingListResponse> => {
  try {
    const response = await axiosInstance.get<IBookingListResponse>(
      `/v1/bookings/all?timestamp=${new Date().getTime()}`,
      {
        params: searchParams,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error during fetching booking list and pagination info:",
      error
    );
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get(
      `/v1/profile?timestamp=${new Date().getTime()}`
    );

    return response.data.data;
  } catch (error) {
    console.error("Error during fetching tables:", error);
    throw error;
  }
};

export const repeatReservation = async (
  data: IBookingSearchParams,
  id: string
): Promise<IBookingListResponse> => {
  try {
    const response = await axiosInstance.patch<IBookingListResponse>(
      `/v1/bookings/${id}`,
      data
    );

    return response.data;
  } catch (error) {
    console.error("smth went wrong:", error);
    throw error;
  }
};

export const addedReservation = async (
  data: IBookingSearchParams
): Promise<IBookingListResponse> => {
  try {
    const response = await axiosInstance.post<IBookingListResponse>(
      `/v1/bookings`,
      data
    );

    return response.data;
  } catch (error) {
    console.error("smth went wrong:", error);
    throw error;
  }
};

export const restoreBooking = async (id: string) => {
  try {
    const response = await axiosInstance.put(`/v1/bookings/restore/${id}`);

    return response.data.data;
  } catch (error) {
    console.error("smth went wrong:", error);
    throw error;
  }
};

export const cancelBooking = async (id: string) => {
  try {
    const response = await axiosInstance.put(`/v1/bookings/cancel/${id}`);

    return response.data.data;
  } catch (error) {
    console.error("smth went wrong:", error);
    throw error;
  }
};

export const getAvailableRooms = async () => {
  try {
    const response = await axiosInstance.get(
      `/v1/rooms?timestamp=${new Date().getTime()}`
    );

    return response.data.data;
  } catch (error) {
    console.error("Error during fetching rooms:", error);
    throw error;
  }
};

export const editBooking = async (
  id: string,
  payload: IBookingSearchParams
) => {
  try {
    const response = await axiosInstance.patch(`/v1/bookings/${id}`, payload);

    return response.data.data;
  } catch (error) {
    console.error("smth went wrong:", error);
    throw error;
  }
};

export const getBookingsByPhone = async (searchParams: {
  status: number;
  client_phone: string;
}): Promise<IBookingListResponse> => {
  try {
    const response = await axiosInstance.get<IBookingListResponse>(
      `/v1/bookings/all?timestamp=${new Date().getTime()}`,
      {
        params: searchParams,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error during fetching booking list and pagination info:",
      error
    );
    throw error;
  }
};

export const updateBookingStatus = async (
  id: string,
  data: { status: number }
) => {
  try {
    const response = await axiosInstance.put(`/v1/bookings/status/${id}`, data);

    return response.data.data;
  } catch (error) {
    console.error("smth went wrong:", error);
    throw error;
  }
};
