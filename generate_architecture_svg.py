#!/usr/bin/env python3
"""
AWSome Shop Frontend — Systemic Cartography (SVG)
Architecture expressed as topographic map — vector output.
"""

import math
import html

# Canvas
W, H = 2400, 2520
BG = "#0A0E1A"

# Color palette
C_DEEP = "#141B2D"
C_INDIGO = "#1E293B"
C_SLATE = "#334155"
C_BLUE = "#2563EB"
C_BLUE_L = "#3B82F6"
C_BLUE_DIM = "#1D4ED8"
C_AMBER = "#D97706"
C_AMBER_L = "#F59E0B"
C_GREEN = "#16A34A"
C_PURPLE = "#7C3AED"
C_TEXT = "#E2E8F0"
C_TEXT_DIM = "#64748B"
C_TEXT_FAINT = "#475569"
C_LINE = "#1E293B"
C_LINE_L = "#334155"

# Font families
F_SANS = "'Inter', 'Instrument Sans', system-ui, sans-serif"
F_MONO = "'Geist Mono', 'JetBrains Mono', 'SF Mono', monospace"
F_DISPLAY = "'Jura', 'Inter', sans-serif"

# SVG elements accumulator
elements = []


def esc(text):
    return html.escape(str(text))


def rect(x, y, w, h, r=0, fill=None, stroke=None, sw=1, opacity=1):
    parts = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}"']
    if r > 0:
        parts.append(f' rx="{r}" ry="{r}"')
    if fill:
        parts.append(f' fill="{fill}"')
    else:
        parts.append(' fill="none"')
    if stroke:
        parts.append(f' stroke="{stroke}" stroke-width="{sw}"')
    if opacity < 1:
        parts.append(f' opacity="{opacity}"')
    parts.append('/>')
    elements.append(''.join(parts))


def hexagon(cx, cy, r, fill=None, stroke=None, sw=1, filt=None):
    points = []
    for i in range(6):
        angle = math.radians(60 * i - 30)
        px = cx + r * math.cos(angle)
        py = cy + r * math.sin(angle)
        points.append(f"{px:.1f},{py:.1f}")
    pts = ' '.join(points)
    f_attr = f' fill="{fill}"' if fill else ' fill="none"'
    s_attr = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ''
    filt_attr = f' filter="url(#{filt})"' if filt else ''
    elements.append(f'<polygon points="{pts}"{f_attr}{s_attr}{filt_attr}/>')


def circle(cx, cy, r, fill=None, stroke=None, sw=1):
    f_attr = f' fill="{fill}"' if fill else ' fill="none"'
    s_attr = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ''
    elements.append(f'<circle cx="{cx}" cy="{cy}" r="{r}"{f_attr}{s_attr}/>')


def line(x1, y1, x2, y2, color, sw=1, dash=None):
    d_attr = f' stroke-dasharray="{dash}"' if dash else ''
    elements.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{sw}"{d_attr}/>')


def dashed_line(x1, y1, x2, y2, color, sw=1, dash_len=8, gap_len=6):
    line(x1, y1, x2, y2, color, sw, dash=f"{dash_len} {gap_len}")


def arrow(x1, y1, x2, y2, color, sw=2, head=10):
    line(x1, y1, x2, y2, color, sw)
    dx, dy = x2 - x1, y2 - y1
    dist = math.sqrt(dx * dx + dy * dy)
    if dist == 0:
        return
    ux, uy = dx / dist, dy / dist
    lx = x2 - ux * head - uy * head * 0.4
    ly = y2 - uy * head + ux * head * 0.4
    rx = x2 - ux * head + uy * head * 0.4
    ry = y2 - uy * head - ux * head * 0.4
    elements.append(
        f'<polygon points="{x2:.1f},{y2:.1f} {lx:.1f},{ly:.1f} {rx:.1f},{ry:.1f}" fill="{color}"/>'
    )


def text_c(x, y, txt, size, color, family=F_SANS, weight=400):
    elements.append(
        f'<text x="{x}" y="{y}" fill="{esc(color)}" '
        f'font-family="{family}" font-size="{size}" font-weight="{weight}" '
        f'text-anchor="middle" dominant-baseline="central">{esc(txt)}</text>'
    )


def text_l(x, y, txt, size, color, family=F_SANS, weight=400):
    elements.append(
        f'<text x="{x}" y="{y + size * 0.85}" fill="{esc(color)}" '
        f'font-family="{family}" font-size="{size}" font-weight="{weight}">{esc(txt)}</text>'
    )


# ============================================================
# BACKGROUND GRID
# ============================================================
for gx in range(0, W, 40):
    line(gx, 0, gx, H, "#0D1224", 1)
for gy in range(0, H, 40):
    line(0, gy, W, gy, "#0D1224", 1)
for gx in range(0, W, 200):
    line(gx, 0, gx, H, "#111829", 1)
for gy in range(0, H, 200):
    line(0, gy, W, gy, "#111829", 1)


# ============================================================
# HEADER
# ============================================================
rect(80, 60, W - 160, 2, 0, C_LINE_L)

text_l(80, 80, "AWSOME SHOP", 52, C_TEXT, F_SANS, 700)
text_l(80, 140, "FRONTEND ARCHITECTURE", 30, C_TEXT_DIM, F_DISPLAY, 300)

text_l(W - 380, 85, "React 19  ·  TypeScript  ·  Vite 7", 15, C_TEXT_FAINT, F_MONO, 400)
text_l(W - 380, 108, "MUI 6  ·  Zustand  ·  React Router 7", 15, C_TEXT_FAINT, F_MONO, 400)
text_l(W - 380, 131, "i18next  ·  Axios", 15, C_TEXT_FAINT, F_MONO, 400)
text_l(W - 160, 160, "v1.0 — 2026.02", 11, C_TEXT_FAINT, F_MONO, 400)

rect(80, 185, W - 160, 2, 0, C_LINE_L)


# ============================================================
# LAYER 0 — Entry
# ============================================================
y0 = 230
text_l(80, y0, "STRATUM 00", 16, C_TEXT_FAINT, F_DISPLAY, 500)
text_l(200, y0, "ENTRY", 16, C_AMBER, F_DISPLAY, 500)

hx, hy = 400, y0 + 90
hexagon(hx, hy, 42, fill="#1A1A2E", stroke=C_AMBER, sw=2, filt="glow-amber")
text_c(hx, hy - 6, "VITE", 14, C_AMBER, F_MONO, 700)
text_c(hx, hy + 12, "7.3", 11, C_AMBER_L, F_MONO, 400)

arrow(hx + 50, hy, hx + 130, hy, C_LINE_L, 1, 8)

mx = hx + 200
rect(mx - 60, hy - 25, 120, 50, 8, C_DEEP, C_LINE_L, 1)
text_c(mx, hy - 4, "main.tsx", 16, C_TEXT, F_MONO, 700)
text_c(mx, hy + 14, "bootstrap", 11, C_TEXT_FAINT, F_MONO, 400)

arrow(mx + 68, hy, mx + 148, hy, C_LINE_L, 1, 8)

ix = mx + 220
rect(ix - 65, hy - 25, 130, 50, 8, C_DEEP, C_PURPLE, 1)
text_c(ix, hy - 4, "i18n/index", 16, C_PURPLE, F_MONO, 700)
text_c(ix, hy + 14, "zh · en", 11, C_TEXT_FAINT, F_MONO, 400)

arrow(mx, hy + 30, mx, hy + 90, C_LINE_L, 1, 8)


# ============================================================
# LAYER 1 — App Shell
# ============================================================
y1 = y0 + 190
text_l(80, y1, "STRATUM 01", 16, C_TEXT_FAINT, F_DISPLAY, 500)
text_l(200, y1, "APP SHELL", 16, C_BLUE_L, F_DISPLAY, 500)

app_x, app_y = 240, y1 + 50
app_w, app_h = W - 480, 140
rect(app_x, app_y, app_w, app_h, 12, "#111827", C_BLUE_DIM, 2)

text_l(app_x + 20, app_y + 12, "App.tsx", 20, C_BLUE_L, F_SANS, 700)
text_l(app_x + 120, app_y + 14, "— Root Component", 15, C_TEXT_FAINT, F_MONO, 400)

tp_x = app_x + 30
tp_y = app_y + 50
rect(tp_x, tp_y, 260, 65, 8, C_DEEP, C_LINE_L, 1)
text_c(tp_x + 130, tp_y + 18, "ThemeProvider", 18, C_TEXT, F_SANS, 400)
text_c(tp_x + 130, tp_y + 42, "light · dark", 11, C_TEXT_FAINT, F_MONO, 400)

cb_x = tp_x + 290
rect(cb_x, tp_y, 200, 65, 8, C_DEEP, C_LINE_L, 1)
text_c(cb_x + 100, tp_y + 18, "CssBaseline", 18, C_TEXT, F_SANS, 400)
text_c(cb_x + 100, tp_y + 42, "global reset", 11, C_TEXT_FAINT, F_MONO, 400)

rp_x = cb_x + 230
rect(rp_x, tp_y, 260, 65, 8, C_DEEP, C_BLUE, 1)
text_c(rp_x + 130, tp_y + 18, "RouterProvider", 20, C_BLUE_L, F_SANS, 700)
text_c(rp_x + 130, tp_y + 42, "react-router 7", 11, C_TEXT_FAINT, F_MONO, 400)

arrow(app_x + app_w / 2, app_y + app_h + 5, app_x + app_w / 2, app_y + app_h + 65, C_LINE_L, 1, 8)


# ============================================================
# LAYER 2 — Routing & Auth Guard
# ============================================================
y2 = y1 + 305
text_l(80, y2, "STRATUM 02", 16, C_TEXT_FAINT, F_DISPLAY, 500)
text_l(200, y2, "ROUTING & AUTH", 16, C_GREEN, F_DISPLAY, 500)

route_y = y2 + 50
route_cx = W / 2

ag_cx, ag_cy = route_cx, route_y + 55
hexagon(ag_cx, ag_cy, 52, fill="#0D1F0D", stroke=C_GREEN, sw=2, filt="glow-green")
text_c(ag_cx, ag_cy - 8, "AUTH", 15, C_GREEN, F_MONO, 700)
text_c(ag_cx, ag_cy + 10, "GUARD", 15, C_GREEN, F_MONO, 700)

login_x = 280
rect(login_x - 80, ag_cy - 28, 160, 56, 8, C_DEEP, C_AMBER, 1)
text_c(login_x, ag_cy - 8, "/login", 20, C_AMBER, F_SANS, 700)
text_c(login_x, ag_cy + 12, "no auth needed", 11, C_TEXT_FAINT, F_MONO, 400)

nf_x = W - 280
rect(nf_x - 70, ag_cy - 28, 140, 56, 8, C_DEEP, C_TEXT_FAINT, 1)
text_c(nf_x, ag_cy - 8, "/*", 20, C_TEXT_DIM, F_SANS, 700)
text_c(nf_x, ag_cy + 12, "404", 11, C_TEXT_FAINT, F_MONO, 400)

dashed_line(login_x + 85, ag_cy, ag_cx - 60, ag_cy, C_LINE_L, 1, 6, 4)
dashed_line(ag_cx + 60, ag_cy, nf_x - 75, ag_cy, C_LINE_L, 1, 6, 4)

emp_arrow_x = ag_cx - 200
adm_arrow_x = ag_cx + 200
arrow(ag_cx - 30, ag_cy + 52, emp_arrow_x + 50, ag_cy + 130, C_BLUE_L, 1, 8)
arrow(ag_cx + 30, ag_cy + 52, adm_arrow_x - 50, ag_cy + 130, C_BLUE_L, 1, 8)
text_c(ag_cx - 140, ag_cy + 85, "employee", 11, C_TEXT_FAINT, F_MONO, 400)
text_c(ag_cx + 140, ag_cy + 85, "admin", 11, C_TEXT_FAINT, F_MONO, 400)


# ============================================================
# LAYER 3 — Layouts
# ============================================================
y3 = y2 + 220
text_l(80, y3, "STRATUM 03", 16, C_TEXT_FAINT, F_DISPLAY, 500)
text_l(200, y3, "LAYOUTS", 16, C_BLUE_L, F_DISPLAY, 500)

# Employee Layout
el_x, el_y = 140, y3 + 50
el_w, el_h = 1000, 360
rect(el_x, el_y, el_w, el_h, 16, "#0C1425", C_BLUE, 2)

# Employee header bar
rect(el_x, el_y, el_w, 48, 16, C_BLUE_DIM)
rect(el_x, el_y + 32, el_w, 16, 0, C_BLUE_DIM)
text_l(el_x + 20, el_y + 13, "EMPLOYEE LAYOUT", 18, "#ffffff", F_SANS, 700)
text_l(el_x + 240, el_y + 15, "EmployeeLayout.tsx", 15, "#8EA6EB", F_MONO, 400)

# Navbar
nav_y = el_y + 65
rect(el_x + 20, nav_y, el_w - 40, 50, 8, C_INDIGO, C_LINE_L, 1)
text_l(el_x + 36, nav_y + 8, "AWSome Shop", 14, C_BLUE_L, F_SANS, 700)

for i, label in enumerate(["Home", "Orders", "Points"]):
    nx = el_x + 200 + i * 80
    col = C_BLUE_L if i == 0 else C_TEXT_DIM
    text_l(nx, nav_y + 16, label, 15, col, F_MONO, 400)

text_l(el_x + el_w - 250, nav_y + 16, "Search ····", 15, C_TEXT_FAINT, F_MONO, 400)
text_l(el_x + el_w - 110, nav_y + 10, "2,580 pts", 15, C_AMBER, F_MONO, 400)
circle(el_x + el_w - 46, nav_y + 25, 14, fill=C_BLUE)
text_c(el_x + el_w - 46, nav_y + 25, "李", 11, "#ffffff", F_SANS, 700)

# Outlet
out_y = nav_y + 65
rect(el_x + 20, out_y, el_w - 40, 210, 8, C_DEEP, C_LINE_L, 1)
text_c(el_x + el_w / 2, out_y + 20, "<Outlet />", 16, C_TEXT_DIM, F_MONO, 700)

pages_e = [
    ("ShopHome", "/", C_BLUE_L),
    ("Orders", "/orders", C_TEXT_DIM),
    ("Points", "/points", C_TEXT_DIM),
]
for i, (name, path, col) in enumerate(pages_e):
    px = el_x + 60 + i * 310
    py = out_y + 55
    rect(px, py, 270, 130, 10, "#111827", col if i == 0 else C_LINE_L, 2 if i == 0 else 1)
    text_c(px + 135, py + 30, name, 20, col, F_SANS, 700)
    text_c(px + 135, py + 55, path, 15, C_TEXT_FAINT, F_MONO, 400)
    if i == 0:
        text_c(px + 135, py + 85, "Products · Filter · Cards", 11, C_TEXT_FAINT, F_MONO, 400)
        text_c(px + 135, py + 102, "Hero · Rating · Redeem", 11, C_TEXT_FAINT, F_MONO, 400)
    else:
        text_c(px + 135, py + 85, "— pending —", 11, C_TEXT_FAINT, F_MONO, 400)

# Admin Layout
al_x, al_y = el_x + el_w + 40, y3 + 50
al_w, al_h = W - al_x - 140, 360
rect(al_x, al_y, al_w, al_h, 16, "#0C1425", C_INDIGO, 2)

rect(al_x, al_y, al_w, 48, 16, C_INDIGO)
rect(al_x, al_y + 32, al_w, 16, 0, C_INDIGO)
text_l(al_x + 20, al_y + 13, "ADMIN LAYOUT", 18, C_TEXT, F_SANS, 700)
text_l(al_x + 190, al_y + 15, "AdminLayout.tsx", 15, C_TEXT_FAINT, F_MONO, 400)

# Sidebar
sb_y = al_y + 65
sb_w = 160
rect(al_x + 15, sb_y, sb_w, al_h - 80, 8, "#0B111F", C_LINE_L, 1)
nav_items = ["Dashboard", "Products", "Categories", "Points", "Orders", "Users"]
for i, item in enumerate(nav_items):
    iy = sb_y + 14 + i * 36
    col = "#ffffff" if i == 0 else C_TEXT_FAINT
    if i == 0:
        rect(al_x + 22, iy - 4, sb_w - 14, 28, 6, C_BLUE)
    text_l(al_x + 32, iy, item, 15, col, F_MONO, 400)

# Main content
mc_x = al_x + sb_w + 25
mc_w = al_w - sb_w - 45
rect(mc_x, sb_y, mc_w, al_h - 80, 8, C_DEEP, C_LINE_L, 1)

circle(mc_x + mc_w - 22, sb_y + 18, 12, fill=C_BLUE)
text_c(mc_x + mc_w - 22, sb_y + 18, "管", 9, "#ffffff", F_SANS, 700)

text_c(mc_x + mc_w / 2, sb_y + 20, "<Outlet />", 16, C_TEXT_DIM, F_MONO, 700)
dash_y = sb_y + 45
rect(mc_x + 12, dash_y, mc_w - 24, 200, 8, "#111827", C_BLUE, 2)
text_c(mc_x + mc_w / 2, dash_y + 25, "Dashboard", 20, C_BLUE_L, F_SANS, 700)
text_c(mc_x + mc_w / 2, dash_y + 50, "/admin", 15, C_TEXT_FAINT, F_MONO, 400)

# Metric boxes
for i in range(4):
    bx = mc_x + 24 + i * int((mc_w - 60) / 4)
    bw = int((mc_w - 72) / 4)
    rect(bx, dash_y + 75, bw, 50, 4, C_DEEP, C_LINE_L, 1)
    labels = ["Products", "Users", "Orders", "Points"]
    text_c(bx + bw / 2, dash_y + 92, labels[i], 11, C_TEXT_FAINT, F_MONO, 400)
    vals = ["128", "356", "89", "52.8K"]
    text_c(bx + bw / 2, dash_y + 108, vals[i], 16, C_TEXT, F_MONO, 700)

# Table lines
for i in range(4):
    ty = dash_y + 140 + i * 16
    line(mc_x + 24, ty, mc_x + mc_w - 24, ty, C_LINE_L if i > 0 else C_TEXT_FAINT, 1)
text_l(mc_x + 28, dash_y + 142, "Recent Orders", 11, C_TEXT_DIM, F_MONO, 400)


# ============================================================
# LAYER 4 — Shared Components
# ============================================================
y4 = y3 + 435
text_l(80, y4, "STRATUM 04", 16, C_TEXT_FAINT, F_DISPLAY, 500)
text_l(200, y4, "SHARED COMPONENTS", 16, C_PURPLE, F_DISPLAY, 500)

comp_y = y4 + 50
am_x = 240
rect(am_x, comp_y, 340, 200, 12, "#120D1F", C_PURPLE, 2)
text_l(am_x + 18, comp_y + 14, "AvatarMenu.tsx", 20, C_PURPLE, F_SANS, 700)

menu_items = [
    ("User Info", "name · role", C_TEXT),
    ("Language", "zh ↔ en", C_AMBER),
    ("Theme", "light ↔ dark", C_BLUE_L),
    ("Logout", "→ /login", "#DC2626"),
]
for i, (label, desc, col) in enumerate(menu_items):
    iy = comp_y + 52 + i * 36
    if i == 0:
        line(am_x + 18, iy + 28, am_x + 322, iy + 28, C_LINE_L, 1)
    circle(am_x + 36, iy + 10, 4, fill=col)
    text_l(am_x + 50, iy + 2, label, 15, col, F_MONO, 400)
    text_l(am_x + 200, iy + 2, desc, 11, C_TEXT_FAINT, F_MONO, 400)

dashed_line(am_x + 340, comp_y + 100, am_x + 440, comp_y + 100, C_PURPLE, 1)


# ============================================================
# LAYER 5 — State Management
# ============================================================
y5 = y4 - 5
text_l(W - 880, y5, "STRATUM 05", 16, C_TEXT_FAINT, F_DISPLAY, 500)
text_l(W - 760, y5, "STATE MANAGEMENT", 16, C_AMBER, F_DISPLAY, 500)

store_y = y5 + 50
auth_x = W - 860
rect(auth_x, store_y, 340, 200, 12, "#1A150A", C_AMBER, 2)
text_l(auth_x + 18, store_y + 14, "useAuthStore", 20, C_AMBER, F_SANS, 700)
text_l(auth_x + 180, store_y + 16, "Zustand + persist", 11, C_TEXT_FAINT, F_MONO, 400)

auth_fields = [
    ("user", "UserInfo | null", C_TEXT),
    ("isAuthenticated", "boolean", C_TEXT),
    ("login()", "→ mock API", C_GREEN),
    ("logout()", "→ clear state", "#DC2626"),
]
for i, (name, typ, col) in enumerate(auth_fields):
    fy = store_y + 52 + i * 36
    text_l(auth_x + 24, fy + 2, name, 16, col, F_MONO, 700)
    text_l(auth_x + 180, fy + 2, typ, 11, C_TEXT_FAINT, F_MONO, 400)

app_sx = auth_x + 380
rect(app_sx, store_y, 340, 200, 12, "#1A150A", C_AMBER, 2)
text_l(app_sx + 18, store_y + 14, "useAppStore", 20, C_AMBER, F_SANS, 700)
text_l(app_sx + 175, store_y + 16, "Zustand + persist", 11, C_TEXT_FAINT, F_MONO, 400)

app_fields = [
    ("darkMode", "boolean", C_TEXT),
    ("language", "string (zh|en)", C_TEXT),
    ("toggleDarkMode()", "→ theme", C_BLUE_L),
    ("setLanguage()", "→ i18n", C_PURPLE),
]
for i, (name, typ, col) in enumerate(app_fields):
    fy = store_y + 52 + i * 36
    text_l(app_sx + 24, fy + 2, name, 16, col, F_MONO, 700)
    text_l(app_sx + 200, fy + 2, typ, 11, C_TEXT_FAINT, F_MONO, 400)

# localStorage
for sx, label in [(auth_x + 170, "auth-storage"), (app_sx + 170, "app-storage")]:
    ly = store_y + 210
    rect(sx - 60, ly, 120, 30, 6, C_DEEP, C_LINE_L, 1)
    text_c(sx, ly + 15, label, 11, C_TEXT_FAINT, F_MONO, 400)
    line(sx, store_y + 200, sx, ly, C_LINE_L, 1)
    text_c(sx, store_y + 207, "localStorage", 9, C_TEXT_FAINT, F_MONO, 400)


# ============================================================
# LAYER 6 — Theme & i18n
# ============================================================
y6 = y5 + 300
text_l(80, y6, "STRATUM 06", 16, C_TEXT_FAINT, F_DISPLAY, 500)
text_l(200, y6, "THEME SYSTEM", 16, C_BLUE_L, F_DISPLAY, 500)

theme_y = y6 + 50
tf_x = 180
rect(tf_x, theme_y, 580, 180, 12, "#0C1425", C_BLUE_DIM, 2)
text_l(tf_x + 18, theme_y + 14, "theme/index.ts", 20, C_BLUE_L, F_SANS, 700)
text_l(tf_x + 180, theme_y + 16, "getTheme(mode)", 15, C_TEXT_FAINT, F_MONO, 400)

# Light mode
lm_x = tf_x + 20
lm_y = theme_y + 52
rect(lm_x, lm_y, 260, 108, 8, "#F8FAFC", C_LINE_L, 1)
text_l(lm_x + 12, lm_y + 8, "LIGHT", 12, "#1E293B", F_MONO, 700)

swatches_l = [("#2563EB", "primary"), ("#1E293B", "text.primary"), ("#64748B", "text.secondary"), ("#F8FAFC", "bg.default")]
for i, (color, label) in enumerate(swatches_l):
    sy = lm_y + 32 + i * 18
    rect(lm_x + 12, sy, 16, 12, 2, color, "#333", 1)
    text_l(lm_x + 36, sy - 1, label, 10, "#475569", F_MONO, 400)
    text_l(lm_x + 160, sy - 1, color, 10, "#94A3B8", F_MONO, 400)

# Dark mode
dm_x = lm_x + 280
rect(dm_x, lm_y, 260, 108, 8, "#0F172A", C_LINE_L, 1)
text_l(dm_x + 12, lm_y + 8, "DARK", 12, "#E2E8F0", F_MONO, 700)

swatches_d = [("#2563EB", "primary"), ("#E2E8F0", "text.primary"), ("#94A3B8", "text.secondary"), ("#0F172A", "bg.default")]
for i, (color, label) in enumerate(swatches_d):
    sy = lm_y + 32 + i * 18
    rect(dm_x + 12, sy, 16, 12, 2, color, "#333", 1)
    text_l(dm_x + 36, sy - 1, label, 10, "#94A3B8", F_MONO, 400)
    text_l(dm_x + 160, sy - 1, color, 10, "#64748B", F_MONO, 400)

# i18n
i18_x = 860
rect(i18_x, theme_y, 520, 180, 12, "#120D1F", C_PURPLE, 2)
text_l(i18_x + 18, theme_y + 14, "i18n/index.ts", 20, C_PURPLE, F_SANS, 700)
text_l(i18_x + 175, theme_y + 16, "i18next + LanguageDetector", 15, C_TEXT_FAINT, F_MONO, 400)

for i, (lang, file) in enumerate([("zh", "zh.json"), ("en", "en.json")]):
    lx = i18_x + 20 + i * 250
    ly = theme_y + 52
    rect(lx, ly, 230, 108, 8, C_DEEP, C_LINE_L, 1)
    text_l(lx + 12, ly + 8, lang.upper(), 14, C_PURPLE, F_MONO, 700)
    text_l(lx + 50, ly + 10, file, 11, C_TEXT_FAINT, F_MONO, 400)
    keys = ["app.*", "login.*", "employee.*", "admin.*", "menu.*"]
    for j, key in enumerate(keys):
        text_l(lx + 16, ly + 34 + j * 15, key, 10, C_TEXT_DIM, F_MONO, 400)


# ============================================================
# LAYER 7 — Services
# ============================================================
y7 = y6 + 255
text_l(80, y7, "STRATUM 07", 16, C_TEXT_FAINT, F_DISPLAY, 500)
text_l(200, y7, "SERVICE LAYER", 16, C_GREEN, F_DISPLAY, 500)

svc_y = y7 + 50
svc_x = 180
rect(svc_x, svc_y, 700, 130, 12, "#0D1F0D", C_GREEN, 2)
text_l(svc_x + 18, svc_y + 14, "services/request.ts", 20, C_GREEN, F_SANS, 700)
text_l(svc_x + 240, svc_y + 16, "Axios instance", 15, C_TEXT_FAINT, F_MONO, 400)

flow_items = [
    ("baseURL", "/api", 30),
    ("timeout", "10s", 180),
    ("req interceptor", "+ Authorization", 320),
    ("res interceptor", "401 → /login", 530),
]
for label, val, ox in flow_items:
    fy = svc_y + 55
    text_l(svc_x + ox, fy, label, 15, C_TEXT_DIM, F_MONO, 400)
    text_l(svc_x + ox, fy + 20, val, 16, C_GREEN, F_MONO, 700)

arrow(svc_x + 700, svc_y + 65, svc_x + 830, svc_y + 65, C_GREEN, 2, 10)

be_x = svc_x + 850
rect(be_x, svc_y + 30, 260, 70, 8, C_DEEP, C_LINE_L, 1)
dashed_line(be_x + 10, svc_y + 65, be_x + 250, svc_y + 65, C_TEXT_FAINT, 1, 4, 4)
text_c(be_x + 130, svc_y + 52, "Backend API", 18, C_TEXT_DIM, F_SANS, 400)
text_c(be_x + 130, svc_y + 78, "— pending integration —", 11, C_TEXT_FAINT, F_MONO, 400)


# ============================================================
# LAYER 8 — Data Flow
# ============================================================
y8 = y7 + 210
text_l(80, y8, "STRATUM 08", 16, C_TEXT_FAINT, F_DISPLAY, 500)
text_l(200, y8, "DATA FLOW", 16, C_AMBER_L, F_DISPLAY, 500)

flow_y = y8 + 65

flow_nodes = [
    ("User", "Action", C_AMBER, 200),
    ("Zustand", "Store", C_AMBER, 520),
    ("React", "State", C_BLUE_L, 840),
    ("MUI", "Component", C_PURPLE, 1160),
    ("DOM", "Render", C_GREEN, 1480),
    ("User", "Sees", C_AMBER, 1800),
]

for label1, label2, col, fx in flow_nodes:
    hexagon(fx, flow_y, 56, fill="#111827", stroke=col, sw=2)
    text_c(fx, flow_y - 8, label1, 13, col, F_MONO, 700)
    text_c(fx, flow_y + 10, label2, 12, C_TEXT_DIM, F_MONO, 400)

for i in range(len(flow_nodes) - 1):
    x1 = flow_nodes[i][3] + 60
    x2 = flow_nodes[i + 1][3] - 60
    arrow(x1, flow_y, x2, flow_y, C_LINE_L, 1, 8)

# Feedback loop
arc_y = flow_y + 85
dashed_line(flow_nodes[-1][3], flow_y + 56, flow_nodes[-1][3], arc_y, C_TEXT_FAINT, 1, 4, 4)
dashed_line(flow_nodes[-1][3], arc_y, flow_nodes[0][3], arc_y, C_TEXT_FAINT, 1, 4, 4)
arrow(flow_nodes[0][3], arc_y, flow_nodes[0][3], flow_y + 58, C_TEXT_FAINT, 1, 6)
text_c(W / 2, arc_y + 6, "feedback loop", 11, C_TEXT_FAINT, F_MONO, 400)


# ============================================================
# FOOTER
# ============================================================
rect(80, H - 100, W - 160, 2, 0, C_LINE_L)
text_l(80, H - 85, "SYSTEMIC CARTOGRAPHY", 16, C_TEXT_FAINT, F_DISPLAY, 500)
text_l(80, H - 62, "AWSome Shop Frontend Architecture — Topographic System Map", 11, C_TEXT_FAINT, F_MONO, 400)
text_l(W - 400, H - 85, "React 19 · TypeScript · Vite 7 · MUI 6", 11, C_TEXT_FAINT, F_MONO, 400)
text_l(W - 400, H - 62, "Zustand · React Router 7 · i18next · Axios", 11, C_TEXT_FAINT, F_MONO, 400)

text_l(84, H - 42, "0,0", 9, "#1E293B", F_MONO, 400)
text_l(W - 110, H - 42, f"{W},{H}", 9, "#1E293B", F_MONO, 400)

# Edge tick marks
for gy in range(200, H, 200):
    line(60, gy, 75, gy, "#1E293B", 1)
    line(W - 75, gy, W - 60, gy, "#1E293B", 1)
    text_l(20, gy - 6, str(gy), 8, "#1E293B", F_MONO, 400)

# Corner crosshairs
for cx, cy in [(80, 60), (W - 80, 60), (80, H - 40), (W - 80, H - 40)]:
    line(cx - 8, cy, cx + 8, cy, "#1E293B", 1)
    line(cx, cy - 8, cx, cy + 8, "#1E293B", 1)


# ============================================================
# ASSEMBLE SVG
# ============================================================
svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
  <defs>
    <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.086  0 0 0 0 0.639  0 0 0 0 0.290  0 0 0 0.35 0" result="glow"/>
      <feMerge>
        <feMergeNode in="glow"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="glow-amber" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.851  0 0 0 0 0.467  0 0 0 0 0.024  0 0 0 0.35 0" result="glow"/>
      <feMerge>
        <feMergeNode in="glow"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="{W}" height="{H}" fill="{BG}"/>
  {''.join(elements)}
</svg>'''

output_path = "/Users/catface/Desktop/aswome-shop-frontend/architecture.svg"
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(svg_content)

print(f"Saved to {output_path}")
print(f"Canvas: {W}x{H}")
print(f"Elements: {len(elements)}")
