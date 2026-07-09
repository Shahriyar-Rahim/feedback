import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const formatDate = (d) => {
  const date = new Date(d);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const { avgRating, count } = payload[0].payload;
  return (
    <div className="bg-plum-900 text-paper text-xs rounded-lg px-3 py-2 shadow-lg">
      <div className="font-medium mb-0.5">{formatDate(label)}</div>
      <div>{avgRating.toFixed(1)}★ avg · {count} response{count !== 1 ? "s" : ""}</div>
    </div>
  );
};

// Line chart of average daily rating over time. Renders an empty-state
// message rather than a blank chart when there isn't enough data yet.
const RatingTrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-ink/40">
        Not enough responses yet to show a trend.
      </div>
    );
  }

  // if (data.length === 1) {
  //   return (
  //     <div className="h-64 flex items-center justify-center text-sm text-ink/40">
  //       Only one day of data so far — the trend line will appear once responses span multiple days.
  //     </div>
  //   );
  // }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E6DECE" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fill: "#8B85A3", fontSize: 11 }}
            axisLine={{ stroke: "#E6DECE" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            tick={{ fill: "#8B85A3", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="avgRating"
            stroke="#E7A33E"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#E7A33E", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RatingTrendChart;
