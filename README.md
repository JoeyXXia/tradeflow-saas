# TradeFlow SaaS

面向中小贸易企业的多租户业务平台：采购、库存、客户订货与后台订单共用交易核心。后端 NestJS / TypeScript，后续前端采用 Vue 3。

**当前进度：Day 1 工程骨架。** 已提供健康接口和配置校验；采购、交易、数据库与前端尚未实现，无在线 Demo。未来业务使用合成数据和模拟支付。

- [三条用户故事、业务不变量与不做项](docs/scope.md)
- [项目计划](docs/planning/TradeFlow-SaaS-项目总计划.md) · [56 天计划](docs/planning/TradeFlow-SaaS-56天每日计划.md)
- [版本与架构决策](docs/adr/0001-day1-tooling.md) · [今日进度和验证记录](docs/devlog/2026-10-23-day-01.md)

## 环境

精确基线：**Node.js 24.19.0 + pnpm 11.25.0**。先用你已有的 Node 版本管理器选择 `.nvmrc` 中的版本，再安装对应 pnpm（例如 `npm install --global pnpm@11.25.0`）。项目不使用 `latest`，不要求 Docker 即可完成 Day 1 验收。

本机终端默认 Node 是 22.14.0，而 Codex 提供的 pnpm 使用随附 Node 24.19.0。在本机 PowerShell 中可仅为当前终端切换，不修改全局 PATH：

```powershell
$env:Path = "C:\Users\27019\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;$env:Path"
node --version
pnpm --version
```

其他机器使用自己的 Node 安装位置，不复制上述机器专属路径。

## 从空依赖安装并启动

在仓库根目录执行：

```powershell
pnpm install --frozen-lockfile
Copy-Item .env.example .env  # 可选；只在没有 .env 时执行
pnpm build
pnpm lint
pnpm test
pnpm start
```

另开终端验证：

```powershell
Invoke-RestMethod http://127.0.0.1:3000/health
```

预期 HTTP 200，JSON：

```json
{"status":"ok","service":"tradeflow-api"}
```

也可使用 `curl http://127.0.0.1:3000/health`。服务默认仅监听本机；Ctrl+C 停止。`pnpm dev` 合并编译和启动，当前修改源码后需重启。

2026-10-23 已在 Windows / Node 24.19.0 下从无 `node_modules` 的源码副本完成冻结安装，build、lint 和 14 项测试通过；测试实际启动编译后的 API 并访问 HTTP。详细失败与修复见 [Day 1 记录](docs/devlog/2026-10-23-day-01.md)。

## 可用命令

| 命令 | 作用 |
|---|---|
| `pnpm build` | strict TypeScript 编译 API |
| `pnpm lint` | ESLint，警告也导致失败 |
| `pnpm test` | 先编译，再运行配置单测和真实 HTTP 启动冒烟测试 |
| `pnpm test:unit` | 配置输入与边界验证 |
| `pnpm test:smoke` | 启动编译产物，检查 `.env`、健康响应、404 和非法配置退出 |
| `pnpm check` | lint + 编译 + 全部现有测试 |
| `pnpm start` | 启动已有编译产物 |

尚无数据库 integration/concurrency、迁移、对账、demo 命令。不会用 mock 冒充这些验证。

## 配置

Node 从仓库根目录加载可选 `.env`，已有进程环境变量优先。错误配置在监听前使启动失败，错误只包含字段名和要求，不回显配置值。

| 变量 | 默认值 | 校验 |
|---|---|---|
| `NODE_ENV` | `development` | development / test / production |
| `HOST` | `127.0.0.1` | 合法 IPv4 / IPv6 地址；需对外监听时显式设置 |
| `PORT` | `3000` | 1–65535 的十进制整数，无空格、指数或尾随字符 |

`.env` 和 `.env.*` 被 Git 忽略，仅 `.env.example` 允许提交。Day 1 没有数据库密码或其他凭据配置。`/health` 仅证明 API 存活，不代表数据库或队列就绪。

## 最小目录

```text
apps/api/src/         # NestJS 模块、配置校验、健康接口和启动入口
packages/database/   # 仅 Prisma CLI/Client 版本锁定，尚无模型
tests/unit/          # 运行时配置边界
tests/smoke/         # 真实子进程与 HTTP 启动检查
docs/planning/       # 原始三份计划
docs/adr/            # 架构和工具决策
docs/devlog/         # 实际进度与失败记录
```

Day 2 前置项：本机尚未发现 Docker CLI，需要准备 Docker Desktop/WSL2 或其他明确的 PostgreSQL 开发环境；本次未安装或启动它们。
