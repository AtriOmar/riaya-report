// usage: node build.cjs <name>   -> renders <name>.js (uses kit.js) to ../<name>.png at 2x and <name>.svg
// puppeteer comes from the scratchpad tools folder (set PUPPETEER_DIR to override)
const path = require('path'), fs = require('fs');
const PUP = process.env.PUPPETEER_DIR || '/private/tmp/claude-502/-Users-mac-Development-riaya-voice/ccf364d3-e672-4b9c-813d-a5b919b25020/scratchpad/tools/node_modules/puppeteer';
const puppeteer = require(PUP);
(async () => {
  const name = process.argv[2];
  const dir = __dirname;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face{font-family:Inter;font-weight:400;src:url(fonts/Inter-Regular.ttf)}
  @font-face{font-family:Inter;font-weight:500 700;src:url(fonts/Inter-SemiBold.ttf)}
  body{margin:0;background:#fff} #root{display:inline-block}
  </style></head><body><div id="root"></div>
  <script src="kit.js"></script><script src="${name}.js"></script><script>Promise.all([document.fonts.load("600 20px Inter"),document.fonts.load("400 20px Inter")]).then(()=>{draw(K);document.body.dataset.done=1})</script></body></html>`;
  const hp = path.join(dir, `_${name}.html`);
  fs.writeFileSync(hp, html);
  const b = await puppeteer.launch({headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--allow-file-access-from-files']});
  const p = await b.newPage();
  p.on('pageerror', e => console.error('PAGE ERROR', e.message));
  p.on('console', m => console.log('console:', m.text()));
  await p.setViewport({width: 2600, height: 2000, deviceScaleFactor: 2});
  await p.goto('file://' + hp, {waitUntil: 'networkidle0'});
  await p.waitForSelector('body[data-done]');
  await new Promise(r => setTimeout(r, 400));
  const el = await p.$('#root svg');
  await el.screenshot({path: path.join(dir, '..', `${name}.png`)});
  await b.close();
  fs.unlinkSync(hp);
  console.log('ok', name);
})().catch(e => { console.error(e); process.exit(1); });
