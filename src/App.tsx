import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TopBar } from "./components/Layout/TopBar";
import { Sidebar } from "./components/Layout/Sidebar";
import { PanelContainer } from "./components/Layout/PanelContainer";
import { StatusBar } from "./components/Layout/StatusBar";
import { WaldorfMap } from "./components/Map/WaldorfMap";
import { useDataPolling } from "./hooks/useDataPolling";
import { useAutoUpdater } from "./hooks/useAutoUpdater";
import { useAlertEvaluation } from "./hooks/useAlertEvaluation";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  // Check for updates on launch (non-blocking, Tauri-only)
  useAutoUpdater();
  // Initialize live data polling for air/sea traffic
  useDataPolling();
  // Evaluate alert conditions and generate timeline events
  useAlertEvaluation();

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-waldorf-bg text-waldorf-text">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 relative overflow-hidden">
          <WaldorfMap />
        </main>
        <PanelContainer />
      </div>
      <StatusBar />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
