import { axiosInstance } from "./axiosInstance";
import { IFreeTable, IFreeTables, IRoom, IUpdaRoom } from "./types/rooms";

export const addRooms = async (payload: IRoom) => {
  try {
    const response = await axiosInstance.post("/v1/rooms", payload);
    return response.data;
  } catch (error) {
    console.error("Error during add table:", error);
  }
};

export const deleteRoom = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/v1/rooms/${id}`);
    return response.data;
  } catch (error) {
    //@ts-ignore
    if (error?.response && error?.response?.status === 400) {
      throw new Error("Есть брони");
    }
    throw error;
  }
};

export const updateRoom = async (id: string, payload: IUpdaRoom) => {
  try {
    const response = await axiosInstance.patch(`/v1/rooms/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error during updating room:", error);
  }
};

export const getFreeTables = async (
  searchParams: IFreeTables
): Promise<IFreeTable> => {
  try {
    const response = await axiosInstance.get<IFreeTable>(
      `/v1/get-free-tables?timestamp=${new Date().getTime()}`,
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
