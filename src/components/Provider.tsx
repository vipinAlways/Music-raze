'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react'
import React, { useState } from 'react'
import {ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ContextProvider } from './Context';


function Provider({children}:{children:React.ReactNode}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
    <SessionProvider>
      <ContextProvider>

      

        {children}
      
      </ContextProvider>
    <ReactQueryDevtools />
    </SessionProvider>
    </QueryClientProvider>
  )
}

export default Provider