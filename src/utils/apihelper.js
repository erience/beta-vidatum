// utils/apihelper.js
// import axios from "axios";

// export const axiosInstance = axios.create({ withCredentials: true });

// export const apiConnector = (
//   method = "GET",
//   url,
//   bodyData = null,
//   headers = null,
//   params = null
// ) => {
//   return axiosInstance({
//     method,
//     url,
//     data: bodyData,
//     headers,
//     params,
//   });
// };

// utils/apihelper.js
// import axios from "axios";

// export const axiosInstance = axios.create({ withCredentials: true });

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status == 401) {
//       // Dispatch a custom event instead of redirecting directly
//       window.dispatchEvent(new Event("unauthorized"));
//     }
//     return Promise.reject(error);
//   }
// );

// export const apiConnector = (
//   method = "GET",
//   url,
//   bodyData = null,
//   headers = null,
//   params = null
// ) => {
//   return axiosInstance({
//     method,
//     url,
//     data: bodyData,
//     headers,
//     params,
//   });
// };

import axios from "axios";

export const axiosInstance = axios.create({ withCredentials: true });
// export const axiosInstance = axios.create();
export const apiConnector = async (method, url, bodyData, headers, params) => {
  try {
    const response = await axiosInstance({
      method: `${method}`,
      url: `${url}`,
      data: bodyData ? bodyData : null,
      headers: headers ? headers : null,
      params: params ? params : null,
    });
    return response;
  } catch (error) {
    if (error.response && error.response.status == 401) {
      window.dispatchEvent(new Event("unauthorized"));
    }
    console.error("API call failed:", error);
    throw error;
  }
};
