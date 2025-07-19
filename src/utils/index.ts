// 格式化时间戳
export const formatTimestamp = (timestamp: bigint) => {
  return new Date(Number(timestamp) * 1000).toLocaleString();
};

// 截短地址
export const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// 格式化gas费显示
export const formatGasFee = (gasFee?: bigint) => {
  if (!gasFee) return '计算中...';

  // 转换为 ETH (wei -> ETH)
  const ethValue = Number(gasFee) / 1e18;

  if (ethValue < 0.001) {
    return `${ethValue.toFixed(6)} ETH`;
  }
  return `${ethValue.toFixed(4)} ETH`;
};

// 格式化gas价格
export const formatGasPrice = (gasPrice?: bigint) => {
  if (!gasPrice) return 'N/A';

  // 转换为 Gwei (wei -> Gwei)
  const gweiValue = Number(gasPrice) / 1e9;
  return `${gweiValue.toFixed(2)} Gwei`;
};
