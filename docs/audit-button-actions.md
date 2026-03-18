# 按钮 Click Action 实现情况审计

> 审计时间：2026-03-18，最后更新：2026-03-18（PointsPage 快捷操作按钮已修复）

## 说明

检查各页面按钮是否有对应的 click handler 实现，分为"已实现"和"缺失/空壳"两类。

---

## auth/LoginPage

| 按钮 | 状态 | 说明 |
|---|---|---|
| 登录按钮 | ✅ | `handleLogin()` → `useAuthStore().login()`，真实接 API |
| 密码显示/隐藏 | ✅ | `setShowPassword` toggle |
| Enter 键提交 | ✅ | `handleKeyDown` 监听 |

---

## employee/ShopHomePage

| 按钮 | 状态 | 说明 |
|---|---|---|
| 分类 Chip 筛选 | ✅ | `setActiveCategory()`，本地过滤 |
| 商品卡片点击 | ✅ | `navigate('/products/:id')` |
| 立即兑换按钮 | ✅ | `navigate('/orders/confirm/:id')` |
| Hero Banner 浏览按钮 | ⚠️ | 有渲染无 onClick，纯展示 |

---

## employee/ProductDetailPage

| 按钮 | 状态 | 说明 |
|---|---|---|
| 立即兑换 | ✅ | `handleRedeem()` → `navigate('/orders/confirm/:id')` |
| 数量 +/- | ✅ | `setQty()`，有库存上限保护 |
| 颜色选择 Chip | ✅ | `setSelectedColor()` |
| 缩略图切换 | ✅ | `setActiveThumb()` |
| 相关商品卡片 | ✅ | `navigate('/products/:id')` |
| 收藏按钮 | ❌ | 无 onClick，纯展示 |
| 分享按钮 | ❌ | 无 onClick，纯展示 |
| 查看更多（描述） | ❌ | 无 onClick，纯展示 |

---

## employee/OrderConfirmPage

| 按钮 | 状态 | 说明 |
|---|---|---|
| 数量 +/- | ✅ | `setQty()` |
| 返回按钮 | ✅ | `navigate(-1)` |
| 确认兑换按钮 | ⚠️ | 只做 `navigate('/orders')` 跳转，**未调用下单 API** |

---

## employee/OrderListPage

| 按钮 | 状态 | 说明 |
|---|---|---|
| Tab 切换 | ✅ | `setActiveTab()`，本地过滤 |
| 搜索框 | ✅ | `setSearch()`，本地过滤 |
| 分页 | ✅ | `setPage()` |
| 查看详情 | ❌ | 无 onClick，纯展示 |
| 申请退款 | ❌ | 无 onClick，纯展示 |

---

## employee/PointsPage

| 按钮 | 状态 | 说明 |
|---|---|---|
| Tab 切换（全部/收入/支出） | ✅ | `setTab()`，本地过滤 |
| 快捷操作 - 积分商城 | ✅ | `navigate('/')` → 跳转商城首页 |
| 快捷操作 - 兑换记录 | ✅ | `navigate('/orders')` → 跳转兑换记录页 |
| 快捷操作 - 积分规则 | ⚠️ | 无专属页面，`route: null`，点击无响应（待后续实现） |
| 快捷操作 - 帮助中心 | ⚠️ | 无专属页面，`route: null`，点击无响应（待后续实现） |
| 通知铃铛图标 | ❌ | 无 onClick，纯展示 |
| 查看更多（明细） | ❌ | 无 onClick，纯展示 |

---

## admin/DashboardPage

| 按钮 | 状态 | 说明 |
|---|---|---|
| 查看全部链接 | ❌ | 无 onClick，纯展示 |

---

## admin/CategoryManagePage

| 按钮 | 状态 | 说明 |
|---|---|---|
| 搜索框 | ✅ | `setSearch()`，本地过滤 |
| 状态筛选下拉 | ✅ | `setStatusFilter()` |
| 展开/折叠行 | ✅ | `toggleExpand()` |
| 分页按钮 | ✅ | `setPage()` |
| 新增分类按钮 | ❌ | 无 onClick，纯展示 |
| 编辑（分类/子分类） | ❌ | `ActionBtn` 接受 onClick prop 但调用处均未传入 |
| 新增子分类 | ❌ | 同上 |
| 启用/禁用 | ❌ | 同上 |
| 删除（子分类） | ❌ | 同上 |

---

## admin/ProductManagePage

| 按钮 | 状态 | 说明 |
|---|---|---|
| 搜索/分类/状态筛选 | ✅ | 本地过滤 |
| 分页 | ✅ | `setPage()` |
| 新增产品 | ✅ | `navigate('/admin/products/new/edit')` |
| 商品卡片图片/名称点击 | ✅ | `navigate('/admin/products/:id')` → 跳转详情页 |
| 编辑 | ✅ | `navigate('/admin/products/:id/edit')` |
| 删除 | ⚠️ | `window.confirm()` 确认后只有注释 `// mock delete`，无实际逻辑 |

---

## admin/ProductDetailPage（新增）

| 按钮 | 状态 | 说明 |
|---|---|---|
| 下架/上架 | ✅ | `handleToggleStatus()` → 本地 `setStatus()` toggle，未接 API |
| 调整库存 | ✅ | 打开 `AdjustStockDialog`，输入 delta 后本地 `setStock()` 更新，未接 API |
| 编辑商品 | ✅ | `navigate('/admin/products/:id/edit')` |
| 删除 | ✅ | `window.confirm()` 确认后 `navigate('/admin/products')`，未接 API |
| 缩略图切换 | ✅ | `setActiveThumb()` |
| 上传图片 | ❌ | 无 onClick，纯展示 |
| 添加图片（+号） | ❌ | 无 onClick，纯展示 |

---

## admin/ProductEditPage（新增）

| 按钮 | 状态 | 说明 |
|---|---|---|
| 返回 | ✅ | `navigate('/admin/products')` |
| 保存商品 | ✅ | `handleSave()` → `navigate('/admin/products')`，TODO 注释待接 API |
| 分类下拉 | ✅ | `setCategory()` |
| + 成品规格 | ✅ | `handleAddSpec()` → 动态追加规格行 |
| 规格删除（圆形按钮） | ✅ | `handleRemoveSpec(i)`，单行时禁用 |
| 上传图片 Dialog - 选择文件 | ✅ | 触发 `<input type="file">` |
| 上传图片 Dialog - 图片多选 | ✅ | `toggle(id)` → `setSelected()` |
| 上传图片 Dialog - 确认选择 | ✅ | `onConfirm([...selected])` |
| 上传图片 Dialog - 取消 | ✅ | `onClose()` |
| 格式工具栏（B/I/U/列表） | ❌ | 无 onClick，纯展示（富文本未实现） |

---

## admin/PointsManagePage

| 按钮 | 状态 | 说明 |
|---|---|---|
| 分页 | ✅ | `setPage()` |
| 新增规则 | ❌ | 无 onClick，纯展示 |
| 编辑 | ❌ | 无 onClick，纯展示 |
| 禁用/启用 | ❌ | 无 onClick，纯展示 |
| 删除 | ❌ | 无 onClick，纯展示 |

---

## admin/UserManagePage

| 按钮 | 状态 | 说明 |
|---|---|---|
| 搜索/角色筛选 | ✅ | 本地过滤 |
| 分页 | ✅ | `setPage()` |
| 导出按钮 | ❌ | 无 onClick，纯展示 |
| 编辑用户 IconButton | ❌ | 无 onClick，纯展示 |
| 调整积分 IconButton | ❌ | 无 onClick，纯展示 |

---

## 汇总

| 页面 | ✅ 已实现 | ❌/⚠️ 缺失或空壳 |
|---|---|---|
| LoginPage | 登录、密码切换、Enter | — |
| ShopHomePage | 筛选、导航、兑换 | Hero 浏览按钮 |
| ProductDetailPage | 兑换、数量、颜色、缩略图、相关商品 | 收藏、分享、查看更多 |
| OrderConfirmPage | 数量、返回 | 确认兑换无 API 调用 |
| OrderListPage | Tab、搜索、分页 | 查看详情、申请退款 |
| PointsPage | Tab 切换、积分商城跳转、兑换记录跳转 | 积分规则/帮助中心无页面、通知、查看更多 |
| DashboardPage | — | 查看全部 |
| CategoryManagePage | 搜索、筛选、展开、分页 | 新增、编辑、启用禁用、删除 |
| ProductManagePage | 新增跳转、编辑跳转、详情跳转、筛选、分页 | 删除只有 confirm 无实际逻辑 |
| ProductDetailPage（新增） | 下架/上架toggle、调整库存dialog、编辑跳转、删除confirm、缩略图 | 上传图片无实际逻辑、未接 API |
| ProductEditPage（新增） | 返回、保存、分类选择、规格增删、上传图片Dialog完整交互 | 格式工具栏纯展示、保存未接 API |
| PointsManagePage | 分页 | 新增规则、编辑、禁用、删除 |
| UserManagePage | 搜索、筛选、分页 | 导出、编辑用户、调整积分 |

**核心结论**：所有 CRUD 操作和业务动作（下单、退款、积分调整、导出）均未接入 service/store 层，只有登录和页面导航是真实实现的。
