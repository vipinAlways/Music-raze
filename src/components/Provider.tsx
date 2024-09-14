'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react'
import React, { useState } from 'react'
import {ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ContextProvider } from './Context';
import { GroupProvider } from './GroupContextType ';

function Provider({children}:{children:React.ReactNode}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ContextProvider>

    <SessionProvider>
      <GroupProvider>

        {children}
      </GroupProvider>
    </SessionProvider>
      </ContextProvider>
    <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default Provider