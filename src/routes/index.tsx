import loadable from "@app/utils/loadable";
import Layout from "@components/Layout";
import { PreFetchRouteObject } from "@app/utils/routesTypes";
import { PrefetchKeys } from "@apis/queryKeys";
import HomeService from "@apis/services/Home";
import RequestDemoService from "@apis/services/RequestDemo";
import RequestDemoPage from "@pages/RequestDemo";
import JobService from "@apis/services/Job";
import CategoryService from "@apis/services/Category";

// 懒加载页面组件
const Home = loadable(/* #__LOADABLE__ */ () => import("@pages/Home"), null);

// Agent相关页面
const Agents = loadable(/* #__LOADABLE__ */ () => import("@pages/Agents"), null);
const AgentDetail = loadable(/* #__LOADABLE__ */ () => import("@pages/Agents/AgentDetail"), null);
const AgentForm = loadable(/* #__LOADABLE__ */ () => import("@pages/Agents/AgentForm"), null);

// Job相关页面  
const Jobs = loadable(/* #__LOADABLE__ */ () => import("@/pages/Jobs/ListPage"), null);
const JobDetail = loadable(/* #__LOADABLE__ */ () => import("@pages/Jobs/DetailPage/JobDetail"), null);
const JobForm = loadable(/* #__LOADABLE__ */ () => import("@pages/Jobs/CreatePage/JobForm"), null);

// Emotion缓存测试页面
const EmotionCacheTest = loadable(/* #__LOADABLE__ */ () => import("@pages/EmotionCacheTestPage/EmotionCacheTestPage"), null);

// 404页面
const NotFound = () => (
  <div style={{ textAlign: "center", padding: "2rem" }}>
    <h1>404 - 页面未找到</h1>
    <p>抱歉，您访问的页面不存在。</p>
    <a href="/" style={{ color: "#3b82f6" }}>
      返回首页
    </a>
  </div>
);

import { menuCategories } from "../config/navigation";
// 静态导入所有组件
const NativeEthereum = loadable(
  () => import("@pages/Wallets/native-ethereum/page"),
  null
);
const NativeEthereumJs = loadable(
  () => import("@/pages/Wallets/native-ethereum-js/page"),
  null
);
const EthersJs = loadable(() => import("@pages/Wallets/ethers-js/page"), null);
// ... 其他组件

// 创建路径到组件的映射
const componentMap: Record<string, React.ComponentType> = {
  "native-ethereum": NativeEthereum,
  "native-ethereum-js": NativeEthereumJs,
  "ethers-js": EthersJs,
  // ... 其他映射
};

// 从 navigation 配置生成路由
export const web3Routes = menuCategories.flatMap((category) =>
  category.items.map((item) => {
    const path = item.href.slice(1);
    const Component = componentMap[path];

    return {
      path,
      element: Component ? <Component /> : <div>页面开发中...</div>,
    };
  })
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
        queryKey: [PrefetchKeys.HOME],
        loadData: HomeService.getList,
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
            queryKey: [PrefetchKeys.JOBS],
            loadData: () => JobService.getJobs({ page: 1, limit: 12 }),
          },
          {
            path: "new",
            element: <JobForm />,
            queryKey: [PrefetchKeys.CATEGORIES],
            loadData: () => CategoryService.getCategories(),
          },
          {
            path: ":id",
            element: <JobDetail />,
            queryKey: [PrefetchKeys.JOB_DETAIL],
            loadData: ({ params, id }) => {
              return JobService.getJobById(id);
            },
          },
          {
            path: ":id/edit",
            element: <JobForm />,
            queryKey: [PrefetchKeys.JOB_DETAIL, PrefetchKeys.CATEGORIES],
            loadData: async ({ params }) => {
              if (!params || !params.id) {
                throw new Error('Job ID is required');
              }
              const [jobData, categories] = await Promise.all([
                JobService.getJobById(params.id),
                CategoryService.getCategories()
              ]);
              return { jobData, categories };
            },
          },
        ],
      },

      // 其他页面
      {
        path: "about",
        element: (
          <div style={{ padding: "2rem" }}>
            <h1>关于 AgentFlow</h1>
            <p>AgentFlow 是一个智能代理管理平台 - 待完善</p>
          </div>
        ),
      },

       // Emotion缓存测试页面
      {
        path: "emotion-cache-test",
        element: <EmotionCacheTest />,
      },
      
       // RequestDemo测试页面
      {
        path: "request-demo",
        element: <RequestDemoPage />,
        queryKey: [PrefetchKeys.REQUEST_DEMO],
        loadData: RequestDemoService.getList,
      },
      ...web3Routes,

      // 404页面 - 放在最后
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export default routes;
