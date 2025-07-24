import USDTStaking from '@/abis/USDTStaking.json';

// 合约配置
export const CONTRACTS = {
  sepolia: {
    staking: '0xE63599269C25Db849068F50D5080B53f7b8f5F78' as `0x${string}`,
    usdt: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0' as `0x${string}`,
  },
};

// 合约ABI
export const STAKING_CONTRACT_ABI = USDTStaking.abi;

// USDT合约ABI（仅包含必要方法）
export const USDT_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// 基于USDTStaking.json ABI的合约方法定义
export interface USDTStakingContract {
  // 查询方法
  getBalance: () => Promise<bigint>; // 获取用户在合约中的质押余额
  getContractUSDTBalance: () => Promise<bigint>; // 获取合约的USDT总余额
  getTotalStaked: () => Promise<bigint>; // 获取总质押金额
  getUserUSDTAllowance: (user: string) => Promise<bigint>; // 获取用户对合约的USDT授权额度
  getUserUSDTBalance: (user: string) => Promise<bigint>; // 获取用户的USDT余额
  owner: () => Promise<string>; // 获取合约所有者
  totalStaked: () => Promise<bigint>; // 总质押金额（状态变量）
  usdtToken: () => Promise<string>; // USDT代币合约地址

  // 交易方法
  stakeUSDT: (amount: bigint) => Promise<void>; // 质押USDT
  transferBalance: (to: string, amount: bigint) => Promise<void>; // 转移余额给其他地址
  withdrawAll: () => Promise<void>; // 提取所有余额
}

// 合约方法名称映射
export const CONTRACT_METHODS = {
  // 查询方法
  GET_BALANCE: 'getBalance',
  GET_CONTRACT_USDT_BALANCE: 'getContractUSDTBalance', 
  GET_TOTAL_STAKED: 'getTotalStaked',
  GET_USER_USDT_ALLOWANCE: 'getUserUSDTAllowance',
  GET_USER_USDT_BALANCE: 'getUserUSDTBalance',
  GET_OWNER: 'owner',
  GET_USDT_TOKEN: 'usdtToken',
  
  // 交易方法
  STAKE_USDT: 'stakeUSDT',
  TRANSFER_BALANCE: 'transferBalance', 
  WITHDRAW_ALL: 'withdrawAll',
  
  // USDT方法
  APPROVE: 'approve',
  BALANCE_OF: 'balanceOf',
  ALLOWANCE: 'allowance',
} as const;

// 事件定义
export const CONTRACT_EVENTS = {
  BALANCE_TRANSFERRED: 'BalanceTransferred',
  STAKED: 'Staked', 
  USDT_TOKEN_UPDATED: 'USDTTokenUpdated',
  WITHDRAWN: 'Withdrawn',
} as const;

// 错误信息映射
export const ERROR_MESSAGES = {
  INSUFFICIENT_BALANCE: 'Insufficient staked balance',
  AMOUNT_GREATER_THAN_ZERO: 'Amount must be greater than 0',
  CANNOT_TRANSFER_TO_ZERO: 'Cannot transfer to zero address',
  USDT_TRANSFER_FAILED: 'USDT transfer failed',
  NO_BALANCE_TO_WITHDRAW: 'No balance to withdraw',
  INSUFFICIENT_USDT_BALANCE: 'Insufficient USDT balance',
  INSUFFICIENT_ALLOWANCE: 'Insufficient USDT allowance',
} as const;

// 工具函数
export const formatUSDT = (value: bigint | undefined | unknown): string => {
  if (!value) return '0.00';
  return (Number(value) / 1000000).toFixed(2);
};

export const parseUSDT = (value: string): bigint => {
  return BigInt(Math.floor(parseFloat(value) * 1000000));
};