import { apiInterceptor } from "./service";

export const getAllSalesPerson = async () => {
    const response = await apiInterceptor({
        endpoint: `/admin/sales-person`,
        method: 'get'
    });
    return response;
};

export const deleteSalesPerson = async (data) => {
    const response = await apiInterceptor({
        endpoint: '/admin/delete-sales-person',
        method: 'post',
        payload: data
    });
    return response;
};

export const createSalesPerson = async (data) => {
    const response = await apiInterceptor({
        endpoint: '/admin/sales-person',
        method: 'post',
        payload: data
    });
    return response;
};

export const UpdateSalesPerson = async (data) => {
    const response = await apiInterceptor({
        endpoint: '/admin/update-sales-person',
        method: 'post',
        payload: data
    });
    return response;
};