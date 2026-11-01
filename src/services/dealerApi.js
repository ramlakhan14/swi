import { apiInterceptor } from './service';
import api from './api';

export const loginWithDealer = async (data) => {
  const response = await apiInterceptor({
    endpoint: '/dealer/login',
    method: 'post',
    payload: data,
  });
  return response;
};

export const exportDealerRebateData = async (id, startDate, endDate) => {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);

  const endpoint = `/dealer/export-dealer-rebate-data/${id}${
    params.toString() ? `?${params.toString()}` : ''
  }`;

  const response = await api.get(endpoint, {
    responseType: 'blob',
  });
  return response;
};
