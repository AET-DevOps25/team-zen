import { useAuth, useUser } from '@clerk/clerk-react';
import { useMutation, useQuery } from '@tanstack/react-query';
// import { API_BASE_URL } from './base';
// import { API_BASE_URL } from '../../';
import type { Snippet } from '@/model/snippet';
import { env } from '@/env.ts';

type SnippetData = {
  title?: string;
  content?: string;
};

// TODO Chnage so that we dont use the API_BASE_URL
const API_BASE_URL = env.VITE_API_URL || 'http://localhost:8087';
export const useCreateSnippet = () => {
  const { getToken } = useAuth();

  const createSnippet = async (snippetData: SnippetData) => {
    const token = await getToken();

    const response = await fetch(`${API_BASE_URL}/api/snippets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(snippetData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  return useMutation({
    mutationKey: ['createSnippet'],
    mutationFn: createSnippet,
    retry: 2,
  });
};

type GetSnippetsParams = {
  snippetId?: string;
  date?: string;
};

export const useGetSnippets = (params: GetSnippetsParams = {}) => {
  const { getToken } = useAuth();
  const { user } = useUser();

  const fetchSnippets = async () => {
    const token = await getToken();

    const urlParams = new URLSearchParams();
    if (params.snippetId) urlParams.append('snippetId', params.snippetId);
    if (params.date) {
      // Ensure date is in YYYY-MM-DD format for the backend
      const formattedDate = params.date.includes('T')
        ? params.date.split('T')[0]
        : params.date;
      urlParams.append('date', formattedDate);
    }

    const queryString = urlParams.toString();

    console.log('VITE_API_URL in fetchSnippets:', env.VITE_API_URL);
    console.log('API_BASE_URL in fetchSnippets:', API_BASE_URL);
    const url = `${API_BASE_URL}/api/snippets/${user?.id}${queryString ? `?${queryString}` : ''}`;

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
    return response.json() as Promise<Array<Snippet>>;
  };

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: ['getSnippets', user?.id, params.snippetId, params.date],
    queryFn: fetchSnippets,
    enabled: !!user?.id,
    retry: 2,
  });

  const snippets: Array<Snippet> = data || [];

  return { snippets, isLoading, error, isError, refetch };
};
