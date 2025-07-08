import { hydrateRoot, createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { loadableReady } from "@loadable/component";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { CssBaseline, ThemeProvider } from '@mui/material';
import createEmotionCache from './createEmotionCache';
import { CacheProvider } from '@emotion/react';
import App from "index";

interface TradeFlagType {
  isSSR: boolean;
}


// 和服务端共享 emotion cache
const emotionCache = createEmotionCache();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const dehydratedState = document.querySelector(
  "#__REACT_QUERY_STATE__"
)?.textContent;

const tradeFlag: TradeFlagType = JSON.parse(
  document.querySelector("#__APP_FLAG__")?.textContent
);

const ClientApp = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Hydrate state={JSON.parse(dehydratedState)}>
        <CacheProvider value={emotionCache}>
          {/* <ThemeProvider> */}
            <CssBaseline />
            <App />
          {/* </ThemeProvider> */}
        </CacheProvider>
      </Hydrate>
    </QueryClientProvider>
  </BrowserRouter>
);

const root = document.querySelector("#root");

tradeFlag.isSSR
  ? loadableReady(() => {
      hydrateRoot(root, <ClientApp />);
    })
  : createRoot(root).render(<ClientApp />);
