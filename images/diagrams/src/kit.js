// Tiny diagram kit: builds an SVG in the browser so text can be measured.
// Look: white background, rounded cards with icon chips, soft zone tints, thin grey arrows.
const NS = 'http://www.w3.org/2000/svg';
const C = {
  ink: '#111111', sub: '#404040', line: '#737373', teal: '#0F766E', amber: '#333333',
  card: '#FFFFFF', cardStroke: '#E3E3E3',
};
const ZONES = {
  users: {fill: '#F6F6F6', stroke: '#C8C8C8', text: '#111111', chip: '#EFEFEF'},
  edge: {fill: '#F3F3F3', stroke: '#BDBDBD', text: '#111111', chip: '#EAEAEA'},
  riaya: {fill: '#F0FDFA', stroke: '#5EEAD4', text: '#111111', chip: '#CCFBF1'},
  ext: {fill: '#F7F7F7', stroke: '#BDBDBD', text: '#111111', chip: '#EDEDED'},
  host: {fill: '#F6F6F6', stroke: '#737373', text: '#111111', chip: '#EFEFEF'},
  gh: {fill: '#F6F6F6', stroke: '#C8C8C8', text: '#111111', chip: '#EFEFEF'},
};
const CHIPS = {
  teal: {fill: '#F0FDFA', stroke: '#99F6E4'},
  indigo: {fill: '#F3F3F3', stroke: '#D4D4D4'},
  amber: {fill: '#F7F7F7', stroke: '#D9D9D9'},
  white: {fill: '#FFFFFF', stroke: '#E3E3E3'},
  slate: {fill: '#F6F6F6', stroke: '#E3E3E3'},
};
const F = {title: 22, sub: 18, label: 18, zone: 20};

const K = {
  boxes: {},
  init(w, h) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('xmlns', NS);
    svg.setAttribute('width', w); svg.setAttribute('height', h);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.style.fontFamily = 'Inter, sans-serif';
    svg.innerHTML = `<defs>
      <filter id="sh" x="-10%" y="-10%" width="120%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0F172A" flood-opacity="0.07"/></filter>
      ${['line', 'teal', 'amber', 'indigo', 'red'].map(k => `<marker id="ar-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0.8 L9.5,5 L0,9.2 z" fill="${({line: C.line, teal: C.teal, amber: C.amber, indigo: '#333333', red: '#333333'})[k]}"/></marker>`).join('')}
    </defs><rect width="${w}" height="${h}" fill="#FFFFFF"/>`;
    this.svg = svg;
    this.gZones = this.g(); this.gEdges = this.g(); this.gNodes = this.g(); this.gLabels = this.g();
    document.getElementById('root').appendChild(svg);
    return this;
  },
  g(parent) { const g = document.createElementNS(NS, 'g'); (parent || this.svg).appendChild(g); return g; },
  el(parent, tag, attrs, text) {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs || {})) if (v !== undefined && v !== null) e.setAttribute(k, v);
    if (text !== undefined) e.textContent = text;
    parent.appendChild(e); return e;
  },
  textW(str, size, weight) {
    const t = this.el(this.gLabels, 'text', {'font-size': size, 'font-weight': weight || 400}, str);
    const w = t.getComputedTextLength(); t.remove(); return w;
  },
  // zone container with a title tab
  zone({x, y, w, h, title, kind = 'users', icon, dash = true}) {
    const z = ZONES[kind];
    this.el(this.gZones, 'rect', {x, y, width: w, height: h, rx: 20, fill: z.fill, stroke: z.stroke, 'stroke-width': 1.6, 'stroke-dasharray': dash ? '7 5' : null});
    const tw = this.textW(title, F.zone, 600);
    const iw = icon ? 26 : 0;
    this.el(this.gZones, 'rect', {x: x + 16, y: y + 14, width: tw + iw + 24, height: 34, rx: 10, fill: z.chip});
    if (icon) this.el(this.gZones, 'image', {href: icon, x: x + 26, y: y + 21, width: 20, height: 20});
    this.el(this.gZones, 'text', {x: x + 28 + iw, y: y + 38, 'font-size': F.zone, 'font-weight': 600, fill: z.text}, title);
  },
  // card: icon chip on the left, title and optional subtitle
  card({id, x, y, w, h, title, sub, icon, chip = 'teal', accent, cx, cy}) {
    const tw = Math.max(this.textW(title, F.title, 600), sub ? Math.max(...sub.split('\n').map(s => this.textW(s, F.sub, 400))) : 0);
    const hasIcon = !!icon;
    w = w || Math.ceil((hasIcon ? 14 + 44 + 14 : 20) + tw + 20);
    const nSub = sub ? sub.split('\n').length : 0;
    h = h || (nSub === 0 ? 68 : 62 + nSub * 22);
    if (cx !== undefined) x = cx - w / 2;
    if (cy !== undefined) y = cy - h / 2;
    const g = this.g(this.gNodes);
    this.el(g, 'rect', {x, y, width: w, height: h, rx: 14, fill: C.card, stroke: accent || C.cardStroke, 'stroke-width': accent ? 2 : 1.6, filter: 'url(#sh)'});
    let tx = x + 20;
    if (hasIcon) {
      const ch = CHIPS[chip];
      const cyc = y + h / 2;
      this.el(g, 'rect', {x: x + 14, y: cyc - 22, width: 44, height: 44, rx: 11, fill: ch.fill, stroke: ch.stroke, 'stroke-width': 1});
      this.el(g, 'image', {href: icon, x: x + 22, y: cyc - 14, width: 28, height: 28, preserveAspectRatio: 'xMidYMid meet'});
      tx = x + 72;
    }
    const lines = 1 + nSub;
    const blockH = F.title + nSub * 22;
    let ty = y + (h - blockH) / 2 + F.title * 0.8;
    this.el(g, 'text', {x: tx, y: ty, 'font-size': F.title, 'font-weight': 600, fill: C.ink}, title);
    if (sub) sub.split('\n').forEach((s, i) => this.el(g, 'text', {x: tx, y: ty + 24 + i * 22, 'font-size': F.sub, fill: C.sub}, s));
    this.boxes[id] = {x, y, w, h};
    return this.boxes[id];
  },
  // database cylinder
  store({id, x, y, w, h, title, sub, cx, cy, color = 'indigo'}) {
    const pal = color === 'red' ? {fill: '#F7F7F7', stroke: '#737373'} : {fill: '#F3F3F3', stroke: '#737373'};
    const tw = Math.max(this.textW(title, F.title, 600), sub ? this.textW(sub, F.sub) : 0);
    w = w || Math.ceil(tw + 48); h = h || (sub ? 104 : 88);
    if (cx !== undefined) x = cx - w / 2;
    if (cy !== undefined) y = cy - h / 2;
    const ry = 11, g = this.g(this.gNodes);
    this.el(g, 'path', {d: `M${x},${y + ry} A${w / 2},${ry} 0 0 1 ${x + w},${y + ry} L${x + w},${y + h - ry} A${w / 2},${ry} 0 0 1 ${x},${y + h - ry} Z`, fill: pal.fill, stroke: pal.stroke, 'stroke-width': 1.8, filter: 'url(#sh)'});
    this.el(g, 'path', {d: `M${x},${y + ry} A${w / 2},${ry} 0 0 0 ${x + w},${y + ry}`, fill: 'none', stroke: pal.stroke, 'stroke-width': 1.8});
    const mid = y + ry + (h - ry) / 2;
    this.el(g, 'text', {x: x + w / 2, y: sub ? mid - 4 : mid + 7, 'text-anchor': 'middle', 'font-size': F.title, 'font-weight': 600, fill: C.ink}, title);
    if (sub) this.el(g, 'text', {x: x + w / 2, y: mid + 20, 'text-anchor': 'middle', 'font-size': F.sub, fill: C.sub}, sub);
    this.boxes[id] = {x, y, w, h};
    return this.boxes[id];
  },
  // anchor on a box side: side t/b/l/r, f = fraction along the side (0..1, default .5)
  P(id, side, f = 0.5) {
    const b = this.boxes[id];
    if (!b) throw new Error('no box ' + id);
    if (side === 't') return [b.x + b.w * f, b.y];
    if (side === 'b') return [b.x + b.w * f, b.y + b.h];
    if (side === 'l') return [b.x, b.y + b.h * f];
    return [b.x + b.w, b.y + b.h * f];
  },
  // orthogonal (or any) polyline with rounded corners; label at {at:[x,y]} or the middle of segment `seg`
  edge({pts, label, at, seg, kind = 'line', dash, both, width = 1.8, labelColor, anchor = 'middle'}) {
    const col = ({line: C.line, teal: C.teal, amber: C.amber, indigo: '#333333', red: '#333333'})[kind];
    const r = 10;
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i];
      if (i < pts.length - 1) {
        const a = pts[i - 1], n = pts[i + 1];
        const l1 = Math.hypot(p[0] - a[0], p[1] - a[1]), l2 = Math.hypot(n[0] - p[0], n[1] - p[1]);
        const rr = Math.min(r, l1 / 2, l2 / 2);
        const p1 = [p[0] - (p[0] - a[0]) / l1 * rr, p[1] - (p[1] - a[1]) / l1 * rr];
        const p2 = [p[0] + (n[0] - p[0]) / l2 * rr, p[1] + (n[1] - p[1]) / l2 * rr];
        d += ` L${p1[0]},${p1[1]} Q${p[0]},${p[1]} ${p2[0]},${p2[1]}`;
      } else d += ` L${p[0]},${p[1]}`;
    }
    this.el(this.gEdges, 'path', {d, fill: 'none', stroke: col, 'stroke-width': width, 'stroke-dasharray': dash ? '6 5' : null,
      'marker-end': `url(#ar-${kind})`, 'marker-start': both ? `url(#ar-${kind})` : null, 'stroke-linejoin': 'round'});
    if (label) {
      let pos = at;
      if (!pos) {
        let s = seg;
        if (s === undefined) { let best = -1; for (let i = 0; i < pts.length - 1; i++) { const L = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); if (L > best) { best = L; s = i; } } }
        pos = [(pts[s][0] + pts[s + 1][0]) / 2, (pts[s][1] + pts[s + 1][1]) / 2];
      }
      this.label(pos[0], pos[1], label, labelColor || (kind === 'line' ? '#111111' : col), anchor);
    }
  },
  label(x, y, text, color = '#111111', anchor = 'middle', size = F.label, weight = 500) {
    const lines = text.split('\n');
    const lh = size + 4;
    const w = Math.max(...lines.map(l => this.textW(l, size, weight)));
    const h = lines.length * lh + 6;
    const lx = anchor === 'middle' ? x - w / 2 : anchor === 'start' ? x : x - w;
    this.el(this.gLabels, 'rect', {x: lx - 7, y: y - h / 2, width: w + 14, height: h, rx: 7, fill: '#FFFFFF', 'fill-opacity': 0.95});
    lines.forEach((l, i) => this.el(this.gLabels, 'text', {x: anchor === 'middle' ? x : lx, y: y - h / 2 + 3 + (i + 1) * lh - 5, 'text-anchor': anchor === 'middle' ? 'middle' : 'start', 'font-size': size, 'font-weight': weight, fill: color}, l));
  },
  text(x, y, str, {size = F.sub, color = C.sub, weight = 400, anchor = 'start'} = {}) {
    str.split('\n').forEach((l, i) => this.el(this.gLabels, 'text', {x, y: y + i * (size + 5), 'font-size': size, 'font-weight': weight, fill: color, 'text-anchor': anchor}, l));
  },
};

// ---------- activity diagram helpers ----------
const ACT = {
  doctor: {fill: '#F0FDFA', stroke: '#0F766E'},
  patient: {fill: '#F0FDFA', stroke: '#0F766E'},
  sys: {fill: '#FFFFFF', stroke: '#737373'},
  admin: {fill: '#F0FDFA', stroke: '#0F766E'},
  warn: {fill: '#F0FDFA', stroke: '#0F766E'},
  bad: {fill: '#F0FDFA', stroke: '#0F766E'},
  good: {fill: '#F0FDFA', stroke: '#0F766E'},
};
const LANES = {
  doctor: {fill: '#F7FDFC', head: '#CCFBF1', text: '#111111'},
  patient: {fill: '#F7FDFC', head: '#CCFBF1', text: '#111111'},
  sys: {fill: '#F9F9F9', head: '#E3E3E3', text: '#111111'},
  admin: {fill: '#F6F6F6', head: '#EAEAEA', text: '#111111'},
  ext: {fill: '#FAFAFA', head: '#EDEDED', text: '#111111'},
};
Object.assign(K, {
  AF: 19,
  lanes({x, y, h, head = 52, lanes}) {
    let cx = x;
    const out = {};
    lanes.forEach((ln, i) => {
      const st = LANES[ln.kind];
      this.el(this.gZones, 'rect', {x: cx, y, width: ln.w, height: h, fill: st.fill, stroke: '#E3E3E3', 'stroke-width': 1.2,
        rx: 0});
      this.el(this.gZones, 'rect', {x: cx, y, width: ln.w, height: head, fill: st.head, stroke: '#E3E3E3', 'stroke-width': 1.2});
      if (ln.icon) {
        const tw = this.textW(ln.title, 21, 600);
        this.el(this.gZones, 'image', {href: ln.icon, x: cx + ln.w / 2 - (tw + 34) / 2, y: y + head / 2 - 12, width: 24, height: 24});
        this.el(this.gZones, 'text', {x: cx + ln.w / 2 - (tw + 34) / 2 + 34, y: y + head / 2 + 7, 'font-size': 21, 'font-weight': 600, fill: st.text}, ln.title);
      } else this.el(this.gZones, 'text', {x: cx + ln.w / 2, y: y + head / 2 + 7, 'text-anchor': 'middle', 'font-size': 21, 'font-weight': 600, fill: st.text}, ln.title);
      out[ln.key || ln.kind] = cx + ln.w / 2;
      cx += ln.w;
    });
    // outer rounded frame
    this.el(this.gZones, 'rect', {x, y, width: cx - x, height: h, rx: 16, fill: 'none', stroke: '#C8C8C8', 'stroke-width': 1.6});
    return out;
  },
  act({id, cx, cy, text, kind = 'sys', w, size}) {
    const fs = size || this.AF;
    const lines = text.split('\n');
    const tw = Math.max(...lines.map(l => this.textW(l, fs, 500)));
    w = w || Math.ceil(tw + 40);
    const lh = fs + 6;
    const h = lines.length * lh + 26;
    const x = cx - w / 2, y = cy - h / 2;
    const st = ACT[kind];
    const g = this.g(this.gNodes);
    this.el(g, 'rect', {x, y, width: w, height: h, rx: 14, fill: st.fill, stroke: st.stroke, 'stroke-width': 1.8, filter: 'url(#sh)'});
    lines.forEach((l, i) => this.el(g, 'text', {x: cx, y: y + 13 + (i + 1) * lh - 6, 'text-anchor': 'middle', 'font-size': fs, 'font-weight': 500, fill: '#111111'}, l));
    this.boxes[id] = {x, y, w, h};
    return this.boxes[id];
  },
  dec({id, cx, cy, text, w, h}) {
    const lines = text.split('\n');
    const fs = this.AF - 1;
    const tw = Math.max(...lines.map(l => this.textW(l, fs, 600)));
    w = w || Math.ceil(tw * 1.55 + 40);
    h = h || Math.ceil(lines.length * (fs + 5) * 1.6 + 46);
    const x = cx - w / 2, y = cy - h / 2;
    const g = this.g(this.gNodes);
    this.el(g, 'path', {d: `M${cx},${y} L${x + w},${cy} L${cx},${y + h} L${x},${cy} Z`, fill: '#F7F7F7', stroke: '#333333', 'stroke-width': 1.8, 'stroke-linejoin': 'round', filter: 'url(#sh)'});
    const lh = fs + 5;
    lines.forEach((l, i) => this.el(g, 'text', {x: cx, y: cy - (lines.length * lh) / 2 + (i + 1) * lh - 5, 'text-anchor': 'middle', 'font-size': fs, 'font-weight': 600, fill: '#111111'}, l));
    this.boxes[id] = {x, y, w, h};
    return this.boxes[id];
  },
  start({id, cx, cy}) {
    this.el(this.gNodes, 'circle', {cx, cy, r: 14, fill: '#0F766E'});
    this.boxes[id] = {x: cx - 14, y: cy - 14, w: 28, h: 28};
  },
  end({id, cx, cy, kind = 'end'}) {
    this.el(this.gNodes, 'circle', {cx, cy, r: 16, fill: '#FFFFFF', stroke: '#111111', 'stroke-width': 2});
    this.el(this.gNodes, 'circle', {cx, cy, r: 10, fill: '#111111'});
    this.boxes[id] = {x: cx - 16, y: cy - 16, w: 32, h: 32};
  },
  // small guard label (yes / no) near a point
  guard(x, y, text, color, anchor = 'middle') {
    this.label(x, y, text, color || '#111111', anchor, 17, 600);
  },
  fork({id, cx, cy, w = 300, vertical = false}) {
    const r = vertical ? {x: cx - 4, y: cy - w / 2, width: 8, height: w} : {x: cx - w / 2, y: cy - 4, width: w, height: 8};
    this.el(this.gNodes, 'rect', {...r, rx: 3, fill: '#111111'});
    this.boxes[id] = {x: r.x, y: r.y, w: r.width, h: r.height};
  },
});
K.resize = function (w, h) {
  this.svg.setAttribute('width', w); this.svg.setAttribute('height', h);
  this.svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  this.svg.querySelector('rect').setAttribute('height', h);
};
