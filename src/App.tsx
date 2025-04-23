import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Services from "./pages/Services";
import Partners from "./pages/Partners";
import CaseStudies from "./pages/CaseStudies";
import HRMS from "./pages/HRMS";
import Insurance from "./pages/Insurance";
import Hospitality from "./pages/Hospitality";
import ContactPage from "./components/ContactPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FlowchartPage from './pages/FlowchartPage';

const queryClient = new QueryClient();

const App = () => (
  <Router>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="bg-warm-gradient min-h-screen">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/hospitality" element={<Hospitality />} />
              <Route path="/hrms" element={<HRMS />} />
              <Route path="/insurance" element={<Insurance />} />
              <Route path="/flowchart" element={<FlowchartPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  </Router>
);

export default App;
