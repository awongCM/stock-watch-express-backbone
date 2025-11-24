import React, { createContext, useContext, useState, ReactNode } from "react";

export interface StocksParams {
  stock_id: string;
  is_table: boolean;
  order_by?: string;
  collapse_by?: string;
  start_date?: string;
  end_date?: string;
}

interface StocksParamsContextValue {
  params: StocksParams;
  setParams: (p: Partial<StocksParams>) => void;
}

const StocksParamsContext = createContext<StocksParamsContextValue | undefined>(
  undefined
);

export function StocksParamsProvider({ children }: { children: ReactNode }) {
  const [params, setParamsState] = useState<StocksParams>({
    stock_id: "AAPL",
    is_table: true,
  });
  function setParams(patch: Partial<StocksParams>) {
    setParamsState((prev) => ({ ...prev, ...patch }));
  }
  return (
    <StocksParamsContext.Provider value={{ params, setParams }}>
      {children}
    </StocksParamsContext.Provider>
  );
}

export function useStocksParams() {
  const ctx = useContext(StocksParamsContext);
  if (!ctx)
    throw new Error("useStocksParams must be used within StocksParamsProvider");
  return ctx;
}
