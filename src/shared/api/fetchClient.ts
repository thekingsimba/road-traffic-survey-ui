import { envs } from '@shared/envs';
import { useUserStore } from '@shared/stores/userStore';
import { forceLogout } from '@shared/utils/authUtils';
import type { Options } from 'ky';
import ky from 'ky';
import type { RefreshTokenRequest, TokenResponse } from './typesExtracted';
import type { AuthStoreBase } from '@shared/stores/types';

const logoutAndRedirect = (logout: () => void, redirectTo = '/login', reason?: string) => {
  // Show notification to user before logout
  if (reason) {
    alert(`Session expired: ${reason}. Please log in again.`);
  } else {
    alert('Your session has expired. Please log in again.');
  }

  logout();
  window.location.href = redirectTo;
};

const redirectToErrorPage = (statusCode: number) => {
  const statusCodeHandled = [403, 500, 502, 503, 504];
  const isLoginPage = () => window.location.href.includes('/login');
  if (statusCodeHandled.includes(statusCode) && !isLoginPage()) {
    window.location.href = '/error/' + statusCode;
  }
};

const clientIdMiddleWare = (request: Request) => {
  const clientId = envs.VITE_CLIENT_ID_HEADER;

  if (clientId)
    request.headers.set('ClientId', clientId);
};

const authTokenMiddleWare = (
  request: Request,
  authStoreAccessor: () => AuthStoreBase) => {
  const accessToken = authStoreAccessor().accessToken;

  if (accessToken)
    request.headers.set('Authorization', `Bearer ${accessToken}`);
};

const refreshTokenMiddleWare = async (
  request: Request,
  response: Response,
  authStoreAccessor: () => AuthStoreBase) => {
    const currentUser = authStoreAccessor();

  // Handle authentication errors
    if (response.status === 401) {
      try {
        const errorBody = await response?.clone()?.json();

        // Check if it's a force logout or invalid token
        if (errorBody?.error === 'force_logout' || errorBody?.message?.includes('Invalid login token')) {
          forceLogout('Invalid or expired token');
          return;
        }

        // Try to refresh token if we have a refresh token
        if (currentUser.refreshToken) {
          const refreshRequestOptions: Options = {
            prefixUrl: envs.VITE_API_BASE_URL,
            json: { refreshToken: currentUser.refreshToken } as RefreshTokenRequest,
            retry: 0,
            hooks: { beforeRequest: [clientIdMiddleWare] }
          };

          try {
            const newTokens = await ky.post<TokenResponse>('auth/refresh-token', refreshRequestOptions).json();
            currentUser.updateAccessToken(newTokens.accessToken as string);

            request.headers.set('Authorization', `Bearer ${newTokens.accessToken}`);

            return ky(request);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          forceLogout('Token refresh failed');
          return;
        }
      } else {
        // No refresh token available, logout immediately
        forceLogout('No refresh token available');
        return;
      }
    } catch (e) {
      console.error('Authentication error handling failed:', e);
      forceLogout('Authentication error');
      return;
    }
  }

  // Handle forbidden access (403)
  if (response.status === 403) {
    try {
      const errorBody = await response?.clone()?.json();
      if (errorBody?.message?.includes('Access denied') || errorBody?.message?.includes('permission')) {
        alert('Access denied: You do not have permission to perform this action.');
        }
      } catch (e) {
        console.error('Error parsing 403 response:', e);
      }
    }

  // for server side errors. Status code starting by 5...
  redirectToErrorPage(response.status);
};

export const apiCallHandler = ky.extend({
  // Use 'include' for production (cross-origin), 'same-origin' for development
  credentials: import.meta.env.DEV ? 'same-origin' : 'include',
  prefixUrl: envs.VITE_API_BASE_URL,
  timeout: 15000,
  hooks: {
    beforeRequest: [
      (request) => clientIdMiddleWare(request),
      (request) => authTokenMiddleWare(request, useUserStore.getState)
    ],
    afterResponse: [
      (request, _, response) => refreshTokenMiddleWare(request, response, useUserStore.getState),
    ],
  }
});


