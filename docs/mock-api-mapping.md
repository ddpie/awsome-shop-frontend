# Mock API Mapping — AWSomeShop Frontend

> This document lists every page that currently uses hardcoded mock data and maps it to the real API endpoint(s) it should call once integrated.
>
> API base: `http://localhost:8080` (dev proxy via Vite `/api` → `http://localhost:8080`)

---

## Auth

| Page | File | Mock Data | Real API |
|------|------|-----------|----------|
| LoginPage | `src/pages/auth/LoginPage.tsx` | None — already calls `useAuthStore.login()` which hits the real service | `POST /api/v1/public/auth/login` |

---

## Employee Pages

### ShopHomePage
**File:** `src/pages/employee/ShopHomePage.tsx`

| Mock | Real API |
|------|----------|
| `PRODUCTS` — hardcoded product list with name, category, points, icon | `GET /api/v1/product?page=0&size=20` |
| `CATEGORIES` — hardcoded category keys | Derived client-side from product `category` field |

---

### ProductDetailPage
**File:** `src/pages/employee/ProductDetailPage.tsx`

| Mock | Real API |
|------|----------|
| `MOCK_PRODUCTS` — product detail by id (name, specs, points, stock, colors, description) | `GET /api/v1/product/:id` |
| `RELATED_PRODUCTS` — hardcoded related items | `GET /api/v1/product?category={category}&page=0&size=4` (filter out current product client-side) |

---

### OrderConfirmPage
**File:** `src/pages/employee/OrderConfirmPage.tsx`

| Mock | Real API |
|------|----------|
| `MOCK_PRODUCTS` — product info for the confirm screen | `GET /api/v1/product/:productId` |
| `MOCK_USER.currentPoints` — current points balance | `GET /api/v1/point/balance` |
| `MOCK_ADDRESS` — default delivery address | *(No address API in current design — use user profile or hardcode from auth state)* |
| Confirm button navigates to `/orders` without calling API | `POST /api/v1/order { productId }` |

---

### OrderListPage
**File:** `src/pages/employee/OrderListPage.tsx`

| Mock | Real API |
|------|----------|
| `MOCK_ORDERS` — list of orders with status, product name, points, address | `GET /api/v1/order?page=0&size=20` |
| Tab filter (all / pending / shipped / completed / cancelled) | `GET /api/v1/order?status={status}&page=0&size=20` |

---

### OrderDetailPage (Employee)
**File:** `src/pages/employee/OrderDetailPage.tsx`

| Mock | Real API |
|------|----------|
| `MOCK_ORDER` — full order detail (status, product, points, delivery, timeline) | `GET /api/v1/order/:id` |

---

### RedemptionSuccessPage
**File:** `src/pages/employee/RedemptionSuccessPage.tsx`

| Mock | Real API |
|------|----------|
| `MOCK_ORDER` — order number, product name, points spent, remaining balance | Should receive order data from navigation state after `POST /api/v1/order` succeeds |

---

### PointsPage
**File:** `src/pages/employee/PointsPage.tsx`

| Mock | Real API |
|------|----------|
| `MOCK_BALANCE` — current, totalEarned, totalSpent, redemptions | `GET /api/v1/point/balance` |
| `MOCK_TRANSACTIONS` — points history list | `GET /api/v1/point/transactions?page=0&size=20` |
| Tab filter (all / earn / spend) | `GET /api/v1/point/transactions?type={EARN|SPEND}&page=0&size=20` |

---

### DeliveryInfoPage
**File:** `src/pages/employee/DeliveryInfoPage.tsx`

| Mock | Real API |
|------|----------|
| `MOCK_ADDRESSES` — saved delivery addresses | *(No address management API in current design — may need to be added or sourced from user profile)* |
| Confirm button navigates to `/orders` without saving | Should save selected address to order or user profile |

---

## Admin Pages

### DashboardPage
**File:** `src/pages/admin/DashboardPage.tsx`

| Mock | Real API |
|------|----------|
| `METRICS` — totalProducts (128), totalUsers (356), monthlyRedemptions (89), pointsCirculation (52800) | No dedicated dashboard stats API defined — needs aggregation endpoint or derive from: `GET /api/v1/product/admin/products` (count), `GET /api/v1/public/auth/admin/users` (count), `GET /api/v1/order/admin/orders` (count) |
| `RECENT_ORDERS` — last 4 orders with user, product, points, status | `GET /api/v1/order/admin/orders?page=0&size=4&sort=createdAt,desc` |

---

### ProductManagePage
**File:** `src/pages/admin/ProductManagePage.tsx`

| Mock | Real API |
|------|----------|
| `MOCK_PRODUCTS` — product grid with name, category, points, stock, status | `GET /api/v1/product/admin/products?page=0&size=8` |
| Search filter | `GET /api/v1/product/admin/products?keyword={keyword}&page=0&size=8` |
| Category / status filter | `GET /api/v1/product/admin/products?category={cat}&status={status}&page=0&size=8` |
| Delete action (window.confirm only) | `DELETE /api/v1/product/admin/products/:id` |

---

### ProductDetailPage (Admin)
**File:** `src/pages/admin/ProductDetailPage.tsx`

| Mock | Real API |
|------|----------|
| `MOCK_PRODUCTS` — full product detail by id | `GET /api/v1/product/admin/products/:id` |
| Deactivate / activate toggle | `PUT /api/v1/product/admin/products/:id` `{ status: 'INACTIVE' | 'ACTIVE' }` |
| Adjust stock dialog (local state only) | `PUT /api/v1/product/admin/products/:id` `{ stock: newStock }` |
| Upload image dialog (UI only) | `POST /api/v1/product/file/upload` (multipart/form-data) |
| Delete button (window.confirm only) | `DELETE /api/v1/product/admin/products/:id` |

---

### ProductEditPage
**File:** `src/pages/admin/ProductEditPage.tsx`

| Mock | Real API |
|------|----------|
| `MOCK_PRODUCTS` — pre-fill form for edit mode | `GET /api/v1/product/admin/products/:id` |
| Save button (navigates away, no API call) | New: `POST /api/v1/product/admin/products` / Edit: `PUT /api/v1/product/admin/products/:id` |
| Upload image dialog (UI only) | `POST /api/v1/product/file/upload` (multipart/form-data) |

---

### CategoryManagePage
**File:** `src/pages/admin/CategoryManagePage.tsx`

| Mock | Real API |
|------|----------|
| Already uses `useProductStore` — `fetchCategories`, `createCategory`, `updateCategory`, `deleteCategory`, `toggleCategoryStatus` | Depends on `product.store.ts` implementation — check if store calls real API or returns mock |
| Note: per `business-logic-model.md`, categories are simplified to string fields on products; this page may be out of scope for MVP | *(Verify with backend team — no category CRUD endpoint defined in domain-entities.md)* |

---

### OrderManagePage
**File:** `src/pages/admin/OrderManagePage.tsx`

| Mock | Real API |
|------|----------|
| `MOCK_ORDERS` — order list with status, product, user, points, date | `GET /api/v1/order/admin/orders?page=0&size=10` |
| `STAT_CARDS` — totalOrders (1284), pending (23), completed (1198), pointsConsumed (586400) | No dedicated stats endpoint — derive from order list or add aggregation endpoint |
| Search / status filter | `GET /api/v1/order/admin/orders?keyword={kw}&status={status}&page=0&size=10` |
| Ship action (text link, no API call) | `PUT /api/v1/order/admin/orders/:id/status { status: 'READY' }` |
| Export button (no action) | *(Not in API design — future feature)* |

---

### OrderDetailPage (Admin)
**File:** `src/pages/admin/OrderDetailPage.tsx`

| Mock | Real API |
|------|----------|
| `MOCK_ORDER` — full order detail with employee info, delivery, timeline | `GET /api/v1/order/admin/orders/:id` *(or `GET /api/v1/order/:id` if shared)* |
| Update status button (no API call) | `PUT /api/v1/order/admin/orders/:id/status { status }` |

---

### PointsManagePage
**File:** `src/pages/admin/PointsManagePage.tsx`

| Mock | Real API |
|------|----------|
| `MOCK_RULES` — points rules list (name, type, points, condition, status) | `GET /api/v1/point/admin/config` *(current API returns single config; rules list may need new endpoint)* |
| `STAT_CARDS` — totalRules (6), activeRules (5), monthlyIssued (128500), beneficiaries (257) | No dedicated stats endpoint defined |
| Add rule button (no action) | *(Not in current API design — `POST /api/v1/point/admin/config` only covers monthly amount)* |
| Edit / disable / delete actions (no API calls) | *(Needs backend support for rule CRUD)* |

---

### UserManagePage
**File:** `src/pages/admin/UserManagePage.tsx`

| Mock | Real API |
|------|----------|
| `MOCK_USERS` — user list with name, email, dept, points, role, status, redemptions | `GET /api/v1/public/auth/admin/users?page=0&size=10` |
| `STAT_CARDS` — totalUsers (356), activeUsers (218), newThisMonth (12) | No dedicated stats endpoint — derive from user list |
| Search / role filter | `GET /api/v1/public/auth/admin/users?keyword={kw}&role={role}&page=0&size=10` |
| Edit user (icon button, no action) | *(Not in current API design)* |
| Adjust points (icon button, no action) | `POST /api/v1/point/admin/adjust { userId, amount, reason }` |
| Disable/enable user (not wired) | `PUT /api/v1/public/auth/admin/users/:id/status { status }` |
| Export button (no action) | *(Not in API design — future feature)* |

---

### UserPointsHistoryPage
**File:** `src/pages/admin/UserPointsHistoryPage.tsx`

| Mock | Real API |
|------|----------|
| `MOCK_USER` — user name, id, dept | `GET /api/v1/public/auth/admin/users/:id` *(or from user list)* |
| `MOCK_STATS` — current points, earned, monthly, redemption count | `GET /api/v1/point/admin/balances` filtered by userId |
| `MOCK_TXS` — transaction history for a specific user | *(No per-user transaction endpoint defined — may need `GET /api/v1/point/admin/transactions?userId={id}`)* |
| Tab filter (all / income / expense) | Filter client-side or `GET /api/v1/point/admin/transactions?userId={id}&type={type}` |
| Export button (no action) | *(Not in API design — future feature)* |
| Adjust points button (no action) | `POST /api/v1/point/admin/adjust { userId, amount, reason }` |

---

## API Endpoints Summary

| Endpoint | Method | Used By |
|----------|--------|---------|
| `/api/v1/public/auth/login` | POST | LoginPage |
| `/api/v1/public/auth/admin/users` | GET | UserManagePage |
| `/api/v1/public/auth/admin/users/:id/status` | PUT | UserManagePage |
| `/api/v1/product` | GET | ShopHomePage, ProductDetailPage (related) |
| `/api/v1/product/:id` | GET | ProductDetailPage, OrderConfirmPage |
| `/api/v1/product/admin/products` | GET | ProductManagePage, DashboardPage |
| `/api/v1/product/admin/products` | POST | ProductEditPage (new) |
| `/api/v1/product/admin/products/:id` | GET | ProductDetailPage (admin), ProductEditPage |
| `/api/v1/product/admin/products/:id` | PUT | ProductDetailPage (admin), ProductEditPage |
| `/api/v1/product/admin/products/:id` | DELETE | ProductManagePage, ProductDetailPage (admin) |
| `/api/v1/product/file/upload` | POST | ProductDetailPage (admin), ProductEditPage |
| `/api/v1/point/balance` | GET | OrderConfirmPage, PointsPage |
| `/api/v1/point/transactions` | GET | PointsPage |
| `/api/v1/point/admin/balances` | GET | UserPointsHistoryPage |
| `/api/v1/point/admin/adjust` | POST | UserManagePage, UserPointsHistoryPage |
| `/api/v1/point/admin/config` | GET/PUT | PointsManagePage |
| `/api/v1/order` | POST | OrderConfirmPage |
| `/api/v1/order` | GET | OrderListPage |
| `/api/v1/order/:id` | GET | OrderDetailPage (employee) |
| `/api/v1/order/admin/orders` | GET | OrderManagePage, DashboardPage |
| `/api/v1/order/admin/orders/:id/status` | PUT | OrderManagePage, OrderDetailPage (admin) |

---

## Gaps / Missing APIs

The following functionality is mocked but has no corresponding API endpoint in the current design docs:

| Feature | Page | Notes |
|---------|------|-------|
| Dashboard aggregate stats | DashboardPage | Needs a stats/summary endpoint or client-side aggregation |
| Order stats (total, pending count, points consumed) | OrderManagePage | Same as above |
| User stats (total, active, new this month) | UserManagePage | Same as above |
| Points rules CRUD | PointsManagePage | Current API only has `config` (monthly amount); full rules management needs new endpoints |
| Per-user transaction history (admin) | UserPointsHistoryPage | Needs `GET /api/v1/point/admin/transactions?userId={id}` |
| Delivery address management | DeliveryInfoPage, OrderConfirmPage | No address API defined |
| User edit | UserManagePage | No update user endpoint defined |
| Export (orders, users, points) | Multiple admin pages | Not in current API design |
