import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface Props {
  data?: { title: string; stocks: (number | string)[][] };
}

export const StockGraph: React.FC<Props> = ({ data }) => {
  const [showOpen, setShowOpen] = useState(true);
  const [showClose, setShowClose] = useState(true);

  const graphData = useMemo(() => {
    if (!data?.stocks) return [];
    return data.stocks.map((row) => ({
      date: String(row[0]).slice(0, 10),
      open: Number(row[1]),
      close: Number(row[4]),
    }));
  }, [data]);

  if (!graphData.length) return <p>No graph data.</p>;

  return (
    <div>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
        <label style={{ fontSize: "0.8rem" }}>
          <input
            type="checkbox"
            checked={showOpen}
            onChange={() => setShowOpen((o) => !o)}
          />{" "}
          Open
        </label>
        <label style={{ fontSize: "0.8rem" }}>
          <input
            type="checkbox"
            checked={showClose}
            onChange={() => setShowClose((c) => !c)}
          />{" "}
          Close
        </label>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={graphData}
          margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
        >
          <XAxis dataKey="date" tickFormatter={(d) => d} minTickGap={20} />
          <YAxis />
          <Tooltip />
          <Legend />
          {showClose && (
            <Line
              type="monotone"
              dataKey="close"
              stroke="#1f6feb"
              dot={false}
              name="Close"
            />
          )}
          {showOpen && (
            <Line
              type="monotone"
              dataKey="open"
              stroke="#d93025"
              dot={false}
              name="Open"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
