// ethereum.d.ts - 以太坊相关类型声明

// 声明 window.ethereum 对象
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeAllListeners: () => void;
      isMetaMask?: boolean;
      isCoinbaseWallet?: boolean;
      selectedAddress?: string;
      chainId?: string;
      networkVersion?: string;
    };
  }
}

export {};
