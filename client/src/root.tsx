import { ClerkProvider } from '@clerk/clerk-react';

import Layout from './components/Layout';
import type { PropsWithChildren } from 'react';
import { env } from '@/env.ts';
import './styles.css';

function Root({ children }: PropsWithChildren) {
  return (
    <ClerkProvider
      publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl="/"
    >
      <Layout>{children}</Layout>
    </ClerkProvider>
  );
}

export default Root;
