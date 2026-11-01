import { apiInterceptor } from "./service";

export const getAllSavedEmail = async (type,page, per_page = 10) => {
    const response = await apiInterceptor({
        endpoint: `/admin/get-emails?type=${type}&per_page=${per_page}&page=${page}`,
        method: 'get'
    });
    return response;
};

export const deleteEmail = async (id) => {
    const response = await apiInterceptor({
        endpoint: `/admin/emails/${id}`,
        method: 'delete'
    });
    return response;
};


export const actionButtonEmail = async (data) => {
    const response = await apiInterceptor({
        endpoint: '/admin/emails-bulk-action',
        method: 'post',
        payload: data
    });
    return response;
};


export const addEmail = async (data, id = null) => {
  const endpoint = id ? `/admin/emails/${id}` : `/admin/create-emails`;
    const response = await apiInterceptor({
        endpoint,
        method: 'post',
        payload: data
    });
    return response;
};



export const getByIdEmail = async (id) => {
    const response = await apiInterceptor({
        endpoint: `/admin/emails/${id}`,
        method: 'get'
    });
    return response;
};
