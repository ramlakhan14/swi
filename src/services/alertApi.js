import { apiInterceptor } from "./service";

export const getAllAlerts = async (page, per_page = 10) => {
    const response = await apiInterceptor({
        endpoint: `/admin/home-page-alerts?per_page=${per_page}&page=${page}`,
        method: 'get'
    });
    return response;
};

export const deleteAlert = async (id) => {
    const response = await apiInterceptor({
        endpoint: `/admin/home-page-alerts/${id}`,
        method: 'delete'
    });
    return response;
};


export const actionButtonAlert = async (data) => {
    const response = await apiInterceptor({
        endpoint: '/admin/alert-bulk-action',
        method: 'post',
        payload: data
    });
    return response;
};

export const createAlert = async (data, id = null) => {
  const endpoint = id ? `/admin/home-page-alerts/${id}` : `/admin/home-page-alerts`;
  
  const response = await apiInterceptor({
    endpoint,
    method: "POST",
    payload: data
  });

  return response;
};