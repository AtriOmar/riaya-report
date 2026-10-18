// How a doctor action is checked against the plan limits.
const I = 'icons/';
const LG = '../../logos/';
function draw(K) {
  K.init(1240, 1100);
  const E = (o) => K.edge(o);
  const M = 620;

  K.start({id: 's', cx: M, cy: 40});
  K.act({id: 'act', cx: M, cy: 115, text: 'A doctor starts an action', kind: 'doctor'});
  K.dec({id: 'plan', cx: M, cy: 245, text: 'Pro, active and\nperiod end ahead?', w: 300, h: 130});
  K.act({id: 'free', cx: M - 300, cy: 245, text: 'Free limits', kind: 'sys', w: 170});
  K.act({id: 'pro', cx: M + 300, cy: 245, text: 'Pro limits', kind: 'good', w: 170});
  E({pts: [K.P('s', 'b'), K.P('act', 't')]});
  E({pts: [K.P('act', 'b'), K.P('plan', 't')]});
  E({pts: [K.P('plan', 'l'), K.P('free', 'r')], kind: 'amber'});
  K.guard((K.P('plan', 'l')[0] + K.P('free', 'r')[0]) / 2, 223, 'no');
  E({pts: [K.P('plan', 'r'), K.P('pro', 'l')], kind: 'teal'});
  K.guard((K.P('plan', 'r')[0] + K.P('pro', 'l')[0]) / 2, 223, 'yes', '#0F766E');
  K.text(M, 335, 'A missing, free, past_due or expired subscription counts as Free.', {size: 17, color: '#64748B', anchor: 'middle'});

  // bus to the four action types
  const cols = [175, 475, 775, 1075], busY = 380;
  E({pts: [K.P('free', 'b'), [M - 300, busY]]}); K.gEdges.lastChild.removeAttribute('marker-end');
  E({pts: [K.P('pro', 'b'), [M + 300, busY]]}); K.gEdges.lastChild.removeAttribute('marker-end');
  K.el(K.gEdges, 'path', {d: `M${cols[0]},${busY} L${cols[3]},${busY}`, stroke: '#94A3B8', 'stroke-width': 1.8, fill: 'none'});
  const hy = 450;
  const heads = [
    ['wa', 'WhatsApp send', 'started by the doctor', LG + 'whatsapp.png'],
    ['rec', 'Recording', 'and transcription', I + 'microphone.svg'],
    ['ai', 'AI assistant', 'real model cost', LG + 'openrouter.png'],
    ['call', 'Phone booking', 'made by the AI', I + 'phone.svg'],
  ];
  heads.forEach(([id, t, sub, ic], i) => {
    K.card({id, cx: cols[i], cy: hy, w: 270, title: t, sub, icon: ic, chip: ic.endsWith('.png') ? 'white' : 'teal'});
    E({pts: [[cols[i], busY], K.P(id, 't')]});
  });

  const ry = 575, dy = 700, py = 825, py2 = 915, ny = 1010;
  const col = (i, id, rule, q, ok, bad, badKind, note) => {
    const c = cols[i];
    K.act({id: id + 'r', cx: c, cy: ry, text: rule, kind: 'sys', w: 262, size: 18});
    K.dec({id: id + 'd', cx: c, cy: dy, text: q, w: 210, h: 104});
    K.act({id: id + 'ok', cx: c, cy: py, text: ok, kind: 'good', w: 214, size: 18});
    K.act({id: id + 'no', cx: c, cy: py2, text: bad, kind: badKind, w: 214, size: 18});
    E({pts: [K.P(heads[i][0], 'b'), K.P(id + 'r', 't')]});
    E({pts: [K.P(id + 'r', 'b'), K.P(id + 'd', 't')]});
    E({pts: [K.P(id + 'd', 'b'), [c, K.P(id + 'ok', 't')[1]]], kind: 'teal'});
    K.guard(c + 12, (K.P(id + 'd', 'b')[1] + K.P(id + 'ok', 't')[1]) / 2, 'yes', '#0F766E', 'start');
    E({pts: [K.P(id + 'd', 'r'), [c + 132, dy], [c + 132, py2], K.P(id + 'no', 'r')], kind: badKind === 'bad' ? 'red' : 'amber'});
    K.guard(c + 132, dy + 50, 'no', badKind === 'bad' ? '#DC2626' : '#B45309');
    K.text(c, ny, note, {size: 16, color: '#64748B', anchor: 'middle'});
  };
  col(0, 'w', 'counts 1 caption + 1 per file\ninvoice PDF = 1', 'within the\nmonth limit?', 'send, add to the count', 'refused (limit code)', 'bad',
    'Free 30, Pro unlimited. Atomic SQL check.\nAutomatic patient messages never count.');
  col(1, 'r', 'the audio is always saved\nplan hours, then pack hours', 'time left?', 'transcribe, charge once', 'skipped, transcribe\nlater by hand', 'warn',
    'Free 2 h, Pro 100 h a month.\nPacks (Pro): 25 h or 100 h.');
  col(2, 'a', 'month spend vs budget\n$0.05 Free, $5 Pro', 'budget\nleft?', 'answer, store the cost', 'refused (limit code)', 'bad',
    'About 20 or 2,000 questions.\nCost comes from OpenRouter.');
  // phone booking: never limited
  K.act({id: 'cr', cx: cols[3], cy: ry + 60, text: 'never limited\non any plan', kind: 'good', w: 262});
  E({pts: [K.P('call', 'b'), K.P('cr', 't')]});
  K.text(cols[3], ry + 150, 'Urgent requests too.\nThe plan never changes\nwhich doctor is chosen.', {size: 16, color: '#64748B', anchor: 'middle'});
  K.resize(1240, 1060);
}
