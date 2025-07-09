import loadable from "@app/utils/loadable";
import Layout from "components/Layout";
import { PreFetchRouteObject } from "@app/utils/routesTypes";

// 懒加载页面组件
const Home = loadable(/* #__LOADABLE__ */ () => import("pages/Home"), null);

// Agent相关页面
const Agents = loadable(/* #__LOADABLE__ */ () => import("pages/Agents"), null);
const AgentDetail = loadable(/* #__LOADABLE__ */ () => import("pages/Agents/AgentDetail"), null);
const AgentForm = loadable(/* #__LOADABLE__ */ () => import("pages/Agents/AgentForm"), null);

// Job相关页面  
const Jobs = loadable(/* #__LOADABLE__ */ () => import("pages/Jobs"), null);
const JobDetail = loadable(/* #__LOADABLE__ */ () => import("pages/Jobs/JobDetail"), null);
const JobForm = loadable(/* #__LOADABLE__ */ () => import("pages/Jobs/JobForm"), null);

// Emotion缓存测试页面
const EmotionCacheTest = loadable(/* #__LOADABLE__ */ () => import("pages/EmotionCacheTestPage/EmotionCacheTestPage"), null);

// 404页面
const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <h1>404 - 页面未找到</h1>
    <p>抱歉，您访问的页面不存在。</p>
    <a href="/" style={{ color: '#3b82f6' }}>返回首页</a>
  </div>
);

const routes: PreFetchRouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      // 首页
      {
        index: true,
        element: <Home />,
      },
      
      // Agent管理模块
      {
        path: "agents",
        children: [
          {
            index: true,
            element: <Agents />,
          },
          {
            path: "new",
            element: <AgentForm />,
          },
          {
            path: ":id",
            element: (
              <AgentDetail
                open={true}
                onClose={() => {}}
                agent={null}
              />
            ),
          },
          {
            path: ":id/edit",
            element: <AgentForm />,
          },
        ],
      },
      
      // Job管理模块
      {
        path: "jobs",
        children: [
          {
            index: true,
            element: <Jobs />,
          },
          {
            path: "new",
            element: <JobForm />,
          },
          {
            path: ":id",
            element: <JobDetail />,
          },
          {
            path: ":id/edit",
            element: <JobForm />,
          },
        ],
      },
      
      // 其他页面
      {
        path: "about",
        element: <div style={{ padding: '2rem' }}>
          <h1>关于 AgentFlow</h1>
          <p>AgentFlow 是一个智能代理管理平台 - 待完善</p>
        </div>,
      },

       // Emotion缓存测试页面
      {
        path: "emotion-cache-test",
        element: <EmotionCacheTest />,
      },
      
      // 404页面 - 放在最后
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export default routes;
