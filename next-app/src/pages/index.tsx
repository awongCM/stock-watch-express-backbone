import React from "react";
import {
  QueryClientProvider,
  dehydrate,
  DehydratedState,
} from "@tanstack/react-query";
import { StockForm } from "../components/StockForm";
import { StockTable } from "../components/StockTable";
import { StockGraph } from "../components/StockGraph";
import { useStocks } from "../hooks/useStocks";
import {
  StocksParamsProvider,
  useStocksParams,
} from "../context/StocksParamsContext";
import { createQueryClient } from "../lib/queryClient";
import { fetchQuandlJSON } from "../lib/quandl";
import Head from "next/head";

const qc = createQueryClient();
function PageInner() {
  const { params, setParams } = useStocksParams();
  const { data, isLoading } = useStocks(params);
  return (
    <>
      <Head>
        <title>Stock Watch - Historical Stock Data Visualization</title>
        <meta
          name="description"
          content="View historical stock prices and charts for major tech stocks including Apple, Google, Microsoft, Amazon, and more."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{ padding: "1rem", fontFamily: "sans-serif" }}>
        <h1>Stock Watch (Next.js Migration)</h1>
        <StockForm onSubmit={(p) => setParams(p)} />
        <section style={{ marginTop: "2rem" }}>
          <StockTable
            data={params.is_table ? data : undefined}
            loading={isLoading}
          />
        </section>
        <section style={{ marginTop: "2rem" }}>
          <StockGraph data={data} />
        </section>
      </main>
    </>
  );
}

interface HomePageProps {
  dehydratedState: DehydratedState;
}

export default function HomePage({ dehydratedState }: HomePageProps) {
  return (
    <QueryClientProvider client={qc}>
      <StocksParamsProvider>
        <PageInner />
      </StocksParamsProvider>
    </QueryClientProvider>
  );
}

export async function getServerSideProps() {
  const queryClient = createQueryClient();

  // Prefetch default stock data (AAPL) for initial render
  const defaultParams = { stock_id: "AAPL", is_table: true };

  try {
    const data = await fetchQuandlJSON(defaultParams);
    await queryClient.prefetchQuery({
      queryKey: ["stocks", defaultParams],
      queryFn: () =>
        Promise.resolve({
          title: data.dataset.name,
          column_names: data.dataset.column_names,
          stocks: data.dataset.data,
        }),
    });
  } catch (error) {
    console.error("[SSR] Failed to prefetch default stock data:", error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
