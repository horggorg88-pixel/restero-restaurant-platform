import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

function onRrefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/v1/clients/web/login"
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const response = await axios.post(
            "https://rest64.azatdev.ru/api/v1/clients/web/refresh",
            {
              refresh_token: refreshToken,
            }
          );

          if (response.status === 200) {
            const newToken = response.data.data.access_token;
            localStorage.setItem("token", newToken);
            localStorage.setItem(
              "refreshToken",
              response.data.data.refresh_token
            );

            axiosInstance.defaults.headers[
              "Authorization"
            ] = `Bearer ${newToken}`;
            isRefreshing = false;

            onRrefreshed(newToken);

            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error("refresh error", refreshError);
          isRefreshing = false;
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");

          window.location.href = "/";

          return Promise.reject(refreshError);
        }
      } else {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);
