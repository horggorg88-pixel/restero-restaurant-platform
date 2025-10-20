import { axiosInstance } from "./axiosInstance";

export const logout = async () => {
  try {
    const response = await axiosInstance.post("/v1/logout");

    return response.data;
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};
