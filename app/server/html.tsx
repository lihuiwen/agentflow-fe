interface RenderProps {
  appContent: string;
  linkTags: string;
  scriptTags: string;
  styleTags: string;
  htmlAttributes: string;
  bodyAttributes: string;
  helmetTags: string;
  dehydratedState: string;
  emotionCacheData: string;
}

export default ({
  appContent,
  linkTags,
  styleTags,
  scriptTags,
  htmlAttributes,
  bodyAttributes,
  helmetTags,
  dehydratedState,
  emotionCacheData,
}: RenderProps) =>
  `<!DOCTYPE html>
<html ${htmlAttributes} version="21">
<head>
  ${helmetTags}
  ${linkTags}
  ${styleTags}
</head>
<body ${bodyAttributes}>
  <div id="root">${appContent}</div>
  <script id="__APP_FLAG__" type="application/json">{"isSSR": true}</script>
  <script id="__REACT_QUERY_STATE__" type="application/json">${dehydratedState}</script>
  <script id="__EMOTION_CACHE_STATE__" type="application/json">${emotionCacheData}</script>
  ${scriptTags}
</body>
</html>`;
