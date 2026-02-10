#!/usr/bin/env python3
"""
AWSome Shop Frontend — Systemic Cartography
Architecture expressed as topographic map.
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math

# Canvas — tightened to eliminate dead space
W, H = 2400, 2520
bg = "#0A0E1A"
img = Image.new("RGBA", (W, H), bg)
draw = ImageDraw.Draw(img)

# Fonts
FONTS_DIR = "/Users/catface/.claude/skills/canvas-design/canvas-fonts"
def font(name, size):
    return ImageFont.truetype(f"{FONTS_DIR}/{name}", size)

f_title = font("InstrumentSans-Bold.ttf", 52)
f_subtitle = font("Jura-Light.ttf", 22)
f_label = font("GeistMono-Regular.ttf", 15)
f_label_bold = font("GeistMono-Bold.ttf", 16)
f_node = font("InstrumentSans-Regular.ttf", 18)
f_node_bold = font("InstrumentSans-Bold.ttf", 20)
f_tiny = font("GeistMono-Regular.ttf", 11)
f_section = font("Jura-Medium.ttf", 16)
f_brand = font("InstrumentSans-Bold.ttf", 28)

# Color palette — Systemic Cartography strata
C_DEEP = "#141B2D"       # Foundation stratum
C_INDIGO = "#1E293B"     # Infrastructure
C_SLATE = "#334155"       # Mid layer
C_BLUE = "#2563EB"        # Primary accent
C_BLUE_L = "#3B82F6"      # Light accent
C_BLUE_DIM = "#1D4ED8"    # Dim blue
C_AMBER = "#D97706"       # Surface warmth
C_AMBER_L = "#F59E0B"     # Light amber
C_GREEN = "#16A34A"       # Success/active
C_PURPLE = "#7C3AED"      # Special accent
C_TEXT = "#E2E8F0"         # Primary text
C_TEXT_DIM = "#64748B"     # Secondary text
C_TEXT_FAINT = "#475569"   # Faint text
C_LINE = "#1E293B"         # Subtle lines
C_LINE_L = "#334155"       # Visible lines


def draw_rounded_rect(x, y, w, h, r, fill=None, outline=None, width=1):
    """Draw a rounded rectangle."""
    if fill:
        # Fill
        draw.rounded_rectangle([x, y, x+w, y+h], radius=r, fill=fill)
    if outline:
        draw.rounded_rectangle([x, y, x+w, y+h], radius=r, outline=outline, width=width)


def draw_hexagon(cx, cy, r, fill=None, outline=None, width=1):
    """Draw a regular hexagon."""
    points = []
    for i in range(6):
        angle = math.radians(60 * i - 30)
        px = cx + r * math.cos(angle)
        py = cy + r * math.sin(angle)
        points.append((px, py))
    if fill:
        draw.polygon(points, fill=fill)
    if outline:
        draw.polygon(points, outline=outline, width=width)


def draw_circle(cx, cy, r, fill=None, outline=None, width=1):
    draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=fill, outline=outline, width=width)


def draw_dashed_line(x1, y1, x2, y2, color, width=1, dash_len=8, gap_len=6):
    """Draw a dashed line."""
    dx = x2 - x1
    dy = y2 - y1
    dist = math.sqrt(dx*dx + dy*dy)
    if dist == 0:
        return
    ux, uy = dx/dist, dy/dist
    pos = 0
    while pos < dist:
        sx = x1 + ux * pos
        sy = y1 + uy * pos
        end = min(pos + dash_len, dist)
        ex = x1 + ux * end
        ey = y1 + uy * end
        draw.line([(sx, sy), (ex, ey)], fill=color, width=width)
        pos += dash_len + gap_len


def draw_arrow(x1, y1, x2, y2, color, width=2, head=10):
    """Draw line with arrowhead."""
    draw.line([(x1, y1), (x2, y2)], fill=color, width=width)
    dx = x2 - x1
    dy = y2 - y1
    dist = math.sqrt(dx*dx + dy*dy)
    if dist == 0:
        return
    ux, uy = dx/dist, dy/dist
    # Arrow head
    lx = x2 - ux * head - uy * head * 0.4
    ly = y2 - uy * head + ux * head * 0.4
    rx = x2 - ux * head + uy * head * 0.4
    ry = y2 - uy * head - ux * head * 0.4
    draw.polygon([(x2, y2), (lx, ly), (rx, ry)], fill=color)


def text_center(x, y, text, fnt, color):
    bbox = draw.textbbox((0, 0), text, font=fnt)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((x - tw/2, y - th/2), text, fill=color, font=fnt)


def text_left(x, y, text, fnt, color):
    draw.text((x, y), text, fill=color, font=fnt)


# ============================================================
# BACKGROUND GRID — cartographic texture
# ============================================================
for gx in range(0, W, 40):
    draw.line([(gx, 0), (gx, H)], fill="#0D1224", width=1)
for gy in range(0, H, 40):
    draw.line([(0, gy), (W, gy)], fill="#0D1224", width=1)

# Finer grid every 200px
for gx in range(0, W, 200):
    draw.line([(gx, 0), (gx, H)], fill="#111829", width=1)
for gy in range(0, H, 200):
    draw.line([(0, gy), (W, gy)], fill="#111829", width=1)


# ============================================================
# HEADER — Title zone
# ============================================================
# Top line accent
draw.rectangle([80, 60, W-80, 62], fill=C_LINE_L)

# Title
text_left(80, 80, "AWSOME SHOP", f_title, C_TEXT)
text_left(80, 140, "FRONTEND ARCHITECTURE", font("Jura-Light.ttf", 30), C_TEXT_DIM)

# Right side markers
text_left(W-380, 85, "React 19  ·  TypeScript  ·  Vite 7", f_label, C_TEXT_FAINT)
text_left(W-380, 108, "MUI 6  ·  Zustand  ·  React Router 7", f_label, C_TEXT_FAINT)
text_left(W-380, 131, "i18next  ·  Axios", f_label, C_TEXT_FAINT)

# Version marker
text_left(W-160, 160, "v1.0 — 2026.02", f_tiny, C_TEXT_FAINT)

draw.rectangle([80, 185, W-80, 187], fill=C_LINE_L)


# ============================================================
# LAYER 0 — Entry Point (Vite + main.tsx)
# ============================================================
y0 = 230
text_left(80, y0, "STRATUM 00", f_section, C_TEXT_FAINT)
text_left(200, y0, "ENTRY", f_section, C_AMBER)

# Vite hexagon
hx, hy = 400, y0 + 90
draw_hexagon(hx, hy, 42, fill="#1A1A2E", outline=C_AMBER, width=2)
text_center(hx, hy - 6, "VITE", font("GeistMono-Bold.ttf", 14), C_AMBER)
text_center(hx, hy + 12, "7.3", f_tiny, C_AMBER_L)

# Arrow
draw_arrow(hx + 50, hy, hx + 130, hy, C_LINE_L, 1, 8)

# main.tsx node
mx = hx + 200
draw_rounded_rect(mx - 60, hy - 25, 120, 50, 8, fill=C_DEEP, outline=C_LINE_L, width=1)
text_center(mx, hy - 4, "main.tsx", f_label_bold, C_TEXT)
text_center(mx, hy + 14, "bootstrap", f_tiny, C_TEXT_FAINT)

# Arrow
draw_arrow(mx + 68, hy, mx + 148, hy, C_LINE_L, 1, 8)

# i18n init node
ix = mx + 220
draw_rounded_rect(ix - 65, hy - 25, 130, 50, 8, fill=C_DEEP, outline=C_PURPLE, width=1)
text_center(ix, hy - 4, "i18n/index", f_label_bold, C_PURPLE)
text_center(ix, hy + 14, "zh · en", f_tiny, C_TEXT_FAINT)

# Arrow down from main.tsx
draw_arrow(mx, hy + 30, mx, hy + 90, C_LINE_L, 1, 8)


# ============================================================
# LAYER 1 — App Shell (ThemeProvider + Router)
# ============================================================
y1 = y0 + 190
text_left(80, y1, "STRATUM 01", f_section, C_TEXT_FAINT)
text_left(200, y1, "APP SHELL", f_section, C_BLUE_L)

# App.tsx large block
app_x, app_y = 240, y1 + 50
app_w, app_h = W - 480, 140
draw_rounded_rect(app_x, app_y, app_w, app_h, 12, fill="#111827", outline=C_BLUE_DIM, width=2)

# Inner label
text_left(app_x + 20, app_y + 12, "App.tsx", f_node_bold, C_BLUE_L)
text_left(app_x + 120, app_y + 14, "— Root Component", f_label, C_TEXT_FAINT)

# ThemeProvider box
tp_x = app_x + 30
tp_y = app_y + 50
draw_rounded_rect(tp_x, tp_y, 260, 65, 8, fill=C_DEEP, outline=C_LINE_L)
text_center(tp_x + 130, tp_y + 18, "ThemeProvider", f_node, C_TEXT)
text_center(tp_x + 130, tp_y + 42, "light · dark", f_tiny, C_TEXT_FAINT)

# CssBaseline
cb_x = tp_x + 290
draw_rounded_rect(cb_x, tp_y, 200, 65, 8, fill=C_DEEP, outline=C_LINE_L)
text_center(cb_x + 100, tp_y + 18, "CssBaseline", f_node, C_TEXT)
text_center(cb_x + 100, tp_y + 42, "global reset", f_tiny, C_TEXT_FAINT)

# RouterProvider
rp_x = cb_x + 230
draw_rounded_rect(rp_x, tp_y, 260, 65, 8, fill=C_DEEP, outline=C_BLUE, width=1)
text_center(rp_x + 130, tp_y + 18, "RouterProvider", f_node_bold, C_BLUE_L)
text_center(rp_x + 130, tp_y + 42, "react-router 7", f_tiny, C_TEXT_FAINT)

# Arrow down from App
draw_arrow(app_x + app_w/2, app_y + app_h + 5, app_x + app_w/2, app_y + app_h + 65, C_LINE_L, 1, 8)


# ============================================================
# LAYER 2 — Routing & Auth Guard
# ============================================================
y2 = y1 + 305
text_left(80, y2, "STRATUM 02", f_section, C_TEXT_FAINT)
text_left(200, y2, "ROUTING & AUTH", f_section, C_GREEN)

route_y = y2 + 50
route_cx = W / 2

# AuthGuard hexagon — center
ag_cx, ag_cy = route_cx, route_y + 55
draw_hexagon(ag_cx, ag_cy, 52, fill="#0D1F0D", outline=C_GREEN, width=2)
text_center(ag_cx, ag_cy - 8, "AUTH", font("GeistMono-Bold.ttf", 15), C_GREEN)
text_center(ag_cx, ag_cy + 10, "GUARD", font("GeistMono-Bold.ttf", 15), C_GREEN)

# Login route — left (no guard)
login_x = 280
draw_rounded_rect(login_x - 80, ag_cy - 28, 160, 56, 8, fill=C_DEEP, outline=C_AMBER, width=1)
text_center(login_x, ag_cy - 8, "/login", f_node_bold, C_AMBER)
text_center(login_x, ag_cy + 12, "no auth needed", f_tiny, C_TEXT_FAINT)

# NotFound — far right
nf_x = W - 280
draw_rounded_rect(nf_x - 70, ag_cy - 28, 140, 56, 8, fill=C_DEEP, outline=C_TEXT_FAINT, width=1)
text_center(nf_x, ag_cy - 8, "/*", f_node_bold, C_TEXT_DIM)
text_center(nf_x, ag_cy + 12, "404", f_tiny, C_TEXT_FAINT)

# Dashed connection lines
draw_dashed_line(login_x + 85, ag_cy, ag_cx - 60, ag_cy, C_LINE_L, 1, 6, 4)
draw_dashed_line(ag_cx + 60, ag_cy, nf_x - 75, ag_cy, C_LINE_L, 1, 6, 4)

# Two arrows down from AuthGuard — employee left, admin right
emp_arrow_x = ag_cx - 200
adm_arrow_x = ag_cx + 200
draw_arrow(ag_cx - 30, ag_cy + 52, emp_arrow_x + 50, ag_cy + 130, C_BLUE_L, 1, 8)
draw_arrow(ag_cx + 30, ag_cy + 52, adm_arrow_x - 50, ag_cy + 130, C_BLUE_L, 1, 8)

# Role labels on arrows
text_center(ag_cx - 140, ag_cy + 85, "employee", f_tiny, C_TEXT_FAINT)
text_center(ag_cx + 140, ag_cy + 85, "admin", f_tiny, C_TEXT_FAINT)


# ============================================================
# LAYER 3 — Layouts (Dual Role System)
# ============================================================
y3 = y2 + 220
text_left(80, y3, "STRATUM 03", f_section, C_TEXT_FAINT)
text_left(200, y3, "LAYOUTS", f_section, C_BLUE_L)

# Employee Layout — left
el_x, el_y = 140, y3 + 50
el_w, el_h = 1000, 360
draw_rounded_rect(el_x, el_y, el_w, el_h, 16, fill="#0C1425", outline=C_BLUE, width=2)

# Employee header
draw_rounded_rect(el_x, el_y, el_w, 48, 16, fill=C_BLUE_DIM)
draw.rectangle([el_x, el_y + 32, el_x + el_w, el_y + 48], fill=C_BLUE_DIM)
text_left(el_x + 20, el_y + 13, "EMPLOYEE LAYOUT", font("InstrumentSans-Bold.ttf", 18), "#fff")
text_left(el_x + 240, el_y + 15, "EmployeeLayout.tsx", f_label, "#8EA6EB")

# Navbar mock
nav_y = el_y + 65
draw_rounded_rect(el_x + 20, nav_y, el_w - 40, 50, 8, fill=C_INDIGO, outline=C_LINE_L)
text_left(el_x + 36, nav_y + 8, "AWSome Shop", font("InstrumentSans-Bold.ttf", 14), C_BLUE_L)
# Nav items
for i, label in enumerate(["Home", "Orders", "Points"]):
    nx = el_x + 200 + i * 80
    col = C_BLUE_L if i == 0 else C_TEXT_DIM
    text_left(nx, nav_y + 16, label, f_label, col)
text_left(el_x + el_w - 250, nav_y + 16, "Search ····", f_label, C_TEXT_FAINT)
text_left(el_x + el_w - 110, nav_y + 10, "2,580 pts", f_label, C_AMBER)
# Avatar circle
draw_circle(el_x + el_w - 46, nav_y + 25, 14, fill=C_BLUE, outline=None)
text_center(el_x + el_w - 46, nav_y + 25, "李", font("InstrumentSans-Bold.ttf", 11), "#fff")

# Outlet area
out_y = nav_y + 65
draw_rounded_rect(el_x + 20, out_y, el_w - 40, 210, 8, fill=C_DEEP, outline=C_LINE_L)
text_center(el_x + el_w/2, out_y + 20, "<Outlet />", f_label_bold, C_TEXT_DIM)

# Employee pages inside outlet
pages_e = [
    ("ShopHome", "/", C_BLUE_L),
    ("Orders", "/orders", C_TEXT_DIM),
    ("Points", "/points", C_TEXT_DIM),
]
for i, (name, path, col) in enumerate(pages_e):
    px = el_x + 60 + i * 310
    py = out_y + 55
    draw_rounded_rect(px, py, 270, 130, 10, fill="#111827", outline=col if i == 0 else C_LINE_L, width=2 if i == 0 else 1)
    text_center(px + 135, py + 30, name, f_node_bold, col)
    text_center(px + 135, py + 55, path, f_label, C_TEXT_FAINT)
    if i == 0:
        # Active indicator
        text_center(px + 135, py + 85, "Products · Filter · Cards", f_tiny, C_TEXT_FAINT)
        text_center(px + 135, py + 102, "Hero · Rating · Redeem", f_tiny, C_TEXT_FAINT)
    else:
        text_center(px + 135, py + 85, "— pending —", f_tiny, C_TEXT_FAINT)


# Admin Layout — right
al_x, al_y = el_x + el_w + 40, y3 + 50
al_w, al_h = W - al_x - 140, 360
draw_rounded_rect(al_x, al_y, al_w, al_h, 16, fill="#0C1425", outline=C_INDIGO, width=2)

# Admin header
draw_rounded_rect(al_x, al_y, al_w, 48, 16, fill=C_INDIGO)
draw.rectangle([al_x, al_y + 32, al_x + al_w, al_y + 48], fill=C_INDIGO)
text_left(al_x + 20, al_y + 13, "ADMIN LAYOUT", font("InstrumentSans-Bold.ttf", 18), C_TEXT)
text_left(al_x + 190, al_y + 15, "AdminLayout.tsx", f_label, C_TEXT_FAINT)

# Sidebar mock
sb_y = al_y + 65
sb_w = 160
draw_rounded_rect(al_x + 15, sb_y, sb_w, al_h - 80, 8, fill="#0B111F", outline=C_LINE_L)
nav_items = ["Dashboard", "Products", "Categories", "Points", "Orders", "Users"]
for i, item in enumerate(nav_items):
    iy = sb_y + 14 + i * 36
    col = "#fff" if i == 0 else C_TEXT_FAINT
    if i == 0:
        draw_rounded_rect(al_x + 22, iy - 4, sb_w - 14, 28, 6, fill=C_BLUE)
    text_left(al_x + 32, iy, item, f_label, col)

# Main content area
mc_x = al_x + sb_w + 25
mc_w = al_w - sb_w - 45
draw_rounded_rect(mc_x, sb_y, mc_w, al_h - 80, 8, fill=C_DEEP, outline=C_LINE_L)

# Avatar in top right
draw_circle(mc_x + mc_w - 22, sb_y + 18, 12, fill=C_BLUE)
text_center(mc_x + mc_w - 22, sb_y + 18, "管", font("InstrumentSans-Bold.ttf", 9), "#fff")

# Dashboard inside
text_center(mc_x + mc_w/2, sb_y + 20, "<Outlet />", f_label_bold, C_TEXT_DIM)
dash_y = sb_y + 45
draw_rounded_rect(mc_x + 12, dash_y, mc_w - 24, 200, 8, fill="#111827", outline=C_BLUE, width=2)
text_center(mc_x + mc_w/2, dash_y + 25, "Dashboard", f_node_bold, C_BLUE_L)
text_center(mc_x + mc_w/2, dash_y + 50, "/admin", f_label, C_TEXT_FAINT)

# Metric boxes
for i in range(4):
    bx = mc_x + 24 + i * int((mc_w - 60) / 4)
    bw = int((mc_w - 72) / 4)
    draw_rounded_rect(bx, dash_y + 75, bw, 50, 4, fill=C_DEEP, outline=C_LINE_L)
    labels = ["Products", "Users", "Orders", "Points"]
    text_center(bx + bw/2, dash_y + 92, labels[i], f_tiny, C_TEXT_FAINT)
    vals = ["128", "356", "89", "52.8K"]
    text_center(bx + bw/2, dash_y + 108, vals[i], f_label_bold, C_TEXT)

# Table lines
for i in range(4):
    ty = dash_y + 140 + i * 16
    draw.line([(mc_x + 24, ty), (mc_x + mc_w - 24, ty)], fill=C_LINE_L if i > 0 else C_TEXT_FAINT, width=1)
text_left(mc_x + 28, dash_y + 142, "Recent Orders", f_tiny, C_TEXT_DIM)


# ============================================================
# LAYER 4 — Shared Components
# ============================================================
y4 = y3 + 435
text_left(80, y4, "STRATUM 04", f_section, C_TEXT_FAINT)
text_left(200, y4, "SHARED COMPONENTS", f_section, C_PURPLE)

comp_y = y4 + 50
# AvatarMenu
am_x = 240
draw_rounded_rect(am_x, comp_y, 340, 200, 12, fill="#120D1F", outline=C_PURPLE, width=2)
text_left(am_x + 18, comp_y + 14, "AvatarMenu.tsx", f_node_bold, C_PURPLE)

# Menu mockup
menu_items = [
    ("User Info", "name · role", C_TEXT),
    ("Language", "zh ↔ en", C_AMBER),
    ("Theme", "light ↔ dark", C_BLUE_L),
    ("Logout", "→ /login", "#DC2626"),
]
for i, (label, desc, col) in enumerate(menu_items):
    iy = comp_y + 52 + i * 36
    if i == 0:
        draw.line([(am_x + 18, iy + 28), (am_x + 322, iy + 28)], fill=C_LINE_L)
    draw_circle(am_x + 36, iy + 10, 4, fill=col)
    text_left(am_x + 50, iy + 2, label, f_label, col)
    text_left(am_x + 200, iy + 2, desc, f_tiny, C_TEXT_FAINT)

# Connection lines to stores
draw_dashed_line(am_x + 340, comp_y + 100, am_x + 440, comp_y + 100, C_PURPLE, 1)


# ============================================================
# LAYER 5 — State Management (Zustand Stores)
# ============================================================
y5 = y4 - 5
text_left(W - 880, y5, "STRATUM 05", f_section, C_TEXT_FAINT)
text_left(W - 760, y5, "STATE MANAGEMENT", f_section, C_AMBER)

store_y = y5 + 50
# useAuthStore
auth_x = W - 860
draw_rounded_rect(auth_x, store_y, 340, 200, 12, fill="#1A150A", outline=C_AMBER, width=2)
text_left(auth_x + 18, store_y + 14, "useAuthStore", f_node_bold, C_AMBER)
text_left(auth_x + 180, store_y + 16, "Zustand + persist", f_tiny, C_TEXT_FAINT)

auth_fields = [
    ("user", "UserInfo | null", C_TEXT),
    ("isAuthenticated", "boolean", C_TEXT),
    ("login()", "→ mock API", C_GREEN),
    ("logout()", "→ clear state", "#DC2626"),
]
for i, (name, typ, col) in enumerate(auth_fields):
    fy = store_y + 52 + i * 36
    text_left(auth_x + 24, fy + 2, name, f_label_bold, col)
    text_left(auth_x + 180, fy + 2, typ, f_tiny, C_TEXT_FAINT)

# useAppStore
app_x = auth_x + 380
draw_rounded_rect(app_x, store_y, 340, 200, 12, fill="#1A150A", outline=C_AMBER, width=2)
text_left(app_x + 18, store_y + 14, "useAppStore", f_node_bold, C_AMBER)
text_left(app_x + 175, store_y + 16, "Zustand + persist", f_tiny, C_TEXT_FAINT)

app_fields = [
    ("darkMode", "boolean", C_TEXT),
    ("language", "string (zh|en)", C_TEXT),
    ("toggleDarkMode()", "→ theme", C_BLUE_L),
    ("setLanguage()", "→ i18n", C_PURPLE),
]
for i, (name, typ, col) in enumerate(app_fields):
    fy = store_y + 52 + i * 36
    text_left(app_x + 24, fy + 2, name, f_label_bold, col)
    text_left(app_x + 200, fy + 2, typ, f_tiny, C_TEXT_FAINT)

# localStorage icons
for sx, label in [(auth_x + 170, "auth-storage"), (app_x + 170, "app-storage")]:
    ly = store_y + 210
    draw_rounded_rect(sx - 60, ly, 120, 30, 6, fill=C_DEEP, outline=C_LINE_L)
    text_center(sx, ly + 8, label, f_tiny, C_TEXT_FAINT)
    draw.line([(sx, store_y + 200), (sx, ly)], fill=C_LINE_L, width=1)
    text_center(sx, store_y + 204, "localStorage", font("GeistMono-Regular.ttf", 9), C_TEXT_FAINT)


# ============================================================
# LAYER 6 — Theme System
# ============================================================
y6 = y5 + 300
text_left(80, y6, "STRATUM 06", f_section, C_TEXT_FAINT)
text_left(200, y6, "THEME SYSTEM", f_section, C_BLUE_L)

theme_y = y6 + 50
# Theme factory
tf_x = 180
draw_rounded_rect(tf_x, theme_y, 580, 180, 12, fill="#0C1425", outline=C_BLUE_DIM, width=2)
text_left(tf_x + 18, theme_y + 14, "theme/index.ts", f_node_bold, C_BLUE_L)
text_left(tf_x + 180, theme_y + 16, "getTheme(mode)", f_label, C_TEXT_FAINT)

# Light mode box
lm_x = tf_x + 20
lm_y = theme_y + 52
draw_rounded_rect(lm_x, lm_y, 260, 108, 8, fill="#F8FAFC", outline=C_LINE_L)
text_left(lm_x + 12, lm_y + 8, "LIGHT", font("GeistMono-Bold.ttf", 12), "#1E293B")
# Color swatches
swatches_l = [("#2563EB", "primary"), ("#1E293B", "text.primary"), ("#64748B", "text.secondary"), ("#F8FAFC", "bg.default")]
for i, (color, label) in enumerate(swatches_l):
    sy = lm_y + 32 + i * 18
    draw.rectangle([lm_x + 12, sy, lm_x + 28, sy + 12], fill=color, outline="#333")
    text_left(lm_x + 36, sy - 1, label, font("GeistMono-Regular.ttf", 10), "#475569")
    text_left(lm_x + 160, sy - 1, color, font("GeistMono-Regular.ttf", 10), "#94A3B8")

# Dark mode box
dm_x = lm_x + 280
draw_rounded_rect(dm_x, lm_y, 260, 108, 8, fill="#0F172A", outline=C_LINE_L)
text_left(dm_x + 12, lm_y + 8, "DARK", font("GeistMono-Bold.ttf", 12), "#E2E8F0")
swatches_d = [("#2563EB", "primary"), ("#E2E8F0", "text.primary"), ("#94A3B8", "text.secondary"), ("#0F172A", "bg.default")]
for i, (color, label) in enumerate(swatches_d):
    sy = lm_y + 32 + i * 18
    draw.rectangle([dm_x + 12, sy, dm_x + 28, sy + 12], fill=color, outline="#333")
    text_left(dm_x + 36, sy - 1, label, font("GeistMono-Regular.ttf", 10), "#94A3B8")
    text_left(dm_x + 160, sy - 1, color, font("GeistMono-Regular.ttf", 10), "#64748B")


# ============================================================
# LAYER 6 continued — i18n System (right side)
# ============================================================
i18_x = 860
draw_rounded_rect(i18_x, theme_y, 520, 180, 12, fill="#120D1F", outline=C_PURPLE, width=2)
text_left(i18_x + 18, theme_y + 14, "i18n/index.ts", f_node_bold, C_PURPLE)
text_left(i18_x + 175, theme_y + 16, "i18next + LanguageDetector", f_label, C_TEXT_FAINT)

# Language boxes
for i, (lang, file, sample) in enumerate([("zh", "zh.json", "仪表盘 · 兑换 · 积分"), ("en", "en.json", "Dashboard · Redeem · Points")]):
    lx = i18_x + 20 + i * 250
    ly = theme_y + 52
    draw_rounded_rect(lx, ly, 230, 108, 8, fill=C_DEEP, outline=C_LINE_L)
    text_left(lx + 12, ly + 8, lang.upper(), font("GeistMono-Bold.ttf", 14), C_PURPLE)
    text_left(lx + 50, ly + 10, file, f_tiny, C_TEXT_FAINT)
    keys = ["app.*", "login.*", "employee.*", "admin.*", "menu.*"]
    for j, key in enumerate(keys):
        text_left(lx + 16, ly + 34 + j * 15, key, font("GeistMono-Regular.ttf", 10), C_TEXT_DIM)


# ============================================================
# LAYER 7 — Services (Axios)
# ============================================================
y7 = y6 + 255
text_left(80, y7, "STRATUM 07", f_section, C_TEXT_FAINT)
text_left(200, y7, "SERVICE LAYER", f_section, C_GREEN)

svc_y = y7 + 50
svc_x = 180
draw_rounded_rect(svc_x, svc_y, 700, 130, 12, fill="#0D1F0D", outline=C_GREEN, width=2)
text_left(svc_x + 18, svc_y + 14, "services/request.ts", f_node_bold, C_GREEN)
text_left(svc_x + 240, svc_y + 16, "Axios instance", f_label, C_TEXT_FAINT)

# Request flow
flow_items = [
    ("baseURL", "/api", 30),
    ("timeout", "10s", 180),
    ("req interceptor", "+ Authorization", 320),
    ("res interceptor", "401 → /login", 530),
]
for label, val, ox in flow_items:
    fy = svc_y + 55
    text_left(svc_x + ox, fy, label, f_label, C_TEXT_DIM)
    text_left(svc_x + ox, fy + 20, val, f_label_bold, C_GREEN)

# Arrow to backend
draw_arrow(svc_x + 700, svc_y + 65, svc_x + 830, svc_y + 65, C_GREEN, 2, 10)

# Backend placeholder
be_x = svc_x + 850
draw_rounded_rect(be_x, svc_y + 30, 260, 70, 8, fill=C_DEEP, outline=C_LINE_L)
draw_dashed_line(be_x + 10, svc_y + 65, be_x + 250, svc_y + 65, C_TEXT_FAINT, 1, 4, 4)
text_center(be_x + 130, svc_y + 52, "Backend API", f_node, C_TEXT_DIM)
text_center(be_x + 130, svc_y + 78, "— pending integration —", f_tiny, C_TEXT_FAINT)


# ============================================================
# DATA FLOW DIAGRAM — bottom section
# ============================================================
y8 = y7 + 210
text_left(80, y8, "STRATUM 08", f_section, C_TEXT_FAINT)
text_left(200, y8, "DATA FLOW", f_section, C_AMBER_L)

flow_y = y8 + 65
flow_cx = W / 2

# Flow nodes in a chain
flow_nodes = [
    ("User\nAction", C_AMBER, 200),
    ("Zustand\nStore", C_AMBER, 520),
    ("React\nState", C_BLUE_L, 840),
    ("MUI\nComponent", C_PURPLE, 1160),
    ("DOM\nRender", C_GREEN, 1480),
    ("User\nSees", C_AMBER, 1800),
]

for label, col, fx in flow_nodes:
    draw_hexagon(fx, flow_y, 56, fill="#111827", outline=col, width=2)
    lines = label.split("\n")
    text_center(fx, flow_y - 8, lines[0], font("GeistMono-Bold.ttf", 13), col)
    text_center(fx, flow_y + 10, lines[1], font("GeistMono-Regular.ttf", 12), C_TEXT_DIM)

# Arrows between flow nodes
for i in range(len(flow_nodes) - 1):
    x1 = flow_nodes[i][2] + 60
    x2 = flow_nodes[i+1][2] - 60
    draw_arrow(x1, flow_y, x2, flow_y, C_LINE_L, 1, 8)

# Return arrow (bottom arc)
arc_y = flow_y + 85
draw_dashed_line(flow_nodes[-1][2], flow_y + 56, flow_nodes[-1][2], arc_y, C_TEXT_FAINT, 1, 4, 4)
draw_dashed_line(flow_nodes[-1][2], arc_y, flow_nodes[0][2], arc_y, C_TEXT_FAINT, 1, 4, 4)
draw_arrow(flow_nodes[0][2], arc_y, flow_nodes[0][2], flow_y + 58, C_TEXT_FAINT, 1, 6)
text_center(flow_cx, arc_y + 6, "feedback loop", f_tiny, C_TEXT_FAINT)


# ============================================================
# FOOTER
# ============================================================
draw.rectangle([80, H - 100, W - 80, H - 98], fill=C_LINE_L)
text_left(80, H - 85, "SYSTEMIC CARTOGRAPHY", f_section, C_TEXT_FAINT)
text_left(80, H - 62, "AWSome Shop Frontend Architecture — Topographic System Map", f_tiny, C_TEXT_FAINT)
text_left(W - 400, H - 85, "React 19 · TypeScript · Vite 7 · MUI 6", f_tiny, C_TEXT_FAINT)
text_left(W - 400, H - 62, "Zustand · React Router 7 · i18next · Axios", f_tiny, C_TEXT_FAINT)

# Coordinate markers in corners
text_left(84, H - 42, "0,0", font("GeistMono-Regular.ttf", 9), "#1E293B")
text_left(W - 110, H - 42, f"{W},{H}", font("GeistMono-Regular.ttf", 9), "#1E293B")


# ============================================================
# CARTOGRAPHIC EDGE MARKERS
# ============================================================
# Tick marks along left and right edges every 200px
for gy in range(200, H, 200):
    draw.line([(60, gy), (75, gy)], fill="#1E293B", width=1)
    draw.line([(W - 75, gy), (W - 60, gy)], fill="#1E293B", width=1)
    text_left(20, gy - 6, f"{gy}", font("GeistMono-Regular.ttf", 8), "#1E293B")

# Corner crosshairs
for cx, cy in [(80, 60), (W - 80, 60), (80, H - 40), (W - 80, H - 40)]:
    draw.line([(cx - 8, cy), (cx + 8, cy)], fill="#1E293B", width=1)
    draw.line([(cx, cy - 8), (cx, cy + 8)], fill="#1E293B", width=1)


# ============================================================
# SAVE — Composite with subtle glow
# ============================================================
# Create a glow layer for key accent nodes
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow)

# Glow on AuthGuard hexagon
glow_points = []
for i in range(6):
    angle = math.radians(60 * i - 30)
    px = ag_cx + 52 * math.cos(angle)
    py = ag_cy + 52 * math.sin(angle)
    glow_points.append((px, py))
glow_draw.polygon(glow_points, fill=(22, 163, 74, 30))

# Glow on Vite hexagon
glow_points2 = []
for i in range(6):
    angle = math.radians(60 * i - 30)
    px = hx + 42 * math.cos(angle)
    py = hy + 42 * math.sin(angle)
    glow_points2.append((px, py))
glow_draw.polygon(glow_points2, fill=(217, 119, 6, 30))

# Apply Gaussian blur
glow = glow.filter(ImageFilter.GaussianBlur(radius=20))

# Composite
img = Image.alpha_composite(img, glow)

# Convert to RGB for final save
img_rgb = img.convert("RGB")

output_path = "/Users/catface/Desktop/aswome-shop-frontend/architecture.png"
img_rgb.save(output_path, "PNG")
print(f"Saved to {output_path}")
print(f"Canvas: {W}x{H}")
