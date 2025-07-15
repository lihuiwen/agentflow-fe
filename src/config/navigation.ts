// 定义菜单项类型
export interface MenuItem {
  title: string;
  href: string;
  description?: string;
  icon?: string;
}

// 定义菜单分类类型
export interface MenuCategory {
  title: string;
  items: MenuItem[];
}

// 导航菜单配置
export const menuCategories: MenuCategory[] = [
  {
    title: "原生交互",
    items: [
      {
        title: "原生以太坊交互",
        description: "使用原生 JavaScript 与以太坊交互",
        href: "/native-ethereum",
        icon: "🔗",
      },
      {
        title: "原生以太坊交互 (JS)",
        description: "使用原生 JavaScript 实现，更易理解",
        href: "/native-ethereum-js",
        icon: "⚡",
      },
    ],
  },
  {
    title: "Web3 库",
    items: [
      {
        title: "Ethers.js",
        href: "/ethers-js",
        description: "使用 Ethers.js 库",
      },
      {
        title: "Web3.js",
        href: "/web3-js",
        description: "使用 Web3.js 库",
      },
    ],
  },
  {
    title: "基础库",
    items: [
      {
        title: "Web3-React",
        href: "/web3-react",
        description: "使用 Web3-React 库",
      },
      {
        title: "Viem",
        href: "/viem",
        description: "使用 Viem 库",
      },
    ],
  },
  {
    title: "高级库",
    items: [
      {
        title: "Wagmi",
        href: "/wagmi",
        description: "使用 Wagmi 库",
      },
      {
        title: "Web3Modal",
        href: "/Web3Modal",
        description: "使用 Web3Modal 库",
      },
      {
        title: "Web3-Onboard",
        href: "/Web3-Onboard",
        description: "使用 Web3-Onboard 库",
      },
    ],
  },
  {
    title: "钱包连接库",
    items: [
      {
        title: "ConnectKit",
        href: "/ConnectKit",
        description: "使用 ConnectKit 库",
      },
      {
        title: "RainbowKit",
        href: "/rainbowkit",
        description: "使用 RainbowKit 库",
      },
      {
        title: "Dynamic",
        href: "/Dynamic",
        description: "使用 Dynamic 库",
      },
      {
        title: "Privy",
        href: "/Privy",
        description: "使用 Privy 库",
      },
    ],
  },
];
