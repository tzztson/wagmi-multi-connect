import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";

import { publicProvider } from "wagmi/providers/public";
import { configureChains } from "wagmi";
import { mainnet, bsc } from "wagmi/chains";

export const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, bsc],
  [publicProvider()]
);

export const connectors = [
  new MetaMaskConnector({ chains, options: { shimDisconnect: true } }),
  new CoinbaseWalletConnector({
    chains,
    options: {
      appName: "wagmi",
    },
  }),
  new WalletConnectConnector({
    chains,
    options: {
      qrcode: true,
    },
  }),
];
