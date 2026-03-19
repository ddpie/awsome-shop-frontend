#!/usr/bin/env node
/**
 * Backend API smoke test
 * Usage: node scripts/test-api.mjs [base_url]
 * Default base_url: http://localhost:3000
 */

const BASE = process.argv[2] || 'http://localhost:3000';
const ADMIN_USER = { username: 'admin', password: 'admin123' };
const EMP_USER   = { username: 'staff1', password: 'pass1234' };

let adminToken = '';
let empToken   = '';
let createdProductId = '';
let adminUserId = '';

const results = [];

// ── helpers ────────────────────────────────────────────────────────────────

function decodeJwt(token) {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  } catch {
    return {};
  }
}

async function req(method, path, { body, token, label } = {}) {
  const url = `${BASE}${path}`;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res, json;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    try { json = await res.json(); } catch { json = null; }
  } catch (e) {
    results.push({ label, status: 'ERR', detail: e.message, path: `${method} ${path}` });
    console.error(`  ✗ ${label}: ${e.message}`);
    return null;
  }

  const ok = res.status >= 200 && res.status < 300;
  const icon = ok ? '✓' : '✗';
  const detail = ok ? '' : JSON.stringify(json)?.slice(0, 120);
  results.push({ label, status: res.status, ok, detail, path: `${method} ${path}` });
  console.log(`  ${icon} [${res.status}] ${method} ${path} — ${label}${detail ? ' — ' + detail : ''}`);
  return ok ? json : null;
}

// ── test suites ────────────────────────────────────────────────────────────

async function testAuth() {
  console.log('\n── Auth ──────────────────────────────────────────────');

  const adminRes = await req('POST', '/api/v1/public/auth/login', {
    body: ADMIN_USER, label: 'Admin login',
  });
  if (adminRes?.data?.token) {
    adminToken = adminRes.data.token;
    const payload = decodeJwt(adminToken);
    console.log(`     JWT payload: userId=${payload.userId} username=${payload.username} role=${payload.role}`);
  }

  const empRes = await req('POST', '/api/v1/public/auth/login', {
    body: EMP_USER, label: 'Employee login',
  });
  if (empRes?.data?.token) {
    empToken = empRes.data.token;
  }

  await req('POST', '/api/v1/private/user/current', {
    token: empToken, label: 'POST /private/user/current (employee)',
  });
}

async function testAdminUsers() {
  console.log('\n── Admin Users ───────────────────────────────────────');

  const res = await req('POST', '/api/v1/admin/user/list', {
    token: adminToken, label: 'POST admin user list',
    body: { page: 0, size: 10 },
  });
  if (res?.data?.content?.length) {
    adminUserId = res.data.content[0].id;
    console.log(`     First user id: ${adminUserId}`);
  }

  if (adminUserId) {
    await req('POST', '/api/v1/admin/user/get', {
      token: adminToken, label: 'POST admin user get',
      body: { id: adminUserId },
    });
  }
}

async function testProducts() {
  console.log('\n── Products (Employee) ───────────────────────────────');

  const listRes = await req('POST', '/api/v1/public/product/list', {
    token: empToken, label: 'POST product list',
    body: { page: 0, size: 20 },
  });
  const firstId = listRes?.data?.content?.[0]?.id;
  if (firstId) {
    await req('POST', '/api/v1/public/product/get', {
      token: empToken, label: `POST product get (${firstId})`,
      body: { id: firstId },
    });
  }

  console.log('\n── Products (Admin) ──────────────────────────────────');

  const adminList = await req('POST', '/api/v1/admin/product/list', {
    token: adminToken, label: 'POST admin product list',
    body: { page: 0, size: 8 },
  });
  const adminFirstId = adminList?.data?.content?.[0]?.id;
  if (adminFirstId) {
    await req('POST', '/api/v1/admin/product/get', {
      token: adminToken, label: `POST admin product get (${adminFirstId})`,
      body: { id: adminFirstId },
    });
  }

  const created = await req('POST', '/api/v1/admin/product/create', {
    token: adminToken,
    label: 'POST create product',
    body: {
      name: '[TEST] API Smoke Test Product',
      description: 'Created by test script',
      pointsCost: 100,
      stock: 10,
      status: 'ACTIVE',
    },
  });
  createdProductId = created?.data?.id ?? adminFirstId;

  if (createdProductId) {
    await req('POST', '/api/v1/admin/product/update', {
      token: adminToken,
      label: `POST update product (${createdProductId})`,
      body: { id: createdProductId, stock: 99 },
    });

    await req('POST', '/api/v1/admin/product/delete', {
      token: adminToken,
      label: `POST delete product (${createdProductId})`,
      body: { id: createdProductId },
    });
  }
}

async function testCategories() {
  console.log('\n── Categories ────────────────────────────────────────');

  await req('POST', '/api/v1/public/category/list', {
    token: empToken, label: 'POST category list',
  });

  const created = await req('POST', '/api/v1/admin/category/create', {
    token: adminToken,
    label: 'POST create category',
    body: { name: '[TEST] Smoke Category', sortWeight: 99 },
  });
  const catId = created?.data?.id;
  if (catId) {
    await req('POST', '/api/v1/admin/category/update', {
      token: adminToken,
      label: `POST update category (${catId})`,
      body: { id: catId, name: '[TEST] Updated Category', sortWeight: 50 },
    });
    await req('POST', '/api/v1/admin/category/delete', {
      token: adminToken,
      label: `POST delete category (${catId})`,
      body: { id: catId },
    });
  }
}

async function testPoints() {
  console.log('\n── Points (Employee) ─────────────────────────────────');

  await req('GET', '/api/v1/point/balance', {
    token: empToken, label: 'GET point balance',
  });

  await req('GET', '/api/v1/point/transactions?page=0&size=20', {
    token: empToken, label: 'GET point transactions',
  });

  await req('GET', '/api/v1/point/transactions?type=EARN&page=0&size=20', {
    token: empToken, label: 'GET point transactions (EARN)',
  });

  console.log('\n── Points (Admin) ────────────────────────────────────');

  await req('GET', '/api/v1/point/admin/config', {
    token: adminToken, label: 'GET point admin config',
  });

  await req('GET', '/api/v1/point/admin/balances', {
    token: adminToken, label: 'GET point admin balances',
  });

  // Admin transactions with userId path param
  await req('GET', '/api/v1/point/admin/transactions/1?page=0&size=20', {
    token: adminToken, label: 'GET point admin transactions (userId=1)',
  });
}

async function testOrders() {
  console.log('\n── Orders (Employee) ─────────────────────────────────');

  const listRes = await req('POST', '/api/v1/public/order/list', {
    token: empToken, label: 'POST employee order list',
    body: { page: 0, size: 20 },
  });
  const empOrderId = listRes?.data?.content?.[0]?.id;
  if (empOrderId) {
    await req('POST', '/api/v1/public/order/get', {
      token: empToken, label: `POST employee order get (${empOrderId})`,
      body: { id: empOrderId },
    });
  }

  console.log('\n── Orders (Admin) ────────────────────────────────────');

  const adminOrders = await req('POST', '/api/v1/private/order/admin/list', {
    token: adminToken, label: 'POST admin order list',
    body: { page: 0, size: 4 },
  });
  const adminOrderId = adminOrders?.data?.content?.[0]?.id;
  if (adminOrderId) {
    await req('POST', '/api/v1/private/order/admin/get', {
      token: adminToken, label: `POST admin order get (${adminOrderId})`,
      body: { id: adminOrderId },
    });
  }
}

// ── summary ────────────────────────────────────────────────────────────────

function printSummary() {
  console.log('\n── Summary ───────────────────────────────────────────');
  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  console.log(`  Total: ${results.length}  ✓ ${passed}  ✗ ${failed}`);
  if (failed > 0) {
    console.log('\n  Failed:');
    results.filter((r) => !r.ok).forEach((r) => {
      console.log(`    [${r.status}] ${r.path} — ${r.label}${r.detail ? ' — ' + r.detail : ''}`);
    });
  }
}

// ── main ───────────────────────────────────────────────────────────────────

console.log(`Testing against: ${BASE}`);
await testAuth();
await testAdminUsers();
await testProducts();
await testCategories();
await testPoints();
await testOrders();
printSummary();
