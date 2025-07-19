import React, { useState } from "react";
import { ethers } from "ethers";
import ConnectWallet from "@components/ConnectWallet";
import Button from "@components/Button";

// 生成登录消息
function generateLoginMessage() {
  const timestamp = Date.now();
  const nonce = Math.random().toString(36).substring(7);

  return `
欢迎使用 Web3 应用
时间：${timestamp}
随机数：${nonce}
请签名以登录系统
`;
}

const EthersPage: React.FC = () => {
  // 钱包状态
  const [walletInfo, setWalletInfo] = useState<{
    account: string;
    chainId: number;
    provider: ethers.BrowserProvider | null;
    signer: ethers.JsonRpcSigner | null;
  } | null>(null);

  // 应用状态
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [signature, setSignature] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [error, setError] = useState("");

  // 钱包连接成功处理
  const handleConnect = async (account: string, chainId: number) => {
    console.log("钱包已连接:", account, chainId);

    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      setWalletInfo({
        account,
        chainId,
        provider,
        signer,
      });
    }
    setError("");
  };

  // 钱包断开连接处理
  const handleDisconnect = () => {
    console.log("钱包已断开");
    setWalletInfo(null);
    setIsLoggedIn(false);
    setSignature("");
    setLoginMessage("");
    setError("");
  };

  // 错误处理
  const handleError = (error: Error) => {
    console.error("钱包连接错误:", error);
    setError(`连接失败: ${error.message}`);
  };

  // 切换网络到 Sepolia 测试网
  const switchToSepolia = async () => {
    if (!walletInfo?.provider) return;

    setLoading(true);
    try {
      await window.ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // Sepolia 测试网
      });
      setError("");
    } catch (err: any) {
      setError(`切换网络失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 发送测试交易
  const sendTestTransaction = async () => {
    if (!walletInfo?.signer) {
      setError("请先连接钱包");
      return;
    }

    setLoading(true);
    try {
      const tx = {
        to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", // 测试地址
        value: ethers.parseEther("0.001"), // 发送 0.001 ETH
      };

      const transaction = await walletInfo.signer.sendTransaction(tx);
      setTransactionHash(transaction.hash);

      // 等待交易确认
      await transaction.wait();
      setError("");
    } catch (err: any) {
      setError(`发送交易失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 签名消息并登录
  const signMessage = async () => {
    if (!walletInfo?.signer) {
      setError("请先连接钱包");
      return;
    }

    setLoading(true);
    try {
      const messageText = generateLoginMessage();
      setLoginMessage(messageText);

      // 请求用户签名消息
      const signature = await walletInfo.signer.signMessage(messageText);

      if (signature) {
        setSignature(signature);

        // 验证签名
        const recoveredAddress = ethers.verifyMessage(messageText, signature);

        if (
          recoveredAddress.toLowerCase() === walletInfo.account.toLowerCase()
        ) {
          setIsLoggedIn(true);
          setError("");
        } else {
          setError("签名验证失败");
        }
      }
    } catch (err: any) {
      setError(`签名失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 退出登录
  const logout = () => {
    setIsLoggedIn(false);
    setSignature("");
    setLoginMessage("");
    setError("");
  };

  // 获取网络名称
  const getNetworkName = (chainId: number) => {
    const networks: Record<number, string> = {
      1: "Ethereum Mainnet",
      5: "Goerli Testnet",
      11155111: "Sepolia Testnet",
      137: "Polygon",
      56: "BSC",
    };
    return networks[chainId] || `Chain ${chainId}`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Ethers.js 示例</h1>

      <div className="mb-6">
        <p className="text-gray-600 mb-2">Ethers.js 版本: {ethers.version}</p>
        <p className="text-sm text-gray-500">
          这是一个使用 Ethers.js v6 与以太坊区块链交互的完整示例。
        </p>
      </div>

      {/* 钱包连接区域 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">1. 钱包连接</h2>
        <div className="mb-4">
          <ConnectWallet
            size="large"
            type="primary"
            supportedWallets={["metamask", "injected"]}
            showBalance={true}
            showDisconnect={true}
            autoConnect={true}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onError={handleError}
          />
        </div>

        {walletInfo && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">钱包信息</h3>
            <div className="space-y-1 text-sm">
              <p>
                <strong>账户:</strong> {walletInfo.account}
              </p>
              <p>
                <strong>网络:</strong> {getNetworkName(walletInfo.chainId)} (
                {walletInfo.chainId})
              </p>
              {isLoggedIn && (
                <p className="text-green-600">
                  <strong>状态:</strong> 已登录
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 网络操作区域 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">2. 网络操作</h2>
        <div className="space-x-4">
          <Button
            type="default"
            onClick={switchToSepolia}
            loading={loading}
            disabled={!walletInfo}
          >
            切换到 Sepolia 测试网
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          推荐使用 Sepolia 测试网进行测试，避免使用真实资金。
        </p>
      </div>

      {/* 交易操作区域 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">3. 发送交易</h2>
        <div className="space-x-4 mb-4">
          <Button
            type="primary"
            onClick={sendTestTransaction}
            loading={loading}
            disabled={!walletInfo}
          >
            发送测试交易 (0.001 ETH)
          </Button>
        </div>
        {transactionHash && (
          <div className="bg-green-50 p-3 rounded text-sm">
            <p>
              <strong>交易哈希:</strong>
            </p>
            <p className="font-mono break-all">{transactionHash}</p>
          </div>
        )}
        <p className="text-sm text-gray-500">
          将发送 0.001 ETH 到测试地址，请确保您在测试网络上。
        </p>
      </div>

      {/* 消息签名区域 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">4. 消息签名与登录</h2>
        <div className="space-x-4 mb-4">
          {!isLoggedIn ? (
            <Button
              type="primary"
              onClick={signMessage}
              loading={loading}
              disabled={!walletInfo}
            >
              签名登录
            </Button>
          ) : (
            <Button danger onClick={logout}>
              退出登录
            </Button>
          )}
        </div>

        {signature && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">签名信息</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium">消息内容:</p>
                <pre className="text-xs bg-white p-2 rounded border overflow-auto">
                  {loginMessage}
                </pre>
              </div>
              <div>
                <p className="text-sm font-medium">签名结果:</p>
                <p className="text-xs bg-white p-2 rounded border font-mono break-all">
                  {signature}
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-500 mt-2">
          通过签名消息来验证身份，这是 Web3 应用中常用的登录方式。
        </p>
      </div>

      {/* 错误显示区域 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-red-800 mb-2">错误信息</h3>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* 技术说明 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold mb-3">🔧 技术特性</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium">核心功能</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Ethers.js v6 API</li>
              <li>钱包连接与断开</li>
              <li>网络检测与切换</li>
              <li>余额查询</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium">高级功能</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>交易发送与确认</li>
              <li>消息签名与验证</li>
              <li>错误处理与提示</li>
              <li>自动重连机制</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EthersPage;
