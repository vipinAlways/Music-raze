"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import React, { use, useEffect, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ContextProvider } from "./Context";

function Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 200);
  }, [mounted]);
  if (mounted) {
    return (
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <ContextProvider>{children}</ContextProvider>
          <ReactQueryDevtools />
        </SessionProvider>
      </QueryClientProvider>
    );
  }
}

export default Provider;
