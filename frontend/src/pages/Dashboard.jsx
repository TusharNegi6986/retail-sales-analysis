import MonthlyPerformance from "../components/MonthlyPerformance";
import StateRevenue from "../components/StateRevenue";

function Dashboard({
  kpis,
  monthlyData,
  stateData,
  loading,
}) {
  return (
    <>
      {/* KPI SECTION */}
      <section className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Total Revenue</span>

          <strong className="kpi-value">
            {loading
              ? "Loading..."
              : `R$ ${Number(
                  kpis?.total_revenue
                ).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
          </strong>

          <small className="kpi-meta">
            Overall sales value
          </small>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Total Orders</span>

          <strong className="kpi-value">
            {loading
              ? "Loading..."
              : Number(
                  kpis?.total_orders
                ).toLocaleString("en-IN")}
          </strong>

          <small className="kpi-meta">
            Total order volume
          </small>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Average Order Value</span>

          <strong className="kpi-value">
            {loading
              ? "Loading..."
              : `R$ ${Number(
                  kpis?.aov
                ).toFixed(2)}`}
          </strong>

          <small className="kpi-meta">
            Revenue per order
          </small>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Repeat Revenue</span>

          <strong className="kpi-value">
            {loading
              ? "Loading..."
              : `${Number(
                  kpis?.repeat_revenue_share
                ).toFixed(2)}%`}
          </strong>

          <small className="kpi-meta">
            Revenue from repeat customers
          </small>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Average Delivery</span>

          <strong className="kpi-value">
            {loading
              ? "Loading..."
              : `${Number(
                  kpis?.average_delivery_days
                ).toFixed(2)} days`}
          </strong>

          <small className="kpi-meta">
            Purchase to delivery
          </small>
        </div>
      </section>

      {/* MAIN PERFORMANCE */}
      <section className="dashboard-main-grid">

        {/* MONTHLY PERFORMANCE */}
        <div className="panel dashboard-monthly-panel">
          <div className="panel-heading">
            <div>
              <h2>Monthly Performance</h2>
              <p>Revenue and order trends over time</p>
            </div>
          </div>

          <div className="dashboard-chart-container">
            {loading ? (
              <div className="chart-loading">
                Loading chart...
              </div>
            ) : monthlyData.length === 0 ? (
              <div className="chart-loading">
                No monthly data available.
              </div>
            ) : (
              <MonthlyPerformance data={monthlyData} />
            )}
          </div>
        </div>

        {/* REVENUE BY STATE */}
        <div className="panel dashboard-state-panel">
          <div className="panel-heading">
            <div>
              <h2>Revenue by State</h2>
              <p>Geographic revenue concentration</p>
            </div>
          </div>

          <div className="dashboard-chart-container">
            {loading ? (
              <div className="chart-loading">
                Loading chart...
              </div>
            ) : stateData.length === 0 ? (
              <div className="chart-loading">
                No state data available.
              </div>
            ) : (
              <StateRevenue data={stateData} />
            )}
          </div>
        </div>
      </section>

      <section className="business-signal">
  <div>
    <span className="signal-label">
      BUSINESS SIGNAL
    </span>

    <h2>
      Customer retention is a key opportunity
    </h2>

    <p>
      Repeat customers contribute{" "}
      <strong>
        {loading
          ? "—"
          : `${Number(
              kpis?.repeat_revenue_share
            ).toFixed(2)}%`}
      </strong>{" "}
      of total revenue.
    </p>
  </div>

  <div className="signal-value">
    <span>Repeat Revenue</span>

    <strong>
      {loading
        ? "—"
        : `${Number(
            kpis?.repeat_revenue_share
          ).toFixed(2)}%`}
    </strong>
  </div>
</section>
    </>
  );
}

export default Dashboard;