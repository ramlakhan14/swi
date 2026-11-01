import { apiInterceptor } from "./service";

export const getRebateType = async (type) => {
    const response = await apiInterceptor({
        endpoint: `/dealer/get-dealer-rebate-type?rebate_type=${type}`,
        method: 'get'
    });
    return response;
};

export const getModel = async (id) => {
    const response = await apiInterceptor({
        endpoint: `/dealer/get-product-models?product_id=${id}`,
        method: 'get'
    });
    return response;
};

export const getProductSerial = async (modaleId) => {
    const response = await apiInterceptor({
        endpoint: `/dealer/get-product-serials?model_number=${modaleId}`,
        method: 'get'
    });
    return response;
};

export const getSerialNumberVerification = async (data) => {
    const response = await apiInterceptor({
        endpoint: '/dealer/verify-serial-number',
        method: 'post',
        payload: data
    });
    return response;
};

export const createRebateForm = async (data) => {
    const response = await apiInterceptor({
        endpoint: '/dealer/submit-rebate-form',
        method: 'post',
        payload: data
    });
    return response;
};

