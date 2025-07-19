import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { HelmetProvider, FilledContext } from 'react-helmet-async';
import routes from './routes';
import { KoaProvider } from '@app/utils/KoaContext';
import { Context } from 'koa';
import { WagmiProvider } from 'wagmi'

import { config } from './config/wagmi.config';

import 'apis/index';
import 'theme/index.less';
import './index.css';

export const helmetContext = {} as FilledContext;

interface AppProps {
  context?: Context;
}

const App = (props: AppProps) => {
  const renderRoutes = useRoutes(routes);

  return (
    <HelmetProvider context={helmetContext}>
      <KoaProvider value={props?.context}>
        <WagmiProvider config={config}>
          <Suspense>{renderRoutes}</Suspense>
        </WagmiProvider>
      </KoaProvider>
    </HelmetProvider>
  );
};

export default App;
