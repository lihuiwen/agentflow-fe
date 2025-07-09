import path from "node:path";
import Koa from "koa";
import Router from "@koa/router";
import { ChunkExtractor } from "@loadable/server";
import createEmotionServer from "@emotion/server/create-instance";
import { ServerStyleSheet } from "styled-components";
import { helmetTagNameList, TempThemeMap } from "@app/utils/constants";
import { helmetContext } from "index";
import renderApp from "./app";
import renderToStream from "./stream";
import renderHtml from "./html";
import {
  renderToString,
  renderToReadableStream,
  renderToPipeableStream,
} from "react-dom/server";
import createEmotionCache from "@app/utils/emotionCache";

const app = new Koa();
export const router = new Router();

const statsFile = path.resolve(__dirname, "./loadable-stats.json");

router.get("(.*)", async (ctx: Koa.Context) => {
  const extractor = new ChunkExtractor({
    statsFile,
    entrypoints: ["client"],
  });
  const SCSheet = new ServerStyleSheet();

  // 创建emotion cache和server实例
  const emotionCache = createEmotionCache();
  const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(emotionCache);

  const jsx = SCSheet.collectStyles(
    extractor.collectChunks(await renderApp(ctx, emotionCache))
  );
  let appContent = "";
  let emotionStyleTags = "";
  let emotionCacheDataString = "";
  try {
    appContent = await renderToStream(jsx); // 渲染出应用的html字符串

    // 提取emotion样式
    const emotionChunks = extractCriticalToChunks(appContent);
    emotionStyleTags = constructStyleTagsFromChunks(emotionChunks);
    
    // 序列化emotion缓存状态 - 只保存已插入的样式ID
    const emotionCacheData = JSON.stringify({
      ids: Object.keys(emotionCache.inserted),
      key: emotionCache.key
    });
    
    emotionCacheDataString = emotionCacheData;
  } catch (error) {
    console.error(error);
  }
  const { dehydratedState } = ctx;
  const { helmet } = helmetContext;
  const helmetTags = helmetTagNameList
    .map((tagName) => helmet[tagName].toString())
    .join("");

  ctx.body = renderHtml({
    appContent,
    dehydratedState: JSON.stringify(dehydratedState),
    linkTags: extractor.getLinkTags(),
    scriptTags: extractor.getScriptTags(),
    styleTags: [extractor.getStyleTags(), SCSheet.getStyleTags(), emotionStyleTags].join(""),
    helmetTags,
    htmlAttributes: helmet.htmlAttributes.toString(),
    bodyAttributes: helmet.bodyAttributes.toString(),
    emotionCacheData: emotionCacheDataString
  });
  SCSheet.seal();
  ctx.queryClient?.clear();
});

export default app;
