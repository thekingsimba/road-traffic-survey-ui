import { envs } from '@shared/envs';
import { useUserStore } from '@shared/stores/userStore';
import type { Options } from 'ky';
import ky from 'ky';
import type { RefreshTokenRequest, TokenResponse } from './typesExtracted';
import type { AuthStoreBase } from '@shared/stores/types';

const logoutAndRedirect = (logout: () => void, redirectTo = '/login') => {
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

    if (response.status === 401) {
      try {
        const errorBody = await response?.clone()?.json();

        if (errorBody?.error === 'force_logout') {
          logoutAndRedirect(currentUser.logout);
        } else {
          const refreshRequestOptions: Options = {
            prefixUrl: envs.VITE_API_BASE_URL,
            json: { refreshToken: currentUser.refreshToken } as RefreshTokenRequest,
            retry: 0,
            hooks: { beforeRequest: [clientIdMiddleWare] }
          };

          const newTokens = await ky.post<TokenResponse>('auth/refresh-token', refreshRequestOptions).json();
          currentUser.updateAccessToken(newTokens.accessToken as string);

          request.headers.set('Authorization', `Bearer ${newTokens.accessToken}`);

          return ky(request);
        }
      } catch (e) {
        console.error(e);
        logoutAndRedirect(currentUser.logout);
      }
  }

  // for server side errors. Status code starting by 5...
  redirectToErrorPage(response.status);
};

export const apiCallHandler = ky.extend({
  credentials: 'include',
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


