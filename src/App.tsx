import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { Auth } from "@/pages/Auth";
import { Dashboard } from "@/pages/Dashboard";
import { Fleet } from "@/pages/Fleet";
import { FleetDetail } from "@/pages/FleetDetail";
import { Drivers } from "@/pages/Drivers";
import { Orders } from "@/pages/Orders";
import { LiveTracking } from "@/pages/LiveTracking";
import { FuelConsumptionAnalysis } from "@/pages/FuelConsumptionAnalysis";
import { Settings } from "@/pages/Settings";
import { NotFound } from "@/pages/NotFound";

const queryClient = new QueryClient();

export const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <header className="flex items-center justify-between border-b px-6 py-4">
              <div className="font-semibold">LogiTrack</div>
              <NotificationBell />
            </header>
            <main className="flex-1 bg-muted/20">
              <Suspense fallback={<div className="p-6">Caricamento...</div>}>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/fleet" element={<Fleet />} />
                    <Route path="/fleet/:id" element={<FleetDetail />} />
                    <Route path="/drivers" element={<Drivers />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/tracking" element={<LiveTracking />} />
                    <Route path="/fuel-analysis" element={<FuelConsumptionAnalysis />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
