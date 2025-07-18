import { useEffect } from 'react';
import { ROUTES } from '@app/router/routes';
import LoginPage from '@pages/login';
import { useUserStore } from '@shared/stores/userStore';
import { Layout } from '@widgets/Layout';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

export const Router = () => {
  const isAuthorized = useUserStore(state => state.isAuthorized);
  const [location, setLocation] = useLocation();

  const availableRoutes = ROUTES.filter(route => {
    if (route.authorizationRequired) return isAuthorized;
    return route;
  });

  useEffect(() => {
    const isPublicRoute = ROUTES.some(
      r => r.path === location && !r.authorizationRequired
    );

    if (!isAuthorized && !isPublicRoute) {
      setLocation('/login');
    }
  }, [isAuthorized, location, setLocation]);

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
