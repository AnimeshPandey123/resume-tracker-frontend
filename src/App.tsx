
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import AuthRedirect from "./components/AuthRedirect";

import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing page route */}
          <Route path="/" element={<Landing />} />
          
          {/* Protected routes */}
          <Route element={<AuthRedirect />}>

            <Route path="/home" element={<Layout />}>
              <Route index element={<Index />} />
            </Route>
            <Route element={<Layout />}>
              <Route path="jobs" element={<Jobs />} />

            </Route>
          </Route>

          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
