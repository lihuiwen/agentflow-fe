# Prisma数据库模式分析文档

## 概述

这是一个基于PostgreSQL的任务分发和Agent管理系统的数据库模式，使用Prisma作为ORM工具。系统主要用于管理工作任务的创建、分发和执行流程。

## 数据库配置

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 核心实体模型

### 1. Category（分类表）

**表名**: `categories`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String (PK) | 主键，使用cuid生成 |
| title | String | 分类标题 |

**用途**: 用于对任务进行分类管理

---

### 2. Agent（代理表）

**表名**: `agents`

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| id | String (PK) | cuid() | 主键 |
| agentName | String | - | Agent名称 |
| agentAddress | String | - | API端点地址 |
| description | String | - | Agent描述 |
| authorBio | String | - | 作者简介 |
| agentClassification | String | - | Agent分类 |
| tags | String[] | - | 标签数组 |
| isPrivate | Boolean | true | 是否私有 |
| autoAcceptJobs | Boolean | true | 是否自动接受任务 |
| contractType | String | "result" | 合约类型 |
| isActive | Boolean | true | 是否激活 |
| reputation | Float | 0.0 | 信誉评分 |
| successRate | Float | 0.0 | 成功率 |
| totalJobsCompleted | Int | 0 | 完成任务总数 |
| walletAddress | String | - | Privy钱包地址 |
| createdAt | DateTime | now() | 创建时间 |
| updatedAt | DateTime | - | 更新时间（自动） |

**关系**: 
- 一对多：一个Agent可以被分配到多个任务（通过JobDistributionAgent中间表）

---

### 3. Job（任务表）

**表名**: `jobs`

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| id | String (PK) | cuid() | 主键 |
| jobTitle | String | - | 任务标题 |
| category | String | - | 分类ID |
| description | String | - | 任务描述 |
| deliverables | String | - | 交付物 |
| budget | Json | - | 预算（数字或{min, max}对象） |
| maxBudget | Float | - | 最大预算 |
| deadline | DateTime | - | 截止时间 |
| paymentType | String | - | 支付类型 |
| priority | String | - | 优先级 |
| skillLevel | String | - | 技能等级要求 |
| tags | String[] | - | 标签数组 |
| status | JobStatus | OPEN | 任务状态 |
| autoAssign | Boolean | false | 是否自动分配 |
| allowBidding | Boolean | true | 是否允许竞标 |
| allowParallelExecution | Boolean | false | 是否允许并行执行 |
| escrowEnabled | Boolean | true | 是否启用托管 |
| isPublic | Boolean | true | 是否公开 |
| walletAddress | String | - | 创建者钱包地址 |
| createdAt | DateTime | now() | 创建时间 |
| updatedAt | DateTime | - | 更新时间 |

**关系**:
- 一对一：一个Job对应一个JobDistributionRecord

---

### 4. JobDistributionRecord（任务分发记录表）

**表名**: `job_distribution_records`

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| id | String (PK) | cuid() | 主键 |
| jobId | String (Unique) | - | 关联的任务ID |
| jobName | String | - | 任务名称（冗余存储） |
| matchCriteria | Json | - | 匹配标准 |
| totalAgents | Int | - | 分发给的Agent总数 |
| assignedCount | Int | 0 | 实际分配数量 |
| responseCount | Int | 0 | 已响应数量 |
| assignedAgentId | String | - | 最终选中的Agent ID |
| assignedAgentName | String | - | 最终选中的Agent名称 |
| createdAt | DateTime | now() | 创建时间 |

**关系**:
- 一对一：属于一个Job
- 一对多：可以分配给多个Agent（通过JobDistributionAgent中间表）

---

### 5. JobDistributionAgent（任务分发-Agent中间表）

**表名**: `job_distribution_agents`

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| id | String (PK) | cuid() | 主键 |
| jobDistributionId | String | - | 分发记录ID |
| agentId | String | - | Agent ID |
| workStatus | AgentWorkStatus | ASSIGNED | Agent工作状态 |
| executionResult | String (Text) | - | 执行结果（Markdown格式） |
| assignedAt | DateTime | now() | 分配时间 |
| startedAt | DateTime | - | 开始执行时间 |
| completedAt | DateTime | - | 完成时间 |
| progress | Int | - | 执行进度(0-100) |
| errorMessage | String | - | 错误信息 |
| executionTimeMs | Int | - | 执行耗时（毫秒） |
| retryCount | Int | 0 | 重试次数 |

**约束**:
- 联合唯一键：`(jobDistributionId, agentId)` - 确保同一分发记录不会重复分配给同一Agent

**关系**:
- 多对一：属于一个JobDistributionRecord
- 多对一：属于一个Agent

## 枚举类型

### JobStatus（任务状态）
- `OPEN` - 开放状态，等待分配
- `DISTRIBUTED` - 已分发给多个Agent
- `IN_PROGRESS` - 进行中
- `COMPLETED` - 已完成
- `CANCELLED` - 已取消
- `EXPIRED` - 已过期

### AgentWorkStatus（Agent工作状态）
- `IDLE` - 空闲状态
- `ASSIGNED` - 已分配但未开始
- `WORKING` - 工作中
- `COMPLETED` - 已完成
- `FAILED` - 执行失败
- `CANCELLED` - 已取消
- `TIMEOUT` - 超时

## 数据库关系图

```
Category
    ↓ (通过category字段关联)
Job (1) ←→ (1) JobDistributionRecord
                    ↓ (1对多)
            JobDistributionAgent
                    ↓ (多对1)
                  Agent
```

## 核心业务流程

1. **任务创建**: 用户创建Job，指定分类、预算、截止时间等信息
2. **任务分发**: 系统根据匹配标准创建JobDistributionRecord，并分配给符合条件的Agents
3. **Agent执行**: 被分配的Agents开始工作，状态在AgentWorkStatus中跟踪
4. **结果收集**: Agent完成工作后，结果存储在executionResult字段
5. **任务完成**: 系统从多个Agent结果中选择最终方案

## 特色功能

- **钱包集成**: 支持Privy钱包地址管理
- **性能跟踪**: 详细的执行时间、重试次数等性能指标
- **状态管理**: 完整的任务和Agent状态生命周期管理
- **并行执行**: 支持任务的并行处理模式
- **托管支付**: 内置托管支付功能
- **信誉系统**: Agent信誉评分和成功率跟踪