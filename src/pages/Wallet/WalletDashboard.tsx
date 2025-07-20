import React from 'react';
import {
  Eye,
  EyeOff,
  Zap,
  Shield,
  Target,
  Wallet,
} from 'lucide-react';
import { useAccount, useReadContract, useBalance, useConnect, useSimulateContract } from 'wagmi';
import { formatUnits } from 'viem';
import DataChainLog from '@/abis/USDTStaking.json';


// 合约地址（sepolia 测试链）
// const CONTRACT_ADDRESS = DataChainLog.networks['11155111'].address;
const STAKING_CONTRACT_ABI = DataChainLog.abi;

// 合约地址配置
const CONTRACTS = {
  sepolia: {
    staking: '0xB51d6daA8c137F60780d413837BBab667C48032d', // 替换为你的质押合约地址
    usdt: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0', // Sepolia USDT地址
  },
};
const STAKING_CONTRACT_ADDRESS = CONTRACTS.sepolia.staking as `0x${string}`;
const STACK_USDT_ADDRESS = CONTRACTS.sepolia.usdt as `0x${string}`;

const WalletDashboard = () => {
  const { address, isConnected } = useAccount();

  // 获取用户在质押合约中的余额
  const stakedBalanceResult = useReadContract({
    address: STAKING_CONTRACT_ADDRESS,
    abi: STAKING_CONTRACT_ABI,
    functionName: 'getBalance',
    account: address,
    query: {
      enabled: !!address && isConnected,
      refetchInterval: 10000, // 每10秒自动刷新
    },
  });

  // 获取合约总质押金额
  const totalStakedResult = useReadContract({
    address: STAKING_CONTRACT_ADDRESS,
    abi: STAKING_CONTRACT_ABI,
    functionName: 'getTotalStaked',
    query: {
      enabled: isConnected,
      refetchInterval: 30000, // 总质押变化较慢
    },
  });

  // 解构所有结果
  const {
    data: stakedBalance,
    error: stakedError,
    isLoading: stakedLoading,
    refetch: refetchStaked,
  } = stakedBalanceResult;

  const { data: totalStaked, isLoading: totalLoading } = totalStakedResult;

  // 格式化USDT余额 (6位小数)
  const formatUSDT = (value: bigint | undefined) => {
    if (!value) return '0.00';
    return parseFloat(formatUnits(value, 6)).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600">
      {/* Header Section */}
      <div className="pt-8 pb-16 px-6">
        <div className="flex items-center justify-center mb-2">
          <div className="bg-white opacity-20 rounded-xl p-3 mr-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Wallet />
            </div>
          </div>
          <h1 className="text-white text-2xl font-semibold">My Wallet</h1>
        </div>

        <div className="text-center mb-8">
          <p className="text-purple-100 text-sm mb-1">Agent Earnings · Job Escrow · Staking Finance</p>
        </div>

        {/* Total Assets Card */}
        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 mx-auto max-w-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-100 text-sm">Total Assets</span>
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div className="text-white text-3xl font-bold mb-1">
            {/* <span className="text-gray-600">合约总质押:</span> */}
            {totalLoading ? (
              <span className="text-gray-400">加载中...</span>
            ) : (
              <span className="font-semibold text-gray-800">{formatUSDT(totalStaked as bigint)} USDT</span>
            )}
          </div>
          {/* <div className="flex items-center">
            <span className="text-green-300 text-sm">📈 +5.2% Today</span>
          </div> */}
        </div>
      </div>

      {/* Wallets Section */}
      <div className="bg-gray-50 min-h-screen rounded-t-3xl pt-8 px-6">
        <div className="w-5xl m-auto">
          <h2 className="text-gray-800 text-xl font-semibold mb-6 px-10">My Wallets</h2>
          <div className="w-full flex justify-around flex-wrap gap-2">
            {/* Agent Earnings Wallet */}
            <div className="w-74 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Eye className="w-5 h-5 text-white opacity-80" />
              </div>
              <div className="flex items-center mb-4">
                <div className="bg-white opacity-20 rounded-lg p-2 mr-3">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Agent Earnings Wallet</h3>
                  <p className="text-blue-100 text-sm">•••• •••• •••• 1234</p>
                </div>
              </div>
              <div className="text-2xl font-bold mb-2">15,420.5 USDC</div>
              <div className="text-blue-100 text-sm">Updated 2025/7/19 17:02:15</div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-white opacity-10 rounded-tl-full"></div>
            </div>

            {/* Job Escrow Funds */}
            <div className="w-74 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Eye className="w-5 h-5 text-white opacity-80" />
              </div>
              <div className="flex items-center mb-4">
                <div className="bg-white opacity-20 rounded-lg p-2 mr-3">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Job Escrow Funds</h3>
                  <p className="text-purple-100 text-sm">•••• •••• •••• 5678</p>
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">8,950 USDC</div>
              <div className="text-purple-100 text-sm mb-2">Pending: 2,300 USDC</div>
              <div className="text-purple-100 text-sm">Updated 2025/7/19 17:02:15</div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-white opacity-10 rounded-tl-full"></div>
            </div>

            {/* Staking Rewards Wallet */}
            <div className="w-74 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 flex space-x-2">
                <Eye className="w-5 h-5 text-white opacity-80" />
              </div>
              <div className="flex items-center mb-4">
                <div className="bg-white opacity-20 rounded-lg p-2 mr-3">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Staking Rewards Wallet</h3>
                  <p className="text-green-100 text-sm">•••• •••• •••• 9012</p>
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {/* <span className="text-gray-600">质押余额:</span> */}
                {stakedLoading ? (
                  <span className="text-gray-400">加载中...</span>
                ) : stakedError ? (
                  <span className="text-red-500">加载失败</span>
                ) : (
                  <span className="font-semibold text-purple-600">{formatUSDT(stakedBalance as bigint)} USDT</span>
                )}
              </div>
              {/* <div className="text-green-100 text-sm mb-2">📈 APY: 8.5%</div> */}
              <div className="text-green-100 text-sm mb-4">Updated 2025/7/19 17:02:15</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;
