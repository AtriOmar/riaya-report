// The two repositories (voice and web), their main modules and how they talk.
const I = 'icons/';
const LG = '../../logos/';
function draw(K) {
  const W = 1200;
  const zw = 470, gap = 220, zx1 = 20, zx2 = zx1 + zw + gap; // zone x positions
  const top = 200, head = 66, pitch = 84, ch = 66;
  const rowY = (i) => top + head + i * pitch;               // card top for row i
  const rows = 9;
  const zh = head + rows * pitch + 4;
  K.init(W, top + zh + 190);

  K.zone({x: zx1, y: top, w: zw, h: zh - pitch, title: 'voice repo', kind: 'riaya', dash: false, icon: I + 'code-branch.svg'});
  K.zone({x: zx2, y: top, w: zw, h: zh, title: 'web repo', kind: 'edge', dash: false, icon: I + 'code-branch.svg'});

  const vcard = (i, id, title, sub, icon) => K.card({id, x: zx1 + 18, y: rowY(i), w: zw - 36, h: ch, title, sub, icon: icon.endsWith('.png') ? LG + icon : I + icon, chip: icon.endsWith('.png') ? 'white' : 'teal'});
  const wcard = (i, id, title, sub, icon) => K.card({id, x: zx2 + 18, y: rowY(i), w: zw - 36, h: ch, title, sub, icon: icon.endsWith('.png') ? LG + icon : I + icon, chip: icon.endsWith('.png') ? 'white' : 'indigo'});

  vcard(0, 'v_srv', 'Express + WebSocket server', '/incoming-call, live dashboards', 'express.png');
  vcard(1, 'v_wa', 'WhatsApp manager', 'Baileys, one session per doctor', 'whatsapp.png');
  vcard(2, 'v_tools', 'Call tools', 'search, book, cancel, report abuse', 'list-check.svg');
  vcard(3, 'v_sess', 'TwilioSession', 'bridges phone audio, AI and dashboard', 'twilio.png');
  vcard(4, 'v_rt', 'Realtime backends', 'Gemini Live (used), OpenAI, others', 'gemini.png');
  vcard(5, 'v_stt', 'Caller transcriber, watchdog', 'caller text, silence, 15 min limit', 'microphone.svg');
  vcard(6, 'v_lk', 'LiveKit agent', 'STT, LLM, TTS chain (kept for tests)', 'livekit.png');
  vcard(7, 'v_wk', 'BullMQ workers', 'timeout, review, subscription', 'clock.svg');

  wcard(0, 'w_pages', 'Pages (App Router)', 'doctor, admin, review, test call', 'nextjs.png');
  wcard(1, 'w_api', 'API routes', 'Zod schemas, OpenAPI, Orval client', 'zod.png');
  wcard(2, 'w_int', 'Internal API', '/api/internal, voice server only', 'key.svg');
  wcard(3, 'w_auth', 'Better Auth', 'email OTP sign-up, roles', 'better-auth.png');
  wcard(4, 'w_fit', 'Best fit and geo', 'Google Places, road distance', 'google-places.png');
  wcard(5, 'w_bill', 'Plans and billing', 'limits, Konnect webhook', 'konnect.png');
  wcard(6, 'w_ai', 'Doctor AI', 'assistant, transcription (OpenRouter)', 'openrouter.png');
  wcard(7, 'w_q', 'Queue producers', 'delayed jobs in BullMQ', 'calendar-check.svg');
  wcard(8, 'w_db', 'Drizzle schema', 'tables and migrations', 'drizzle.png');

  // outside actors
  K.card({id: 'twilio', cx: zx1 + 210, y: 36, title: 'Twilio', sub: 'phone calls', icon: LG + 'twilio.png', chip: 'white'});
  K.card({id: 'browser', cx: W / 2, y: 36, title: 'Browser', sub: 'doctor, admin', icon: I + 'user-doctor.svg', chip: 'white'});

  // shared stores
  const gx = zx1 + zw + gap / 2;
  K.card({id: 'redis', cx: gx, cy: rowY(7) + ch / 2, w: 176, title: 'Redis', sub: 'queues', icon: LG + 'redis.png', chip: 'white'});
  K.card({id: 'pg', cx: zx2 + zw / 2, y: top + zh + 70, title: 'PostgreSQL', sub: 'used by web only', icon: LG + 'postgresql.png', chip: 'white'});

  const E = (o) => K.edge(o);
  // twilio, browser
  const tb = K.P('twilio', 'b');
  E({pts: [tb, [tb[0], rowY(0)]], label: 'webhook, audio', at: [tb[0], 150]});
  const bl = K.P('browser', 'l'), br = K.P('browser', 'r');
  const vx = zx1 + zw - 50, wx = zx2 + 260;
  E({pts: [bl, [vx, bl[1]], [vx, rowY(0)]], label: 'WebSocket', at: [vx, 150]});
  E({pts: [br, [wx, br[1]], [wx, rowY(0)]], label: 'HTTPS', at: [wx, 150]});
  // cross-repo calls
  const yWa = rowY(1) + ch / 2, yInt = rowY(2) + ch / 2;
  E({pts: [[zx2 + 18, yWa], [zx1 + zw - 18, yWa]], label: 'send WhatsApp', at: [gx, yWa - 22], kind: 'indigo'});
  E({pts: [[zx1 + zw - 18, yInt], [zx2 + 18, yInt]], label: 'x-internal-secret', at: [gx, yInt + 24], kind: 'teal'});
  // redis
  const yQ = rowY(7) + ch / 2;
  E({pts: [[zx2 + 18, yQ], K.P('redis', 'r')]});
  E({pts: [K.P('redis', 'l'), [zx1 + zw - 18, yQ]]});
  // pg
  const pb = K.P('w_db', 'b');
  E({pts: [pb, K.P('pg', 't')], label: 'SQL', at: [pb[0], top + zh + 30]});
}
