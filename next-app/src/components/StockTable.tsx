import React from "react";

interface Props {
  data?: {
    title: string;
    column_names: string[];
    stocks: (number | string)[][];
  };
  loading: boolean;
}

export const StockTable: React.FC<Props> = ({ data, loading }) => {
  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data.</p>;
  return (
    <div>
      <h3>{data.title}</h3>
      <table>
        <thead>
          <tr>
            {data.column_names.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.stocks.slice(0, 50).map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
