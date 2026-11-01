import { apiInterceptor } from './service';
import api from './api';

export const getAllDealerUser = async (page, per_page = 10) => {
  const response = await apiInterceptor({
    endpoint: `/dealer/dealer-user?per_page=${per_page}&page=${page}`,
    method: 'get',
  });
  return response;
};

export const addDealerUser = async (data) => {
  const response = await apiInterceptor({
    endpoint: '/dealer/dealer-user',
    method: 'post',
    payload: data,
  });
  return response;
};

export const UpdateDealerUser = async (data, id) => {
  const response = await apiInterceptor({
    endpoint: `/dealer/dealer-user/${id}`,
    method: 'post',
    payload: data,
  });
  return response;
};

export const actionButtonDealerUser = async (data) => {
  const response = await apiInterceptor({
    endpoint: '/dealer/dealer-user-bulk-action',
    method: 'post',
    payload: data,
  });
  return response;
};

export const exportDealerUserRebateData = async (id, startDate, endDate) => {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);

  const endpoint = `/dealer/export-dealer-user-rebate-data/${id}${
    params.toString() ? `?${params.toString()}` : ''
  }`;

  const response = await api.get(endpoint, {
    responseType: 'blob',
  });
  return response;
};
