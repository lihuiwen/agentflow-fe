import { useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { formatEther } from 'viem';
import { Button } from '@mui/material';
import { Wallet } from 'lucide-react';
import { useChainStore, useUserStore } from '@store/index';
import { shortenAddress } from '@utils/index';

export default function Wallets() {
  // 通过 wagmi 获取账户地址和连接状态
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  // 获取 store
  const isLinking: boolean = useChainStore((state: { isLinking: boolean }) => state.isLinking);
  // 获取余额
  const { data: balance, isLoading, error } = useBalance({ address });
  // 更新链接地址
  const updateAddress = useUserStore((state) => state.updateAddress);
  // 页面加载是自动触发链接按钮
  useEffect(() => {
    connect({ connector: injected() })
  }, []);
  // 监听获取余额是否出错
  useEffect(() => {
    if (error) {
      console.error('Error fetching balance:', error);
    }
  }, [error]);

  // 监听链接账号
  useEffect(() => {
    if (isConnected) {
      // 把地址保存到 store 中
      updateAddress(address);
    } else {
      updateAddress(undefined);
    }
  }, [isConnected]);

  return (
    <>
      <div className="basis-2/3 flex flex-flow justify-end pr-2 text-blue-500">
        {!isConnected ? (
          <Button
            variant="contained"
            startIcon={<Wallet />}
            onClick={() => connect({ connector: injected() })}
          >
            链接钱包
          </Button>
        ) : (
          <>
            {isLoading ? (
              <span className="mr-2 h-10 text-base/10">余额加载中...</span>
            ) : error ? (
              <span className="mr-2 h-10 text-base/10">加载出错了</span>
            ) : (
              <span className="mr-2 h-10 text-base/10">
                余额: {balance ? Number(formatEther(balance.value)).toFixed(3) : '--'}{' '}
                {balance?.symbol}
              </span>
            )}
            {isLinking ? (
              <Button loading loadingPosition="start" startIcon={<Wallet />} variant="outlined">
                {shortenAddress(address as string)}
              </Button>
            ) : (
              <Button variant="contained" startIcon={<Wallet />} onClick={() => disconnect()}>
                {shortenAddress(address as string)}
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
}
