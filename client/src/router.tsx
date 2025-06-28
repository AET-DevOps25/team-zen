import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useAuth } from '@clerk/clerk-react';

import Home from './app/home.tsx';
import { default as Root } from './root.tsx';
import Dashboard from './app/dashboard.tsx';
import Profile from './app/profile.tsx';
import Journal from './app/journal.tsx';
import CreateSnippet from './app/snippet.tsx';

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    // Show loading state while auth is loading
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    // Redirect to sign-in if not authenticated
    throw redirect({ to: '/' });
  }

  return <>{children}</>;
};

// Protected layout component
const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
};

const rootRoute = createRootRoute({
  component: () => (
    <Root>
      <Outlet />
      <TanStackRouterDevtools />
    </Root>
  ),
  beforeLoad: () => {
    // You can add global auth checks here if needed
    return {
      isAuthenticated: false, // This will be updated by individual routes
    };
  },
});

// Public routes (no authentication required)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

// Protected layout route - all protected routes will be children of this
const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: ProtectedLayout,
  beforeLoad: () => {
    // This hook runs before any protected route loads
    // The actual auth check is in the ProtectedRoute component
    // We can add additional logic here if needed
    return {};
  },
});

// Protected routes - require authentication
const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/dashboard',
  component: Dashboard,
});

const dashboardTabRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/dashboard/$tab',
  component: Dashboard,
});

const profileRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/profile',
  component: Profile,
});

const journalRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/journal',
  component: Journal,
});

const dashboardJournalRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/journal/$journalId',
  component: Journal,
});

const snippetRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/snippet',
  component: CreateSnippet,
});

// Reference for layouts https://tanstack.com/router/v1/docs/framework/react/routing/code-based-routing#layout-routes

const routeTree = rootRoute.addChildren([
  indexRoute, // Public route
  protectedRoute.addChildren([
    // All protected routes
    dashboardRoute,
    dashboardTabRoute,
    profileRoute,
    journalRoute,
    dashboardJournalRoute,
    snippetRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
  context: {}, // Empty context for now
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  // Global error handling
  defaultErrorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-600">{error.message}</p>
      </div>
    </div>
  ),
  // Global not found handling
  defaultNotFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600">
          The page you're looking for doesn't exist.
        </p>
      </div>
    </div>
  ),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
