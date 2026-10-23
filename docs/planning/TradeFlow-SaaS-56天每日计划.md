# TradeFlow SaaS：56 天每日执行清单

配套：[总计划](./TradeFlow-SaaS-项目总计划.md) · [面试与 AI 协作手册](./TradeFlow-SaaS-面试与AI协作手册.md)。

适用：有后端基础，每天 3.5–4 小时，每周第 7 天轻量复盘。Day 1 按实际开始日计算。若 TypeScript 很陌生，先增加 5–7 天基础练习；不要把关键并发与数据库验证交给 AI 后就跳过理解。

前端统一：Vue 3、TypeScript、Vite、Vue Router、Pinia、Element Plus；Axios 请求层、ECharts 报表；Composition API + `<script setup>`。后端 Jest；必要的前端测试用 Vitest + Vue Test Utils，浏览器 E2E 用 Playwright。

## 每天的工作节奏

15 分钟读进度、写 Issue 与验收标准；100–120 分钟分步实现；40–50 分钟亲自验证与审查 diff；30 分钟补当天基础题；10 分钟记录并提交。单项超时则顺延或砍选修，不用空提交补数量。

每天建议 2–4 个真实提交，下面示例通常为功能、风险验证和文档三个边界。UI 使用现成组件，AI 可以高比例辅助；库存、幂等、状态、权限与消息处理的关键代码必须本人逐行讲得通。

**正确性实验编号 C01–C16 的定义见总计划。所有“通过”“成功数”都是未来验收要求，不是当前结果。**

## 第 1 周：工程骨架、租户和权限

### Day 1 — 业务范围、技术版本与骨架

- **实现**：写采购到发货的 3 条用户故事和不做项；核实 Node/NestJS/Prisma/Jest 兼容版本并锁定；初始化 workspace、NestJS `/health`、TypeScript strict、lint、配置校验和 `.env.example`。定义单币种、单订单单仓。
- **AI 协作**：让 AI 解释最小目录、依赖和启动路径，删掉当前无用的通用框架。
- **验收**：干净安装能 build、lint、访问健康接口；环境文件不被提交；README 有实测步骤。
- **提交建议**：`docs: define business scope and invariants`；`chore: bootstrap nestjs workspace`；`chore: lock tooling and env configuration`。
- **面试主题**：TypeScript 类型与 JavaScript 运行时；为什么采用模块化单体？

### Day 2 — 数据库、迁移和测试依赖

- **实现**：启动 Docker PostgreSQL，接 Prisma；建立 users、tenants、memberships 最小模型；增加迁移和测试库初始化；写一条访问真实数据库的 Jest 集成测试。
- **AI 协作**：让 AI 对照锁定版本生成迁移与客户端代码；你核对 SQL、连接池和事务客户端用法。
- **验收**：空库可迁移到当前版本；测试仅连接专用测试库；数据库重启后数据仍在。
- **提交建议**：`feat: add database models and migrations`；`test: establish real database integration harness`；`docs: document local database workflow`。
- **面试主题**：ORM、迁移、数据库约束分别解决什么问题？

### Day 3 — 登录、会话与登出

- **实现**：种子用户登录、密码哈希验证、到期会话和登出撤销。MVP 可选择数据库会话 + HttpOnly Cookie，明确 CSRF、SameSite 和跨域策略；不同时搭两套认证方案。
- **AI 协作**：让 AI 列出登录错误、过期、登出后复用和伪造会话的测试，再实现最小闭环。
- **验收**：密码与会话秘密不进入日志；登出后旧会话不可用；无会话访问受保护接口被拒绝。
- **提交建议**：`feat: implement authenticated sessions`；`test: cover expiry and revocation`；`docs: record authentication choice`。
- **面试主题**：Session、JWT、Cookie、CSRF；鉴权不能只靠前端。

### Day 4 — 租户上下文与成员校验

- **实现**：创建 A/B 两家企业及成员关系；选择租户时服务端验证 membership；要求受保护查询显式使用租户上下文；建立跨租户资源测试助手。
- **AI 协作**：让 AI 找 tenant ID 来源、嵌套写入与原始 SQL 中可能绕过过滤的路径。
- **验收**：用户切换到非成员租户失败；同一个用户可以在授权范围内切换；未知租户不会自动赋权。
- **提交建议**：`feat: enforce verified tenant context`；`test: reject unauthorized tenant selection`；`docs: define tenant access rules`。
- **面试主题**：共享表、独立 schema、独立库的多租户取舍。

### Day 5 — 角色权限与审计入口

- **实现**：预设 owner、sales、purchasing、warehouse、viewer；建立权限矩阵与服务端 policy；成功业务操作的审计与业务同事务，拒绝操作记独立安全日志。日志保存动作摘要而非完整敏感数据。
- **AI 协作**：让 AI 从角色矩阵生成反例；你检查 URL、API 直接调用和后台任务路径。
- **验收**：viewer 不能写；warehouse 不能批准采购；事务回滚不留下成功审计；拒绝路径可追踪。
- **提交建议**：`feat: add role policies and audit foundation`；`test: verify action permissions`；`docs: publish role matrix`。
- **面试主题**：RBAC 与资源归属为什么都需要？

### Day 6 — 管理端壳、OpenAPI 与 CI

- **实现**：建立 Vue 3/Vite 工程，Vue Router 区分登录与后台布局，Pinia 管理会话和当前租户，Element Plus 实现登录/菜单，Axios 统一错误；生成 OpenAPI；配置 build/lint/unit/integration CI，集成测试使用 PostgreSQL 服务容器。
- **AI 协作**：让 AI 搭表单和 API 客户端，你确认隐藏按钮不代替服务端授权。
- **验收**：浏览器登录切换租户；CI 无私人凭据也能跑；故意打破权限测试会失败。
- **提交建议**：`feat: add admin shell and tenant switcher`；`docs: expose api contracts`；`ci: run checks with postgres service`。
- **面试主题**：NestJS Module、Provider、Guard、Pipe、Interceptor 的职责。

### Day 7 — 轻量复盘与 v0.1

- **实现**：复查登录与权限流程；写一页架构取舍；发布 `v0.1-tenancy`；整理下周数据模型草图。
- **AI 协作**：让 AI 追问请求从路由到数据库的路径，自己先回答。
- **验收**：3 分钟解释“身份 → 租户 → 角色 → 资源”的顺序，能指出实际代码。
- **提交建议**：`docs: publish week one retrospective`；有真实缺陷再做 `fix: ...`。
- **面试主题**：Promise、async/await、异常传播、Node 事件循环入门。

## 第 2 周：商品、客户、采购与库存账

### Day 8 — 商品 SKU 与仓库

- **实现**：建立 product、sku、warehouse；SKU 编码租户内唯一；核心模型使用租户组合外键；增加创建、查询、分页、停用接口。单订单只能选择一个仓库。
- **AI 协作**：AI 生成 DTO 与表单骨架，你审核唯一键、历史引用与嵌套写入。
- **验收**：A/B 可使用同 SKU 编码；不能跨租户引用仓库或商品；已引用资料不能随意硬删。
- **提交建议**：`feat: add catalog and warehouses`；`test: enforce tenant-scoped references`；`feat: add catalog admin pages`。
- **面试主题**：复合唯一键、组合外键、软删除与历史数据。

### Day 9 — 库存余额、流水与不变量

- **实现**：建立 balances、movements、reservations；定义 on_hand/reserved/available；添加 CHECK；实现受控测试入库服务；所有初始库存来自流水。保存数量为整数。
- **AI 协作**：让 AI 列出库存不合法状态，你用数据库直接写入验证约束。
- **验收**：负现存、负预占、超额预占都被阻止；余额可以从流水算回；直接改余额的 API 不对外开放。
- **提交建议**：`feat: model inventory balances and ledger`；`test: enforce stock invariants`；`docs: define inventory semantics`。
- **面试主题**：数据库约束为什么不能完全用 DTO 校验替代？

### Day 10 — 客户、供应商与采购草稿

- **实现**：客户/供应商最小资料；采购单与行项目；校验商品归属、正数量、服务端金额；采购草稿可编辑，已提交后限制编辑；定义状态 DRAFT/SUBMITTED/APPROVED/REJECTED/RECEIVED。
- **AI 协作**：AI 帮做 CRUD 和表单，你负责金额精度、关联权限和状态转换。
- **验收**：跨租户客户/供应商不能关联；小数件数和负金额被拒；金额由服务端校验计算。
- **提交建议**：`feat: add customers suppliers and purchase drafts`；`test: validate purchase data ownership`；`feat: add master data forms`。
- **面试主题**：BIGINT 分、decimal 与 JS number 的边界。

### Day 11 — 采购提交、审核与并发编辑

- **实现**：提交、批准、拒绝接口；用状态条件更新防止重复或越级审核；草稿编辑加 version 乐观并发检查；审计记录动作与前后状态。
- **AI 协作**：让 AI 构造两个审核者同时操作、旧页面覆盖新修改的测试。
- **验收**：两个相反审批只有一个合法迁移成功；提交后不能继续悄悄改数量；旧版本编辑返回冲突。
- **提交建议**：`feat: implement purchase approval workflow`；`test: cover conflicting approval and stale edits`；`docs: record purchase transitions`。
- **面试主题**：乐观锁、行锁、条件更新分别适合哪里？

### Day 12 — 收货事务与第一次业务幂等

- **实现**：全量收货；锁定/条件更新采购状态，创建唯一 receipt，更新所有库存、流水、审计；一个事务处理整单。实现同 receipt reference 重试与不同内容冲突。
- **AI 协作**：AI 提供事务草案，你检查所有写入使用同一事务客户端、不同 SKU 排序一致。
- **验收**：重复收货只增加一次库存（C08 初版）；中途错误使所有 SKU 回滚；未审核采购不能入库。
- **提交建议**：`feat: receive purchases atomically`；`test: prevent duplicate and partial receipts`；`docs: explain receipt transaction boundary`。
- **面试主题**：为什么事务内部调用全局 ORM 客户端会破坏预期？

### Day 13 — 库存查询与最小对账脚本

- **实现**：库存列表、流水分页、低库存筛选；写 reconcile 检查余额与流水；在测试环境一致快照内读取；加入种子资料和多个租户数据。
- **AI 协作**：AI 写聚合 SQL，你手工核对几个 SKU 的计算并检查索引。
- **验收**：完成入库后账平；故意在隔离测试库制造差异，脚本能定位 SKU 和差额；恢复后归零。
- **提交建议**：`feat: expose inventory and movement queries`；`feat: add inventory reconciliation command`；`test: detect ledger mismatches`。
- **面试主题**：GROUP BY、事务快照、对账误报。

### Day 14 — 轻量采购演示与 v0.2

- **实现**：补齐采购草稿、审批、收货、库存页面的必要按钮；录制短演示；发布 `v0.2-procurement`，只修闭环问题。
- **AI 协作**：让 AI 检查角色之间的操作是否能从页面看懂。
- **验收**：采购员建单、owner 审核、warehouse 收货，重复操作后账仍平。
- **提交建议**：`docs: publish procurement demo and week two notes`；必要时 `fix: ...`。
- **面试主题**：如何解释“业务流程”和“表的 CRUD”的差异？

## 第 3 周：订单与库存交易核心

### Day 15 — 订单模型与价格快照

- **实现**：sales order、line、来源渠道与客户关联；定义状态表；下单输入合并重复 SKU；服务端读取有效商品、计算金额，保存商品名、单价和数量快照。
- **AI 协作**：让 AI 生成篡改总价、停用 SKU、跨客户下单的反例。
- **验收**：改商品现价不改变历史订单；客户端 total 无法覆盖服务端结果；同 SKU 重复行不会绕过数量校验。
- **提交建议**：`feat: model orders with immutable line snapshots`；`test: validate prices quantities and ownership`；`docs: define order lifecycle`。
- **面试主题**：为什么订单不能只引用商品当前价格？

### Day 16 — 原子预占与整单回滚

- **实现**：事务中创建订单、按 SKU 顺序执行条件库存更新、建立预占及流水；库存不足整单失败。按锁定 Prisma 版本使用参数化 SQL 或等价表达。
- **AI 协作**：让 AI 对比先查后写与条件更新，你指出两者竞争窗口；亲自跑真实数据库测试。
- **验收**：库存 10 不能成功预占 11；A 足够 B 不足时 A 不留下占用（C04）；CHECK 全程成立。
- **提交建议**：`feat: reserve stock in order transaction`；`test: roll back multi-item shortages`；`docs: explain oversell prevention`。
- **面试主题**：Read Committed 下 UPDATE 的竞争与条件重检。

### Day 17 — 请求幂等与结果恢复

- **实现**：幂等记录唯一键、规范化 payload hash、业务结果快照；记录与业务同事务；处理同 key 同参数、不同参数、提交成功响应丢失、并发处理中。
- **AI 协作**：AI 设计请求排列，你审核冲突捕获后事务是否已回滚、重试是否使用原 key。
- **验收**：重复请求返回同一订单；同 key 换内容返回冲突；响应丢失后重试不重复预占（C02/C03/C09 初版）。
- **提交建议**：`feat: persist idempotent order outcomes`；`test: recover duplicate and uncertain requests`；`docs: define idempotency scope and retention`。
- **面试主题**：唯一约束和 idempotency key 的分工。

### Day 18 — 模拟支付回调与去重

- **实现**：独立模拟器或受控脚本生成签名回调；验证原始 payload、签名、商户/订单映射、金额币种；建立事件去重和交易去重；合法状态从 PENDING_PAYMENT 转 PAID，预占不释放。
- **AI 协作**：让 AI 构造重复 event、不同 event 同 transaction、金额不一致及伪造签名案例。
- **验收**：重复成功只产生一次支付事实；错误签名/金额无效；不支持的事件不推进订单（C05 初版）。
- **提交建议**：`feat: process verified simulated payment events`；`test: deduplicate payment facts`；`docs: label payment simulator boundaries`。
- **面试主题**：验签、事件 ID、交易 ID 与订单 ID 为什么不能混为一谈？

### Day 19 — 取消、到期规则与竞争

- **实现**：取消只允许待支付；锁订单并释放有效预占、写流水；引入 expires_at 与数据库时间规则；回调取得订单锁后检查截止时间。晚到款先写持久化补偿待办，第 4 周完成执行器。
- **AI 协作**：让 AI 枚举先支付/先取消/截止后回调三种调度，你分别写预期状态。
- **验收**：重复取消不重复释放；截止后回调不能复活订单；已付订单不可取消；预占和状态一致（C06/C07 初版）。
- **提交建议**：`feat: cancel pending orders with guarded release`；`test: cover payment cancellation races`；`feat: record late-payment compensation tasks`。
- **面试主题**：状态机、时间边界和数据库锁的关系。

### Day 20 — 发货出库与初步抢库存实验

- **实现**：已付订单整单发货，现存/预占同步扣减，预占转 consumed；唯一 shipment 防重复；增加确认收货到 COMPLETED 的状态迁移，该步骤不再改库存；写第一版真实 HTTP 并发下单脚本。
- **AI 协作**：AI 写脚本与统计，你检查真并发连接和结果分类，避免串行伪并发。
- **验收**：重复发货只出库一次；100 个有效请求争抢 10 件时正常依赖下只有 10 单成功，剩余库存不足；系统错误独立统计。
- **提交建议**：`feat: ship paid orders atomically`；`test: guard duplicate shipments`；`test: add initial stock contention scenario`。
- **面试主题**：发货为什么同时减少 on_hand 和 reserved？

### Day 21 — 轻量交易演示与 v0.3

- **实现**：订单列表、详情、模拟支付、取消和发货基础界面；主流程录屏；发布 `v0.3-transactions`；登记现有并发测试限制。
- **AI 协作**：让 AI 给交易演示提纲，你用对账结果结束演示。
- **验收**：采购 → 下单 → 支付 → 发货可运行；未完成晚到款执行清楚显示为待补偿，不伪装完成。
- **提交建议**：`docs: publish transaction walkthrough and known gaps`；必要时 `fix: ...`。
- **面试主题**：完整解释一笔订单的事务边界与失败处理。

## 第 4 周：RabbitMQ、可靠事件与补偿

### Day 22 — RabbitMQ 拓扑与事件契约

- **实现**：Compose 加入 RabbitMQ；定义 exchange、队列、路由键、事件 schema version、event/tenant/aggregate ID；实现一条测试事件的发布消费与连接关闭。
- **AI 协作**：让 AI 画发布者、broker、消费者流程；你确认 durable、消息持久化、confirm、ACK 是不同设置。
- **验收**：服务重启能重新连接；未知事件版本有明确错误；不依赖订阅者在线才能提交核心订单。
- **提交建议**：`feat: add rabbitmq transport and event contracts`；`test: validate event envelopes`；`docs: describe message topology`。
- **面试主题**：exchange、queue、routing key、prefetch 的作用。

### Day 23 — Transactional Outbox

- **实现**：把订单、支付、收货、发货事件写入同一业务事务的 Outbox；发布 worker 短事务领取 lease，提交后发布；处理 confirm、nack、不可路由和连接失败；确认后标记已发送。
- **AI 协作**：让 AI 分析 DB commit 前后、publish 前后四个故障点，你核对重试时 event ID 不改变。
- **验收**：业务回滚不产生事件；MQ 停止时订单仍能提交且 Outbox 可见；恢复后补发（C10 初版）。
- **提交建议**：`feat: persist transactional outbox events`；`feat: publish claimed events with confirms`；`test: recover broker outage backlog`。
- **面试主题**：为什么事务提交后直接发消息仍可能丢事件？

### Day 24 — Inbox 与提交后 ACK

- **实现**：做一个站内通知消费者；Inbox 唯一键包含消费者名与 event ID；Inbox 与通知在同事务提交，然后 ACK；错误时回滚并保持可重投。
- **AI 协作**：AI 提供去重草稿，你检查“先记处理过、后写业务”是否被拆成两个事务。
- **验收**：同事件重复投递 20 次只有一条逻辑通知；提交后 ACK 前断开再投递仍不重复（C11 初版）。
- **提交建议**：`feat: consume events with transactional inbox`；`test: deduplicate redelivered notifications`；`docs: explain ack timing`。
- **面试主题**：publisher confirm 为什么不代表业务消费成功？

### Day 25 — 有界重试、死信与重放

- **实现**：临时错误采用有界延迟重试；永久错误进入死信/停车队列；保留原 event ID 与错误信息；实现受控重放命令。若手动转发，确认新发布成功才 ACK 原消息。
- **AI 协作**：让 AI 构造持续失败、断网、重试队列不存在等场景，你审核消息转移的丢失窗口。
- **验收**：毒消息不无限立即重入队；重放不会重复副作用；MQ 故障期间不提前 ACK；重试上限可观察。
- **提交建议**：`feat: add bounded retries and dead-letter handling`；`test: preserve events across retry transfer failures`；`ops: add controlled event replay command`。
- **面试主题**：requeue 风暴、DLQ、重试延迟与消息可靠性。

### Day 26 — 晚到支付的模拟退款补偿

- **实现**：消费/扫描持久化 refund job；调用支持业务幂等键的模拟退款网关；调用成功但本地未记结果时可按同 key 查询/重试；订单保持 CANCELLED，记录补偿状态和失败次数。
- **AI 协作**：AI 列网络超时但网关已成功等不确定结果，你选择查询和重试策略。
- **验收**：同一晚到交易只退款一次；中断恢复后最终完成或明确待人工处理；不重复释放库存。
- **提交建议**：`feat: execute idempotent late-payment compensation`；`test: recover ambiguous refund results`；`docs: explain compensation limits`。
- **面试主题**：本地事务为什么不能跨外部 HTTP 保证原子性？

### Day 27 — 到期扫描与补偿巡检

- **实现**：数据库按 expires_at 索引分批扫描待付订单；任务可由多 worker 运行，最终依赖订单状态和事务防重；增加 Outbox lease 超时恢复、长时间待补偿检测。到期时间不是精确秒级 SLA。
- **AI 协作**：让 AI 检查扫描批次、锁等待和多个扫描器的冲突；你复用同一取消服务。
- **验收**：扫描器暂停再恢复会处理历史到期单；重复扫描不重复释放；支付竞争仍符合 Day 19 规则。
- **提交建议**：`feat: expire orders with durable database sweeps`；`test: recover delayed and duplicate sweeps`；`ops: surface stuck outbox and compensation jobs`。
- **面试主题**：为什么核心到期释放不能只依赖 Redis 过期通知？

### Day 28 — 轻量消息故障演示与 v0.4

- **实现**：录制 MQ 暂停积压再恢复、重复事件、晚到款补偿；页面展示订单时间线、通知和异常状态；发布 `v0.4-events`。
- **AI 协作**：让 AI 从结果倒推关键事件，你核对日志是否能串成完整链路。
- **验收**：交易状态和消息处理状态分开可见；不声称消息“绝不重复”；主流程和补偿路径均可运行。
- **提交建议**：`docs: publish event reliability walkthrough`；必要时 `fix: ...`。
- **面试主题**：用具体故障解释 at-least-once 与业务幂等。

## 第 5 周：SaaS 产品闭环、报表与审计

### Day 29 — 客户订货入口与双入口复用

- **实现**：在 Vue Router 建立客户布局与路由，为租户建立商品列表、购物车、下单、我的订单；Pinia 保存购物车草稿；客户端身份映射 customer；管理端代客下单与客户端复用交易服务，只在权限和输入来源上不同。
- **AI 协作**：AI 帮做页面，你检查是否出现第二套扣库存/建订单逻辑。
- **验收**：同租户客户互相看不到订单；管理端与订货页都受相同库存、价格与幂等规则约束。
- **提交建议**：`feat: add tenant customer ordering portal`；`refactor: share order application service`；`test: isolate customer-owned resources`。
- **面试主题**：应用服务、领域规则、Controller 的分层。

### Day 30 — 后台业务操作体验

- **实现**：用 Element Plus 补齐订单/采购服务端分页筛选、表单校验、详情、角色按钮、错误信息和时间线；抽出可复用 composable；下单页面为同一次提交保留幂等键，编辑内容后生成新 key；切租户清理旧页面数据与购物车上下文。
- **AI 协作**：让 AI 检查重复点击、断网刷新、重新尝试的 UI 行为；你检查前后端契约。
- **验收**：用户能区分库存不足、处理中、权限不足与系统错误；刷新不会悄悄发起第二单。
- **提交建议**：`feat: complete operational order and purchase screens`；`fix: preserve request identity across retries`；`test: cover recoverable client failures`。
- **面试主题**：业务错误码、HTTP 状态与可恢复用户体验。

### Day 31 — 报表口径与同步 SQL 基线

- **实现**：定义下单量、已支付有效订单金额、晚到款/补偿单独统计、采购收货金额、低库存；按租户时区划分日期，数据库存 UTC；先用源表 SQL 生成准确基线。
- **AI 协作**：AI 写聚合，你检查 JOIN 是否重复计数、取消单是否被算进实收、截止边界是否一致。
- **验收**：手工 seed 5–10 个跨日和取消样例，算出已知结果；金额不经过浮点累计；不将销售额叫利润。
- **提交建议**：`feat: implement source-of-truth business reports`；`test: verify report accounting rules`；`docs: define metric meanings and timezone`。
- **面试主题**：口径、时间窗、重复 JOIN 与业务指标正确性。

### Day 32 — 异步报表投影与乱序

- **实现**：RabbitMQ 消费业务事实写 daily_metrics；Inbox 与原子增量在同事务；paid、shipped 等指标分开，避免一条事件覆盖整行最新状态；保留版本与进度。
- **AI 协作**：AI 生成乱序/重投序列，你决定哪些指标可交换、哪些需要等待或重建。
- **验收**：打乱 paid/shipped 事件不回退状态；多个事件并发更新不丢增量；消费追平后与 Day 31 基线一致。
- **提交建议**：`feat: project business events into daily metrics`；`test: handle duplicate and reordered events`；`docs: specify projection consistency`。
- **面试主题**：最终一致、读模型、丢更新、乱序处理。

### Day 33 — 看板、缓存与权限作用域

- **实现**：用 ECharts + Element Plus 构建经营看板、客户排行、低库存；Redis 短 TTL 缓存报表/商品，key 包含 tenant 和必要的客户/角色范围；明确更新延迟；订单提交始终访问数据库权威数据。
- **AI 协作**：AI 实现缓存适配器，你审核跨租户、权限变化、旧值回填和 Redis 异常。
- **验收**：A/B 相同查询参数不会共享结果；缓存过期或不可用时行为明确；修改展示缓存不能导致超卖。
- **提交建议**：`feat: add business dashboard and scoped caching`；`test: prevent cache data leakage`；`docs: define freshness and fallback policy`。
- **面试主题**：Cache-aside、失效策略与缓存一致性限制。

### Day 34 — 异步导出与审计查询

- **实现**：建立 export job，经 Outbox/队列执行；导出 CSV，流式或分批读取避免一次加载全量；下载必须验租户与申请人权限；处理 CSV 公式注入、过期删除；完成审计列表。
- **AI 协作**：AI 写导出骨架，你检查查询筛选和下载权限一致、失败任务可追踪。进度落后可先限量同步导出并如实记录。
- **验收**：越权下载失败；导出字段遵守权限；危险公式前缀被安全处理；大样本不会明显撑爆内存。
- **提交建议**：`feat: add authorized report export jobs`；`test: validate download scope and csv safety`；`feat: expose searchable audit history`。
- **面试主题**：Node streams、背压、导出一致性与权限。

### Day 35 — 轻量完整演示与 v0.5

- **实现**：录制“租户与角色 → 采购 → 客户下单 → 支付 → 发货 → 报表 → 审计”；建立三条浏览器 E2E；发布 `v0.5-business`。
- **AI 协作**：让 AI 以第一次使用者视角检查演示，你删掉误导性的未实现按钮。
- **验收**：无需数据库手工改状态完成业务；所有模拟功能清楚标识；关键权限反例仍通过。
- **提交建议**：`test: add core browser business flows`；`docs: publish full product walkthrough`。
- **面试主题**：API 测试与浏览器 E2E 的分工。

## 第 6 周：并发、重复与故障的证据

### Day 36 — 专用并发测试环境

- **实现**：Compose/脚本启动两 API 实例、共享真实 DB/MQ；提供种子重置、并发 barrier 和结果统计；限制故障注入只在测试环境启用；固定随机 seed。
- **AI 协作**：AI 写 harness，你验证请求分散到两个实例、有多条 DB 连接、没有靠内存 mutex 串行化。
- **验收**：报告包含实例、连接池、请求数和并发数；测试库清理不会误连演示/生产库；一次失败可重跑。
- **提交建议**：`test: add multi-instance concurrency harness`；`test: isolate destructive fixtures to test database`；`docs: specify reproducible experiment setup`。
- **面试主题**：单进程单元测试为什么不能证明分布式并发正确？

### Day 37 — 库存争抢与请求重放

- **实现**：系统运行 C01/C02/C03/C04/C09；100 请求抢 10 件、同 key 并发、混合 SKU 不足、提交后响应丢失；每类重复至少 20 轮或明确记录实际次数。
- **AI 协作**：AI 收集数据，你核对最终订单、预占、流水，不只看 HTTP 返回成功数。
- **验收**：正常依赖下成功数准确；库存与金额账平；技术错误单列；不通过降低并发掩盖竞态。
- **提交建议**：`test: verify stock contention and request replay`；`fix: resolve reproduced transaction race`（如有）；`docs: publish order correctness results`。
- **面试主题**：业务拒绝和系统故障为什么必须分开统计？

### Day 38 — 支付、取消与出库竞争

- **实现**：C05/C06/C07/C08；同时支付与取消、到期边界、重复出库/收货；检查两个不同事件重复确认同一支付交易；用故障点控制竞争窗口。
- **AI 协作**：AI 生成状态组合，你确认每个最终状态都有允许的解释。
- **验收**：没有 PAID 且已释放预占的组合；已取消晚到款有补偿；发货/收货各只记一次。
- **提交建议**：`test: exercise payment expiry and fulfillment races`；`fix: enforce legal terminal transitions`（如有）；`docs: record state race matrix`。
- **面试主题**：如何为两个竞争操作定义线性化点？

### Day 39 — MQ 故障窗口

- **实现**：C10/C11/C12：停 broker、发布成功未标 sent、消费提交未 ACK、毒消息、重试转发失败；重启并检查积压、Inbox、通知和投影。
- **AI 协作**：AI 写自动恢复脚本，你确认“杀进程”实际发生在目标窗口而非仅抛一个异常。
- **验收**：允许重复投递但无重复业务效果；积压恢复有证据；失败与 DLQ 可定位；没有假设单机 broker 磁盘永不丢失。
- **提交建议**：`test: inject broker and consumer failure windows`；`fix: harden event recovery paths`（如有）；`docs: publish messaging fault results`。
- **面试主题**：如何区分应用保证与基础设施故障假设？

### Day 40 — 随机状态序列与不变量

- **实现**：使用固定 seed 生成收货、下单、支付、取消、发货序列；允许重复和乱序请求；每轮校验库存/流水/预占/状态；可用 fast-check，也可写小型确定性生成器。
- **AI 协作**：AI 提供生成规则，你审核预期模型与实际实现不要完全相同，以免同错。
- **验收**：失败能保存最小或精简序列重放；非法操作是预期拒绝，不算程序崩溃；对账在一致快照执行。
- **提交建议**：`test: generate repeatable business operation sequences`；`test: assert cross-table invariants`；`docs: capture reproducible seeds and counterexamples`。
- **面试主题**：例子测试与性质测试各能发现什么？

### Day 41 — 权限全链路与故障降级

- **实现**：C13/C15：列表/详情/关联写/导出/缓存/事件后台路径全覆盖；同租户跨客户访问；Redis 停止，检查缓存回源、限流策略与权限不会失效。
- **AI 协作**：AI 从 API 清单生成覆盖表，你核对原始 SQL、后台 job 的 tenant scope。
- **验收**：没有跨租户/跨客户可见性漏洞；Redis 故障不破坏交易不变量；拒绝与降级有日志。
- **提交建议**：`test: audit tenant boundaries across data paths`；`test: verify cache outage behavior`；`fix: close verified authorization gaps`（如有）。
- **面试主题**：缓存、导出和异步消费者为何也是权限边界？

### Day 42 — 轻量正确性报告与 v0.6

- **实现**：汇总 C01–C15 的实现与结果，C16 在后续报表重建完成；链接原始数据、SQL 和失败案例；发布 `v0.6-correctness`。
- **AI 协作**：AI 整理表格，你逐条核实已跑、未跑、失败与修复后重跑状态。
- **验收**：能用 5 分钟展示一个竞态从复现到修复的证据链；不使用“绝对不会”“已证明任何情况正确”等表述。
- **提交建议**：`docs: publish correctness and failure recovery report`；`ci: gate critical transactional regressions`。
- **面试主题**：测试证据、系统假设与形式化证明的区别。

## 第 7 周：性能、观测与部署

### Day 43 — 查询计划与索引优化

- **实现**：生成有合理分布的较大测试数据；选订单列表、库存、报表三个慢查询，记录 EXPLAIN ANALYZE/BUFFERS；修复 N+1、过量字段、缺失复合索引；为大列表比较 offset 与游标分页。
- **AI 协作**：AI 解读计划，你核对扫描行数、选择性与新增索引的写入代价；只在测试库做带执行的分析。
- **验收**：有优化前后同条件数据；字段排序稳定；不能只贴索引代码声称提升。
- **提交建议**：`perf: optimize measured tenant queries`；`test: preserve pagination semantics`；`docs: publish query plan comparison`。
- **面试主题**：索引顺序、选择性、回表、N+1、深分页。

### Day 44 — 缓存、限流与 Vue 数据竞态

- **实现**：测量缓存命中与失效；增加租户/用户限流、过载保护；检查 Vue 快速筛选和切租户时旧请求回写，用取消或请求版本校验解决；路由懒加载，Element Plus 按需引入可作为小优化。
- **AI 协作**：AI 列缓存穿透、旧值回填和前端竞态，你选择与当前规模匹配的最小策略。
- **验收**：慢的旧响应不会覆盖新租户数据；限流不代替事务；Redis 故障策略可复现；只报告实测性能。
- **提交建议**：`feat: bound request load with scoped rate limits`；`fix: discard stale vue query responses`；`perf: tune cache policy from measurements`。
- **面试主题**：防抖、取消请求、缓存一致性、雪崩与击穿。

### Day 45 — 日志、指标与运行健康

- **实现**：贯穿 request/tenant/order/event/trace ID；记录 API 延迟、业务拒绝、DB 锁等待、Outbox oldest age、消息积压与补偿失败；区分 liveness/readiness；日志脱敏。
- **AI 协作**：AI 提议排障看板和阈值，你按实际基线设置，不照抄生产告警数字。
- **验收**：给一个订单 ID 可找到请求、事务结果、事件与消费记录；不会暴露密码/会话/支付模拟秘密。
- **提交建议**：`feat: correlate business and messaging telemetry`；`ops: add health and backlog metrics`；`docs: write incident diagnosis runbook`。
- **面试主题**：日志、metrics、trace，以及 readiness 的边界。

### Day 46 — 可复现负载实验

- **实现**：用 k6 或等价工具分别测试普通读、独立 SKU 写、热点 SKU 争抢；固定数据、实例、连接池，记录吞吐、p50/p95、业务拒绝、系统错误和资源；运行时长足以得到有意义样本。
- **AI 协作**：AI 编写脚本与图表数据，你解释瓶颈是 CPU、DB、锁、连接池还是 MQ；热点库存不足不算技术故障。
- **验收**：每次实验结束对账；至少一个瓶颈有前后对照；小样本尾延迟注明不稳定，不承诺虚构 QPS。
- **提交建议**：`perf: add reproducible workload benchmarks`；`perf: address confirmed bottleneck`；`docs: publish load test report`。
- **面试主题**：为什么热点写吞吐与普通查询吞吐不能放在一起吹成绩？

### Day 47 — 投影重建与对账截止点

- **实现**：完成 C16；MVP 采用维护窗口暂停相关写入、等待在途事务和消息追平，再从源表重建报表并验证；记录快照/截止点。在线重建与增量追赶只设计，不强行实现。
- **AI 协作**：让 AI 检查重建期间可能漏事件/重复计数的窗口，你明确每一步恢复条件。
- **验收**：人为删掉测试投影后可按 runbook 恢复；重放旧事件不导致重复累计；对账使用同一业务口径与时间范围。
- **提交建议**：`ops: add controlled report rebuild workflow`；`test: reconcile rebuilt projections`；`docs: define maintenance and cutoff procedure`。
- **面试主题**：全量重建、增量追赶与一致快照。

### Day 48 — 容器部署与公开演示隔离

- **实现**：构建 API/worker/Vue 静态产物；反向代理同源 API、history 路由 fallback、HTTPS、持久卷；访客分配隔离合成租户和额度；关闭公开故障注入、任意压测及基础设施管理端。
- **AI 协作**：AI 写 Compose/代理配置，你检查前端环境变量都是公开构建内容，不能放服务端秘密。
- **验收**：外网可访问；刷新 Vue 深层路由不 404；两访客互不可见；重启保留业务数据；支付始终标明模拟。
- **提交建议**：`build: package deployable api worker and vue app`；`ops: configure secure demo hosting`；`test: verify isolated demo sessions`。
- **面试主题**：SPA 路由、反向代理、容器网络、构建时变量。

### Day 49 — 轻量备份恢复与候选发布

- **实现**：按脚本备份并恢复到隔离数据库，核对行数与账；演练前一镜像版本回滚，确认数据库兼容；准备 release candidate。初次演练超时可占用机动时间，不跳过验证。
- **AI 协作**：AI 审阅 runbook，你确认恢复目标与覆盖范围，绝不在正式演示库试验破坏性步骤。
- **验收**：有恢复记录与实际耗时；明确单机部署的可用性限制；回滚不是无条件执行反向迁移。
- **提交建议**：`ops: document verified backup and restore`；`docs: publish release candidate limitations`。
- **面试主题**：RPO/RTO、兼容迁移、镜像回滚与数据回滚。

## 第 8 周：复验、展示、简历与面试

### Day 50 — 干净环境独立复验

- **实现**：从新目录/干净依赖环境安装、迁移、seed；跑 unit/integration/concurrency 和 3 条 UI E2E；记录 Vue/NestJS 类型检查结果；复验最关键 C01–C16 场景。
- **AI 协作**：让 AI 严格按 README 操作，你记录所有隐藏前提并修正文档。
- **验收**：没有本机缓存或手动数据库改动才能运行的步骤；关键测试失败会阻止发布；记录 SHA 与版本。
- **提交建议**：`test: verify clean installation and release regressions`；`fix: remove hidden environment assumptions`；`docs: update reproducibility evidence`。
- **面试主题**：为什么“我电脑能跑”不是可交付？

### Day 51 — README、架构与证据索引

- **实现**：首屏写业务价值、Demo、GIF、并发/故障报告；补架构图、订单库存状态、模块、API、权限矩阵、脚本、限制、数据来源、许可证；整理 5–8 篇已产生的 ADR。
- **AI 协作**：AI 优化文案和英文摘要，你逐句检查是否夸大实现。
- **验收**：读者 30 秒知道项目做什么，3 分钟找到正确性证据；未做部分明确标注。
- **提交建议**：`docs: prepare reviewer-friendly readme`；`docs: link architecture decisions and evidence`；`docs: add concise english overview`。
- **面试主题**：如何解释技术取舍而不是列框架名单？

### Day 52 — 两段演示录像

- **实现**：录 3–5 分钟业务演示；另录 2–3 分钟正确性演示：100 请求抢 10 库存、重复支付、MQ 中断恢复、最终对账；Vue 页面展示真实结果与状态。
- **AI 协作**：AI 写提纲，你自己讲并对应实际操作；故障演示在专用环境。
- **验收**：视频可访问、无秘密数据；清晰说明请求数/并发数；预录与实时区分；不靠剪辑隐藏失败。
- **提交建议**：`docs: add business and correctness demos`；`docs: provide repeatable presentation scripts`。
- **面试主题**：90 秒、5 分钟、10 分钟三个项目介绍版本。

### Day 53 — 简历与三个深挖故事

- **实现**：按真实结果写三条经历，围绕多租户、库存事务、Outbox/Inbox；准备一次竞态修复、一次性能优化、一次设计舍弃的故事；列出 Vue 页面与后端代码入口。
- **AI 协作**：让 AI 质疑“高并发、零丢失、生产级”等措辞，你用实验与限制替换空泛结论。
- **验收**：所有数字可在报告查到；能说清 AI 辅助和本人决策；不编造商业用户或工作经验。
- **提交建议**：`docs: add verified resume project summary`；`docs: map interview stories to code and reports`。
- **面试主题**：STAR 表达与技术证据，不背不存在的成果。

### Day 54 — 独立编码与系统设计模拟

- **实现**：关闭 AI 先写限并发 Promise 执行器、两条库存/重复订单 SQL；解释 Nest 请求链；画 100 倍流量下的瓶颈演进；前端独立写一个带请求取消的 Vue 查询 composable。
- **AI 协作**：自己完成后再让 AI review，检查异常、竞态、复杂度与清理逻辑。
- **验收**：现场修一个真实边界缺陷；明确哪些扩展只是设计；能解释为什么不先拆微服务。
- **提交建议**：`docs: record coding and architecture exercises`；`test: capture discovered regression`；有实际修复时 `fix: ...`。
- **面试主题**：事件循环、数据库隔离、缓存、消息、Vue 响应式综合。

### Day 55 — 发布 v1.0.0

- **实现**：核对 CI、干净启动、演示地址、视频、报告、License、环境模板和秘密扫描；写 release notes，打 tag，部署最终版；只修发布阻塞问题。
- **AI 协作**：AI 做最后审阅，你确认没有临时大升级、新中间件和未验证迁移。
- **验收**：GitHub 展示完整；公共 Demo 可用；核心测试、对账与恢复说明有证据；未完成项留在已知限制。
- **提交建议**：`chore: prepare v1.0.0 release`；`docs: publish release notes and known limitations`。
- **面试主题**：什么条件允许发布，什么条件必须阻止？

### Day 56 — 轻量复盘与岗位校准

- **实现**：汇总 8 周进展、最难缺陷、最有效实验、未解决问题；找 10–15 条适合自己的实际 JD，逐项标记已证明/理解/待补；做 30 分钟模拟面试并制定后续两周补强。
- **AI 协作**：让 AI 依据仓库与报告追问，自己先回答；前后端方向分别标出掌握深度。
- **验收**：能独立讲清一笔交易从 Vue 点击到数据库、MQ 和报表的全链路；知道项目不能替代哪些经验。
- **提交建议**：`docs: publish final retrospective and job skill mapping`。
- **面试主题**：重做会删什么？最重要的不变量是什么？

## 每日记录模板

```markdown
# Day NN：主题
- Issue / PR：
- 今天的可观察验收条件：
- 实际修改：
- AI 协助了什么：
- 我否决/修改了 AI 哪个建议，理由：
- 测试命令、数据版本与结果：
- 涉及的不变量或权限边界：
- 新发现的反例与复现步骤：
- 今天能独立解释的概念：
- 未完成事项和下一步：
```

同一周可使用同一个 devlog 文件；真实失败记录比每天重复“完成开发”更有价值。休息日可以不提交，不补造日期。

## 缺时间时怎么调整

Day 14 不能完成采购闭环：先修采购，压缩界面装饰。Day 21 不能保证库存交易正确：暂停新增报表和导出，修事务与幂等。Day 35 主流程不顺：先完成演示，保留第 6 周核心验证。Day 42 仍存在超卖、重复写或跨租户问题：优先修复，延迟 v1.0，而不是把它们藏在演示之外。
