import { apiInterceptor } from './service';

let currentUser = JSON.parse(localStorage.getItem('user'));

export const setCurrentUser = (user) => {
  currentUser = user;
};

export const clearCurrentUser = () => {
  currentUser = null;
};

export const loginWithAdmin = async (data) => {
  const response = await apiInterceptor({
    endpoint: '/admin/login',
    method: 'post',
    payload: data,
  });
  return response;
};

export const dashboardAdmin = async () => {
  const isUser = currentUser?.role_id === 1;
  let url = '';

  if (isUser) {
    url = '/admin/dashboard';
  } else {
    url = '/dealer/dashboard';
  }
  const response = await apiInterceptor({
    endpoint: url,
    method: 'get',
  });
  return response;
};

export const logoutWithAdmin = async () => {
  const isUser = currentUser?.role_id === 1;
  let url = '';
  if (isUser) {
    url = '/admin/logout';
  } else {
    url = '/dealer/logout';
  }

  const response = await apiInterceptor({
    endpoint: url,
    method: 'post',
  });
  return response;
};

export const forgotPassword = async (data) => {
  const response = await apiInterceptor({
    endpoint: '/admin/forgot-password',
    method: 'post',
    payload: data,
  });
  return response;
};

export const changePasswordWithAdmin = async (data) => {
  const isUser = currentUser?.role_id === 1;
  let url = '';
  if (isUser) {
    url = '/admin/change-password';
  } else {
    url = '/dealer/change-password';
  }
  const response = await apiInterceptor({
    endpoint: url,
    method: 'post',
    payload: data,
  });
  return response;
};

export const getByIdAdminProduct = async (id) => {
  const isUser = currentUser?.role_id === 1;
  let url = '';
  if (isUser) {
    url = `/admin/products/${id}`;
  } else {
    url = `/dealer/products/${id}`;
  }
  const response = await apiInterceptor({
    endpoint: url,
    method: 'get',
  });
  return response;
};

export const getAllCategory = async () => {
  const response = await apiInterceptor({
    endpoint: `/admin/get-category`,
    method: 'get',
  });
  return response;
};

export const getAllDealerUserType = async () => {
  const response = await apiInterceptor({
    endpoint: `/admin/get-dealer-user-roles`,
    method: 'get',
  });
  return response;
};

export const getAllSalesPerson = async () => {
  const response = await apiInterceptor({
    endpoint: `/admin/get-sales-person`,
    method: 'get',
  });
  return response;
};

export const getAlert = async () => {
  const response = await apiInterceptor({
    endpoint: `/admin/get-alert`,
    method: 'get',
  });
  return response;
};

export const resetPassword = async (data) => {
  const response = await apiInterceptor({
    endpoint: `/admin/reset-password`,
    method: 'post',
    payload: data,
  });
  return response;
};

export const submitSupportRequest = async (data) => {
  const response = await apiInterceptor({
    endpoint: '/admin/submit-support-request',
    method: 'post',
    payload: data,
  });
  return response;
};

export const getDealerList = async () => {
  const response = await apiInterceptor({
    endpoint: `/admin/dealer_list`,
    method: 'get',
  });
  return response;
};
