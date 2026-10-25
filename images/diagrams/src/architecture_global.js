// Global architecture of Riaya: users, edge, the two Riaya services and their stores, external services.
const I = 'icons/';
const LG = '../../logos/';
function draw(K) {
  K.init(1200, 1010);
  const L = 440, R = 790;           // centres of the voice column and the web column
  const cy = {users: 108, edge: 300, svc: 535, store: 690, gw: 925};

  // zones
  K.zone({x: 292, y: 20, w: 888, h: 160, title: 'Users', kind: 'users'});
  K.zone({x: 292, y: 222, w: 630, h: 150, title: 'Edge', kind: 'edge'});
  K.zone({x: 292, y: 432, w: 630, h: 340, title: 'Riaya', kind: 'riaya', dash: false});
  K.zone({x: 20, y: 432, w: 244, h: 340, title: 'Voice services', kind: 'ext'});
  K.zone({x: 950, y: 222, w: 230, h: 550, title: 'Web services', kind: 'ext'});
  K.zone({x: L - 70, y: 822, w: R - L + 140, h: 168, title: 'AI gateway', kind: 'ext'});

  // users
  K.card({id: 'patient', cx: L, cy: cy.users + 8, title: 'Patient', sub: 'phone', icon: I + 'phone.svg'});
  K.card({id: 'doctor', cx: R - 40, cy: cy.users + 8, title: 'Doctor', sub: 'browser', icon: I + 'user-doctor.svg'});
  K.card({id: 'admin', cx: 1065, cy: cy.users + 8, title: 'Admin', sub: 'browser', icon: I + 'user-shield.svg', chip: 'indigo'});

  // edge
  K.card({id: 'twilio', cx: L, cy: cy.edge + 10, title: 'Twilio', sub: 'phone line', icon: LG + 'twilio.png', chip: 'white'});
  K.card({id: 'nginx', cx: R, cy: cy.edge + 10, title: 'Nginx', sub: 'TLS, routing', icon: LG + 'nginx.png', chip: 'white'});

  // riaya
  K.card({id: 'voice', cx: L, cy: cy.svc, w: 250, title: 'Voice server', sub: 'Express, ws', icon: LG + 'express.png', chip: 'white', accent: '#0F766E'});
  K.card({id: 'web', cx: R, cy: cy.svc, w: 240, title: 'Web app', sub: 'Next.js', icon: LG + 'nextjs.png', chip: 'white', accent: '#0F766E'});
  K.card({id: 'redis', cx: L, cy: cy.store, w: 190, title: 'Redis', sub: 'BullMQ', icon: LG + 'redis.png', chip: 'white'});
  K.card({id: 'pg', cx: R - 14, cy: cy.store, w: 222, title: 'PostgreSQL', sub: 'Drizzle ORM', icon: LG + 'postgresql.png', chip: 'white'});

  // externals
  const lw = 212, rw = 198;
  K.card({id: 'gemini', x: 36, cy: cy.svc, w: lw, title: 'Gemini Live', sub: 'voice AI', icon: LG + 'gemini.png', chip: 'white'});
  K.card({id: 'wa', x: 36, cy: cy.store, w: lw, title: 'WhatsApp', sub: 'Baileys', icon: LG + 'whatsapp.png', chip: 'white'});
  const ry = [330, 444, 558, 672];
  K.card({id: 'places', x: 966, cy: ry[0], w: rw, title: 'Google', sub: 'Places', icon: LG + 'google-places.png', chip: 'white'});
  K.card({id: 'geo', x: 966, cy: ry[1], w: rw, title: 'Google', sub: 'Routes (km)', icon: LG + 'google-places.png', chip: 'white'});
  K.card({id: 'r2', x: 966, cy: ry[2], w: rw, title: 'R2', sub: 'file storage', icon: LG + 'cloudflare-r2.png', chip: 'white'});
  K.card({id: 'konnect', x: 966, cy: ry[3], w: rw, title: 'Konnect', sub: 'payments', icon: LG + 'konnect.png', chip: 'white'});
  K.card({id: 'openrouter', cx: (L + R) / 2, cy: cy.gw + 8, title: 'OpenRouter', sub: 'transcription, doctor AI', icon: LG + 'openrouter.png', chip: 'white'});

  const E = (o) => K.edge(o);
  // users -> edge
  E({pts: [K.P('patient', 'b'), K.P('twilio', 't')], label: 'call', both: true, at: [L, 201]});
  const dx = K.P('doctor', 'b')[0];
  E({pts: [K.P('doctor', 'b'), [dx, K.P('nginx', 't')[1]]], label: 'HTTPS', at: [dx, 201]});
  E({pts: [K.P('admin', 'b'), [1065, 201], [R + 50, 201], [R + 50, K.P('nginx', 't')[1]]]});
  // edge -> riaya
  const gapY = 402;
  E({pts: [K.P('twilio', 'b'), K.P('voice', 't')], label: 'audio', at: [L, gapY]});
  E({pts: [[R - 50, K.P('nginx', 'b')[1]], [R - 50, gapY], [L + 70, gapY], [L + 70, K.P('voice', 't')[1]]], label: 'live events', at: [(L + R) / 2 + 10, gapY]});
  E({pts: [[R + 40, K.P('nginx', 'b')[1]], [R + 40, K.P('web', 't')[1]]], label: 'pages, API', at: [R + 40, gapY]});
  // inside riaya
  E({pts: [K.P('voice', 'r'), K.P('web', 'l')], label: 'internal\nAPI', at: [(K.P('voice', 'r')[0] + K.P('web', 'l')[0]) / 2, cy.svc - 34]});
  E({pts: [K.P('voice', 'b'), K.P('redis', 't')], label: 'workers'});
  E({pts: [[R - 14, K.P('web', 'b')[1]], K.P('pg', 't')], label: 'SQL'});
  const wl = K.P('web', 'l', 0.82), mx = (K.P('voice', 'r')[0] + wl[0]) / 2;
  E({pts: [wl, [mx, wl[1]], [mx, cy.store], K.P('redis', 'r')], label: 'jobs', at: [mx, cy.store - 40]});
  // voice side
  E({pts: [K.P('voice', 'l'), K.P('gemini', 'r')]});
  const vb = K.P('voice', 'l', 0.8);
  E({pts: [vb, [272 + 5, vb[1]], [277, cy.store], K.P('wa', 'r')]});
  // web side bus
  const bx = 936, wr = K.P('web', 'r');
  K.edge({pts: [wr, [bx, wr[1]]], kind: 'line'});
  // remove the arrow head on the trunk by drawing it again without marker
  K.gEdges.lastChild.removeAttribute('marker-end');
  for (const id of ['places', 'geo', 'r2', 'konnect']) {
    const t = K.P(id, 'l');
    E({pts: [[bx, wr[1]], [bx, t[1]], t]});
  }
  // both services -> OpenRouter
  const vx = K.P('voice', 'l')[0] + 16, wx2 = K.P('web', 'r')[0] - 10, oy = K.P('openrouter', 'l')[1];
  E({pts: [[vx, K.P('voice', 'b')[1]], [vx, oy], K.P('openrouter', 'l')], label: 'caller text', at: [vx, 800]});
  E({pts: [[wx2, K.P('web', 'b')[1]], [wx2, oy], K.P('openrouter', 'r')], label: 'doctor AI', at: [wx2, 800]});
}
