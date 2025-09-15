import type { ComponentType } from 'react';
import type { UserType } from '@shared/utils/userType';

export type RoutePath = '/' | '/error/:errorCode' | '/login' | '/change-password' | '/reset-password' | '/users' | '/surveys' | '/counting';

export type Route = {
  path: RoutePath;
  authorizationRequired?: boolean;
  allowedRoles?: UserType[];
  content: ComponentType;
}
