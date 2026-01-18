import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Products from "./pages/Products";
import InspectionBodies from "./pages/InspectionBodies";
import InspectionControls from "./pages/InspectionControls";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/proizvodi" element={<Products />} />
          <Route path="/inspekcijska-tijela" element={<InspectionBodies />} />
          <Route path="/kontrole" element={<InspectionControls />} />
          <Route path="/izvjestaji" element={<Reports />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
