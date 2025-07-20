"use client";

import { useState, useEffect } from "react";

// 定义错误类型
interface EthereumError {
  code?: number;
  message?: string;
}

export default function NativeEthereumJS() {
  const [isConnected, setIsConnected] = useState(false);
  const [accountInfo, setAccountInfo] = useState({
    address: "",
    balance: "",
    chainId: "",
  });
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");
  const [signature, setSignature] = useState("");

  // 检查是否安装了 MetaMask 钱包
  function checkWallet(): boolean {
    if (typeof window.ethereum !== "undefined") {
      return true;
    }
    setError("请安装 MetaMask 钱包");
    return false;
  }

  // 连接钱包
  async function connectWallet(): Promise<void> {
    try {
      if (!checkWallet()) return;

      // 添加空值检查
      if (!window.ethereum) {
        setError("钱包未安装");
        return;
      }

      // 请求用户授权连接钱包
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts[0]) {
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
  }

  // 获取账户余额
  async function getBalance(address: string): Promise<string> {
    if (!window.ethereum) {
      throw new Error("钱包未安装");
    }

    const balance = await window.ethereum.request({
      method: "eth_getBalance",
      params: [address, "latest"],
    });
    // 将 Wei 转换为 ETH（1 ETH = 10^18 Wei）
    return (parseInt(balance, 16) / 1e18).toFixed(4);
  }

  // 获取链 ID
  async function getChainId(): Promise<string> {
    if (!window.ethereum) {
      return "0x1";
    }

    return (
      (await window.ethereum.request({
        method: "eth_chainId",
      })) || "0x1"
    );
  }

  // 切换网络
  async function switchNetwork(chainId: string): Promise<void> {
    if (!window.ethereum) {
      setError("钱包未安装");
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
    } catch (err: unknown) {
      const error = err as EthereumError;
      if (error.code === 4902) {
        // 如果链不存在，添加网络
        await addNetwork(chainId);
      }
      setError("切换网络失败");
      console.error(err);
    }
  }

  // 添加网络
  async function addNetwork(chainId: string): Promise<void> {
    if (!window.ethereum) {
      setError("钱包未安装");
      return;
    }

    const networkParams = {
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
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [networkParams],
      });
    } catch (err) {
      setError("添加网络失败");
      console.error(err);
    }
  }

  // 发送交易
  async function sendTransaction(): Promise<void> {
    if (!accountInfo.address) return;
    if (!window.ethereum) {
      setError("钱包未安装");
      return;
    }

    try {
      // 构建交易参数
      const transactionParams = {
        to: "0x0000000000000000000000000000000000000000", // 示例地址
        from: accountInfo.address,
        value: "0x" + (0.001 * 1e18).toString(16), // 发送 0.001 ETH
      };

      // 发送交易
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParams],
      });

      if (txHash) {
        setTxHash(txHash);
        setError("");
      }
    } catch (err) {
      setError("交易失败");
      console.error(err);
    }
  }

  // 签名消息
  async function signMessage(): Promise<void> {
    if (!accountInfo.address) return;
    if (!window.ethereum) {
      setError("钱包未安装");
      return;
    }

    try {
      const message = "Hello Web3!";
      // 请求用户签名消息
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, accountInfo.address],
      });

      if (signature) {
        setSignature(signature);
        setError("");
      }
    } catch (err) {
      setError("签名失败");
      console.error(err);
    }
  }

  // 监听账户变化
  useEffect(() => {
    if (typeof window.ethereum !== "undefined" && window.ethereum) {
      // 监听账户变化事件
      window.ethereum.on("accountsChanged", async (accounts: string[]) => {
        if (accounts.length === 0) {
          // 用户断开连接
          setIsConnected(false);
          setAccountInfo({
            address: "",
            balance: "",
            chainId: "",
          });
        } else {
          // 用户切换账户
          const balance = await getBalance(accounts[0]);
          const chainId = await getChainId();
          setAccountInfo({
            address: accounts[0],
            balance,
            chainId,
          });
        }
      });

      // 监听链变化事件
      window.ethereum.on("chainChanged", async (chainId: string) => {
        if (accountInfo.address) {
          // 更新余额和链 ID
          const balance = await getBalance(accountInfo.address);
          setAccountInfo({
            ...accountInfo,
            chainId,
            balance,
          });
        }
      });
    }

    // 组件卸载时清理事件监听器
    return () => {
      if (typeof window.ethereum !== "undefined" && window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, [accountInfo]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">原生以太坊交互 (JavaScript)</h1>

        {/* 钱包连接状态区域 */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">钱包状态</h2>
          {!isConnected ? (
            <button
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium"
            >
              连接钱包
            </button>
          ) : (
            <div className="space-y-2">
              <p>
                <strong>地址:</strong> {accountInfo.address}
              </p>
              <p>
                <strong>余额:</strong> {accountInfo.balance} ETH
              </p>
              <p>
                <strong>链 ID:</strong> {accountInfo.chainId}
              </p>
            </div>
          )}
        </div>

        {/* 操作按钮区域 */}
        {isConnected && (
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">操作</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => switchNetwork("0x1")}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
              >
                切换到主网
              </button>
              <button
                onClick={() => switchNetwork("0xaa36a7")}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
              >
                切换到 Sepolia
              </button>
              <button
                onClick={sendTransaction}
                className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg"
              >
                发送交易
              </button>
              <button
                onClick={signMessage}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
              >
                签名消息
              </button>
            </div>
          </div>
        )}

        {/* 结果显示区域 */}
        {error && (
          <div className="bg-red-900 p-4 rounded-lg mb-4">
            <p className="text-red-200">错误: {error}</p>
          </div>
        )}

        {txHash && (
          <div className="bg-green-900 p-4 rounded-lg mb-4">
            <p className="text-green-200">交易哈希: {txHash}</p>
          </div>
        )}

        {signature && (
          <div className="bg-blue-900 p-4 rounded-lg mb-4">
            <p className="text-blue-200">签名: {signature}</p>
          </div>
        )}
      </div>
    </div>
  );
}
