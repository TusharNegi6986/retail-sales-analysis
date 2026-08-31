import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CategoryPerformance({ data }) {
  const chartData = data.slice(0, 10).map((item) => ({
    category: item.category,
    revenue: Number(item.revenue),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{
          top: 5,
          right: 15,
          left: 10,
          bottom: 5,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false}
        />

        <XAxis
          type="number"
          tick={{ fontSize: 10 }}
          tickFormatter={(value) =>
            `R$ ${(value / 1000000).toFixed(1)}M`
          }
        />

        <YAxis
          type="category"
          dataKey="category"
          width={125}
          tick={{ fontSize: 9 }}
        />

        <Tooltip
          formatter={(value) => [
            `R$ ${Number(value).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            "Revenue",
          ]}
          cursor={{ fill: "#f4f6f8" }}
        />

        <Bar
          dataKey="revenue"
          name="Revenue"
          radius={[0, 5, 5, 0]}
          barSize={17}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default CategoryPerformance;