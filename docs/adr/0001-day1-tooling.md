# ADR 0001：Day 1 最小工程与版本基线

- 日期：2026-10-23
- 状态：采用；运行验收见 [Day 1 日志](../devlog/2026-10-23-day-01.md)

## 选择

采用 pnpm workspace 和 NestJS 模块化单体。今天只有 API 进程；未来 worker 共享业务规则，在业务出现时再提取 domain/contracts，不预建空框架。管理端和订货页后续共用 Vue 3 工程。

| 组件 | 精确版本 | 核实依据与用途 |
|---|---|---|
| Node.js | 24.19.0 | 本机 Codex 随附运行时实际版本；`.nvmrc`、`.node-version` 与 engines 一致 |
| pnpm | 11.25.0 | 本机实际版本；packageManager 与 engines 固定 |
| NestJS common/core/platform-express | 11.2.7 | npm 元数据 core 要求 Node >=20，三包同版本 |
| TypeScript | 5.9.3 | 满足 Prisma/Jest 的 TS >=5.4，处于 TypeScript ESLint 的 >=4.8.4 <6.1.0 范围 |
| Prisma CLI / Client | 7.10.1 | npm engines 为 ^20.19、^22.12 或 >=24；CLI/Client 配对锁定 |
| Jest | 30.5.2 | npm engines 包含 >=24；测试已编译 JS，无额外 TS transformer |
| ESLint / @eslint/js | 10.13.0 / 10.0.1 | engines 包含 >=24 |
| typescript-eslint | 8.72.0 | peer 支持 ESLint 10 和 TypeScript 5.9 |
| reflect-metadata / RxJS | 0.2.2 / 7.8.2 | NestJS 所需运行依赖 |

核实时 npm 默认 `prisma` 标签返回 `8.0.0-rc.26`，故选已发布的 7.x 稳定版本；默认 TypeScript 为 7.0.2，超过 lint 工具声明范围，故不使用默认标签。选择 NestJS 11 的确定版本，避免为 Day 1 骨架引入 NestJS 12 的 ESM 迁移。依赖声明均为精确版本，传递依赖由 `pnpm-lock.yaml` 固定。

pnpm 11 的普通配置放在 `pnpm-workspace.yaml`，不是 `.npmrc`：启用 engineStrict、strictPeerDependencies、saveExact，store 使用 pnpm 默认位置。构建脚本允许 Prisma/引擎安装所需脚本；关闭 NestJS 的安装后提示和 Prisma Client 自动生成。Client 生成与 schema 配置留到 Day 2。

## 最小启动路径

`pnpm dev` → TypeScript 编译 → Node 加载根目录可选 `.env` → NestFactory 创建 AppModule → 配置 provider 校验 → 注册 HealthController → 监听地址。`dev` 当前是编译后启动，修改源文件需重启，不提供热重载。

生产代码使用 TypeScript strict，输出 CommonJS；Jest 测试直接运行同一份编译产物，从而不增加 ts-jest/SWC 版本组合。配置边界和进程启动失败有验证；这不替代未来真实数据库集成测试。

`/health` 是进程存活探针，只返回服务名与状态，不输出环境变量或假装检查数据库。数据库可用性和 readiness 在真实连接存在后设计。

## 官方依据

- [NestJS 11 发布说明](https://github.com/nestjs/nest/releases/tag/v11.0.0)，以及 npm 官方注册表的 `npm view @nestjs/core@11.2.7 engines peerDependencies --json`。
- [Prisma 7 系统要求](https://docs.prisma.io/docs/orm/v7/reference/system-requirements)。使用 7.x 文档，不混用 ORM 8 或旧教程迁移 API。
- [Jest 30 兼容要求](https://jestjs.io/docs/upgrading-to-jest30)。
- [pnpm 11 配置变化](https://github.com/pnpm/pnpm.io/blob/main/blog/releases/11.0.md)。

只核实版本元数据不能证明数据库事务/迁移兼容。Day 1 未连接 PostgreSQL、Redis、RabbitMQ，相关服务镜像在实际接入时核实精确标签并验证，不在今天声称已运行。
