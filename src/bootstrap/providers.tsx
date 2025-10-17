import React from "react";
import { Toaster } from "../../client/ui-kit/atoms/toaster";
import { Toaster as Sonner } from "../../client/ui-kit/atoms/sonner";
import { TooltipProvider } from "../../client/ui-kit/atoms/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {children}
    </TooltipProvider>
  </QueryClientProvider>
);
