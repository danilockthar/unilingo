import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { inter } from "../utils/fonts";
import "../public/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <main className={inter.className}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />;
      </QueryClientProvider>
    </main>
  );
}
