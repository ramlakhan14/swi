import { apiInterceptor } from "./service";

export const getAllProducts = async () => {
    const response = await apiInterceptor({
        endpoint: `/admin/products`,
        method: 'get'
    });
    return response;
};

export const createProduct= async (data, id = null) => {
    const endpoint = id ? `/admin/products/${id}` : `/admin/products`;
    const response = await apiInterceptor({
        endpoint,
        method: 'post',
        payload: data
    });
    return response;
};


export const getAllProductdetails = async (id) => {
    const response = await apiInterceptor({
        endpoint: `/admin/product-details/${id}`,
        method: 'get'
    });
    return response;
};

export const adminProductsStatus = async (data) => {
    const response = await apiInterceptor({
        endpoint: '/admin/products-status',
        method: 'post',
        payload: data
    });
    return response;
};