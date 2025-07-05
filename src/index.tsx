import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { HelmetProvider, FilledContext } from "react-helmet-async";
import routes from "./routes";
import { KoaProvider } from "@app/utils/KoaContext";
import { Context } from "koa";
import "apis/index";
import "theme/index.less";
import "./index.css";

export const helmetContext = {} as FilledContext;

interface AppProps {
  context?: Context;
}

const App = (props: AppProps) => {
  const renderRoutes = useRoutes(routes);
  // console.log("renderRoutes", renderRoutes);

  return (
    <HelmetProvider context={helmetContext}>
      <KoaProvider value={props?.context}>
        <Suspense>{renderRoutes}</Suspense>
      </KoaProvider>
    </HelmetProvider>
  );
};

export default App;
