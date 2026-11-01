import { apiInterceptor } from "./service";

export const getAllRebateForms = async (
  page,
  per_page = 10,
  dealer_id,
  type_of_rebate,
  form_id
) => {
  const params = { per_page, page };

  if (dealer_id) params.dealer_id = dealer_id;
  if (type_of_rebate) params.type_of_rebate = type_of_rebate;
  if (form_id) params.id = form_id;
  const response = await apiInterceptor({
    endpoint: `/admin/rebate-forms`,
    method: 'get',
    params,
  });

  return response;
};

export const updateRebateStatus = async (data) => {
    const response = await apiInterceptor({
        endpoint: '/admin/update-rebate-status',
        method: 'post',
        payload: data
    });
    return response;
};



export const getRebateDetails = async (id) => {
    const response = await apiInterceptor({
        endpoint: `/admin/get-dealer-details/${id}`,
        method: 'get'
    });
    return response;
};