// usage: node add_legend.cjs <name>   -> adds the class legend under ../<name>.png (in place)
// Run right after rendering a class diagram (render_mmd.sh does it); running it twice adds two legends.
// puppeteer comes from PUPPETEER_DIR (render_mmd.sh points it at the Mermaid tools folder).
const path = require('path'), fs = require('fs');
const puppeteer = require(process.env.PUPPETEER_DIR);
(async () => {
  const name = process.argv[2];
  const png = path.resolve(__dirname, '..', `${name}.png`);
  // The PNG is rendered at 2x, so the legend is drawn at 2x too (14px text -> 28px).
  const swatch = (fill, stroke) =>
    `<span style="display:inline-block;width:44px;height:28px;background:${fill};border:3px solid ${stroke};border-radius:4px;vertical-align:middle;margin-right:16px"></span>`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;background:#fff;font-family:"Helvetica Neue",Inter,Arial,sans-serif;color:#1F2937}
  #root{display:inline-block;background:#fff}
  #root img{display:block}
  .legend{display:flex;justify-content:center;gap:72px;padding:28px 0 36px;font-size:28px;border-top:2px solid #E5E7EB;margin-top:12px}
  </style></head><body><div id="root">
  <img src="file://${png}">
  <div class="legend">
    <span>${swatch('#FEF9E7', '#B8A55A')}Introduced in this diagram</span>
    <span>${swatch('#EEEEEE', '#A3A3A3')}Detailed in another class diagram</span>
  </div></div></body></html>`;
  const hp = path.join(__dirname, `_legend_${name}.html`);
  fs.writeFileSync(hp, html);
  const b = await puppeteer.launch({headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--allow-file-access-from-files']});
  const p = await b.newPage();
  await p.setViewport({width: 4000, height: 4000, deviceScaleFactor: 1});
  await p.goto('file://' + hp, {waitUntil: 'networkidle0'});
  const el = await p.$('#root');
  const out = png + '.tmp.png';
  await el.screenshot({path: out});
  await b.close();
  fs.unlinkSync(hp);
  fs.renameSync(out, png);
  console.log('legend added', name);
})().catch(e => { console.error(e); process.exit(1); });
