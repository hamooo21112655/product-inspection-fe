import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";
import { ProductProvider } from "./contexts/ProductContext";
import { InspectionBodyProvider } from "./contexts/InspectionBodyContext";
import InspectionBodies from "./pages/InspectionBodies";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ProductProvider>
      <InspectionBodyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Products />} />
              <Route path="/proizvodi" element={<Products />} />
              <Route
                path="/inspekcijska-tijela"
                element={<InspectionBodies />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </InspectionBodyProvider>
    </ProductProvider>
  </QueryClientProvider>
);

export default App;
