import { axiosInstance } from "./axiosInstance";
import { ITable } from "./types/tables";

interface FormValues {
  number: number;
  count_people: number;
  id: string;
  comment: string;
}

export const getTables = async () => {
  try {
    const response = await axiosInstance.get(
      `/v1/rooms?timestamp=${new Date().getTime()}`
    );

    return response.data.data;
  } catch (error) {
    console.error("Error during fetching tables:", error);
    throw error;
  }
};

export const addTables = async (payload: ITable) => {
  try {
    const response = await axiosInstance.post(`/v1/tables`, payload);

    return response.data;
  } catch (error) {
    console.error("Error during add table:", error);
  }
};

export const deleteTables = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/v1/tables/${id}`);

    return response.data;
  } catch (error) {
    //@ts-ignore
    if (error?.response && error?.response?.status === 400) {
      throw new Error("Есть брони");
    }
    throw error;
  }
};

export const updateTables = async (
  id: string,
  payload: Omit<FormValues, "id">
) => {
  try {
    const response = await axiosInstance.patch(`/v1/tables/${id}`, payload);

    return response.data;
  } catch (error) {
    console.error("Error during update table:", error);
    throw error;
  }
};

export const getTableById = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      `/v1/tables/${id}?timestamp=${new Date().getTime()}`
    );

    return response.data.data;
  } catch (error) {
    console.error("Error during fetching table:", error);
    throw error;
  }
};
