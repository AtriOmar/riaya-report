// Best-fit pipeline: from the patient's place to the 2 or 3 doctors the AI reads out.
const I = 'icons/';
const LG = '../../logos/';
function draw(K) {
  K.init(1140, 1290);
  const E = (o) => K.edge(o);
  const X = 40, W = 650, FX = 770, FW = 340;

  // a numbered step card with title, detail lines and an optional logo on the right
  const step = (id, n, y, title, lines, icon) => {
    const h = 74 + lines.length * 25;
    const g = K.g(K.gNodes);
    K.el(g, 'rect', {x: X, y, width: W, height: h, rx: 16, fill: '#FFFFFF', stroke: '#0F766E', 'stroke-width': 1.8, filter: 'url(#sh)'});
    K.el(g, 'rect', {x: X + 1, y: y + 16, width: 5, height: h - 32, rx: 2.5, fill: '#0F766E'});
    K.el(g, 'circle', {cx: X + 46, cy: y + 38, r: 19, fill: '#0F766E'});
    K.el(g, 'text', {x: X + 46, y: y + 45, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 600, fill: '#FFFFFF'}, String(n));
    K.el(g, 'text', {x: X + 80, y: y + 46, 'font-size': 23, 'font-weight': 600, fill: '#111111'}, title);
    lines.forEach((l, i) => K.el(g, 'text', {x: X + 80, y: y + 80 + i * 25, 'font-size': 19, fill: '#111111'}, l));
    if (icon) {
      K.el(g, 'rect', {x: X + W - 70, y: y + 16, width: 50, height: 50, rx: 12, fill: '#FFFFFF', stroke: '#E3E3E3'});
      K.el(g, 'image', {href: icon, x: X + W - 61, y: y + 25, width: 32, height: 32});
    }
    K.boxes[id] = {x: X, y, w: W, h};
    return y + h;
  };
  const fall = (id, cy, title, lines) => {
    const h = 50 + lines.length * 24;
    const y = cy - h / 2, g = K.g(K.gNodes);
    K.el(g, 'rect', {x: FX, y, width: FW, height: h, rx: 14, fill: '#F7F7F7', stroke: '#333333', 'stroke-width': 1.6, 'stroke-dasharray': '6 4'});
    K.el(g, 'text', {x: FX + 20, y: y + 32, 'font-size': 19, 'font-weight': 600, fill: '#111111'}, title);
    lines.forEach((l, i) => K.el(g, 'text', {x: FX + 20, y: y + 60 + i * 24, 'font-size': 18, fill: '#111111'}, l));
    K.boxes[id] = {x: FX, y, w: FW, h};
  };

  // input
  K.card({id: 'in', x: X, y: 20, w: W, title: 'Patient request', sub: 'speciality, place, preferred time (no preference = now)', icon: I + 'phone.svg'});
  const gap = 44;
  let y = K.boxes.in.y + K.boxes.in.h + gap;
  const ends = {};
  const steps = [
    ['loc', 'Locate the patient', ['Google Places, restricted to Tunisia', 'cabinets keep exact map coordinates'], LG + 'google-places.png'],
    ['cand', 'Candidate doctors', ['verified, chosen speciality, cabinet mapped', 'straight-line (Haversine) distance up to 50 km'], I + 'user-check.svg'],
    ['slot', 'Nearest free slot', ['30-minute slot around the preferred time', 'starting once the patient can get there', 'within one week, before or after', 'plus up to 3 extra later slots'], I + 'calendar-check.svg'],
    ['score', 'Score and sort', ['score = km + minutes away / 10', '10 minutes of waiting counts as 1 km'], I + 'list-check.svg'],
    ['road', 'Road-distance polish', ['top 8 re-ranked by driving km,', 'slots redone with the real drive time', 'Google Routes API, one call, 3 s timeout'], LG + 'google-places.png'],
    ['say', 'AI offers the 2 best doctors', ['name, cabinet, distance in km, time', 'more on request, never a drive time'], I + 'comments.svg'],
  ];
  steps.forEach(([id, t, l, ic], i) => {
    const bottom = step(id, i + 1, y, t, l, ic);
    ends[id] = bottom;
    y = bottom + gap;
  });
  const cx = X + W / 2;
  E({pts: [K.P('in', 'b'), K.P('loc', 't')]});
  for (let i = 0; i < steps.length - 1; i++) E({pts: [K.P(steps[i][0], 'b'), K.P(steps[i + 1][0], 't')]});

  // fallbacks
  const mid = (id) => K.boxes[id].y + K.boxes[id].h / 2;
  fall('f1', mid('loc'), 'Only a city, or not found', ['ask once for the area,', 'else one of 24 city centres']);
  fall('f2', mid('cand'), 'Nobody within 50 km has a slot', ['return the 3 nearest beyond,', 'flagged far away, said honestly']);
  fall('f5', mid('road'), 'Service slow or failing', ['keep the straight-line order']);
  const nh = 210, nb = (K.boxes.slot.y + K.boxes.score.y + K.boxes.score.h) / 2 - nh / 2;
  K.el(K.gNodes, 'rect', {x: FX, y: nb, width: FW, height: nh, rx: 14, fill: '#F6F6F6', stroke: '#C8C8C8', 'stroke-width': 1.4});
  K.text(FX + 20, nb + 34, 'Plan does not matter', {size: 19, color: '#111111', weight: 600});
  K.text(FX + 20, nb + 64, 'Free and Pro doctors are ranked\nthe same way. We dropped the\nidea of hiding Free doctors:\nthe patient always gets the\nbest match.', {size: 18, color: '#111111'});
  for (const [s, f] of [['loc', 'f1'], ['cand', 'f2'], ['road', 'f5']]) {
    E({pts: [K.P(s, 'r'), K.P(f, 'l')], kind: 'amber', dash: true});
  }
  K.resize(1140, y - gap + 24);
}
