import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react";

import App from "@/app.tsx";

import "@/index.css";

export const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <App />
      </NuqsAdapter>
    </QueryClientProvider>
  </StrictMode>
);
