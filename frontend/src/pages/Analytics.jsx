import CategoryPerformance from "../components/CategoryPerformance";
import DeliveryTrend from "../components/DeliveryTrend";

function Analytics({
  deliveryReliability,
  categoryData,
  deliveryData,
  loading,
  selectedState,
  setSelectedState,
  stateData,
}) {
  return (
    <>
      <div className="page-heading">
        <div>
          <h2>Category & Delivery Analytics</h2>
          <p>Explore product performance and delivery reliability by state.</p>
        </div>
      </div>
      {/* PAGE FILTER */}
      <div className="analytics-toolbar">
        <div>
          <span className="filter-label">State</span>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">All States</option>

            {stateData.map((item) => (
              <option key={item.state} value={item.state}>
                {item.state}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CATEGORY + DELIVERY */}
      <section className="content-grid">
        {/* CATEGORY PERFORMANCE */}
        <div className="panel">
          <h2>Category Performance</h2>

          <p>
            Revenue performance by product category
            {selectedState ? ` in ${selectedState}` : " across all states"}
          </p>

          <div className="chart-container">
            {loading ? (
              <div className="chart-loading">Loading chart...</div>
            ) : categoryData.length === 0 ? (
              <div className="chart-loading">No category data available.</div>
            ) : (
              <CategoryPerformance data={categoryData} />
            )}
          </div>
        </div>

        {/* DELIVERY PERFORMANCE */}
        <div className="panel">
          <h2>Delivery Performance</h2>

          <p>
            Average delivery time over the order lifecycle
            {selectedState ? ` in ${selectedState}` : " across all states"}
          </p>

          <div className="chart-container">
            {loading ? (
              <div className="chart-loading">Loading chart...</div>
            ) : deliveryData.length === 0 ? (
              <div className="chart-loading">No delivery data available.</div>
            ) : (
              <DeliveryTrend data={deliveryData} />
            )}
          </div>
        </div>
      </section>

      {/* DELIVERY RELIABILITY */}
      <section className="panel reliability-panel">
        <div className="panel-heading">
          <div>
            <h2>Delivery Reliability</h2>

            <p>
              Orders delivered after the estimated delivery date
              {selectedState ? ` in ${selectedState}` : " across all states"}
            </p>
          </div>
        </div>

        <div className="reliability-grid">
          <div className="reliability-metric reliability-risk">
            <span>Late Rate</span>

            <strong>
              {deliveryReliability
                ? `${Number(deliveryReliability.late_rate_percent).toFixed(2)}%`
                : "—"}
            </strong>
          </div>

          <div className="reliability-metric">
            <span>Late Orders</span>

            <strong>
              {deliveryReliability
                ? Number(deliveryReliability.late_orders).toLocaleString(
                    "en-IN",
                  )
                : "—"}
            </strong>
          </div>

          <div className="reliability-metric">
            <span>On-time / Early</span>

            <strong>
              {deliveryReliability
                ? Number(
                    deliveryReliability.on_time_or_early_orders,
                  ).toLocaleString("en-IN")
                : "—"}
            </strong>
          </div>
        </div>
      </section>

      <section className="business-signal analytics-signal">
        <div>
          <span className="signal-label">DELIVERY SIGNAL</span>

          <h2>Delivery reliability should be monitored by region</h2>

          <p>
            Current late-order rate is{" "}
            <strong>
              {deliveryReliability
                ? `${Number(deliveryReliability.late_rate_percent).toFixed(2)}%`
                : "—"}
            </strong>
            .
          </p>
        </div>

        <div className="signal-value">
          <span>Late Rate</span>

          <strong>
            {deliveryReliability
              ? `${Number(deliveryReliability.late_rate_percent).toFixed(2)}%`
              : "—"}
          </strong>
        </div>
      </section>
    </>
  );
}

export default Analytics;
