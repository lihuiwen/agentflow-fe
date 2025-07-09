import { Context } from "koa";
import { matchRoutes } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import {
  dehydrate,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { CacheProvider } from '@emotion/react';
import { EmotionCache } from '@emotion/cache';
import App from "index";
import routes from "routes";

export default async (ctx: Context, emotionCache: EmotionCache) => {
  const queryClient = new QueryClient();
  const prefetchRoutes = matchRoutes(routes, ctx.req.url);

  if (prefetchRoutes) {
    const promiseRoutes = prefetchRoutes
      .map(({ route, params }) => {
        if (route?.queryKey && route?.loadData) {
          return queryClient.prefetchQuery(route?.queryKey, () =>
            route?.loadData(params)
          );
        }
      })
      .filter((i) => i);

    await Promise.all(promiseRoutes);
  }

  const dehydratedState = dehydrate(queryClient);
  ctx.dehydratedState = dehydratedState;
  ctx.queryClient = queryClient;

  const appElement = (
    <StaticRouter location={ctx.req.url}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={dehydratedState}>
          <App context={ctx} />
        </Hydrate>
      </QueryClientProvider>
    </StaticRouter>
  );

  // 如果提供了emotionCache，则包裹CacheProvider
  if (emotionCache) {
    return (
      <CacheProvider value={emotionCache}>
        {appElement}
      </CacheProvider>
    );
  }

  return appElement;
};
