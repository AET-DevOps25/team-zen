// Environment configuration with fallback support
const getEnvVar = (
  kubernetesPlaceholder: string,
  viteEnvKey: string,
): string => {
  // Check if we're getting the Kubernetes placeholder (deployment replacement didn't happen)
  if (
    kubernetesPlaceholder.startsWith('__') &&
    kubernetesPlaceholder.endsWith('__')
  ) {
    // Fallback to reading from import.meta.env (Vite's environment variables)
    const envValue = import.meta.env[viteEnvKey];
    if (!envValue) {
      throw new Error(`Environment variable ${viteEnvKey} is not defined`);
    }
    return envValue;
  }
  // Use the Kubernetes-replaced value
  return kubernetesPlaceholder;
};

export const env = {
  VITE_CLERK_PUBLISHABLE_KEY: getEnvVar(
    '__VITE_CLERK_PUBLISHABLE_KEY__',
    'VITE_CLERK_PUBLISHABLE_KEY',
  ),
  VITE_API_URL: getEnvVar('__VITE_API_URL__', 'VITE_API_URL'),
};
