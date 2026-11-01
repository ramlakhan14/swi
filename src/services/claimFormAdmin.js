    import { apiInterceptor } from "./service";
    
    export const getProductSerialClaimsAdmin = async (modelId,dealerId) => {
        const response = await apiInterceptor({
            endpoint: `/admin/get-serials-claims/${modelId}/${dealerId}`,
            method: 'get'
        });
        return response;
    };

    export const getSerialNumberVerificationAdmin = async (data) => {
    const response = await apiInterceptor({
        endpoint: '/admin/verify-claim-serial-number',
        method: 'post',
        payload: data
    });
    return response;
};

export const createClaimFormAdmin = async (data) => {
    const response = await apiInterceptor({
        endpoint: '/admin/submit-claim',
        method: 'post',
        payload: data
    });
    return response;
};


export const getModelAdmin = async (id,dealerId) => {
    const response = await apiInterceptor({
        endpoint: `/admin/get-models-claims/${id}/${dealerId}`,
        method: 'get'
    });
    return response;
};
