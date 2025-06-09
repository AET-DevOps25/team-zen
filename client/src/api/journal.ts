import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { API_BASE_URL } from './base';

export const testQuery = () => {
  const { getToken } = useAuth();

  const testFetch = async () => {
    const token = await getToken();
    console.log('Token:', token);
    const response = await fetch(`${API_BASE_URL}/api/journalEntry`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ['test'],
    queryFn: testFetch,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  return { data, error, isLoading };
};
