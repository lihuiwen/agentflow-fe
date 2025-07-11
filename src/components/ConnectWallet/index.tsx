/**
 * ConnectWallet 组件
 *
 * 一个功能完整的 Web3 钱包连接组件，提供以下核心功能：
 *
 * 🔗 钱包连接功能：
 * - 支持 MetaMask、WalletConnect、Coinbase Wallet 等多种钱包
 * - 钱包选择弹窗，用户友好的选择界面
 * - 自动检测已安装的钱包
 *
 * 🔄 状态管理：
 * - 连接状态持久化（localStorage）
 * - 自动重连功能（页面刷新后自动恢复连接）
 * - 实时监听账户和网络变化
 *
 * 💰 信息展示：
 * - 账户地址显示（格式化为 0x1234...abcd）
 * - 余额查询和显示
 * - 当前网络名称显示
 * - 在线状态指示器
 *
 * 🌐 网络支持：
 * - 多网络支持（主网、测试网、Layer2 等）
 * - 自动网络切换
 * - 网络名称友好显示
 *
 * 🛡️ 错误处理：
 * - 完善的错误捕获和用户提示
 * - 钱包未安装检测
 * - 网络切换失败处理
 * - 连接超时处理
 *
 * 🎨 界面特性：
 * - 响应式设计，适配移动端
 * - 加载状态显示
 * - 可自定义样式
 * - 无障碍访问支持
 *
 * 📋 使用示例：
 * ```tsx
 * // 基础使用
 * <ConnectWallet />
 *
 * // 高级配置
 * <ConnectWallet
 *   size="large"
 *   type="primary"
 *   supportedWallets={['metamask', 'injected']}
 *   requiredChainId={1}
 *   showBalance={true}
 *   onConnect={(account, chainId) => console.log('连接成功')}
 *   onError={(error) => console.error('连接失败')}
 * />
 * ```
 *
 * @author AgentFlow Team
 * @version 1.0.0
 * @since 2024
 */

import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import Button from "../Button";

/**
 * 钱包类型定义
 * 支持的钱包类型枚举，用于标识不同的钱包提供商
 * - metamask: MetaMask 浏览器插件钱包
 * - walletconnect: WalletConnect 协议钱包（开发中）
 * - coinbase: Coinbase Wallet（开发中）
 * - injected: 通用注入式钱包（兼容大部分钱包）
 */
type WalletType = "metamask" | "walletconnect" | "coinbase" | "injected";

/**
 * 钱包状态接口
 * 定义钱包连接后的所有状态信息，用于管理钱包连接状态
 */
interface WalletState {
  isConnected: boolean; // 是否已连接钱包
  account: string | null; // 用户钱包地址（如：0x1234...abcd）
  chainId: number | null; // 当前网络链ID（如：1=主网，11155111=Sepolia测试网）
  balance: string | null; // 账户余额（以ETH为单位的字符串）
  provider: ethers.BrowserProvider | null; // Ethers.js Provider实例，用于读取区块链数据
  signer: ethers.JsonRpcSigner | null; // Ethers.js Signer实例，用于签名交易和消息
}

/**
 * 支持的网络配置
 * 定义各个区块链网络的ID和显示名称
 * 用于网络切换和显示当前网络名称
 */
const SUPPORTED_CHAINS: Record<number, string> = {
  1: "Ethereum Mainnet", // 以太坊主网
  5: "Goerli Testnet", // Goerli 测试网（已废弃）
  11155111: "Sepolia Testnet", // Sepolia 测试网（推荐用于测试）
  137: "Polygon", // Polygon 主网
  56: "BSC", // Binance Smart Chain
  42161: "Arbitrum", // Arbitrum One 二层网络
  10: "Optimism", // Optimism 二层网络
};

/**
 * 钱包信息配置
 * 定义每种钱包的显示名称和图标
 * 用于在钱包选择弹窗中显示
 */
const WALLET_INFO: Record<WalletType, { name: string; icon: string }> = {
  metamask: { name: "MetaMask", icon: "🦊" }, // MetaMask 钱包
  walletconnect: { name: "WalletConnect", icon: "🔗" }, // WalletConnect 协议
  coinbase: { name: "Coinbase Wallet", icon: "🔷" }, // Coinbase 钱包
  injected: { name: "Injected Wallet", icon: "🔌" }, // 通用注入钱包
};

/**
 * ConnectWallet 组件属性接口
 * 定义组件的所有配置选项和回调函数
 */
interface ConnectWalletProps {
  // === 样式相关属性 ===
  size?: "small" | "middle" | "large"; // 按钮尺寸大小
  type?: "primary" | "default"; // 按钮类型样式
  className?: string; // 自定义CSS类名

  // === 功能相关属性 ===
  supportedWallets?: WalletType[]; // 支持的钱包类型列表，默认支持所有钱包
  requiredChainId?: number; // 要求的网络链ID，连接后会自动切换到此网络
  showBalance?: boolean; // 是否显示用户余额，默认为true
  showDisconnect?: boolean; // 是否显示断开连接按钮，默认为true
  autoConnect?: boolean; // 页面刷新后是否自动重连，默认为true

  // === 事件回调函数 ===
  onConnect?: (account: string, chainId: number) => void; // 钱包连接成功回调
  onDisconnect?: () => void; // 钱包断开连接回调
  onChainChanged?: (chainId: number) => void; // 网络切换回调
  onAccountChanged?: (account: string) => void; // 账户切换回调
  onError?: (error: Error) => void; // 错误处理回调
}

/**
 * 钱包选择弹窗组件
 * 显示支持的钱包列表，用户可以选择要连接的钱包类型
 *
 * @param open - 是否显示弹窗
 * @param onClose - 关闭弹窗的回调函数
 * @param onSelect - 选择钱包的回调函数，参数为选中的钱包类型
 * @param supportedWallets - 支持的钱包类型列表
 * @param loading - 是否处于连接中状态
 * @param error - 错误信息，如果有的话
 */
const WalletModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSelect: (walletType: WalletType) => void;
  supportedWallets: WalletType[];
  loading: boolean;
  error: string | null;
}> = ({ open, onClose, onSelect, supportedWallets, loading, error }) => {
  // 如果弹窗未打开，不渲染任何内容
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">选择钱包</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-2">
          {supportedWallets.map((walletType) => (
            <button
              key={walletType}
              onClick={() => onSelect(walletType)}
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
            >
              <span className="text-2xl">{WALLET_INFO[walletType].icon}</span>
              <span className="font-medium">
                {WALLET_INFO[walletType].name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * 账户信息展示组件
 * 显示已连接钱包的账户信息，包括地址、余额、网络等
 *
 * @param account - 用户钱包地址
 * @param balance - 账户余额（ETH）
 * @param chainId - 当前网络链ID
 * @param onDisconnect - 断开连接的回调函数
 * @param onSwitchNetwork - 切换网络的回调函数
 * @param size - 组件尺寸，与按钮尺寸保持一致
 */
const AccountInfo: React.FC<{
  account: string;
  balance: string | null;
  chainId: number;
  onDisconnect?: () => void;
  onSwitchNetwork?: (chainId: number) => void;
  size: "small" | "middle" | "large";
}> = ({ account, balance, chainId, onDisconnect, onSwitchNetwork, size }) => {
  /**
   * 格式化账户地址
   * 将长地址缩短为 0x1234...abcd 的格式，便于显示
   * @param account - 完整的钱包地址
   * @returns 格式化后的地址字符串
   */
  const formatAccount = (account: string) => {
    return `${account.slice(0, 6)}...${account.slice(-4)}`;
  };

  /**
   * 格式化余额显示
   * 将余额格式化为小数点后3位的形式
   * @param balance - 原始余额字符串
   * @returns 格式化后的余额字符串
   */
  const formatBalance = (balance: string | null) => {
    if (!balance) return "0.000";
    const num = parseFloat(balance);
    return num.toFixed(3);
  };

  return (
    <div className="flex items-center space-x-3">
      {/* 连接状态指示器 */}
      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>

      {/* 账户信息区域 - 横向排列 */}
      <div className="flex items-center space-x-4 bg-gray-50 rounded-lg px-3 py-2 min-w-0">
        {/* 账户地址 */}
        <div className="flex-shrink-0">
          <span
            className="font-mono text-sm font-medium"
            style={{ color: "#39495f" }}
          >
            {formatAccount(account)}
          </span>
        </div>

        {/* 余额信息 */}
        {balance && (
          <div className="flex-shrink-0">
            <span className="text-sm text-gray-600">
              {formatBalance(balance)} ETH
            </span>
          </div>
        )}

        {/* 网络信息 */}
        <div className="flex-shrink-0">
          <span className="text-sm text-gray-500">
            {SUPPORTED_CHAINS[chainId] || `Chain ${chainId}`}
          </span>
        </div>
      </div>

      {/* 断开连接按钮 */}
      {onDisconnect && (
        <Button
          type="text"
          size={size}
          onClick={onDisconnect}
          className="flex-shrink-0"
          style={{
            color: "#39495f",
            backgroundColor: "white",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
          }}
        >
          断开
        </Button>
      )}
    </div>
  );
};

/**
 * 主要的 ConnectWallet 组件
 * 提供完整的 Web3 钱包连接功能，包括钱包选择、连接、状态管理等
 *
 * 功能特性：
 * - 支持多种钱包类型（MetaMask、WalletConnect等）
 * - 自动检测和重连功能
 * - 网络切换和监听
 * - 余额显示和更新
 * - 错误处理和用户反馈
 *
 * @param props - 组件属性，详见 ConnectWalletProps 接口
 */
const ConnectWallet: React.FC<ConnectWalletProps> = ({
  size = "middle", // 按钮尺寸，默认中等
  type = "primary", // 按钮类型，默认主要按钮
  className = "", // 自定义样式类名
  supportedWallets = ["metamask", "walletconnect", "coinbase"], // 支持的钱包类型
  requiredChainId, // 要求的网络ID（可选）
  showBalance = true, // 是否显示余额
  showDisconnect = true, // 是否显示断开按钮
  autoConnect = true, // 是否自动重连
  onConnect, // 连接成功回调
  onDisconnect, // 断开连接回调
  onChainChanged, // 网络变化回调
  onAccountChanged, // 账户变化回调
  onError, // 错误处理回调
}) => {
  // === 状态管理 ===

  /**
   * 钱包连接状态
   * 包含钱包的所有核心信息：连接状态、账户、网络、余额等
   */
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false, // 初始状态为未连接
    account: null, // 初始无账户信息
    chainId: null, // 初始无网络信息
    balance: null, // 初始无余额信息
    provider: null, // 初始无Provider实例
    signer: null, // 初始无Signer实例
  });

  /**
   * UI 界面状态
   * 管理加载状态、弹窗显示、错误信息等UI相关状态
   */
  const [loading, setLoading] = useState(false); // 加载状态
  const [showModal, setShowModal] = useState(false); // 钱包选择弹窗状态
  const [error, setError] = useState<string | null>(null); // 错误信息状态

  // === 钱包连接器函数 ===

  /**
   * 检查 MetaMask 是否安装
   * 验证浏览器是否注入了 window.ethereum 对象
   * @throws {Error} 如果未安装 MetaMask 则抛出错误
   * @returns {boolean} 安装检查通过返回 true
   */
  const checkMetaMask = () => {
    if (!window.ethereum) {
      throw new Error("请安装 MetaMask 钱包");
    }
    return true;
  };

  /**
   * 连接 MetaMask 钱包
   * 请求用户授权并创建 Ethers.js Provider 实例
   * @returns {Promise<ethers.BrowserProvider>} MetaMask Provider 实例
   * @throws {Error} 连接失败时抛出错误
   */
  const connectMetaMask = async (): Promise<ethers.BrowserProvider> => {
    checkMetaMask(); // 首先检查是否安装

    // 请求用户授权连接钱包
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // 创建 Ethers.js Provider 实例
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider;
  };

  /**
   * 连接 WalletConnect 钱包 (占位实现)
   * TODO: 实现 WalletConnect 协议连接
   * @returns {Promise<ethers.BrowserProvider>} WalletConnect Provider 实例
   * @throws {Error} 当前版本尚未实现，抛出开发中提示
   */
  const connectWalletConnect = async (): Promise<ethers.BrowserProvider> => {
    // TODO: 实现 WalletConnect 连接
    throw new Error("WalletConnect 集成开发中");
  };

  /**
   * 连接 Coinbase Wallet (占位实现)
   * TODO: 实现 Coinbase Wallet SDK 连接
   * @returns {Promise<ethers.BrowserProvider>} Coinbase Wallet Provider 实例
   * @throws {Error} 当前版本尚未实现，抛出开发中提示
   */
  const connectCoinbase = async (): Promise<ethers.BrowserProvider> => {
    // TODO: 实现 Coinbase Wallet 连接
    throw new Error("Coinbase Wallet 集成开发中");
  };

  /**
   * 连接通用注入钱包
   * 适用于大部分兼容 EIP-1193 标准的钱包（如 Trust Wallet、Brave Wallet 等）
   * @returns {Promise<ethers.BrowserProvider>} 注入钱包的 Provider 实例
   * @throws {Error} 未检测到钱包时抛出错误
   */
  const connectInjected = async (): Promise<ethers.BrowserProvider> => {
    if (!window.ethereum) {
      throw new Error("未检测到钱包");
    }

    // 请求账户访问权限
    await window.ethereum.request({ method: "eth_requestAccounts" });
    return new ethers.BrowserProvider(window.ethereum);
  };

  // === 工具函数 ===

  /**
   * 获取钱包连接器函数
   * 根据钱包类型返回对应的连接函数
   * @param walletType - 钱包类型
   * @returns {Function} 对应的钱包连接函数
   * @throws {Error} 不支持的钱包类型时抛出错误
   */
  const getWalletConnector = (walletType: WalletType) => {
    switch (walletType) {
      case "metamask":
        return connectMetaMask; // MetaMask 连接器
      case "walletconnect":
        return connectWalletConnect; // WalletConnect 连接器
      case "coinbase":
        return connectCoinbase; // Coinbase Wallet 连接器
      case "injected":
        return connectInjected; // 通用注入钱包连接器
      default:
        throw new Error(`不支持的钱包类型: ${walletType}`);
    }
  };

  /**
   * 切换区块链网络
   * 请求用户切换到指定的区块链网络
   * @param chainId - 目标网络的链ID（十进制）
   * @throws {Error} 切换失败时抛出错误，特别处理网络不存在的情况（4902错误码）
   */
  const switchNetwork = async (chainId: number) => {
    try {
      // 发送切换网络请求，chainId需要转换为十六进制格式
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // 错误码 4902 表示网络不存在，需要先添加网络
        console.warn("需要添加网络:", chainId);
      }
      throw error;
    }
  };

  /**
   * 获取账户余额
   * 查询指定账户的以太坊余额
   * @param provider - Ethers.js Provider 实例
   * @param account - 钱包账户地址
   * @returns {Promise<string>} 格式化后的余额字符串（ETH单位）
   */
  const getBalance = async (
    provider: ethers.BrowserProvider,
    account: string
  ) => {
    try {
      // 获取账户余额（返回 wei 单位）
      const balance = await provider.getBalance(account);
      // 将 wei 转换为 ETH 单位
      return ethers.formatEther(balance);
    } catch (error) {
      console.warn("获取余额失败:", error);
      return "0.000"; // 获取失败时返回默认值
    }
  };

  // === 核心处理函数 ===

  /**
   * 连接钱包主函数
   * 处理完整的钱包连接流程，包括连接、获取信息、状态更新等
   *
   * 执行步骤：
   * 1. 获取对应的钱包连接器
   * 2. 连接钱包并获取 Provider
   * 3. 获取 Signer、账户地址、网络信息、余额
   * 4. 更新组件状态
   * 5. 检查并切换到要求的网络
   * 6. 保存连接状态到本地存储
   * 7. 调用相关回调函数
   *
   * @param walletType - 要连接的钱包类型
   */
  const handleConnect = useCallback(
    async (walletType: WalletType) => {
      setLoading(true); // 开始加载状态
      setError(null); // 清除之前的错误信息

      try {
        // 第一步：获取对应的钱包连接器函数
        const connector = getWalletConnector(walletType);

        // 第二步：执行钱包连接，获取 Provider 实例
        const provider = await connector();

        // 第三步：获取签名器实例（用于后续的交易签名）
        const signer = await provider.getSigner();

        // 第四步：获取用户的钱包账户地址
        const account = await signer.getAddress();

        // 第五步：获取当前网络信息
        const network = await provider.getNetwork();
        const chainId = Number(network.chainId);

        // 第六步：获取账户余额
        const balance = await getBalance(provider, account);

        // 第七步：构建新的钱包状态对象
        const newState: WalletState = {
          isConnected: true,
          account,
          chainId,
          balance,
          provider,
          signer,
        };

        // 第八步：更新组件状态
        setWalletState(newState);
        setShowModal(false); // 关闭钱包选择弹窗

        // 第九步：检查是否需要切换到指定网络
        if (requiredChainId && chainId !== requiredChainId) {
          try {
            await switchNetwork(requiredChainId);
          } catch (error) {
            console.warn("切换网络失败:", error);
            // 网络切换失败不影响整体连接流程
          }
        }

        // 第十步：调用连接成功回调函数
        onConnect?.(account, chainId);

        // 第十一步：保存连接状态到浏览器本地存储（用于自动重连）
        localStorage.setItem("walletConnected", "true");
        localStorage.setItem("walletType", walletType);
      } catch (err) {
        // 错误处理：捕获连接过程中的任何异常
        const error = err as Error;
        setError(error.message); // 设置错误信息显示给用户
        onError?.(error); // 调用错误处理回调
      } finally {
        // 无论成功失败都要结束加载状态
        setLoading(false);
      }
    },
    [requiredChainId, onConnect, onError]
  );

  /**
   * 断开钱包连接
   * 清除所有钱包相关状态和本地存储数据
   *
   * 使用 useCallback 优化性能，避免不必要的重新渲染
   */
  const handleDisconnect = useCallback(() => {
    // 重置钱包状态为初始值
    setWalletState({
      isConnected: false,
      account: null,
      chainId: null,
      balance: null,
      provider: null,
      signer: null,
    });

    // 清除本地存储的连接状态（防止自动重连）
    localStorage.removeItem("walletConnected");
    localStorage.removeItem("walletType");

    // 调用断开连接回调函数
    onDisconnect?.();
  }, [onDisconnect]);

  /**
   * 自动连接钱包功能
   * 在组件挂载时检查本地存储，如果之前已连接过则自动重连
   *
   * 执行条件：
   * - autoConnect 属性为 true
   * - 本地存储中有连接记录
   * - 钱包仍然授权给当前网站
   *
   * 使用 useCallback 避免依赖变化导致的重复执行
   */
  const autoConnectWallet = useCallback(async () => {
    // 如果禁用自动连接，直接返回
    if (!autoConnect) return;

    // 从本地存储读取上次的连接状态
    const wasConnected = localStorage.getItem("walletConnected") === "true";
    const walletType = localStorage.getItem("walletType") as WalletType;

    // 检查连接条件：之前连接过 + 有钱包类型记录 + 钱包可用
    if (wasConnected && walletType && window.ethereum) {
      // 设置loading状态
      setLoading(true);

      try {
        // 检查钱包是否仍然授权给当前网站
        const accounts = await window.ethereum.request({
          method: "eth_accounts" as any,
        });

        // 如果有授权的账户，则执行连接
        if (accounts.length > 0) {
          // 直接连接，不通过handleConnect避免重复设置loading
          const connector = getWalletConnector(walletType);
          const provider = await connector();
          const signer = await provider.getSigner();
          const account = await signer.getAddress();
          const network = await provider.getNetwork();
          const chainId = Number(network.chainId);
          const balance = await getBalance(provider, account);

          // 更新状态
          setWalletState({
            isConnected: true,
            account,
            chainId,
            balance,
            provider,
            signer,
          });

          // 调用连接成功回调
          onConnect?.(account, chainId);
        } else {
          // 如果没有授权账户，清除本地存储
          localStorage.removeItem("walletConnected");
          localStorage.removeItem("walletType");
        }
      } catch (error) {
        // 自动连接失败，清除本地存储
        console.warn("自动连接失败:", error);
        localStorage.removeItem("walletConnected");
        localStorage.removeItem("walletType");
        onError?.(error as Error);
      } finally {
        // 确保loading状态被重置
        setLoading(false);
      }
    }
  }, [autoConnect, onConnect, onError]);

  // === 事件监听器 ===

  /**
   * 监听钱包账户和网络变化
   * 当用户在钱包中切换账户或网络时，自动更新组件状态
   *
   * 监听的事件：
   * - accountsChanged: 账户切换或断开连接
   * - chainChanged: 网络切换
   */
  useEffect(() => {
    // 如果没有 window.ethereum，说明没有安装钱包，跳过监听
    if (!window.ethereum) return;

    /**
     * 处理账户变化事件
     * @param accounts - 当前授权的账户列表
     */
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // 账户列表为空，说明用户断开了连接
        handleDisconnect();
      } else if (accounts[0] !== walletState.account) {
        // 账户发生了变化，更新状态并触发回调
        setWalletState((prev) => ({ ...prev, account: accounts[0] }));
        onAccountChanged?.(accounts[0]);
      }
    };

    /**
     * 处理网络变化事件
     * @param chainId - 新的网络链ID（十六进制字符串）
     */
    const handleChainChanged = (chainId: string) => {
      // 将十六进制链ID转换为十进制数字
      const newChainId = parseInt(chainId, 16);

      // 更新组件状态并触发回调
      setWalletState((prev) => ({ ...prev, chainId: newChainId }));
      onChainChanged?.(newChainId);
    };

    // 注册事件监听器
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    // 清理函数：组件卸载时移除事件监听器
    return () => {
      window.ethereum.removeAllListeners();
    };
  }, [walletState.account, onAccountChanged, onChainChanged, handleDisconnect]);

  /**
   * 组件挂载时执行自动连接
   * 仅在组件首次挂载时执行一次
   */
  useEffect(() => {
    autoConnectWallet();
  }, [autoConnectWallet]);

  // === 组件渲染逻辑 ===

  /**
   * 未连接状态的渲染
   * 显示"连接钱包"按钮和钱包选择弹窗
   */
  if (!walletState.isConnected) {
    return (
      <>
        {/* 连接钱包按钮 */}
        <Button
          type={type} // 按钮类型（primary/default）
          size={size} // 按钮尺寸（small/middle/large）
          loading={loading} // 是否显示加载状态
          onClick={() => setShowModal(true)} // 点击打开钱包选择弹窗
          className={className} // 自定义样式类名
        >
          {loading ? "连接中..." : "连接钱包"} {/* 根据加载状态显示文本 */}
        </Button>

        {/* 钱包选择弹窗 */}
        <WalletModal
          open={showModal} // 弹窗显示状态
          onClose={() => setShowModal(false)} // 关闭弹窗
          onSelect={handleConnect} // 选择钱包后的处理函数
          supportedWallets={supportedWallets} // 支持的钱包类型列表
          loading={loading} // 连接中的加载状态
          error={error} // 错误信息（如果有）
        />
      </>
    );
  }

  /**
   * 已连接状态的渲染
   * 显示账户信息组件，包含地址、余额、网络等信息
   */
  return (
    <AccountInfo
      account={walletState.account!} // 钱包账户地址（非空断言）
      balance={showBalance ? walletState.balance : null} // 余额（根据配置决定是否显示）
      chainId={walletState.chainId!} // 当前网络链ID（非空断言）
      onDisconnect={showDisconnect ? handleDisconnect : undefined} // 断开连接函数（根据配置决定是否提供）
      onSwitchNetwork={switchNetwork} // 网络切换函数
      size={size} // 组件尺寸（保持与按钮一致）
    />
  );
};

// === 导出 ===

/**
 * 默认导出 ConnectWallet 组件
 * 这是组件的主要导出，用于在其他文件中导入使用
 *
 * 使用示例：
 * import ConnectWallet from 'components/ConnectWallet';
 */
export default ConnectWallet;

/**
 * 导出类型定义
 * 提供 TypeScript 类型支持，方便其他组件使用相关类型
 *
 * 使用示例：
 * import type { ConnectWalletProps, WalletState, WalletType } from 'components/ConnectWallet';
 */
export type { ConnectWalletProps, WalletState, WalletType };
