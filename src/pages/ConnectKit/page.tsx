export default function Page() {
  //  ConnectKit
  // 描述：使用 ConnectKit 库，基于 wagmi 和 viem，与 MetaMask 等钱包交互，支持连接钱包、签名、交易及链切换，提供简洁的 UI 组件（如 ConnectKitButton）。
  // 特点：轻量、易配置，UI 简洁直观，支持多钱包，适合快速集成到 Next.js 应用，配置比 RainbowKit 更简单。
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>connectkit!</h1>
    </div>
  );
}
