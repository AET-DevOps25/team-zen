import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import Home from './app/home.tsx';
import { default as Root } from './root.tsx';
import Dashboard from './app/dashboard.tsx';
import Profile from './app/profile.tsx';
import Journal from './app/journal.tsx';
import CreateSnippet from './app/snippet.tsx';

const rootRoute = createRootRoute({
  component: () => (
    <Root>
      <Outlet />
      <TanStackRouterDevtools />
    </Root>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: Profile,
});

const journalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/journal',
  component: Journal,
});

const snippetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/snippet',
  component: CreateSnippet,
});

// Reference for layouts https://tanstack.com/router/v1/docs/framework/react/routing/code-based-routing#layout-routes

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  profileRoute,
  journalRoute,
  snippetRoute,
]);

export const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
