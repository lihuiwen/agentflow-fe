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

const app = new Koa();
export const router = new Router();

const statsFile = path.resolve(__dirname, "./loadable-stats.json");

router.get("(.*)", async (ctx: Koa.Context) => {
  const extractor = new ChunkExtractor({
    statsFile,
    entrypoints: ["client"],
  });
  const SCSheet = new ServerStyleSheet();
  const jsx = SCSheet.collectStyles(
    extractor.collectChunks(await renderApp(ctx))
  );
  let appContent = "";
  try {
    appContent = await renderToStream(jsx); // 渲染出应用的html字符串
  } catch (error) {
    console.error(error);
  }
  const { dehydratedState } = ctx;
  const { helmet } = helmetContext;
  const helmetTags = helmetTagNameList
    .map((tagName) => helmet[tagName].toString())
    .join("");

    // 提取emotion样式 - 确保emotionCache存在
    let emotionStyleTags = "";
    if (ctx.emotionCache) {
      try {
        const emotionServer = createEmotionServer(ctx.emotionCache);
        const emotionStyles = emotionServer.extractCriticalToChunks(appContent);
        emotionStyleTags = emotionServer.constructStyleTagsFromChunks(emotionStyles);
      } catch (error) {
        console.error("Emotion server rendering error:", error);
      }
    }

  ctx.body = renderHtml({
    appContent,
    dehydratedState: JSON.stringify(dehydratedState),
    linkTags: extractor.getLinkTags(),
    scriptTags: extractor.getScriptTags(),
    styleTags: [extractor.getStyleTags(), SCSheet.getStyleTags(), emotionStyleTags].join(""),
    helmetTags,
    htmlAttributes: helmet.htmlAttributes.toString(),
    bodyAttributes: helmet.bodyAttributes.toString(),
  });
  SCSheet.seal();
  ctx.queryClient?.clear();
});

export default app;
