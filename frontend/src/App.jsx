import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import "./index.css";

import {
  fetchKPIs,
  fetchMonthlyPerformance,
  fetchRevenueByState,
  fetchCategories,
  fetchDeliveryTrend,
  fetchDeliveryReliability,
} from "./services/api";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";

function AppContent() {
  const location = useLocation();
  const isAnalyticsPage = location.pathname === "/analytics";
  const [kpis, setKpis] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);
  const [deliveryReliability, setDeliveryReliability] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [
          kpiData,
          monthlyPerformance,
          revenueByState,
          categories,
          deliveryTrend,
          reliability,
        ] = await Promise.all([
          fetchKPIs(),
          fetchMonthlyPerformance(),
          fetchRevenueByState(),
          fetchCategories(),
          fetchDeliveryTrend(),
          fetchDeliveryReliability(),
        ]);

        setKpis(kpiData);
        setMonthlyData(monthlyPerformance);
        setStateData(revenueByState);
        setCategoryData(categories);
        setDeliveryData(deliveryTrend);
        setDeliveryReliability(reliability);
      } catch (err) {
        console.error("Dashboard loading error:", err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);
  useEffect(() => {
    async function loadFilteredAnalytics() {
      try {
        const [categories, deliveryTrend, reliability] = await Promise.all([
          fetchCategories(selectedState),
          fetchDeliveryTrend(selectedState),
          fetchDeliveryReliability(selectedState),
        ]);

        setCategoryData(categories);
        setDeliveryData(deliveryTrend);
        setDeliveryReliability(reliability);
      } catch (err) {
        console.error("Filtered analytics error:", err);
        setError("Unable to update filtered analytics.");
      }
    }

    if (!loading) {
      loadFilteredAnalytics();
    }
  }, [selectedState, loading]);

  return (
    <div className="app">
      <header className="dashboard-header">
        <div className="header-brand">
          <div>
            <h1>Retail Analytics</h1>

            <p>
              {isAnalyticsPage
                ? "Category & Delivery Analytics"
                : "Executive Business Overview"}
              {" • Olist E-Commerce Dataset"}
            </p>
          </div>
        </div>

        <div className="header-right">
          <nav className="main-nav">
            <Link to="/" className={!isAnalyticsPage ? "active" : ""}>
              Dashboard
            </Link>

            <Link to="/analytics" className={isAnalyticsPage ? "active" : ""}>
              Analytics
            </Link>
          </nav>

          <div className="header-badge">BUSINESS INTELLIGENCE</div>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              kpis={kpis}
              monthlyData={monthlyData}
              stateData={stateData}
              loading={loading}
            />
          }
        />

        <Route
          path="/analytics"
          element={
            <Analytics
              categoryData={categoryData}
              deliveryData={deliveryData}
              deliveryReliability={deliveryReliability}
              loading={loading}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              stateData={stateData}
            />
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer>
        End-to-End Retail Analytics • PostgreSQL + Express + React
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
