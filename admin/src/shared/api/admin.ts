import { axiosInstance } from "./axiosInstance";

interface IRest {
  name?: string;
  start_time?: string;
  end_time?: string;
}

export const updateRestaurant = async (id: string, payload: IRest) => {
  try {
    const response = await axiosInstance.patch(
      `/v1/restaurants/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error during updating room:", error);
  }
};
