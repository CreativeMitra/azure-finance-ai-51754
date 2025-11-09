import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FinanceProvider } from "@/contexts/FinanceContext";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import NetWorth from "./pages/NetWorth";
import AssetsLiabilities from "./pages/AssetsLiabilities";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import MarketInsights from "./pages/MarketInsights";
import LoansDebt from "./pages/LoansDebt";
import IncomeSavings from "./pages/IncomeSavings";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FinanceProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/net-worth" element={<NetWorth />} />
              <Route path="/assets-liabilities" element={<AssetsLiabilities />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/market-insights" element={<MarketInsights />} />
              <Route path="/loans-debt" element={<LoansDebt />} />
              <Route path="/income-savings" element={<IncomeSavings />} />
              <Route path="/reports" element={<Reports />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </FinanceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
