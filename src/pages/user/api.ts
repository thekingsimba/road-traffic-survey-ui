import { apiCallHandler } from '@shared/api/fetchClient';
import type {
  UserFilter,
  PaginatedUsersResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse
} from '@shared/api/data.models';
import { downloadFile } from '@shared/api/downloadFile';

export const getUsers = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  filter?: UserFilter;
}): Promise<PaginatedUsersResponse> => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.search) searchParams.append('search', params.search);

  return await apiCallHandler.get<PaginatedUsersResponse>(`users/list?${searchParams.toString()}`).json();
};

export const exportUsersCsv = async (params: {
  search?: string;
  filter?: UserFilter;
}): Promise<string> => {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.append('search', params.search);

  return await downloadFile({
    url: 'users/export',
    searchParams,
    method: 'get'
  });
};

export const createUser = async (data: CreateUserRequest): Promise<UserResponse> => {
  return await apiCallHandler.post<UserResponse>('users/create-agent', { json: data }).json();
};

export const updateUser = async (id: string, data: Omit<UpdateUserRequest, 'id'>): Promise<UserResponse> => {
  return await apiCallHandler.put<UserResponse>('users/update', { json: { id, ...data } }).json();
};

export const deleteUser = async (id: string): Promise<UserResponse> => {
  return await apiCallHandler.delete<UserResponse>(`users/delete?id=${id}`).json();
};

export const getUserDetails = async (id: string): Promise<UserResponse> => {
  return await apiCallHandler.get<UserResponse>(`users/details?id=${id}`).json();
};
