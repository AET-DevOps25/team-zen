import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

/**
 * Enhanced authentication hook that provides auth state and utilities
 */
export const useAuth = () => {
  const { isSignedIn, isLoaded, signOut } = useClerkAuth();
  const { user } = useUser();

  return {
    // Auth state
    isAuthenticated: isSignedIn && isLoaded,
    isLoading: !isLoaded,
    user,

    // Auth utilities
    signOut,

    // User properties (safely extracted)
    userId: user?.id,
    userEmail: user?.primaryEmailAddress?.emailAddress,
    userName: user?.fullName || user?.firstName || user?.username,
    userImage: user?.imageUrl,
  };
};

/**
 * Hook to protect components and redirect if not authenticated
 */
export const useRequireAuth = (redirectTo: string = '/') => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: redirectTo });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  return { isAuthenticated, isLoading };
};

/**
 * Route guard utility for checking authentication status
 */
export const checkAuthStatus = () => {
  // This can be used in route beforeLoad hooks for additional checks
  const auth = useClerkAuth();

  return {
    isAuthenticated: auth.isSignedIn && auth.isLoaded,
    isLoading: !auth.isLoaded,
    user: auth.userId,
  };
};
