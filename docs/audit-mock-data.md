# Mock 数据使用情况审计

> 审计时间：2026-03-18

## 说明

记录各页面中硬编码 mock 数据的位置，这些数据需要在接入真实 API 时替换。

---

## auth/LoginPage

无 mock 数据。登录逻辑已接入 `useAuthStore().login()`。

---

## employee/ShopHomePage

| 变量 | 内容 | 需替换为 |
|---|---|---|
| `PRODUCTS` | 4 条商品（耳机、手表、礼品卡、背包） | `GET /api/v1/product/*` |
| `CATEGORIES` | 6 个分类（全部/数码/生活/餐饮/礼品/办公） | `GET /api/v1/product/categories` 或静态配置 |

---

## employee/ProductDetailPage

| 变量 | 内容 | 需替换为 |
|---|---|---|
| `MOCK_PRODUCTS` | 4 条商品详情（含规格、描述、库存） | `GET /api/v1/product/:id` |
| `RELATED_PRODUCTS` | 3 条相关商品（硬编码耳机类） | `GET /api/v1/product/:id/related` 或同类商品查询 |

---

## employee/OrderConfirmPage

| 变量 | 内容 | 需替换为 |
|---|---|---|
| `MOCK_PRODUCTS` | 1 条商品（耳机，含单价/折扣） | `GET /api/v1/product/:id` |
| `DEFAULT_PRODUCT` | 兜底商品数据 | 同上 |
| `MOCK_USER` | `{ currentPoints: 2580 }` | `GET /api/v1/point/balance` 或 user store |
| `MOCK_ADDRESS` | 收货人姓名、电话、地址 | `GET /api/v1/auth/profile` 或地址接口 |

---

## employee/OrderListPage

| 变量 | 内容 | 需替换为 |
|---|---|---|
| `MOCK_ORDERS` | 3 条订单（待发货/已发货/已完成） | `GET /api/v1/order/*` |

分页目前 `count={1}` 硬编码，需从 API 响应的总数计算。

---

## employee/PointsPage

| 变量 | 内容 | 需替换为 |
|---|---|---|
| `MOCK_BALANCE` | `{ current, totalEarned, totalSpent, redemptions }` | `GET /api/v1/point/balance` |
| `MOCK_TRANSACTIONS` | 5 条积分流水（收入/支出） | `GET /api/v1/point/transactions` |
| `EARN_WAYS` | 4 种积分获取方式（工龄/绩效/节假日/项目） | 可考虑从积分规则接口获取，或保留为静态说明 |
| `QUICK_ACTIONS` | 4 个快捷入口图标 | 静态配置，无需接口 |

---

## admin/DashboardPage

| 变量 | 内容 | 需替换为 |
|---|---|---|
| `METRICS` | 4 个统计卡片（商品数/用户数/本月兑换/积分流通） | `GET /api/v1/admin/dashboard/metrics` 或各模块聚合 |
| `RECENT_ORDERS` | 4 条最近订单 | `GET /api/v1/order?limit=5&sort=latest` |

---

## admin/CategoryManagePage

| 变量 | 内容 | 需替换为 |
|---|---|---|
| `MOCK_CATEGORIES` | 5 个一级分类，含子分类（数码/礼品/生活/办公/运动） | `GET /api/v1/product/categories` |

分页为本地计算，接入 API 后需改为服务端分页。

---

## admin/ProductManagePage

| 变量 | 内容 | 需替换为 |
|---|---|---|
| `MOCK_PRODUCTS` | 8 条商品（含分类/积分/库存/状态） | `GET /api/v1/product/*` |
| `CATEGORIES` | 4 个分类名称（筛选用） | 与分类接口对齐 |

底部分页文案 `共 128 件产品` 为硬编码，需从 API 总数获取。

---

## admin/ProductDetailPage（新增）

| 变量 | 内容 | 需替换为 |
|---|---|---|
| `MOCK_PRODUCTS` | 6 条商品详情（含规格/描述/配送/服务/促销/颜色） | `GET /api/v1/product/:id` |

库存 `stock` 和状态 `status` 为本地 state，调整后未持久化，接入后需调用 `PATCH /api/v1/product/:id`。

---

## admin/ProductEditPage（新增）

| 变量 | 内容 | 需替换为 |
|---|---|---|
| `MOCK_PRODUCTS` | 6 条商品（用于编辑时回填表单） | `GET /api/v1/product/:id` |
| `CATEGORIES` | 5 个分类名称（下拉选项） | `GET /api/v1/product/categories` |

保存时 `handleSave()` 仅做跳转，需替换为 `POST /api/v1/product`（新增）或 `PUT /api/v1/product/:id`（编辑）。

---

## admin/PointsManagePage

| 变量 | 内容 | 需替换为 |
|---|---|---|
| `MOCK_RULES` | 6 条积分规则（工龄/绩效/节假日/项目/入职/其他） | `GET /api/v1/point/rules` |
| `STAT_CARDS` | 4 个统计数字（规则数/启用数/本月发放/受益人数） | `GET /api/v1/point/stats` 或聚合接口 |

底部分页文案 `共 12 条规则` 为硬编码。

---

## admin/UserManagePage

| 变量 | 内容 | 需替换为 |
|---|---|---|
| `MOCK_USERS` | 4 名员工（含部门/积分/角色/状态/兑换次数） | `GET /api/v1/auth/users` 或用户管理接口 |
| `STAT_CARDS` | 3 个统计数字（总用户/活跃/本月新增） | `GET /api/v1/admin/users/stats` |

底部文案 `共 4 名员工` 直接用 `MOCK_USERS.length`，接入后需用 API 总数。

---

## 汇总

| 页面 | Mock 变量数 | 涉及接口 |
|---|---|---|
| LoginPage | 0 | — |
| ShopHomePage | 2 | product, categories |
| ProductDetailPage | 2 | product/:id, related |
| OrderConfirmPage | 4 | product/:id, point/balance, 地址 |
| OrderListPage | 1 | order |
| PointsPage | 3 | point/balance, point/transactions |
| DashboardPage | 2 | dashboard metrics, order |
| CategoryManagePage | 1 | product/categories |
| ProductManagePage | 2 | product |
| ProductDetailPage（新增） | 1 | product/:id |
| ProductEditPage（新增） | 2 | product/:id, product/categories |
| PointsManagePage | 2 | point/rules, point/stats |
| UserManagePage | 2 | auth/users, users/stats |
