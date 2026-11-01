import { apiInterceptor } from "./service";

export const createdealerBulkUpload = async (data) => {
    const response = await apiInterceptor({
        endpoint: '/admin/dealer-bulk-upload',
        method: 'post',
        payload: data
    });
    return response;
};


export const adminRebateBulkUpload = async (data) => {
    const response = await apiInterceptor({
        endpoint: '/admin/rebate-bulk-upload',
        method: 'post',
        payload: data
    });
    return response;
};

export const adminClaimBulkUpload = async (data) => {
    const response = await apiInterceptor({
        endpoint: '/admin/claim-bulk-upload',
        method: 'post',
        payload: data
    });
    return response;
};