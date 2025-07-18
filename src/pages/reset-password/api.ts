
import { apiCallHandler } from '@shared/api/fetchClient';
import type { CheckForgotPasswordCodeRequest, ConfirmForgotPasswordRequest, ForgotPasswordRequest } from '@shared/api/typesExtracted';
import type { KyResponse } from 'ky';

export const sendForgotPasswordEmail = (data: ForgotPasswordRequest): Promise<KyResponse<void>> =>
  apiCallHandler.post<void>('users/forgot-password', { json: data, throwHttpErrors: false });

export const sendConfirmationCode = (data: CheckForgotPasswordCodeRequest): Promise<KyResponse<void>> =>
  apiCallHandler.post<void>('users/check-forgot-password-code', { json: data, throwHttpErrors: false });

export const confirmForgotPassword = (data: ConfirmForgotPasswordRequest): Promise<KyResponse<void>> =>
  apiCallHandler.post<void>('users/confirm-forgot-password', { json: data, throwHttpErrors: false });
