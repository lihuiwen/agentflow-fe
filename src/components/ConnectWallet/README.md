# ConnectWallet 组件使用说明

这是一个功能完整的 Web3 钱包连接组件，支持多种钱包类型和网络。

## 📦 功能特性

- ✅ 支持多种钱包（MetaMask、WalletConnect、Coinbase Wallet）
- ✅ 自动连接和断开连接
- ✅ 网络切换功能
- ✅ 余额显示
- ✅ 账户变化监听
- ✅ 错误处理和用户友好的提示
- ✅ 响应式设计
- ✅ TypeScript 支持

## 🔧 使用方法

### 基础使用

```tsx
import ConnectWallet from "components/ConnectWallet";

function App() {
  return (
    <div>
      <ConnectWallet />
    </div>
  );
}
```

### 高级配置

```tsx
import ConnectWallet from "components/ConnectWallet";

function App() {
  const handleConnect = (account: string, chainId: number) => {
    console.log("钱包已连接:", account, chainId);
  };

  const handleDisconnect = () => {
    console.log("钱包已断开");
  };

  const handleError = (error: Error) => {
    console.error("钱包连接错误:", error);
  };

  return (
    <div>
      <ConnectWallet
        size="large"
        type="primary"
        supportedWallets={["metamask", "coinbase"]}
        requiredChainId={1} // 主网
        showBalance={true}
        showDisconnect={true}
        autoConnect={true}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onError={handleError}
      />
    </div>
  );
}
```

## 🎨 Props 属性

| 属性               | 类型                                         | 默认值                                      | 描述             |
| ------------------ | -------------------------------------------- | ------------------------------------------- | ---------------- |
| `size`             | `'small' \| 'middle' \| 'large'`             | `'middle'`                                  | 按钮大小         |
| `type`             | `'primary' \| 'default'`                     | `'primary'`                                 | 按钮类型         |
| `className`        | `string`                                     | `''`                                        | 自定义样式类名   |
| `supportedWallets` | `WalletType[]`                               | `['metamask', 'walletconnect', 'coinbase']` | 支持的钱包类型   |
| `requiredChainId`  | `number`                                     | `undefined`                                 | 要求的链 ID      |
| `showBalance`      | `boolean`                                    | `true`                                      | 是否显示余额     |
| `showDisconnect`   | `boolean`                                    | `true`                                      | 是否显示断开按钮 |
| `autoConnect`      | `boolean`                                    | `true`                                      | 是否自动连接     |
| `onConnect`        | `(account: string, chainId: number) => void` | `undefined`                                 | 连接成功回调     |
| `onDisconnect`     | `() => void`                                 | `undefined`                                 | 断开连接回调     |
| `onChainChanged`   | `(chainId: number) => void`                  | `undefined`                                 | 链变化回调       |
| `onAccountChanged` | `(account: string) => void`                  | `undefined`                                 | 账户变化回调     |
| `onError`          | `(error: Error) => void`                     | `undefined`                                 | 错误处理回调     |

## 🎯 支持的钱包类型

- `'metamask'` - MetaMask 钱包
- `'walletconnect'` - WalletConnect 协议（开发中）
- `'coinbase'` - Coinbase Wallet（开发中）
- `'injected'` - 通用注入钱包

## 🌐 支持的网络

- Ethereum Mainnet (1)
- Goerli Testnet (5)
- Sepolia Testnet (11155111)
- Polygon (137)
- BSC (56)
- Arbitrum (42161)
- Optimism (10)

## 📱 组件状态

### 未连接状态

- 显示"连接钱包"按钮
- 点击后弹出钱包选择弹窗

### 连接中状态

- 显示"连接中..."按钮
- 按钮处于加载状态

### 已连接状态

- 显示账户信息（地址、余额、网络）
- 显示断开连接按钮（如果启用）

## 🔧 扩展功能

### 添加新钱包类型

```tsx
// 在 ConnectWallet 组件中添加新的连接器
const connectNewWallet = async (): Promise<ethers.BrowserProvider> => {
  // 实现新钱包的连接逻辑
  throw new Error("新钱包集成开发中");
};
```

### 添加新网络

```tsx
// 在 SUPPORTED_CHAINS 中添加新网络
const SUPPORTED_CHAINS = {
  // 现有网络...
  8453: "Base", // 添加新网络
};
```

## 🐛 错误处理

组件内置了完善的错误处理机制：

- 钱包未安装检测
- 网络切换失败处理
- 连接超时处理
- 用户拒绝连接处理

## 💡 使用建议

1. **在应用最外层使用**：建议在应用的最外层组件中使用，以便全局管理钱包状态
2. **配合状态管理**：可以配合 Redux、Zustand 等状态管理库使用
3. **响应式设计**：组件已经适配了移动端，可以在不同设备上使用
4. **错误边界**：建议包装在 ErrorBoundary 中使用

## 📝 注意事项

- 确保用户已经安装了对应的钱包插件
- 在服务端渲染环境中，window.ethereum 可能不存在
- 建议在 useEffect 中处理钱包相关逻辑

## 🔄 更新日志

- v1.0.0 - 初始版本，支持 MetaMask 连接
- 计划中 - 添加 WalletConnect 和 Coinbase Wallet 支持
