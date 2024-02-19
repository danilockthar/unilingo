import type { AppProps } from "next/app";
import "../public/globals.css";
import { Inter } from "next/font/google";
import { QueryClient, QueryClientProvider } from "react-query";

const inter = Inter({ subsets: ["latin"] });
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
