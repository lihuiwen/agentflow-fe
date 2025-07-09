import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { HelmetProvider, FilledContext } from 'react-helmet-async';
import routes from './routes';
import { KoaProvider } from '@app/utils/KoaContext';
import { Context } from 'koa';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { muiTheme } from './theme/material-ui';
import createEmotionCache from './theme/emotionCache';
import { CacheProvider } from '@emotion/react';
import 'apis/index';
import 'theme/index.less';
import './index.css';

export const helmetContext = {} as FilledContext;

interface AppProps {
  context?: Context;
}

// 和服务端共享 emotion cache
const emotionCache = createEmotionCache();

const App = (props: AppProps) => {
  const renderRoutes = useRoutes(routes);

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <HelmetProvider context={helmetContext}>
          <KoaProvider value={props?.context}>
            <Suspense>{renderRoutes}</Suspense>
          </KoaProvider>
        </HelmetProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
