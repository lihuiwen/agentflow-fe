# Ethers v6 主要 API 总结

## 概述

Ethers v6 是对 Ethers v5 的重大更新，主要变化包括：

- 移除了 `ethers.utils` 命名空间
- 引入了原生 BigInt 支持
- 改进了 TypeScript 类型支持
- 优化了性能和包大小

## 主要 API 变化

### 1. 格式化工具 (Format Utilities)

#### v5 → v6 迁移

```typescript
// v5 写法
ethers.utils.formatEther(value); // 将 Wei 转换为 ETH（人类可读格式）
ethers.utils.parseEther(value); // 将 ETH 字符串转换为 Wei（BigInt）
ethers.utils.formatUnits(value, decimals); // 将最小单位转换为指定小数位数的字符串
ethers.utils.parseUnits(value, decimals); // 将字符串转换为指定小数位数的最小单位

// v6 写法
ethers.formatEther(value); // 将 Wei 转换为 ETH（人类可读格式）
ethers.parseEther(value); // 将 ETH 字符串转换为 Wei（BigInt）
ethers.formatUnits(value, decimals); // 将最小单位转换为指定小数位数的字符串
ethers.parseUnits(value, decimals); // 将字符串转换为指定小数位数的最小单位
```

#### 实际使用示例

```typescript
// 格式化 Wei 到 ETH - 用于显示余额给用户看
const balance = await provider.getBalance(address); // 返回 Wei (BigInt)
const ethBalance = ethers.formatEther(balance); // 转换为 "1.5" 这样的字符串

// 解析 ETH 到 Wei - 用于发送交易
const amount = ethers.parseEther("1.5"); // 将 "1.5" 转换为 Wei (BigInt)
const hexValue = "0x" + amount.toString(16); // 转换为十六进制字符串发送给区块链

// 处理其他代币（如 USDC 有 6 位小数）
const usdcAmount = ethers.parseUnits("100", 6); // 解析 100 USDC 到最小单位
const usdcDisplay = ethers.formatUnits(usdcAmount, 6); // 格式化显示为 "100.0"
```

### 2. 地址工具 (Address Utilities)

```typescript
// v5 写法
ethers.utils.getAddress(address); // 格式化地址为校验和格式（EIP-55）
ethers.utils.isAddress(address); // 检查字符串是否是有效的以太坊地址

// v6 写法
ethers.getAddress(address); // 格式化地址为校验和格式（EIP-55）
ethers.isAddress(address); // 检查字符串是否是有效的以太坊地址
```

#### 使用示例

```typescript
// 格式化地址 - 将小写地址转换为标准格式
const rawAddress = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
const checksumAddress = ethers.getAddress(rawAddress);
// 返回: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

// 验证地址有效性
const isValid = ethers.isAddress("0xd8da6bf26964af9d7eed9e03e53415d37aa96045");
// 返回: true

const isInvalid = ethers.isAddress("invalid-address");
// 返回: false
```

### 3. 哈希工具 (Hash Utilities)

```typescript
// v5 写法
ethers.utils.keccak256(data); // 计算数据的 Keccak-256 哈希
ethers.utils.solidityKeccak256(types, values); // 计算 Solidity 编码数据的哈希
ethers.utils.hashMessage(message); // 计算消息的以太坊签名哈希

// v6 写法
ethers.keccak256(data); // 计算数据的 Keccak-256 哈希
ethers.solidityPackedKeccak256(types, values); // 计算 Solidity 编码数据的哈希
ethers.hashMessage(message); // 计算消息的以太坊签名哈希
```

#### 使用示例

```typescript
// 计算字符串的哈希
const message = "Hello World";
const messageBytes = ethers.toUtf8Bytes(message);
const hash = ethers.keccak256(messageBytes);
// 返回: "0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba"

// 计算 Solidity 风格的哈希（用于智能合约）
const hash2 = ethers.solidityPackedKeccak256(
  ["string", "uint256"], // 类型数组
  ["Hello", 42] // 值数组
);

// 计算消息签名哈希（用于个人签名）
const messageHash = ethers.hashMessage("Hello Web3!");
// 返回: 以太坊前缀的消息哈希
```

### 4. 编码工具 (Encoding Utilities)

```typescript
// v5 写法
ethers.utils.hexlify(data); // 将数据转换为十六进制字符串
ethers.utils.toUtf8Bytes(str); // 将 UTF-8 字符串转换为字节数组
ethers.utils.toUtf8String(bytes); // 将字节数组转换为 UTF-8 字符串

// v6 写法
ethers.hexlify(data); // 将数据转换为十六进制字符串
ethers.toUtf8Bytes(str); // 将 UTF-8 字符串转换为字节数组
ethers.toUtf8String(bytes); // 将字节数组转换为 UTF-8 字符串
```

#### 使用示例

```typescript
// 将字符串转换为字节数组
const message = "Hello Web3!";
const messageBytes = ethers.toUtf8Bytes(message);
// 返回: Uint8Array [72, 101, 108, 108, 111, 32, 87, 101, 98, 51, 33]

// 将字节数组转换为十六进制字符串
const hexString = ethers.hexlify(messageBytes);
// 返回: "0x48656c6c6f20576562332122"

// 将十六进制字符串转换回字符串
const originalMessage = ethers.toUtf8String(hexString);
// 返回: "Hello Web3!"

// 将数字转换为十六进制（指定长度）
const number = 255;
const paddedHex = ethers.hexlify(number, 4); // 4 字节长度
// 返回: "0x000000ff"
```

### 5. Provider 创建

```typescript
// v5 写法
const provider = new ethers.providers.JsonRpcProvider(url); // 连接到 JSON-RPC 节点
const provider = new ethers.providers.Web3Provider(window.ethereum); // 连接到浏览器钱包

// v6 写法
const provider = new ethers.JsonRpcProvider(url); // 连接到 JSON-RPC 节点
const provider = new ethers.BrowserProvider(window.ethereum); // 连接到浏览器钱包
```

#### 使用示例

```typescript
// 连接到公共 RPC 节点
const rpcProvider = new ethers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/YOUR_API_KEY"
);

// 连接到浏览器钱包（MetaMask）
const browserProvider = new ethers.BrowserProvider(window.ethereum);

// 获取网络信息
const network = await provider.getNetwork();
console.log("网络名称:", network.name);
console.log("链 ID:", network.chainId);

// 获取区块高度
const blockNumber = await provider.getBlockNumber();
console.log("当前区块高度:", blockNumber);

// 获取 Gas 价格
const gasPrice = await provider.getGasPrice();
console.log("Gas 价格:", ethers.formatUnits(gasPrice, "gwei"), "Gwei");
```

### 6. 合约交互

```typescript
// v5 写法
const contract = new ethers.Contract(address, abi, provider); // 创建只读合约实例
const contractWithSigner = contract.connect(signer); // 连接签名器进行写操作

// v6 写法 (基本相同)
const contract = new ethers.Contract(address, abi, provider); // 创建只读合约实例
const contractWithSigner = contract.connect(signer); // 连接签名器进行写操作
```

#### 使用示例

```typescript
// ERC-20 代币合约 ABI（简化版）
const tokenABI = [
  "function balanceOf(address) view returns (uint256)", // 查询余额
  "function transfer(address to, uint256 amount) returns (bool)", // 转账
  "function approve(address spender, uint256 amount) returns (bool)", // 授权
  "event Transfer(address indexed from, address indexed to, uint256 value)", // 转账事件
];

const tokenAddress = "0x..."; // 代币合约地址

// 创建只读合约实例
const contract = new ethers.Contract(tokenAddress, tokenABI, provider);

// 查询余额（只读操作）
const balance = await contract.balanceOf(userAddress);
console.log("代币余额:", ethers.formatUnits(balance, 18));

// 创建可写合约实例
const signer = await provider.getSigner();
const contractWithSigner = contract.connect(signer);

// 执行转账（写操作）
const tx = await contractWithSigner.transfer(
  "0x...", // 接收地址
  ethers.parseUnits("100", 18) // 转账金额
);
await tx.wait(); // 等待交易确认

// 监听事件
contract.on("Transfer", (from, to, value) => {
  console.log(`转账: ${from} -> ${to}, 金额: ${ethers.formatUnits(value, 18)}`);
});
```

### 7. 钱包创建

```typescript
// v5 写法
const wallet = new ethers.Wallet(privateKey, provider); // 从私钥创建钱包
const randomWallet = ethers.Wallet.createRandom(); // 创建随机钱包

// v6 写法 (基本相同)
const wallet = new ethers.Wallet(privateKey, provider); // 从私钥创建钱包
const randomWallet = ethers.Wallet.createRandom(); // 创建随机钱包
```

#### 使用示例

```typescript
// 从私钥创建钱包
const privateKey = "0x..."; // 私钥（请勿在生产环境硬编码）
const wallet = new ethers.Wallet(privateKey, provider);

console.log("钱包地址:", wallet.address);
console.log("公钥:", wallet.publicKey);

// 创建随机钱包
const randomWallet = ethers.Wallet.createRandom();
console.log("随机钱包地址:", randomWallet.address);
console.log("随机钱包私钥:", randomWallet.privateKey);
console.log("助记词:", randomWallet.mnemonic.phrase);

// 从助记词创建钱包
const mnemonic =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
const walletFromMnemonic = ethers.Wallet.fromMnemonic(mnemonic);

// 发送 ETH
const tx = await wallet.sendTransaction({
  to: "0x...",
  value: ethers.parseEther("0.1"),
  gasLimit: 21000,
  gasPrice: ethers.parseUnits("20", "gwei"),
});
await tx.wait();

// 签名消息
const message = "Hello Web3!";
const signature = await wallet.signMessage(message);
console.log("签名:", signature);
```

## 常用功能示例

### 获取账户余额

```typescript
// 创建连接到 MetaMask 的 Provider
const provider = new ethers.BrowserProvider(window.ethereum);

// 获取指定地址的 ETH 余额（返回 Wei 单位的 BigInt）
const balance = await provider.getBalance(address);

// 将 Wei 转换为人类可读的 ETH 格式
const ethBalance = ethers.formatEther(balance);
console.log(`余额: ${ethBalance} ETH`);

// 获取特定区块的余额
const blockNumber = await provider.getBlockNumber();
const historicalBalance = await provider.getBalance(address, blockNumber - 100);
console.log(`100个区块前的余额: ${ethers.formatEther(historicalBalance)} ETH`);
```

### 发送交易

```typescript
// 获取签名器（用于发送交易）
const signer = await provider.getSigner();

// 构建交易对象
const tx = {
  to: "0x...", // 接收地址
  value: ethers.parseEther("0.1"), // 发送金额（0.1 ETH）
  gasLimit: 21000, // Gas 限制（ETH 转账固定为 21000）
};

// 发送交易（返回交易响应对象）
const txResponse = await signer.sendTransaction(tx);
console.log("交易哈希:", txResponse.hash);

// 等待交易被挖矿确认
const receipt = await txResponse.wait();
console.log("交易已确认，区块号:", receipt.blockNumber);
console.log("实际使用的 Gas:", receipt.gasUsed.toString());

// 更完整的交易示例
const complexTx = {
  to: "0x...",
  value: ethers.parseEther("0.1"),
  gasLimit: 21000,
  gasPrice: ethers.parseUnits("20", "gwei"), // 指定 Gas 价格
  nonce: await provider.getTransactionCount(await signer.getAddress()), // 指定 nonce
  data: "0x", // 可选的数据字段
};
```

### 签名消息

```typescript
// 获取签名器
const signer = await provider.getSigner();

// 定义要签名的消息
const message = "Hello Web3!";

// 对消息进行签名（用于身份验证）
const signature = await signer.signMessage(message);
console.log("签名结果:", signature);

// 签名结构化数据（EIP-712）
const domain = {
  name: "MyApp",
  version: "1",
  chainId: 1,
  verifyingContract: "0x...",
};

const types = {
  Person: [
    { name: "name", type: "string" },
    { name: "wallet", type: "address" },
  ],
};

const value = {
  name: "Alice",
  wallet: "0x...",
};

// 对结构化数据进行签名
const structuredSignature = await signer.signTypedData(domain, types, value);
console.log("结构化签名:", structuredSignature);
```

### 验证签名

```typescript
// 验证消息签名，恢复签名者地址
const recoveredAddress = ethers.verifyMessage(message, signature);
console.log("签名者地址:", recoveredAddress);

// 验证地址是否匹配
const signerAddress = await signer.getAddress();
if (recoveredAddress.toLowerCase() === signerAddress.toLowerCase()) {
  console.log("✅ 签名验证成功");
} else {
  console.log("❌ 签名验证失败");
}

// 验证结构化数据签名（EIP-712）
const recoveredFromTypedData = ethers.verifyTypedData(
  domain,
  types,
  value,
  structuredSignature
);
console.log("结构化数据签名者:", recoveredFromTypedData);

// 验证函数封装示例
function verifySignature(message, signature, expectedAddress) {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error("签名验证失败:", error);
    return false;
  }
}
```

## 类型变化

### BigInt 支持

```typescript
// v6 中的数值类型都是 BigInt（原生 JavaScript 大整数类型）
const amount: bigint = ethers.parseEther("1.0"); // 1 ETH = 1000000000000000000n Wei
const balance: bigint = await provider.getBalance(address); // 余额也是 BigInt

// 转换为字符串
const amountStr = amount.toString(); // "1000000000000000000"
const amountHex = "0x" + amount.toString(16); // "0xde0b6b3a7640000"

// BigInt 数学运算
const amount1 = ethers.parseEther("1.5"); // 1.5 ETH
const amount2 = ethers.parseEther("0.5"); // 0.5 ETH
const total = amount1 + amount2; // 2.0 ETH（BigInt 加法）
const difference = amount1 - amount2; // 1.0 ETH（BigInt 减法）
const doubled = amount1 * 2n; // 3.0 ETH（注意：2n 是 BigInt）

// 比较 BigInt
if (balance > ethers.parseEther("1.0")) {
  console.log("余额大于 1 ETH");
}

// 转换为 Number（注意：可能丢失精度）
const balanceInEth = Number(ethers.formatEther(balance));
console.log("余额（Number）:", balanceInEth);

// 处理小数（使用 formatUnits 和 parseUnits）
const gasPrice = ethers.parseUnits("20", "gwei"); // 20 Gwei
const gasPriceInGwei = ethers.formatUnits(gasPrice, "gwei"); // "20.0"
```

### 错误处理

```typescript
try {
  const tx = await signer.sendTransaction(txRequest);
  await tx.wait();
} catch (error) {
  // 处理常见的 ethers 错误
  if (error.code === "ACTION_REJECTED") {
    console.log("❌ 用户拒绝了交易");
  } else if (error.code === "INSUFFICIENT_FUNDS") {
    console.log("❌ 余额不足");
  } else if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
    console.log("❌ 无法预测 Gas 限制，交易可能失败");
  } else if (error.code === "REPLACEMENT_UNDERPRICED") {
    console.log("❌ 替换交易的 Gas 价格过低");
  } else if (error.code === "NETWORK_ERROR") {
    console.log("❌ 网络错误，请检查连接");
  } else {
    console.log("❌ 交易失败:", error.message);
  }
}

// 完整的错误处理示例
async function sendTransactionWithErrorHandling(to, value) {
  try {
    // 检查余额
    const balance = await provider.getBalance(await signer.getAddress());
    if (balance < value) {
      throw new Error("余额不足");
    }

    // 估算 Gas
    const gasLimit = await provider.estimateGas({ to, value });

    // 发送交易
    const tx = await signer.sendTransaction({
      to,
      value,
      gasLimit: (gasLimit * 120n) / 100n, // 增加 20% 的 Gas 缓冲
    });

    console.log("交易已发送:", tx.hash);
    const receipt = await tx.wait();
    console.log("✅ 交易成功:", receipt.hash);
  } catch (error) {
    console.error("交易失败:", error);
    throw error;
  }
}
```

## 最佳实践

1. **使用 BigInt 进行数值计算**

```typescript
// ✅ 正确：使用 BigInt 进行精确计算
const amount1 = ethers.parseEther("1.5");
const amount2 = ethers.parseEther("0.5");
const total = amount1 + amount2; // 精确的 BigInt 运算

// ❌ 错误：直接使用浮点数会丢失精度
const wrongTotal = 1.5 + 0.5; // 可能有精度问题
```

2. **正确处理异步操作**

```typescript
// ✅ 正确：按顺序等待异步操作
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const address = await signer.getAddress();

// ❌ 错误：不等待异步操作完成
const badAddress = signer.getAddress(); // 这是 Promise，不是地址
```

3. **使用类型断言**

```typescript
// ✅ 正确：为 MetaMask 返回值添加类型断言
const accounts = (await window.ethereum.request({
  method: "eth_requestAccounts",
})) as string[];

// ✅ 更好：添加运行时检查
const response = await window.ethereum.request({
  method: "eth_requestAccounts",
});
if (Array.isArray(response)) {
  const accounts = response as string[];
}
```

4. **安全处理私钥**

```typescript
// ✅ 正确：从环境变量读取私钥
const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  throw new Error("私钥未设置");
}

// ❌ 错误：硬编码私钥
const badPrivateKey = "0x1234567890abcdef..."; // 危险！
```

5. **合理设置 Gas 限制**

```typescript
// ✅ 正确：估算 Gas 并添加缓冲
const gasLimit = await provider.estimateGas(txRequest);
const safeTx = {
  ...txRequest,
  gasLimit: (gasLimit * 120n) / 100n, // 增加 20% 缓冲
};

// ❌ 错误：使用固定的 Gas 限制
const unsafeTx = {
  ...txRequest,
  gasLimit: 21000, // 可能不够用
};
```

## 常见问题

### Q: 如何从 v5 迁移到 v6？

A: 主要变化包括：

1. **移除 `ethers.utils` 前缀**：`ethers.utils.formatEther()` → `ethers.formatEther()`
2. **Provider 类名变化**：`Web3Provider` → `BrowserProvider`
3. **原生 BigInt 支持**：所有数值都是 BigInt 类型
4. **更新依赖**：`npm install ethers@^6.0.0`

### Q: BigInt 如何转换为十六进制？

A: 使用 `"0x" + bigintValue.toString(16)`

```typescript
const amount = ethers.parseEther("1.0");
const hex = "0x" + amount.toString(16); // "0xde0b6b3a7640000"
```

### Q: 如何处理精度问题？

A: 使用 `ethers.formatEther()` 和 `ethers.parseEther()` 进行转换，避免直接使用浮点数。

```typescript
// ✅ 正确：使用 ethers 工具函数
const amount = ethers.parseEther("1.5");
const display = ethers.formatEther(amount);

// ❌ 错误：直接使用浮点数
const wrongAmount = 1.5 * 1e18; // 可能有精度问题
```

### Q: 如何处理不同小数位数的代币？

A: 使用 `parseUnits()` 和 `formatUnits()` 指定小数位数。

```typescript
// USDC 有 6 位小数
const usdcAmount = ethers.parseUnits("100", 6);
const display = ethers.formatUnits(usdcAmount, 6);

// WBTC 有 8 位小数
const wbtcAmount = ethers.parseUnits("0.1", 8);
```

### Q: 如何监听区块链事件？

A: 使用 Provider 的事件监听功能。

```typescript
// 监听新区块
provider.on("block", (blockNumber) => {
  console.log("新区块:", blockNumber);
});

// 监听合约事件
contract.on("Transfer", (from, to, value) => {
  console.log("转账事件:", { from, to, value });
});
```

## 参考资源

### 官方文档

- [Ethers v6 官方文档](https://docs.ethers.org/v6/) - 完整的 API 文档和使用指南
- [迁移指南](https://docs.ethers.org/v6/migrating/) - 从 v5 升级到 v6 的详细步骤
- [API 参考](https://docs.ethers.org/v6/api/) - 所有 API 的详细说明

### 社区资源

- [Ethers.js GitHub](https://github.com/ethers-io/ethers.js/) - 源代码和问题反馈
- [Ethers.js 示例](https://github.com/ethers-io/ethers.js/tree/main/examples) - 官方示例代码
- [Web3 开发者社区](https://ethereum.org/developers/) - 以太坊开发者资源

### 相关工具

- [Hardhat](https://hardhat.org/) - 以太坊开发框架（内置 ethers）
- [Remix IDE](https://remix.ethereum.org/) - 在线智能合约开发环境
- [MetaMask](https://metamask.io/) - 浏览器钱包插件

### 测试网络

- [Sepolia 测试网](https://sepolia.etherscan.io/) - 以太坊测试网络
- [Goerli 测试网](https://goerli.etherscan.io/) - 以太坊测试网络
- [Mumbai 测试网](https://mumbai.polygonscan.com/) - Polygon 测试网络

### 学习资源

- [Solidity 文档](https://docs.soliditylang.org/) - 智能合约编程语言
- [Web3.js vs Ethers.js](https://docs.ethers.org/v6/migrating/) - 库对比
- [DApp 开发教程](https://ethereum.org/developers/tutorials/) - 去中心化应用开发
