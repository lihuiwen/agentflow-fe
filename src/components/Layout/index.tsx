import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import NavigationDropdown from "./NavigationDropdown";
import { menuCategories } from "../../config/navigation";
import ConnectWallet from "../ConnectWallet";

const Layout: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  return (
    <>
      <Helmet
        htmlAttributes={{
          lang: "zh-CN",
          dir: "ltr",
        }}
        bodyAttributes={{
          class: ''
        }}
      >
        <title>AgentFlow - 智能代理管理平台</title>
        <meta
          name="description"
          content="AgentFlow是一个智能代理管理平台，支持Agent和Job的创建、管理和执行。"
        />
      </Helmet>

      <header className="bg-gray-800 text-white py-4 shadow-md">
        <nav className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold m-0">AgentFlow</h1>
          <ul className="flex list-none m-0 p-0 gap-8">
            <NavigationDropdown
              trigger={
                <span className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">
                  钱包交互列表
                </span>
              }
              categories={menuCategories}
            />
            <li>
              <Link
                to="/"
                className={`text-decoration-none font-medium transition-colors duration-200 hover:text-blue-400 ${
                  isActive("/home") || location.pathname === "/"
                    ? "text-blue-400 font-semibold"
                    : "text-gray-300"
                }`}
              >
                首页
              </Link>
            </li>
            <li>
              <Link
                to="/agents"
                className={`text-decoration-none font-medium transition-colors duration-200 hover:text-blue-400 ${
                  isActive("/agents")
                    ? "text-blue-400 font-semibold"
                    : "text-gray-300"
                }`}
              >
                Agents
              </Link>
            </li>
            <li>
              <Link
                to="/jobs"
                className={`text-decoration-none font-medium transition-colors duration-200 hover:text-blue-400 ${
                  isActive("/jobs")
                    ? "text-blue-400 font-semibold"
                    : "text-gray-300"
                }`}
              >
                Jobs
              </Link>
            </li>
            <li>
              <ConnectWallet />
            </li>
          </ul>
        </nav>
      </header>

      <main style={{ 
        minHeight: 'calc(100vh - 140px)', 
        padding: 0, 
        margin: 0,
        width: '100%'
      }}>
        <Outlet />
      </main>

      <footer className="bg-gray-700 text-gray-300 text-center py-8 mt-auto">
        <p>&copy; 2024 AgentFlow. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Layout;
