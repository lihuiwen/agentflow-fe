import React, { useEffect, useState } from 'react';
import { useAccount, useWriteContract, useSimulateContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { sepolia } from 'wagmi/chains';

// 合约ABI
const STAKING_CONTRACT_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "stakeUSDT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

const USDT_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "address", "name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

interface StakingActionsProps {
  className?: string;
}

const CONTRACTS = {
  sepolia: {
    staking: '0xB51d6daA8c137F60780d413837BBab667C48032d' as `0x${string}`, // 替换为你的质押合约地址
    usdt: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0' as `0x${string}`, // Sepolia USDT地址
  },
};

const StakingActions: React.FC<StakingActionsProps> = ({ className }) => {
  const { address, isConnected, chain } = useAccount();
  const [isApproving, setIsApproving] = useState(false);
  const [isStaking, setIsStaking] = useState(false);

  const stakingContractAddress = CONTRACTS.sepolia.staking as `0x${string}`;
  const usdtContractAddress = CONTRACTS.sepolia.usdt as `0x${string}`;
  
  // 10 USDT (6位小数)
  const STAKE_AMOUNT = parseUnits('10', 6);
  const STAKE_AMOUNT_DISPLAY = '10.00';

  // 获取用户USDT余额
  const { data: usdtBalance } = useReadContract({
    address: usdtContractAddress,
    abi: USDT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
      refetchInterval: 10000,
    }
  });

  // 获取授权额度
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: usdtContractAddress,
    abi: USDT_ABI,
    functionName: 'allowance',
    args: address ? [address, stakingContractAddress] : undefined,
    query: {
      enabled: !!address && isConnected,
      refetchInterval: 5000,
    }
  });

  // 模拟授权交易
  const { data: approveSimulation } = useSimulateContract({
    address: usdtContractAddress,
    abi: USDT_ABI,
    functionName: 'approve',
    args: [stakingContractAddress, STAKE_AMOUNT],
    query: {
      enabled: !!address && isConnected && (allowance || BigInt(0)) < STAKE_AMOUNT,
    }
  });

  // 模拟质押交易
  const { data: stakeSimulation } = useSimulateContract({
    address: stakingContractAddress,
    abi: STAKING_CONTRACT_ABI,
    functionName: 'stakeUSDT',
    args: [STAKE_AMOUNT],
    query: {
      enabled: !!address && isConnected && (allowance || BigInt(0)) >= STAKE_AMOUNT,
    }
  });

  // 执行交易的Hook
  const { 
    writeContract: writeApprove, 
    data: approveHash,
    error: approveError 
  } = useWriteContract();

  const { 
    writeContract: writeStake, 
    data: stakeHash,
    error: stakeError 
  } = useWriteContract();

  // 等待交易确认
  const { isLoading: isApproveConfirmingRaw, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
    query: {
      enabled: !!approveHash,
    }
  });

  const { isLoading: isStakeConfirmingRaw, isSuccess: isStakeSuccess } = useWaitForTransactionReceipt({
    hash: stakeHash,
    query: {
      enabled: !!stakeHash,
    }
  });

  // 手动控制确认状态，避免在没有交易哈希时显示加载中
  const isApproveConfirming = approveHash && isApproveConfirmingRaw;
  const isStakeConfirming = stakeHash && isStakeConfirmingRaw;

  // 处理授权成功
  useEffect(() => {
    if (isApproveSuccess && approveHash) {
      setIsApproving(false);
      refetchAllowance();
      console.log('授权成功！');
    }
  }, [isApproveSuccess, approveHash, refetchAllowance]);

  // 处理质押成功
  useEffect(() => {
    if (isStakeSuccess && stakeHash) {
      setIsStaking(false);
      console.log('质押成功！');
    }
  }, [isStakeSuccess, stakeHash]);

  // 执行授权
  const handleApprove = () => {
    if (!approveSimulation?.request) return;
    
    setIsApproving(true);
    try {
      writeApprove(approveSimulation.request);
    } catch (error) {
      setIsApproving(false);
      console.error('授权失败:', error);
    }
  };

  // 执行质押
  const handleStake = () => {
    if (!stakeSimulation?.request) return;
    
    setIsStaking(true);
    try {
      writeStake({
        address: stakingContractAddress,
        abi: STAKING_CONTRACT_ABI,
        functionName: 'stakeUSDT',
        args: [STAKE_AMOUNT],
        chain: undefined,
        account: address,
      });
    } catch (error) {
      setIsStaking(false);
      console.error('质押失败:', error);
    }
  };

  // 检查条件
  const hasEnoughBalance = usdtBalance && usdtBalance >= STAKE_AMOUNT;
  const hasEnoughAllowance = allowance && allowance >= STAKE_AMOUNT;
  const isWrongNetwork = chain?.id !== sepolia.id;

  // 格式化USDT余额
  const formatUSDT = (value: bigint | undefined) => {
    if (!value) return '0.00';
    return parseFloat(formatUnits(value, 6)).toFixed(2);
  };

  if (!isConnected) {
    return (
      <div className={`p-4 border rounded-lg bg-gray-50 ${className || ''}`}>
        <p className="text-gray-600 text-center">请先连接钱包</p>
      </div>
    );
  }

  if (isWrongNetwork) {
    return (
      <div className={`p-4 border rounded-lg bg-yellow-50 border-yellow-200 ${className || ''}`}>
        <p className="text-yellow-800 text-center">请切换到Sepolia测试网</p>
      </div>
    );
  }

  return (
    <div className={`p-6 border rounded-lg bg-white shadow-sm ${className || ''}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">质押操作</h3>
        <div className="text-3xl font-bold text-blue-600 mb-1">
          {STAKE_AMOUNT_DISPLAY} USDT
        </div>
        <p className="text-sm text-gray-600">快速质押到合约</p>
      </div>

      {/* 余额检查 */}
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">您的USDT余额:</span>
          <span className={`font-semibold ${hasEnoughBalance ? 'text-green-600' : 'text-red-600'}`}>
            {formatUSDT(usdtBalance)} USDT
          </span>
        </div>
        
        {allowance !== undefined && (
          <div className="flex justify-between items-center text-sm mt-1">
            <span className="text-gray-600">已授权额度:</span>
            <span className={`font-semibold ${hasEnoughAllowance ? 'text-green-600' : 'text-orange-600'}`}>
              {formatUSDT(allowance)} USDT
            </span>
          </div>
        )}
      </div>

      {/* 错误提示 */}
      {!hasEnoughBalance && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          ❌ USDT余额不足，需要至少 {STAKE_AMOUNT_DISPLAY} USDT
        </div>
      )}

      {(approveError || stakeError) && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          ❌ 交易失败: {approveError?.message || stakeError?.message}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="space-y-3">
        {!hasEnoughAllowance ? (
          // 授权按钮
          <button
            onClick={handleApprove}
            disabled={!hasEnoughBalance || isApproving || isApproveConfirming || !approveSimulation}
            className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {isApproving || isApproveConfirming ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isApproveConfirming ? '确认中...' : '授权中...'}
              </span>
            ) : (
              `授权 ${STAKE_AMOUNT_DISPLAY} USDT`
            )}
          </button>
        ) : (
          // 质押按钮
          <button
            onClick={handleStake}
            disabled={!hasEnoughBalance || isStaking || isStakeConfirming || !stakeSimulation}
            className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {isStaking || isStakeConfirming ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isStakeConfirming ? '确认中...' : '质押中...'}
              </span>
            ) : (
              `质押 ${STAKE_AMOUNT_DISPLAY} USDT`
            )}
          </button>
        )}
      </div>

      {/* 交易哈希显示 */}
      {(approveHash || stakeHash) && (
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-sm text-blue-800 font-semibold mb-2">交易提交成功！</p>
          {approveHash && (
            <div className="text-xs">
              <span className="text-blue-600">授权交易: </span>
              <a 
                href={`https://sepolia.etherscan.io/tx/${approveHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-800 underline break-all"
              >
                {approveHash}
              </a>
            </div>
          )}
          {stakeHash && (
            <div className="text-xs mt-1">
              <span className="text-blue-600">质押交易: </span>
              <a 
                href={`https://sepolia.etherscan.io/tx/${stakeHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-800 underline break-all"
              >
                {stakeHash}
              </a>
            </div>
          )}
        </div>
      )}

      {/* 操作说明 */}
      <div className="mt-4 text-xs text-gray-500">
        <p>💡 操作流程:</p>
        <p>1. 首次质押需要先授权合约使用您的USDT</p>
        <p>2. 授权完成后点击质押按钮</p>
        <p>3. 确认MetaMask中的交易</p>
      </div>
    </div>
  );
};

export default StakingActions;