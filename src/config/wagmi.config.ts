// wagmi.config.ts
import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { 
  injected, 
  metaMask, 
  walletConnect 
} from 'wagmi/connectors';

// 创建 wagmi 配置（仅主网和测试网）
export const config = createConfig({
  // 支持的区块链网络
  chains: [
    mainnet,    // 以太坊主网
    sepolia,    // 以太坊测试网
  ],
  
  // 钱包连接器配置
  connectors: [
    // 浏览器注入的钱包（如 MetaMask 等）
    injected(),
    
    // MetaMask 专用连接器
    metaMask(),
  ],
  
  // 网络传输配置
  transports: {
    [mainnet.id]: http(), // 以太坊主网
    [sepolia.id]: http(), // Sepolia 测试网
  },
});