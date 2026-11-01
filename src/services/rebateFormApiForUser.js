import { apiInterceptor } from "./service";

export const getRebateTypeAdmin = async (type) => {
    const response = await apiInterceptor({
        endpoint: `/admin/get-manufacturer?rebate_type=${type}`,
        method: 'get'
    });
    return response;
};

export const getModelAdmin = async (id,dealerId) => {
    const response = await apiInterceptor({
        endpoint: `/admin/get-models/${id}/${dealerId}`,
        method: 'get'
    });
    return response;
};

export const getProductSerialAdmin = async (modaleId,dealerId) => {
    const response = await apiInterceptor({
        endpoint: `/admin/get-serials/${modaleId}/${dealerId}`,
        method: 'get'
    });
    return response;
};

export const getSerialNumberVerificationAdmin = async (data) => {
    const response = await apiInterceptor({
        endpoint: '/admin/verify-serial-number',
        method: 'post',
        payload: data
    });
    return response;
};

export const createRebateFormAdmin = async (data) => {
    const response = await apiInterceptor({
        endpoint: '/admin/submit-rebate-form',
        method: 'post',
        payload: data
    });
    return response;
};

export const getDealerUser = async (data) => {
    const response = await apiInterceptor({
        endpoint: '/admin/get-dealer-user',
        method: 'post',
        payload: data
    });
    return response;
};