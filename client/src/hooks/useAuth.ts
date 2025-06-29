import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useGetUser } from '@/api/user';

/**
 * Enhanced authentication hook that combines Clerk auth with user data from our API
 */
export const useAuth = () => {
  const { isSignedIn, isLoaded, signOut, getToken } = useClerkAuth();
  const { user } = useUser();

  // Get user data from API
  const {
    userData,
    isLoading: isUserLoading,
    error: userError,
    refetch: refetchUser,
  } = useGetUser(getToken);

  return {
    // Auth state
    isAuthenticated: isSignedIn && isLoaded,
    isLoading: !isLoaded || isUserLoading,
    user,

    // Enhanced user data from API
    userData,
    userError,
    refetchUser,

    // Auth utilities
    signOut,
    getToken,

    // User properties (safely extracted from Clerk)
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
