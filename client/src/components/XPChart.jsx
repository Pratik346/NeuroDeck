import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Area,
  } from "recharts";
  
  const XPChart = ({ data = [] }) => {
    return (
      <div
        style={{
          width: "100%",
          height: "300px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "16px",
          padding: "16px",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h3 style={{ color: "white", marginBottom: "10px" }}>
          📈 XP Progress (Last 30 Days)
        </h3>
  
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            
            {/* GRID */}
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
  
            {/* X AXIS */}
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })
              }
            />
  
            {/* Y AXIS (🔥 FIXED DYNAMIC SCALING) */}
            <YAxis
              stroke="#9ca3af"
              domain={[0, (dataMax) => Math.max(200, dataMax + 50)]}
            />
  
            {/* TOOLTIP */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "10px",
                color: "white",
              }}
              formatter={(value) => [`${value} XP`, "XP"]}
              labelFormatter={(label) =>
                new Date(label).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                })
              }
            />
  
            {/* GRADIENT AREA */}
            <defs>
              <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
  
            {/* AREA (glow effect) */}
            <Area
              type="monotone"
              dataKey="xp"
              stroke="none"
              fill="url(#xpGradient)"
            />
  
            {/* LINE */}
            <Line
              type="monotone"
              dataKey="xp"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  export default XPChart;