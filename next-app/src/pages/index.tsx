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
        <title>US Stock Market Watch</title>
        <meta
          name="description"
          content="View historical stock prices and charts for major tech stocks including Apple, Google, Microsoft, Amazon, and more."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <section className="section section-heading">
        <div className="container">
          <h1 className="title is-1">US Stock Market Watch</h1>
        </div>
      </section>
      <section className="section">
        <StockForm onSubmit={(p) => setParams(p)} />
      </section>
      <section className="section section-table">
        <div className="container table-container" id="table-container">
          {params.is_table && <StockTable data={data} loading={isLoading} />}
        </div>
        <div className="container graph-container" id="graph-container">
          {params.is_graph && <StockGraph data={data} />}
        </div>
      </section>
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
