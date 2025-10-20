import { axiosInstance } from "./axiosInstance";
import { ILogin } from "./types/login";

export const login = async (payload: ILogin) => {
  try {
    const response = await axiosInstance.post("/v1/clients/web/login", payload);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};