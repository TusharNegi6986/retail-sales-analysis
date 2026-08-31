import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function DeliveryTrend({ data }) {
  const chartData = data.map((item) => ({
    month: item.month,
    deliveryDays: Number(item.average_delivery_days),
  }));

  return (
    <div className="delivery-chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 15,
            left: 5,
            bottom: 10,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 10 }}
            tickMargin={8}
          />

          <YAxis
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => `${value}d`}
          />

          <Tooltip
            labelFormatter={(value) => `Month: ${value}`}
            formatter={(value) => [
              `${Number(value).toFixed(2)} days`,
              "Avg Delivery",
            ]}
            cursor={{ stroke: "#d1d5db" }}
          />

          <Line
            type="monotone"
            dataKey="deliveryDays"
            name="Avg Delivery"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DeliveryTrend;