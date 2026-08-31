import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function MonthlyPerformance({ data }) {
  const chartData = data.map((item) => ({
    month: item.month,
    revenue: Number(item.revenue),
    orders: Number(item.orders),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 10,
          right: 20,
          left: 10,
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
          yAxisId="revenue"
          tick={{ fontSize: 10 }}
          tickFormatter={(value) =>
            `R$ ${(value / 1000000).toFixed(1)}M`
          }
        />

        <YAxis
          yAxisId="orders"
          orientation="right"
          tick={{ fontSize: 10 }}
          tickFormatter={(value) =>
            `${(value / 1000).toFixed(0)}K`
          }
        />

        <Tooltip
          labelFormatter={(value) => `Month: ${value}`}
          formatter={(value, name) => {
            if (name === "Revenue") {
              return [
                `R$ ${Number(value).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
                "Revenue",
              ];
            }

            return [
              Number(value).toLocaleString("en-IN"),
              "Orders",
            ];
          }}
        />

        <Legend />

        <Line
          yAxisId="revenue"
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />

        <Line
          yAxisId="orders"
          type="monotone"
          dataKey="orders"
          name="Orders"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default MonthlyPerformance;