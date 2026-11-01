import api from "./api";

export const apiInterceptor = async ({ endpoint, method = "GET", payload = null, params = null }) => {
  try {
    const headers = {};
    
    if (payload instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    }

    const config = {
      url: endpoint,
      method: method.toUpperCase(),
      headers,
      ...(payload && { data: payload }),
      ...(params && { params })
    };

    const response = await api.request(config);
    return response.data;
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    throw error;
  }
};
