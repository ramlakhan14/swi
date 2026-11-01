import { apiInterceptor } from "./service";

export const getAllUser = async (
  page,
  per_page = 10,
  dealer_id,
  email,
  company_name,
  missing_lat_lng,
  role_id
) => {
  const params = { per_page, page };

  if (dealer_id) params.dealer_id = dealer_id;
  if (email) params.email = email;
  if (company_name) params.company_name = company_name;
  if (missing_lat_lng) params.missing_lat_lng = missing_lat_lng;
  if (role_id) params.role_id = role_id;

  const response = await apiInterceptor({
    endpoint: `/admin/user`,
    method: 'get',
    params,
  });

  return response;
};

export const getAllRole = async () => {
    const response = await apiInterceptor({
        endpoint: `/admin/get-roles`,
        method: 'get'
    });
    return response;
};


export const addUserModel = async (data, id = null) => {
  const endpoint = id ? `/admin/user/${id}` : `/admin/user`;
    const response = await apiInterceptor({
        endpoint,
        method: 'post',
        payload: data
    });
    return response;
};


export const getByIdUser = async (id) => {
    const response = await apiInterceptor({
        endpoint: `/admin/user/${id}`,
        method: 'get'
    });
    return response;
};

export const deleteUser = async (id) => {
    const response = await apiInterceptor({
        endpoint: `/admin/user/${id}`,
        method: 'delete'
    });
    return response;
};

export const deleteDealerUser = async (id) => {
    const response = await apiInterceptor({
        endpoint: `/admin/dealer-user-delete/${id}`,
        method: 'delete'
    });
    return response;
};
