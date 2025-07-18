import type { ComponentType } from 'react';

export type RoutePath = '/' | '/error/:errorCode' | '/login' | '/change-password' | '/reset-password' | '/users' | '/clients';

export type Route = {
  path: RoutePath;
  authorizationRequired?: boolean;
  content: ComponentType;
}
