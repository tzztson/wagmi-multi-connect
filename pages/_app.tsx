import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createClient, WagmiConfig } from "wagmi";
import { connectors, provider } from "./wagmi";

export default function App({ Component, pageProps }: AppProps) {
  const client = createClient({
    autoConnect: true,
    connectors: connectors,
    provider,
  });
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
}
