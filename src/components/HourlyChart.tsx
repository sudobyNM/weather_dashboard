import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Brush,
  Legend,
} from "recharts";
import { format } from "date-fns";

interface ChartProps {
  data: Record<string, string | number>[];
  xKey: string;
  yKeys: {
    key: string;
    color: string;
    name: string;
    type?: "line" | "area" | "bar";
  }[];
  title: string;
  unit?: string;
  height?: number;
  isHourly?: boolean;
}

export function WeatherChart({
  data,
  xKey,
  yKeys,
  title,
  unit,
  height = 300,
  isHourly = true,
}: ChartProps) {
  const formatXAxis = (tick: string) => {
    try {
      const date = new Date(tick);
      return isHourly ? format(date, "HH:mm") : format(date, "MMM dd");
    } catch {
      return tick;
    }
  };

  const formatTooltip = (
    value: string | number | readonly (string | number)[] | undefined,
    name: string | number | undefined,
  ): [string, string] => [
    `${Array.isArray(value) ? value.join(", ") : (value ?? "")}${unit || ""}`,
    String(name ?? ""),
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm w-full">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        {title}
        {unit && (
          <span className="text-xs font-normal text-gray-600">({unit})</span>
        )}
      </h3>
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            // syncId="weatherCharts"
          >
            <defs>
              {yKeys.map((yk, i) => (
                <linearGradient
                  key={yk.key}
                  id={`gradient-${i}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={yk.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={yk.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey={xKey}
              tickFormatter={formatXAxis}
              tick={{
                fontSize: 10,
                fill: "#9ca3af",
                fontFamily: "JetBrains Mono",
              }}
              axisLine={false}
              tickLine={false}
              minTickGap={30}
            />
            <YAxis
              tick={{
                fontSize: 10,
                fill: "#9ca3af",
                fontFamily: "JetBrains Mono",
              }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                border: "1px solid #f3f4f6",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                fontSize: "12px",
                fontFamily: "JetBrains Mono",
              }}
              formatter={formatTooltip}
              labelFormatter={(label) => {
                const date = new Date(label);
                return isHourly
                  ? format(date, "MMM dd, HH:mm")
                  : format(date, "MMM dd, yyyy");
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: "12px" }}
            />
            {yKeys.map((yk, i) => (
              <Area
                key={yk.key}
                type="monotone"
                dataKey={yk.key}
                name={yk.name}
                stroke={yk.color}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#gradient-${i})`}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
            <Brush
              dataKey={xKey}
              height={30}
              stroke="#3b82f6"
              tickFormatter={formatXAxis}
              fill="#f9fafb"
              travellerWidth={10}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
