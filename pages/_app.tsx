import React from "react";
import "../styles/tailwind.css";
import Theme from "../styles/Theme";
import { bodyFont } from "../styles/font";
// @ts-ignore
import { bscTestnet } from "wagmi/chains";
import { ThemeProvider } from "@wigxel/react-components";
import { publicProvider } from "wagmi/providers/public";
import { WagmiConfig, createConfig, configureChains } from "wagmi";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [bscTestnet],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig config={config}>
      <main className={`${bodyFont.variable} font-body`}>
        <ThemeProvider theme={Theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </main>
    </WagmiConfig>
  );
}
