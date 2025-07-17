import { ClerkProvider } from '@clerk/clerk-react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import type { PropsWithChildren } from 'react';
import { env } from '@/env.ts';
import './styles.css';

const queryClient = new QueryClient();

function Root({ children }: PropsWithChildren) {
  return (
    <ClerkProvider
      publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl="/"
    >
      <QueryClientProvider client={queryClient}>
        <Layout>{children}</Layout>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default Root;
