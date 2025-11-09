'use client';

import {queryClient} from '@/lib/client/query-client';
import {QueryClientProvider} from '@tanstack/react-query';

import {ReactNode} from 'react';

export function QueryProvider({children}: Readonly<{children: ReactNode}>) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
