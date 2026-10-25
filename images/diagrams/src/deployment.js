// Deployment: GitHub (repos, Actions, GHCR) to the Ubuntu VPS (Nginx + Docker network riaya_network).
const I = 'icons/';
const LG = '../../logos/';
function draw(K) {
  K.init(1200, 1060);
  const E = (o) => K.edge(o);

  // GitHub side
  K.card({id: 'dev', x: 40, y: 24, w: 290, title: 'Developer', sub: 'push to main', icon: I + 'user-doctor.svg', chip: 'slate'});
  K.zone({x: 20, y: 140, w: 330, h: 720, title: 'GitHub', kind: 'gh', icon: LG + 'github.png'});
  K.card({id: 'rweb', x: 40, y: 200, w: 290, title: 'web repo', sub: 'Next.js app', icon: LG + 'github.png', chip: 'white'});
  K.card({id: 'rvoice', x: 40, y: 290, w: 290, title: 'voice repo', sub: 'realtime server', icon: LG + 'github.png', chip: 'white'});
  K.card({id: 'gha', x: 40, cy: 465, w: 290, title: 'GitHub Actions', sub: 'one workflow per repo', icon: LG + 'github-actions.png', chip: 'white'});
  K.card({id: 'ghcr', x: 40, cy: 640, w: 290, title: 'GHCR', sub: 'Docker images', icon: LG + 'docker.png', chip: 'white'});
  K.card({id: 'sec', x: 40, cy: 785, w: 290, title: 'Secrets', sub: '.env file, SSH key', icon: I + 'key.svg', chip: 'slate'});

  E({pts: [K.P('dev', 'b'), K.P('rweb', 't')], label: 'git push', at: [185, 124]});
  E({pts: [K.P('rvoice', 'b'), K.P('gha', 't')], label: 'on push', at: [185, 400]});
  E({pts: [K.P('gha', 'b'), K.P('ghcr', 't')], label: 'build, push image', at: [185, 552]});

  // VPS
  K.card({id: 'net', cx: 960, y: 24, w: 300, title: 'Internet', sub: 'browsers, Twilio', icon: I + 'globe.svg', chip: 'slate'});
  K.zone({x: 400, y: 140, w: 780, h: 720, title: 'Ubuntu VPS', kind: 'host', icon: LG + 'ubuntu.png'});
  K.card({id: 'nginx', cx: 960, y: 196, w: 300, title: 'Nginx', sub: 'TLS, reverse proxy', icon: LG + 'nginx.png', chip: 'white'});
  K.zone({x: 424, y: 300, w: 732, h: 536, title: 'Docker network riaya_network', kind: 'riaya', icon: LG + 'docker.png'});

  const c1 = 548, c2 = 790, c3 = 1030;
  K.card({id: 'mig', cx: c1, cy: 465, w: 220, title: 'Migrations', sub: 'drizzle-kit', icon: LG + 'drizzle.png', chip: 'white', accent: '#333333'});
  K.card({id: 'web', cx: c2, cy: 465, w: 210, title: 'web', sub: 'Next.js', icon: LG + 'nextjs.png', chip: 'white', accent: '#0F766E'});
  K.card({id: 'voice', cx: c3, cy: 465, w: 210, title: 'voice', sub: 'Express', icon: LG + 'nodejs.png', chip: 'white', accent: '#0F766E'});
  K.card({id: 'pg', cx: c1, cy: 640, w: 220, title: 'PostgreSQL', sub: 'volume', icon: LG + 'postgresql.png', chip: 'white'});
  K.card({id: 'redis', cx: c3, cy: 640, w: 210, title: 'Redis', sub: 'volume', icon: LG + 'redis.png', chip: 'white'});
  K.card({id: 'compose', cx: c2, cy: 785, w: 300, title: 'Docker Compose', sub: 'pull, up -d, prune', icon: LG + 'docker.png', chip: 'white'});

  // internet -> nginx -> apps
  E({pts: [K.P('net', 'b'), K.P('nginx', 't')], label: 'HTTPS 443', at: [960, 124]});
  const nb = K.P('nginx', 'b');
  E({pts: [[c3, nb[1]], [c3, K.P('voice', 't')[1]]], label: 'WS, webhooks', at: [c3, 360]});
  E({pts: [[nb[0] - 110, nb[1]], [nb[0] - 110, 360], [c2, 360], [c2, K.P('web', 't')[1]]], label: 'pages, API', at: [c2 + 4, 360]});

  // data
  E({pts: [K.P('mig', 'b'), K.P('pg', 't')], label: '1. migrate', at: [c1, 552]});
  const wb = K.P('web', 'b');
  E({pts: [[c2 - 50, wb[1]], [c2 - 50, 640], K.P('pg', 'r')]});
  E({pts: [[c2 + 50, wb[1]], [c2 + 50, 640], K.P('redis', 'l')]});
  E({pts: [K.P('voice', 'b'), K.P('redis', 't')]});

  // deploy
  E({pts: [K.P('gha', 'r'), K.P('mig', 'l')], label: 'SSH', at: [394, 440], kind: 'teal'});
  E({pts: [K.P('ghcr', 'r'), [380, 640], [380, 785], K.P('compose', 'l')], label: '2. pull', at: [380, 712], kind: 'teal'});

  // external services
  const ex = ['twilio', 'gemini', 'openrouter', 'whatsapp', 'google-places', 'cloudflare-r2', 'konnect'];
  const exNames = ['Twilio', 'Gemini', 'OpenRouter', 'WhatsApp', 'Google', 'R2', 'Konnect'];
  K.zone({x: 20, y: 900, w: 1160, h: 140, title: 'External services', kind: 'ext'});
  E({pts: [[c3, 836], [c3, 900]], label: 'outbound HTTPS', at: [c3, 868]});
  E({pts: [K.P('compose', 't'), K.P('web', 'b')], dash: true, kind: 'teal', label: '3. up -d', at: [c2, 712]});
  ex.forEach((s, i) => {
    const x = 604 - ((ex.length - 1) * 112 + 56) / 2 + 4 + i * 112;
    K.el(K.gNodes, 'rect', {x: x - 4, y: 958, width: 56, height: 56, rx: 12, fill: '#FFFFFF', stroke: '#D9D9D9'});
    K.el(K.gNodes, 'image', {href: LG + s + '.png', x: x + 6, y: 968, width: 36, height: 36});
    K.text(x + 24, 1032, exNames[i], {size: 16, color: '#111111', anchor: 'middle', weight: 500});
  });
}
