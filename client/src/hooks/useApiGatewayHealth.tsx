import { useQuery } from '@tanstack/react-query';
import { env } from '@/env';

// Health status types based on the HealthController
export interface HealthStatus {
  status: string;
  service: string;
  port: string;
  timestamp: string;
  version: string;
}

export interface DetailedHealthStatus extends HealthStatus {
  dependencies: {
    'user-service': string;
    'journal-service': string;
    'genai-service': string;
  };
  configuration: {
    authentication: string;
    microservices: string;
    'port-binding': string;
  };
}

/**
 * Hook to get health status from API Gateway
 * @param detailed - If true, fetches detailed health info including dependencies and configuration
 * @param enabled - If false, disables the query (useful for conditional fetching)
 * @returns Health status information with loading states and helper booleans
 */
export const useApiGatewayHealth = (
  detailed: boolean = false,
  enabled: boolean = true,
) => {
  const fetchHealth = async (): Promise<
    HealthStatus | DetailedHealthStatus
  > => {
    const endpoint = detailed ? '/health/detailed' : '/health';
    const response = await fetch(`${env.VITE_API_URL}/api${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Health data:', data);

    return data;
  };

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ['api-gateway-health', detailed],
    queryFn: fetchHealth,
    enabled, // Only fetch when enabled
    refetchInterval: detailed ? 60000 : 30000, // 60s for detailed, 30s for basic
    staleTime: detailed ? 30000 : 20000, // 30s for detailed, 20s for basic
    retry: detailed ? 2 : 3, // Fewer retries for detailed
  });

  // Type-safe access to detailed properties
  const detailedData = detailed ? (data as DetailedHealthStatus) : undefined;

  return {
    health: data,
    isLoading,
    error,
    isError,
    refetch,
    isHealthy: data?.status === 'UP',
    // Only available when detailed=true
    dependencies: detailedData?.dependencies,
    configuration: detailedData?.configuration,
  };
};

/**
 * Hook to get simple status from API Gateway
 * Corresponds to GET /health/status endpoint
 * Returns simple "OK" string - useful for quick health checks
 * @param enabled - If false, disables the query (useful for conditional fetching)
 */
export const useApiGatewayStatus = (enabled: boolean = true) => {
  const fetchStatus = async (): Promise<string> => {
    const response = await fetch(`${env.VITE_API_URL}/api/health/status`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Status check failed: ${response.status}`);
    }

    return response.text();
  };

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ['api-gateway-status'],
    queryFn: fetchStatus,
    enabled, // Only fetch when enabled
    refetchInterval: 15000, // Refetch every 15 seconds (frequent for quick checks)
    staleTime: 10000, // Consider data stale after 10 seconds
    retry: 5, // More retries for simple status check
  });

  return {
    status: data,
    isLoading,
    error,
    isError,
    refetch,
    isOnline: data === 'OK',
  };
};
