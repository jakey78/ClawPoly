import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import AddressPage from "./pages/AddressPage";
import TransactionPage from "./pages/TransactionPage";
import ContractPage from "./pages/ContractPage";
import DocsPage from "./pages/DocsPage";
import PricingPage from "./pages/PricingPage";
import ReceiptsPage from "./pages/ReceiptsPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

export default function App() {
  const location = useLocation();

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/address/:address" element={<AddressPage />} />
          <Route path="/tx/:hash" element={<TransactionPage />} />
          <Route path="/contract/:address" element={<ContractPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/receipts" element={<ReceiptsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}
