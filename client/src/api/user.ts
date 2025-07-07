import { useUser } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { env } from '@/env.ts';
// import { API_BASE_URL } from './base';

// TODO Chnage so that we dont use the API_BASE_URL
const API_BASE_URL = env.VITE_API_URL || 'http://localhost:8087';

type GetUser = {
  id?: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export const useGetUser = (
  getToken: () => Promise<string | null>,
  params: GetUser = {},
) => {
  const { user } = useUser();

  const fetchUser = async () => {
    const token = await getToken();

    const urlParams = new URLSearchParams();
    if (params.id) urlParams.append('id', params.id);

    const queryString = urlParams.toString();
    const url = `${API_BASE_URL}/api/users/${user?.id}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json() as Promise<User>;
  };

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ['getUser', user?.id, params.id],
    queryFn: fetchUser,
    enabled: !!user?.id,
    retry: 2,
  });

  const userData: User | undefined = data;

  return { userData, isLoading, error, isError, refetch };
};
