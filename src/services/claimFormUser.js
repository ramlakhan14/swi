import { apiInterceptor } from "./service";
    
    export const getProductSerialClaims = async (modelId) => {
    const response = await apiInterceptor({
        endpoint: `/dealer/get-serials-claims?model_number=${modelId}`,
        method: 'get'
    });
    return response;
};

    export const getSerialNumberVerification = async (data) => {
    const response = await apiInterceptor({
        endpoint: '/dealer/verify-claim-serial-number',
        method: 'post',
        payload: data
    });
    return response;
};

export const createClaimForm = async (data) => {
    const response = await apiInterceptor({
        endpoint: '/dealer/submit-claim',
        method: 'post',
        payload: data
    });
    return response;
};


export const getModel = async (id) => {
    const response = await apiInterceptor({
        endpoint: `/dealer/get-models-claims?product_id=${id}`,
        method: 'get'
    });
    return response;
};
