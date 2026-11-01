import { apiInterceptor } from "./service";

export const getAllFiles = async (page, per_page = 10) => {
    const response = await apiInterceptor({
        endpoint: `/admin/upload-files?per_page=${per_page}&page=${page}`,
        method: 'get'
    });
    return response;
};
   

export const deleteFile = async (id) => {
    const response = await apiInterceptor({
        endpoint: `/admin/upload-files/${id}`,
        method: 'delete'
    });
    return response;
};


export const actionButtonFile = async (data) => {
    const response = await apiInterceptor({
        endpoint: '/admin/upload-files-bulk-action',
        method: 'post',
        payload: data
    });
    return response;
};



export const createFile = async (data, id = null) => {
  const endpoint = id ? `/admin/upload-files/${id}` : `/admin/upload-files`;
  
  const response = await apiInterceptor({
    endpoint,
    method: "POST",
    payload: data
  });

  return response;
};
