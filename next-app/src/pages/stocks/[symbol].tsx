import { dehydrate } from "@tanstack/react-query";
import { createQueryClient } from "../../lib/queryClient";
import { fetchQuandlJSON } from "../../lib/quandl";
import { getStocksList } from "../../lib/config";
import Head from "next/head";

interface StockPageProps {
  symbol: string;
  title: string;
  dehydratedState: any;
}

// Static page for individual stock (ISR with 1 hour revalidation)
export default function StockPage({ symbol, title }: StockPageProps) {
  return (
    <>
      <Head>
        <title>{title} - Stock Watch</title>
        <meta
          name="description"
          content={`Historical price data and charts for ${title}`}
        />
      </Head>
      <main style={{ padding: "2rem" }}>
        <h1>{title}</h1>
        <p>Stock symbol: {symbol}</p>
        <p>
          This is a statically generated page with ISR (revalidates every hour).
        </p>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const stocks = getStocksList();
  const paths = stocks.map((s) => ({ params: { symbol: s.id } }));
  return {
    paths,
    fallback: "blocking", // Generate other symbols on-demand
  };
}

export async function getStaticProps({
  params,
}: {
  params: { symbol: string };
}) {
  const symbol = params?.symbol as string;
  const queryClient = createQueryClient();

  try {
    const data = await fetchQuandlJSON({ stock_id: symbol });
    await queryClient.prefetchQuery({
      queryKey: ["stocks", { stock_id: symbol, is_table: true }],
      queryFn: () =>
        Promise.resolve({
          title: data.dataset.name,
          column_names: data.dataset.column_names,
          stocks: data.dataset.data,
        }),
    });

    return {
      props: {
        symbol,
        title: data.dataset.name,
        dehydratedState: dehydrate(queryClient),
      },
      revalidate: 3600, // Revalidate every hour (ISR)
    };
  } catch (error) {
    console.error(`[ISR] Failed to fetch data for ${symbol}:`, error);
    return {
      notFound: true,
    };
  }
}
