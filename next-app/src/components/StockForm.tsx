import React, { useState } from "react";
import { useAvailableStocks } from "../hooks/useAvailableStocks";

interface Props {
  onSubmit: (params: { stock_id: string; is_table: boolean }) => void;
}

export const StockForm: React.FC<Props> = ({ onSubmit }) => {
  const { data } = useAvailableStocks();
  const [stockId, setStockId] = useState("AAPL");
  const [showTable, setShowTable] = useState(true);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ stock_id: stockId, is_table: showTable });
      }}
      style={{ display: "flex", gap: "1rem", alignItems: "center" }}
    >
      <label>
        Stock:
        <select value={stockId} onChange={(e) => setStockId(e.target.value)}>
          {data?.available_stocks?.map((s: any) => (
            <option key={s.id} value={s.id}>
              {s.id} - {s.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Show Table
        <input
          type="checkbox"
          checked={showTable}
          onChange={(e) => setShowTable(e.target.checked)}
        />
      </label>
      <button type="submit">Fetch</button>
    </form>
  );
};
