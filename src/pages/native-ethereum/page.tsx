"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Button from "../../components/Button";
// 定义以太坊请求方法的类型
// 这些是 MetaMask 支持的主要方法
type EthereumMethod =
  | "eth_requestAccounts" // 请求连接钱包
  | "eth_getBalance" // 获取账户余额
  | "eth_chainId" // 获取当前链ID
  | "wallet_switchEthereumChain" // 切换以太坊网络
  | "wallet_addEthereumChain" // 添加新的以太坊网络
  | "eth_sendTransaction" // 发送交易
  | "personal_sign"; // 签名消息

// 定义以太坊请求参数的类型
// 每种方法对应的参数类型
interface EthereumRequestParams {
  eth_requestAccounts: never; // 不需要参数
  eth_getBalance: [string, string]; // [地址, 区块标签]
  eth_chainId: never; // 不需要参数
  wallet_switchEthereumChain: [{ chainId: string }]; // 切换网络的参数
  wallet_addEthereumChain: [
    // 添加网络的参数
    {
      chainId: string; // 链ID
      chainName: string; // 链名称
      nativeCurrency: {
        // 原生代币信息
        name: string; // 代币名称
        symbol: string; // 代币符号
        decimals: number; // 小数位数
      };
      rpcUrls: string[]; // RPC节点URL列表
      blockExplorerUrls: string[]; // 区块浏览器URL列表
    }
  ];
  eth_sendTransaction: [
    // 交易参数
    {
      to: string; // 接收地址
      from: string; // 发送地址
      value: string; // 发送金额
    }
  ];
  personal_sign: [string, string]; // [消息, 地址]
}

// 定义以太坊响应的类型
// 每种方法对应的返回值类型
type EthereumResponse<T extends EthereumMethod> =
  T extends "eth_requestAccounts"
    ? string[] // 返回账户地址数组
    : T extends "eth_getBalance"
    ? string // 返回余额（十六进制字符串）
    : T extends "eth_chainId"
    ? string // 返回链ID（十六进制字符串）
    : T extends "wallet_switchEthereumChain"
    ? null // 切换网络成功返回null
    : T extends "wallet_addEthereumChain"
    ? null // 添加网络成功返回null
    : T extends "eth_sendTransaction"
    ? string // 返回交易哈希
    : T extends "personal_sign"
    ? string // 返回签名结果
    : never;

// 定义 window.ethereum 类型
// 扩展全局 Window 接口，添加 ethereum 属性
declare global {
  interface Window {
    ethereum?: {
      // request 方法：向 MetaMask 发送请求
      request: <T extends EthereumMethod>(args: {
        method: T; // 请求方法
        params?: EthereumRequestParams[T]; // 请求参数
      }) => Promise<EthereumResponse<T>>; // 返回Promise

      // on 方法：监听 MetaMask 事件
      on: {
        // 监听账户变化事件
        (
          event: "accountsChanged",
          callback: (accounts: string[]) => void
        ): void;
        // 监听链变化事件
        (event: "chainChanged", callback: (chainId: string) => void): void;
      };

      // 移除所有事件监听器
      removeAllListeners: () => void;
    };
  }
}

// 定义账户信息的接口
// 用于存储和显示用户的钱包信息
interface AccountInfo {
  address: string; // 钱包地址
  balance: string; // ETH 余额
  chainId: string; // 当前连接的链 ID
}

// 定义网络参数类型
// 用于添加新网络时的配置
interface NetworkParams {
  chainId: string; // 链ID
  chainName: string; // 链名称
  nativeCurrency: {
    // 原生代币信息
    name: string; // 代币名称
    symbol: string; // 代币符号
    decimals: number; // 小数位数
  };
  rpcUrls: string[]; // RPC节点URL列表
  blockExplorerUrls: string[]; // 区块浏览器URL列表
}

// 定义交易参数类型
// interface TransactionParams {
//   to: string;
//   from: string;
//   value: string;
// }

export default function NativeEthereum() {
  // 使用 React 的 useState 钩子管理组件状态
  const [isConnected, setIsConnected] = useState(false); // 钱包连接状态
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null); // 账户信息
  const [error, setError] = useState<string>(""); // 错误信息
  const [txHash, setTxHash] = useState<string>(""); // 交易哈希
  const [signature, setSignature] = useState<string>(""); // 签名结果

  // 检查是否安装了 MetaMask 钱包
  const checkWallet = () => {
    if (typeof window.ethereum !== "undefined") {
      return true;
    }
    setError("请安装 MetaMask 钱包");
    return false;
  };

  // 连接钱包函数
  const connectWallet = async () => {
    try {
      if (!checkWallet()) return;

      // 请求用户授权连接钱包
      const accounts = (await window.ethereum?.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (!accounts?.[0]) {
        throw new Error("未获取到账户");
      }

      // 获取账户信息
      const address = accounts[0];
      const balance = await getBalance(address);
      const chainId = await getChainId();

      // 更新状态
      setAccountInfo({
        address,
        balance,
        chainId,
      });
      setIsConnected(true);
      setError("");
    } catch (err) {
      setError("连接钱包失败");
      console.error(err);
    }
  };

  // 获取账户 ETH 余额
  const getBalance = async (address: string): Promise<string> => {
    // 调用 MetaMask 的 eth_getBalance 方法获取余额
    const balance = (await window.ethereum?.request({
      method: "eth_getBalance",
      params: [address, "latest"],
    })) as string;
    // 将 Wei 转换为 ETH（1 ETH = 10^18 Wei）
    return ethers.utils.formatEther(balance || "0");
  };

  // 获取当前连接的链 ID
  const getChainId = async (): Promise<string> => {
    return (
      ((await window.ethereum?.request({
        method: "eth_chainId",
      })) as string) || "0x1"
    ); // 默认返回主网 ID
  };

  // 切换网络
  const switchNetwork = async (chainId: string) => {
    try {
      // 请求 MetaMask 切换到指定网络
      await window.ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
    } catch (err: unknown) {
      const error = err as { code?: number };
      if (error.code === 4902) {
        // 如果链不存在，尝试添加网络
        await addNetwork(chainId);
      }
      setError("切换网络失败");
      console.error(err);
    }
  };

  // 添加新网络
  const addNetwork = async (chainId: string) => {
    // 网络配置参数
    const networkParams: NetworkParams = {
      chainId,
      chainName: "Ethereum Mainnet",
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: ["https://mainnet.infura.io/v3/your-api-key"],
      blockExplorerUrls: ["https://etherscan.io"],
    };

    try {
      // 请求 MetaMask 添加新网络
      await window.ethereum?.request({
        method: "wallet_addEthereumChain",
        params: [networkParams],
      });
    } catch (err) {
      setError("添加网络失败");
      console.error(err);
    }
  };

  // 发送交易
  const sendTransaction = async () => {
    if (!accountInfo) return;

    try {
      // 构建交易参数
      const transactionParams = {
        to: "0x0000000000000000000000000000000000000000", // 示例地址
        from: accountInfo.address,
        value: ethers.utils.parseEther("0.001").toHexString(), // 发送 0.001 ETH
      };

      // 发送交易
      const txHash = (await window.ethereum?.request({
        method: "eth_sendTransaction",
        params: [transactionParams],
      })) as string;

      if (txHash) {
        setTxHash(txHash);
        setError("");
      }
    } catch (err) {
      setError("交易失败");
      console.error(err);
    }
  };

  // 签名消息
  const signMessage = async () => {
    if (!accountInfo) return;

    try {
      const message = "Hello Web3!";
      // 请求用户签名消息
      const signature = (await window.ethereum?.request({
        method: "personal_sign",
        params: [message, accountInfo.address],
      })) as string;

      if (signature) {
        setSignature(signature);
        setError("");
      }
    } catch (err) {
      setError("签名失败");
      console.error(err);
    }
  };

  // 使用 useEffect 监听钱包事件
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      // 监听账户变化事件
      window.ethereum.on("accountsChanged", async (accounts: string[]) => {
        if (accounts.length === 0) {
          // 用户断开连接
          setIsConnected(false);
          setAccountInfo(null);
        } else {
          // 用户切换账户
          const balance = await getBalance(accounts[0]);
          const chainId = await getChainId();
          setAccountInfo({
            address: accounts[0],
            balance: balance.toString(),
            chainId: chainId.toString(),
          });
        }
      });

      // 监听链变化事件
      window.ethereum.on("chainChanged", async (chainId: string) => {
        if (accountInfo) {
          // 更新余额和链 ID
          const balance = await getBalance(accountInfo.address);
          setAccountInfo({
            ...accountInfo,
            chainId: chainId.toString(),
            balance: balance.toString(),
          });
        }
      });
    }

    // 组件卸载时清理事件监听器
    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeAllListeners();
      }
    };
  }, [accountInfo]);

  // 渲染组件
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">原生以太坊交互11</h1>

        {/* 钱包连接状态区域 */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">钱包状态</h2>
          {!isConnected ? (
            <Button type="primary" onClick={connectWallet}>
              连接钱包
            </Button>
          ) : (
            <div className="space-y-4">
              <p>地址: {accountInfo?.address}</p>
              <p>余额: {accountInfo?.balance} ETH</p>
              <p>链 ID: {accountInfo?.chainId}</p>
            </div>
          )}
        </div>

        {/* 错误提示区域 */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* 交互按钮区域 */}
        {isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => switchNetwork("0x1")}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
            >
              切换到主网
            </button>
            <button
              onClick={sendTransaction}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md transition-colors"
            >
              发送交易
            </button>
            <button
              onClick={signMessage}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md transition-colors"
            >
              签名消息
            </button>
          </div>
        )}

        {/* 交易结果区域 */}
        {txHash && (
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">交易结果</h2>
            <p className="break-all">交易哈希: {txHash}</p>
          </div>
        )}

        {/* 签名结果区域 */}
        {signature && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">签名结果</h2>
            <p className="break-all">签名: {signature}</p>
          </div>
        )}
      </div>
    </div>
  );
}
