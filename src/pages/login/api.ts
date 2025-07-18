import { apiCallHandler } from '@shared/api/fetchClient';
import type { AuthUserResponse, ChangeCurrentPasswordRequest, ChangePasswordRequest, SignInRequest } from '@shared/api/typesExtracted';
import type { KyResponse } from 'ky';

export const signIn = (data: SignInRequest): Promise<KyResponse<AuthUserResponse>> =>
  apiCallHandler.post<AuthUserResponse>('auth/signIn', { json: data, throwHttpErrors: false });

export const changeTemporaryPassword = (data: ChangePasswordRequest): Promise<AuthUserResponse> =>
  apiCallHandler.post<AuthUserResponse>('auth/change-temporary-password', { json: data }).json();

export const changeCurrentPassword = (data: ChangeCurrentPasswordRequest): Promise<KyResponse<AuthUserResponse>> =>
  apiCallHandler.post('auth/change-password', { json: data, throwHttpErrors: false });
