import { useEffect } from 'react';
import { ROUTES } from '@app/router/routes';
import LoginPage from '@pages/login';
import { useUserStore } from '@shared/stores/userStore';
import { getUserType } from '@shared/utils/userType';
import { Layout } from '@widgets/Layout';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

export const Router = () => {
  const isAuthorized = useUserStore(state => state.isAuthorized);
  const user = useUserStore(state => state.user);
  const [location, setLocation] = useLocation();

  const availableRoutes = ROUTES.filter(route => {
    if (route.authorizationRequired) {
      if (!isAuthorized) return false;

      // Check role-based access if allowedRoles is specified
      if (route.allowedRoles && route.allowedRoles.length > 0) {
        const userType = getUserType(user);
        return route.allowedRoles.includes(userType);
      }

      return true;
    }
    return route;
  });

  useEffect(() => {
    const isPublicRoute = ROUTES.some(
      r => r.path === location && !r.authorizationRequired
    );

    if (!isAuthorized && !isPublicRoute) {
      setLocation('/login');
      return;
    }

    // Check if user has access to the current route based on roles
    if (isAuthorized) {
      const currentRoute = ROUTES.find(r => r.path === location);
      if (currentRoute?.allowedRoles && currentRoute.allowedRoles.length > 0) {
        const userType = getUserType(user);
        if (!currentRoute.allowedRoles.includes(userType)) {
          // Redirect to home page if user doesn't have access to this route
          setLocation('/');
        }
      }
    }
  }, [isAuthorized, location, setLocation, user]);

  return (
    <WouterRouter>
      <Layout>
        <Switch>
          {availableRoutes.map(route => (
            <Route key={route.path} path={route.path}>
              <route.content />
            </Route>
          ))}
          <Route>
            <LoginPage />
          </Route>
        </Switch>
      </Layout>
    </WouterRouter>
  );
};
