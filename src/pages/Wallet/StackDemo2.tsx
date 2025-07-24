import React, { useEffect, useState } from 'react';
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACTS, STAKING_CONTRACT_ABI, formatUSDT } from './contractHelpers';

interface WithdrawActionsProps {
  className?: string;
}

const WithdrawActions: React.FC<WithdrawActionsProps> = ({ className }) => {
  const { address, isConnected } = useAccount();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

  const stakingContractAddress = CONTRACTS.sepolia.staking as `0x${string}`;

  // 获取用户质押余额 - 使用合约的getBalance方法
  const {
    data: stakedBalance,
    error: stakedBalanceError,
  } = useReadContract({
    address: stakingContractAddress,
    abi: STAKING_CONTRACT_ABI,
    functionName: 'getBalance',
    args: [],
    account: address,
    query: {
      enabled: !!address && isConnected,
      refetchInterval: 10000,
    },
  });

  // 模拟提取交易 - 简化版本，不依赖余额查询
  const withdrawAmountBigInt = withdrawAmount ? parseUnits(withdrawAmount, 6) : BigInt(0);

  // 执行交易的Hook
  const { writeContract: writeWithdraw, data: withdrawHash, error: withdrawError } = useWriteContract();

  // 等待交易确认
  const { isLoading: isWithdrawConfirmingRaw, isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({
    hash: withdrawHash,
    query: {
      enabled: !!withdrawHash,
    },
  });

  // 手动控制确认状态，避免在没有交易哈希时显示加载中
  const isWithdrawConfirming = withdrawHash && isWithdrawConfirmingRaw;

  // 处理转账成功
  useEffect(() => {
    if (isWithdrawSuccess && withdrawHash) {
      setIsWithdrawing(false);
      setWithdrawAmount('');
      setRecipientAddress('');
      console.log('转账成功！');
    }
  }, [isWithdrawSuccess, withdrawHash]);

  // 执行转账操作
  const handleWithdraw = () => {
    if (!address || !recipientAddress) return;

    setIsWithdrawing(true);
    try {
      writeWithdraw({
        address: stakingContractAddress,
        abi: STAKING_CONTRACT_ABI,
        functionName: 'transferBalance',
        args: [recipientAddress as `0x${string}`, withdrawAmountBigInt],
        chain: undefined,
        account: address,
      });
    } catch (error) {
      setIsWithdrawing(false);
      console.error('转账失败:', error);
    }
  };

  // 地址验证函数
  const isValidAddress = (addr: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  return (
    <div className={`p-6 border rounded-lg bg-white shadow-sm ${className || ''}`}>
      {/* 提取界面 */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">转账操作</h3>
        <div className="text-2xl font-bold text-green-600 mb-1">质押余额转账</div>
        <p className="text-sm text-gray-600">将质押余额转账到指定地址</p>
      </div>

      {/* USDT余额检查区域 */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <div className="text-blue-800 font-semibold mb-2">💰 USDT余额检查</div>

        {stakedBalanceError && (
          <div className="mb-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-xs">
            ❌ getBalance() 查询失败: {stakedBalanceError.message}
          </div>
        )}

        <div className="text-sm text-blue-700">
          <div>
            🎯 getBalance(): <strong>{formatUSDT(stakedBalance as bigint)} USDT</strong>
          </div>
        </div>

        {(!stakedBalance || (stakedBalance as bigint) === BigInt(0)) && !stakedBalanceError && (
          <div className="mt-2 p-2 bg-orange-100 border border-orange-300 rounded text-orange-700 text-xs">
            <p className="font-semibold">⚠️ getBalance() 返回0的可能原因:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>您在质押合约中没有余额</li>
              <li>质押合约地址不正确</li>
              <li>需要先进行质押操作</li>
            </ul>
          </div>
        )}
      </div>
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <div className="flex justify-between items-center text-sm mt-1">
          <span className="text-gray-600">质押余额:</span>
          <span className="font-semibold text-gray-600">{formatUSDT(stakedBalance as bigint)} USDT</span>
        </div>
      </div>

      {/* 使用可用的余额数据 */}
      {
        <>
          {/* 显示实际获取到的余额 */}
          <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
            <div className="font-semibold">✅ 成功获取质押余额!</div>
            <div>
              余额: <span className="font-bold">{formatUSDT(stakedBalance as bigint)} USDT</span>
            </div>
          </div>

          {/* 提取金额输入 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">提取金额 (USDT)</label>
            <div className="relative">
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="输入提取金额"
                min="0"
                max={formatUSDT(stakedBalance as bigint)}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => {
                  if (stakedBalance) {
                    setWithdrawAmount(formatUSDT(stakedBalance as bigint));
                  }
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                最大
              </button>
            </div>
          </div>

          {/* 接收地址输入 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">接收地址</label>
            <div className="relative">
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="输入接收地址 (0x...)"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  recipientAddress && !isValidAddress(recipientAddress) 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
              />
              <button
                onClick={() => setRecipientAddress(address || '')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                自己
              </button>
            </div>
            {recipientAddress && !isValidAddress(recipientAddress) && (
              <p className="mt-1 text-sm text-red-600">请输入有效的以太坊地址</p>
            )}
          </div>

          {/* 错误提示 */}
          {withdrawError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
              ❌ 提取失败: {withdrawError.message}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="space-y-3">
            {/* 部分提取按钮 */}
            <button
              onClick={handleWithdraw}
              disabled={
                !withdrawAmount ||
                parseFloat(withdrawAmount) <= 0 ||
                !recipientAddress ||
                !isValidAddress(recipientAddress) ||
                (stakedBalance && parseUnits(withdrawAmount, 6) > (stakedBalance as bigint)) ||
                isWithdrawing ||
                isWithdrawConfirming
              }
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {isWithdrawing || isWithdrawConfirming ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isWithdrawConfirming ? '确认中...' : '转账中...'}
                </span>
              ) : (
                `转账 ${withdrawAmount || '0'} USDT`
              )}
            </button>
          </div>
        </>
      }

      {/* 交易哈希显示 */}
      {withdrawHash && (
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-sm text-blue-800 font-semibold mb-2">交易提交成功！</p>
          <div className="text-xs">
            <span className="text-blue-600">提取交易: </span>
            <a
              href={`https://sepolia.etherscan.io/tx/${withdrawHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 underline break-all"
            >
              {withdrawHash}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawActions;
