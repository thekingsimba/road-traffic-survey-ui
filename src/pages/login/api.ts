import { apiCallHandler } from '@shared/api/fetchClient';
import type { KyResponse } from 'ky';
import type { SignInRequest, AuthUserResponse } from '../../shared/api/typesExtracted';

export const signIn = (data: SignInRequest): Promise<KyResponse<AuthUserResponse>> =>
  apiCallHandler.post<AuthUserResponse>('users/email_login', { json: data, throwHttpErrors: false });

export const changeCurrentPassword = (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<KyResponse<AuthUserResponse>> =>
  apiCallHandler.post<AuthUserResponse>('users/change-password', { json: data, throwHttpErrors: false });
