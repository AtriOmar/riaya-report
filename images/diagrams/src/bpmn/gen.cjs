// Builds BPMN 2.0 XML (with DI) from a small JS spec, then renders it with bpmn-js in headless Chrome.
// usage: node gen.cjs <spec.cjs> <outname>   -> <outname>.bpmn here, ../../<outname>.png (2x) and <outname>.svg here
const fs = require('fs'), path = require('path');
const PUP = process.env.PUPPETEER_DIR || '/private/tmp/claude-502/-Users-mac-Development-riaya-voice/ccf364d3-e672-4b9c-813d-a5b919b25020/scratchpad/tools/node_modules/puppeteer';
const BPMNJS = process.env.BPMNJS_DIR || '/private/tmp/claude-502/-Users-mac-Development-riaya-voice/ccf364d3-e672-4b9c-813d-a5b919b25020/scratchpad/tools/node_modules/bpmn-js';

const COL = {
  task: {fill: '#E6F2F0', stroke: '#7FADA6'},
  ai: {fill: '#E6F2F0', stroke: '#7FADA6'},
  admin: {fill: '#FFE9CC', stroke: '#CDA06A'},
  warn: {fill: '#FFE9CC', stroke: '#CDA06A'},
  bad: {fill: '#FBE1DD', stroke: '#C98F88'},
  good: {fill: '#E4F1DC', stroke: '#8FB07F'},
  gw: {fill: '#FFFFFF', stroke: '#64748B'},
  start: {fill: '#FFF5C9', stroke: '#C9B458'},
  end: {fill: '#FFFFFF', stroke: '#64748B'},
  inter: {fill: '#FFFFFF', stroke: '#64748B'},
  flow: {stroke: '#64748B'},
};
const SIZE = {task: [180, 92], startEvent: [44, 44], endEvent: [44, 44], intermediateCatchEvent: [44, 44], intermediateThrowEvent: [44, 44], boundaryEvent: [40, 40], exclusiveGateway: [56, 56], eventBasedGateway: [56, 56], parallelGateway: [56, 56]};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

function build(spec) {
  const n = {};
  for (const e of spec.nodes) {
    const [w, h] = e.size || SIZE[e.type] || SIZE.task;
    n[e.id] = {...e, w, h, x: e.cx - w / 2, y: e.cy - h / 2};
  }
  const side = (id, s, f = 0.5) => {
    const b = n[id];
    if (b.type.endsWith('Gateway')) f = 0.5;
    return s === 't' ? [b.x + b.w * f, b.y] : s === 'b' ? [b.x + b.w * f, b.y + b.h] : s === 'l' ? [b.x, b.y + b.h * f] : [b.x + b.w, b.y + b.h * f];
  };
  let proc = '', di = '';
  const outgoing = {}, incoming = {};
  for (const f of spec.flows) { (outgoing[f.from] ||= []).push(f.id); (incoming[f.to] ||= []).push(f.id); }
  // lanes
  const laneXml = spec.lanes.map(l => `<bpmn:lane id="${l.id}" name="${esc(l.name)}">${spec.nodes.filter(e => e.lane === l.id).map(e => `<bpmn:flowNodeRef>${e.id}</bpmn:flowNodeRef>`).join('')}</bpmn:lane>`).join('');
  proc += `<bpmn:laneSet id="LaneSet_1">${laneXml}</bpmn:laneSet>`;
  for (const e of Object.values(n)) {
    const io = (incoming[e.id] || []).map(i => `<bpmn:incoming>${i}</bpmn:incoming>`).join('') + (outgoing[e.id] || []).map(o => `<bpmn:outgoing>${o}</bpmn:outgoing>`).join('');
    const def = e.def ? `<bpmn:${e.def}EventDefinition id="${e.id}_def"${e.def === 'link' ? ` name="${esc(e.link || 'B')}"` : ''}>${e.def === 'timer' ? `<bpmn:timeDuration xsi:type="bpmn:tFormalExpression">${e.timer || 'PT10M'}</bpmn:timeDuration>` : ''}</bpmn:${e.def}EventDefinition>` : '';
    const tag = e.type === 'task' ? (e.task || 'task') : e.type;
    const extra = e.type === 'boundaryEvent' ? ` attachedToRef="${e.attachedTo}" cancelActivity="${e.cancel === false ? 'false' : 'true'}"` : '';
    proc += `<bpmn:${tag} id="${e.id}" name="${esc(e.name || '')}"${extra}>${io}${def}</bpmn:${tag}>`;
    const c = COL[e.color || (e.type === 'task' ? 'task' : e.type.endsWith('Gateway') ? 'gw' : e.type === 'startEvent' ? 'start' : e.type === 'endEvent' ? 'end' : 'inter')];
    let label = '';
    if (e.type !== 'task') {
      const lw = e.lw || 150, lh = e.lh || 44;
      const lp = e.lpos || 'b';
      let lx = lp === 'r' ? e.x + e.w + 8 : lp === 'l' ? e.x - lw - 8 : e.cx - lw / 2;
      let ly = lp === 't' ? e.y - lh - 6 : lp === 'b' ? e.y + e.h + 6 : e.cy - lh / 2;
      if (e.ldx) lx += e.ldx; if (e.ldy) ly += e.ldy;
      label = `<bpmndi:BPMNLabel><dc:Bounds x="${lx}" y="${ly}" width="${lw}" height="${lh}"/></bpmndi:BPMNLabel>`;
    }
    di += `<bpmndi:BPMNShape id="${e.id}_di" bpmnElement="${e.id}"${e.type.endsWith('Gateway') ? ' isMarkerVisible="true"' : ''} bioc:fill="${c.fill}" bioc:stroke="${c.stroke}" color:background-color="${c.fill}" color:border-color="${c.stroke}"><dc:Bounds x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}"/>${label}</bpmndi:BPMNShape>`;
  }
  for (const f of spec.flows) {
    const pts = f.pts ? f.pts.map(p => typeof p[0] === 'string' ? side(p[0], p[1], p[2]) : p) : [side(f.from, f.s || 'r'), side(f.to, f.t || 'l')];
    proc += `<bpmn:sequenceFlow id="${f.id}" name="${esc(f.name || '')}" sourceRef="${f.from}" targetRef="${f.to}"/>`;
    let label = '';
    if (f.name) {
      const [lx, ly] = f.at || [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2 - 22];
      const lw = f.lw || 90;
      label = `<bpmndi:BPMNLabel><dc:Bounds x="${lx - lw / 2}" y="${ly - 10}" width="${lw}" height="20"/></bpmndi:BPMNLabel>`;
    }
    di += `<bpmndi:BPMNEdge id="${f.id}_di" bpmnElement="${f.id}" bioc:stroke="${f.color || COL.flow.stroke}" color:border-color="${f.color || COL.flow.stroke}">${pts.map(p => `<di:waypoint x="${p[0]}" y="${p[1]}"/>`).join('')}${label}</bpmndi:BPMNEdge>`;
  }
  const P = spec.pool;
  let laneDi = '', ly = P.y;
  for (const l of spec.lanes) {
    laneDi += `<bpmndi:BPMNShape id="${l.id}_di" bpmnElement="${l.id}" isHorizontal="true" bioc:fill="${l.fill}" bioc:stroke="#737373" color:background-color="${l.fill}" color:border-color="#737373"><dc:Bounds x="${P.x + 36}" y="${ly}" width="${P.w - 36}" height="${l.h}"/></bpmndi:BPMNShape>`;
    ly += l.h;
  }
  const H = ly - P.y;
  return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" xmlns:color="http://www.omg.org/spec/BPMN/non-normative/color/1.0" id="Defs_${spec.id}" targetNamespace="http://riaya.tn/bpmn">
<bpmn:collaboration id="Collab_1"><bpmn:participant id="Pool_1" name="${esc(P.name)}" processRef="Process_1"/>${(spec.blackPools || []).map(b => `<bpmn:participant id="${b.id}" name="${esc(b.name)}"/>`).join('')}${(spec.messageFlows || []).map(m => `<bpmn:messageFlow id="${m.id}" name="${esc(m.name || '')}" sourceRef="${m.from}" targetRef="${m.to}"/>`).join('')}</bpmn:collaboration>
<bpmn:process id="Process_1" isExecutable="false">${proc}</bpmn:process>
<bpmndi:BPMNDiagram id="Diagram_1"><bpmndi:BPMNPlane id="Plane_1" bpmnElement="Collab_1">
<bpmndi:BPMNShape id="Pool_1_di" bpmnElement="Pool_1" isHorizontal="true" bioc:fill="#FFFFFF" bioc:stroke="#404040" color:background-color="#FFFFFF" color:border-color="#404040"><dc:Bounds x="${P.x}" y="${P.y}" width="${P.w}" height="${H}"/></bpmndi:BPMNShape>
${(spec.blackPools || []).map(b => `<bpmndi:BPMNShape id="${b.id}_di" bpmnElement="${b.id}" isHorizontal="true" bioc:fill="${b.fill || '#F6F6F6'}" bioc:stroke="#404040" color:background-color="${b.fill || '#F6F6F6'}" color:border-color="#404040"><dc:Bounds x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}"/></bpmndi:BPMNShape>`).join('')}
${laneDi}${di}${(spec.messageFlows || []).map(m => { const pts = m.pts.map(p => typeof p[0] === 'string' ? side(p[0], p[1], p[2]) : p); const lab = m.name ? `<bpmndi:BPMNLabel><dc:Bounds x="${m.at[0] - (m.lw || 100) / 2}" y="${m.at[1] - 10}" width="${m.lw || 100}" height="20"/></bpmndi:BPMNLabel>` : ''; return `<bpmndi:BPMNEdge id="${m.id}_di" bpmnElement="${m.id}" bioc:stroke="#404040" color:border-color="#404040">${pts.map(p => `<di:waypoint x="${p[0]}" y="${p[1]}"/>`).join('')}${lab}</bpmndi:BPMNEdge>`; }).join('')}
</bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>`;
}

(async () => {
  const [,, specFile, out] = process.argv;
  const spec = require(path.resolve(specFile));
  const xml = build(spec);
  const here = __dirname;
  fs.writeFileSync(path.join(here, `${out}.bpmn`), xml);
  const fontDir = path.join(here, '..', 'fonts');
  const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="file://${BPMNJS}/dist/assets/diagram-js.css"><link rel="stylesheet" href="file://${BPMNJS}/dist/assets/bpmn-js.css">
<style>@font-face{font-family:Inter;font-weight:400;src:url("file://${fontDir}/Inter-Regular.ttf")}@font-face{font-family:Inter;font-weight:600;src:url("file://${fontDir}/Inter-SemiBold.ttf")}
html,body{margin:0;background:#fff}#c{width:3000px;height:2000px}</style></head><body><div id="c"></div>
<script src="file://${BPMNJS}/dist/bpmn-viewer.production.min.js"></script>
<script>
(async () => {
  await document.fonts.load('17px Inter');
  const v = new BpmnJS({container: '#c', textRenderer: {defaultStyle: {fontFamily: 'Inter, sans-serif', fontSize: ${spec.font || 17}, lineHeight: 1.18}, externalStyle: {fontSize: ${spec.efont || 16}}}});
  try { const r = await v.importXML(${JSON.stringify(xml)}); window.warnings = r.warnings.map(w => w.message); } catch (e) { window.err = e.message; }
  const {svg} = await v.saveSVG();
  window.svgOut = svg; document.body.dataset.done = 1;
})();
</script></body></html>`;
  const hp = path.join(here, `_${out}.html`);
  fs.writeFileSync(hp, html);
  const puppeteer = require(PUP);
  const b = await puppeteer.launch({headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--allow-file-access-from-files']});
  const p = await b.newPage();
  p.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await p.goto('file://' + hp, {waitUntil: 'networkidle0'});
  await p.waitForSelector('body[data-done]');
  const res = await p.evaluate(() => ({svg: window.svgOut, err: window.err, warnings: window.warnings}));
  if (res.err) console.error('IMPORT ERROR', res.err);
  if (res.warnings && res.warnings.length) console.error('WARN', res.warnings);
  // style the exported svg: Inter font, white background, padding
  let svg = res.svg.replace(/font-family:\s*[^;"]+/g, 'font-family: Inter, sans-serif');
  fs.writeFileSync(path.join(here, `${out}.svg`), svg);
  const page2 = `<!doctype html><html><head><meta charset="utf-8"><style>@font-face{font-family:Inter;font-weight:400;src:url("file://${fontDir}/Inter-Regular.ttf")}@font-face{font-family:Inter;font-weight:600;src:url("file://${fontDir}/Inter-SemiBold.ttf")}body{margin:0;background:#fff}text,tspan{fill:#111 !important}#root{display:inline-block;padding:24px;background:#fff}</style></head><body><div id="root">${svg}</div></body></html>`;
  fs.writeFileSync(hp, page2);
  await p.setViewport({width: 2600, height: 1600, deviceScaleFactor: 2});
  await p.goto('file://' + hp, {waitUntil: 'networkidle0'});
  await p.evaluate(() => document.fonts.ready);
  const el = await p.$('#root');
  await el.screenshot({path: path.join(here, '..', '..', `${out}.png`)});
  await b.close();
  fs.unlinkSync(hp);
  console.log('ok', out);
})().catch(e => { console.error(e); process.exit(1); });
