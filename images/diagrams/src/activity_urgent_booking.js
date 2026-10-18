// Activity: urgent booking (SAMU advice, emergency group of up to 3 requests, first accept wins).
const I = 'icons/';
function draw(K) {
  K.init(1240, 1540);
  const E = (o) => K.edge(o);
  const ln = K.lanes({x: 20, y: 20, h: 1500, lanes: [
    {key: 'P', kind: 'patient', title: 'Patient', w: 290, icon: I + 'phone.svg'},
    {key: 'R', kind: 'sys', title: 'Riaya (AI and server)', w: 620, icon: I + 'server.svg'},
    {key: 'D', kind: 'admin', title: 'Doctors', w: 290, icon: I + 'user-doctor.svg'},
  ]});
  const P = ln.P, R = ln.R, D = ln.D, RL = R - 160, RR = R + 160;

  K.start({id: 's', cx: P, cy: 110});
  K.act({id: 'sym', cx: P, cy: 200, text: 'Describe the\nsymptoms', kind: 'patient'});
  K.dec({id: 'life', cx: R, cy: 310, text: 'Life-threatening\nsigns?'});
  K.act({id: 'samu', cx: R, cy: 440, text: 'Say: call the SAMU at 190', kind: 'warn'});
  K.act({id: 'offer', cx: R, cy: 540, text: 'Offer urgent requests\nto the nearest doctors', kind: 'sys'});
  K.dec({id: 'agree', cx: P, cy: 680, text: 'Agrees?'});
  K.end({id: 'e0', cx: P, cy: 800});
  K.act({id: 'fit', cx: R, cy: 680, text: 'Best-fit search\npreferred time = now', kind: 'sys'});
  K.act({id: 'create', cx: R, cy: 800, text: 'Create up to 3 urgent pending\nrequests in one emergency group', kind: 'sys'});
  K.act({id: 'badge', cx: D, cy: 800, text: 'See the urgent\nbadge and alert', kind: 'admin'});
  K.act({id: 'wait', cx: R, cy: 915, text: 'Wait for the first event', kind: 'sys'});
  K.dec({id: 'ev', cx: R, cy: 1035, text: 'First\nevent?'});
  K.act({id: 'refuse', cx: D, cy: 1035, text: 'Refuses one: only\nthat request is\ncancelled', kind: 'admin'});
  K.act({id: 'cancel', cx: RL, cy: 1180, text: 'Cancel the whole\nemergency group', kind: 'bad'});
  K.dec({id: 'to', cx: RL, cy: 1300, text: 'Timeout?'});
  K.act({id: 'cb', cx: RL, cy: 1410, text: 'Call the patient back', kind: 'warn'});
  K.act({id: 'acc', cx: RR, cy: 1200, text: 'Confirm that request\ncancel the siblings', kind: 'good'});
  K.act({id: 'wa', cx: RR, cy: 1320, text: 'WhatsApp confirmation\nto the patient', kind: 'sys'});
  K.end({id: 'e1', cx: RR, cy: 1430});
  K.end({id: 'e2', cx: RL, cy: 1480});

  E({pts: [K.P('s', 'b'), K.P('sym', 't')]});
  E({pts: [K.P('sym', 'r'), [R, K.P('sym', 'r')[1]], K.P('life', 't')]});
  E({pts: [K.P('life', 'b'), K.P('samu', 't')], kind: 'amber'});
  K.guard(R + 14, 392, 'yes', '#B45309', 'start');
  E({pts: [K.P('life', 'r'), [R + 230, 310], [R + 230, 540], K.P('offer', 'r')]});
  K.guard(R + 230, 420, 'no,\nurgent only', '#475569');
  E({pts: [K.P('samu', 'b'), K.P('offer', 't')]});
  E({pts: [K.P('offer', 'b'), [R, 605], [P, 605], K.P('agree', 't')]});
  E({pts: [K.P('agree', 'r'), K.P('fit', 'l')], kind: 'teal'});
  K.guard((K.P('agree', 'r')[0] + K.P('fit', 'l')[0]) / 2 - 20, 658, 'yes', '#0F766E');
  E({pts: [K.P('agree', 'b'), K.P('e0', 't')], kind: 'amber'});
  K.guard(P + 14, 750, 'no', '#B45309', 'start');
  E({pts: [K.P('fit', 'b'), K.P('create', 't')]});
  E({pts: [K.P('create', 'r'), K.P('badge', 'l')]});
  E({pts: [K.P('create', 'b'), K.P('wait', 't')]});
  E({pts: [K.P('wait', 'b'), K.P('ev', 't')]});
  // refusal loop
  E({pts: [K.P('ev', 'r'), K.P('refuse', 'l')], kind: 'amber'});
  K.guard((K.P('ev', 'r')[0] + K.P('refuse', 'l')[0]) / 2, 1012, 'a doctor refuses');
  E({pts: [K.P('refuse', 't'), [D, 915], K.P('wait', 'r')]});
  K.guard(D - 6, 952, 'others stay open', '#475569');
  // patient cancel or timeout
  E({pts: [K.P('ev', 'l'), [RL, 1035], K.P('cancel', 't')], kind: 'red'});
  K.guard(RL - 4, 1074, 'patient cancels one\nor 10 min pass', '#DC2626');
  E({pts: [K.P('cancel', 'b'), K.P('to', 't')]});
  E({pts: [K.P('to', 'b'), K.P('cb', 't')], kind: 'amber'});
  K.guard(RL + 14, 1360, 'yes', '#B45309', 'start');
  E({pts: [K.P('cb', 'b'), K.P('e2', 't')]});
  E({pts: [K.P('to', 'l'), [RL - 145, 1300], [RL - 145, 1480], K.P('e2', 'l')]});
  K.guard(RL - 145, 1390, 'no');
  // accept
  E({pts: [K.P('ev', 'b'), [R, 1128], [RR, 1128], K.P('acc', 't')], kind: 'teal'});
  K.guard(RR + 12, 1128, 'a doctor accepts', '#0F766E', 'start');
  E({pts: [K.P('acc', 'b'), K.P('wa', 't')]});
  E({pts: [K.P('wa', 'b'), K.P('e1', 't')]});
}
