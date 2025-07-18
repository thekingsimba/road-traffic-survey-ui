import { lazy } from 'react';
import type { Route } from './types';
const Login = lazy(() => import('@pages/login'));
const ChangePassword = lazy(() => import('@pages/change-password'));
const ResetPassword = lazy(() => import('@pages/reset-password'));
const Home = lazy(() => import('@pages/home'));
const ErrorsPage = lazy(() => import('@pages/errors'));

export const ROUTES: Route[] = [
  {
    path: '/login',
    content: Login,
  },
  {
    path: '/change-password',
    content: ChangePassword,
    authorizationRequired: true,
  },
  {
    path: '/reset-password',
    content: ResetPassword,
  },
  {
    path: '/',
    content: Home,
    authorizationRequired: true,
  },
  {
    path: '/error/:errorCode',
    content: ErrorsPage,
  }
];
