# usage: python3 use_case_doctor_secretary.py   (run from images/diagrams/src)
# Draws the doctor/secretary use case diagram by hand with straight lines, in
# PlantUML's default look, then renders ../use_case_doctor_secretary.png with rsvg-convert.
import math, subprocess, os

FONT = "Helvetica, Arial, sans-serif"
FS = 15          # font size
LINE = 19        # line height for two-line labels
CHAR = 7.6       # average character width at FS
INK = "#181818"
FILL = "#F1F1F1"

ACTOR_X = 70
UC_X = 420
AUTH_X = 860
UC_RX = 112   # every use case has the same width, so all left and right tips line up
TOP = 70
STEP = 64

use_cases = [
    ("SU", ["Sign up"]),
    ("C1", ["Manage bookings"]),
    ("C2", ["Manage patients"]),
    ("C3", ["Create invoices"]),
    ("C4", ["Update availability"]),
    ("D6", ["Subscribe to Pro"]),
    ("D1", ["Manage medical files"]),
    ("D2", ["Add consultation", "recordings"]),
    ("D3", ["Talk to the", "AI assistant"]),
    ("D4", ["Link own WhatsApp"]),
    ("D5", ["Invite secretaries"]),
]
pos = {}
for i, (k, lines) in enumerate(use_cases):
    h = 36 if len(lines) == 1 else 52
    pos[k] = (UC_X, TOP + i * STEP, UC_RX, h / 2, lines)

rows = lambda ks: sum(pos[k][1] for k in ks) / len(ks)
shared = ["C1", "C2", "C3", "C4"]
doctor_only = ["D6", "D1", "D2", "D3", "D4", "D5"]
actors = {
    "V": (ACTOR_X, pos["SU"][1], ["Visitor"]),
    "S": (ACTOR_X, rows(shared), ["Secretary", "(Pro practice)"]),
    "D": (ACTOR_X, rows(shared + doctor_only) + 40, ["Doctor"]),
}
auth_y = rows([k for k, _ in use_cases[1:]])
pos["AUTH"] = (AUTH_X, auth_y, len("Authentication") * CHAR / 2 + 22, 18, ["Authentication"])

links = [("V", "SU")] + [("S", k) for k in shared] + [("D", k) for k in shared + doctor_only]
includes = shared + doctor_only

out = []
def text(x, y, s, weight="normal", anchor="middle"):
    out.append(f'<text x="{x:.1f}" y="{y:.1f}" font-family="{FONT}" font-size="{FS}" '
               f'font-weight="{weight}" text-anchor="{anchor}" fill="{INK}">{s}</text>')

def label(x, y, s):
    out.append(f'<text x="{x:.1f}" y="{y:.1f}" font-family="{FONT}" font-size="13" text-anchor="middle" '
               f'fill="{INK}" stroke="#fff" stroke-width="4" paint-order="stroke">{s}</text>')

def ellipse_edge(k, fx, fy):
    """Point on the ellipse of use case k in the direction of (fx, fy)."""
    cx, cy, rx, ry, _ = pos[k]
    dx, dy = fx - cx, fy - cy
    t = 1 / math.sqrt((dx / rx) ** 2 + (dy / ry) ** 2)
    return cx + dx * t, cy + dy * t

def arrow(x1, y1, x2, y2, dashed=False):
    dash = ' stroke-dasharray="7,5"' if dashed else ""
    out.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{INK}" stroke-width="1.1"{dash}/>')
    a = math.atan2(y2 - y1, x2 - x1)
    L, W = 11, 4.5
    bx, by = x2 - L * math.cos(a), y2 - L * math.sin(a)
    nx, ny = x2 - 0.65 * L * math.cos(a), y2 - 0.65 * L * math.sin(a)
    p1 = (bx + W * math.sin(a), by - W * math.cos(a))
    p2 = (bx - W * math.sin(a), by + W * math.cos(a))
    out.append(f'<path d="M{x2:.1f},{y2:.1f} L{p1[0]:.1f},{p1[1]:.1f} L{nx:.1f},{ny:.1f} L{p2[0]:.1f},{p2[1]:.1f} Z" fill="{INK}"/>')

# system boundary
bx0, bx1 = UC_X - UC_RX - 40, AUTH_X + 105
by0, by1 = TOP - 50, pos["D5"][1] + 50
out.append(f'<rect x="{bx0}" y="{by0}" width="{bx1 - bx0}" height="{by1 - by0}" rx="4" fill="none" stroke="{INK}" stroke-width="1.2"/>')
text((bx0 + bx1) / 2, by0 + 20, "Riaya dashboard", weight="bold")

# include dependencies (drawn first so the ellipses sit on top)
for k in includes:
    cx, cy = pos[k][0], pos[k][1]
    sx, sy = cx + pos[k][2], cy
    ex, ey = ellipse_edge("AUTH", sx, sy)
    arrow(sx, sy, ex, ey, dashed=True)
    t = 0.3
    label(sx + (ex - sx) * t, sy + (ey - sy) * t - 5, "«include»")

# actor associations
for a, k in links:
    ax, ay, _ = actors[a]
    sx, sy = ax + 26, ay - 6
    ex, ey = pos[k][0] - pos[k][2], pos[k][1]
    arrow(sx, sy, ex, ey)

# use cases
for k, (cx, cy, rx, ry, lines) in pos.items():
    out.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx:.1f}" ry="{ry}" fill="{FILL}" stroke="{INK}" stroke-width="1"/>')
    y0 = cy + 5 - (len(lines) - 1) * LINE / 2
    for i, l in enumerate(lines):
        text(cx, y0 + i * LINE, l)

# actors: stick figures centred on (x, y - 6)
for ax, ay, lines in actors.values():
    hy = ay - 34
    out.append(f'<g stroke="{INK}" stroke-width="1.2" fill="{FILL}">'
               f'<circle cx="{ax}" cy="{hy}" r="9"/>'
               f'<line x1="{ax}" y1="{hy + 9}" x2="{ax}" y2="{hy + 36}"/>'
               f'<line x1="{ax - 15}" y1="{hy + 18}" x2="{ax + 15}" y2="{hy + 18}"/>'
               f'<line x1="{ax}" y1="{hy + 36}" x2="{ax - 13}" y2="{hy + 54}"/>'
               f'<line x1="{ax}" y1="{hy + 36}" x2="{ax + 13}" y2="{hy + 54}"/></g>')
    for i, l in enumerate(lines):
        text(ax, hy + 74 + i * LINE, l)

W, H = bx1 + 12, by1 + 12
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
       f'<rect width="{W}" height="{H}" fill="#fff"/>' + "".join(out) + "</svg>")
here = os.path.dirname(os.path.abspath(__file__))
svg_path = os.path.join(here, "use_case_doctor_secretary.svg")
open(svg_path, "w").write(svg)
subprocess.run(["rsvg-convert", "-z", "2.5", "-o", os.path.join(here, "..", "use_case_doctor_secretary.png"), svg_path], check=True)
print("ok")
