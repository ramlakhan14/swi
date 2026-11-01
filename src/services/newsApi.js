import { apiInterceptor } from "./service";

export const getAllNews = async (page, per_page = 10) => {
    const response = await apiInterceptor({
        endpoint: `/admin/news?per_page=${per_page}&page=${page}`,
        method: 'get'
    });
    return response;
};


export const deleteNews = async (id) => {
    const response = await apiInterceptor({
        endpoint: `/admin/news/${id}`,
        method: 'delete'
    });
    return response;
};

export const actionButtonNews = async (data) => {
    const response = await apiInterceptor({
        endpoint: '/admin/news-bulk-action',
        method: 'post',
        payload: data
    });
    return response;
};

export const createNews = async (data, id = null) => {
  const endpoint = id ? `/admin/news/${id}` : `/admin/news`;
  
  const response = await apiInterceptor({
    endpoint,
    method: "POST",
    payload: data
  });

  return response;
};