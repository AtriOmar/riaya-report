// Stacks bpmn_booking.png and bpmn_callback_review.png into bpmn_global.png (for a full-page figure).
const path = require('path'), fs = require('fs');
const puppeteer = require(process.env.PUPPETEER_DIR || '/private/tmp/claude-502/-Users-mac-Development-riaya-voice/ccf364d3-e672-4b9c-813d-a5b919b25020/scratchpad/tools/node_modules/puppeteer');
(async () => {
  const d = path.join(__dirname, '..', '..');
  const font = path.join(__dirname, '..', 'fonts', 'Inter-SemiBold.ttf');
  const html = `<!doctype html><html><head><style>@font-face{font-family:Inter;font-weight:600;src:url("file://${font}")}
  body{margin:0;background:#fff;font-family:Inter} #root{display:inline-block;padding:10px 0;background:#fff}
  h2{font-size:24px;color:#111111;margin:14px 34px 0;font-weight:600} img{display:block;width:1478px}</style></head><body><div id="root">
  <h2>A. From the call to the pending request</h2><img src="file://${d}/bpmn_booking.png">
  <h2>B. The doctor's answer, callbacks and the review request</h2><img src="file://${d}/bpmn_callback_review.png"></div></body></html>`;
  const hp = path.join(__dirname, '_stack.html'); fs.writeFileSync(hp, html);
  const b = await puppeteer.launch({headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--allow-file-access-from-files']});
  const p = await b.newPage(); await p.setViewport({width: 1600, height: 1000, deviceScaleFactor: 2});
  await p.goto('file://' + hp, {waitUntil: 'networkidle0'}); await p.evaluate(() => document.fonts.ready);
  await (await p.$('#root')).screenshot({path: path.join(d, 'bpmn_global.png')});
  await b.close(); fs.unlinkSync(hp); console.log('ok bpmn_global');
})();
