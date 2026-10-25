// Activity: urgent booking (SAMU advice, doctors free within a few hours, waves of 3 requests, first accept wins).
const I = 'icons/';
function draw(K) {
  K.init(1240, 1600);
  const E = (o) => K.edge(o);
  const ln = K.lanes({x: 20, y: 20, h: 1560, lanes: [
    {key: 'P', kind: 'patient', title: 'Patient', w: 290, icon: I + 'phone.svg'},
    {key: 'R', kind: 'sys', title: 'Riaya (AI and server)', w: 620, icon: I + 'server.svg'},
    {key: 'D', kind: 'admin', title: 'Doctors', w: 290, icon: I + 'user-doctor.svg'},
  ]});
  const P = ln.P, R = ln.R, D = ln.D, RL = R - 160, RR = R + 160;
  const LOOP = RL - 140;

  K.start({id: 's', cx: P, cy: 110});
  K.act({id: 'sym', cx: P, cy: 200, text: 'Describe the\nsymptoms', kind: 'patient'});
  K.dec({id: 'life', cx: R, cy: 310, text: 'Life-threatening\nsigns?'});
  K.act({id: 'samu', cx: R, cy: 440, text: 'Say: call the SAMU at 190', kind: 'warn'});
  K.act({id: 'offer', cx: R, cy: 540, text: 'Offer urgent requests\nto the nearest doctors', kind: 'sys'});
  K.dec({id: 'agree', cx: P, cy: 680, text: 'Agrees?'});
  K.end({id: 'e0', cx: P, cy: 800});
  K.act({id: 'fit', cx: R, cy: 680, text: 'Best-fit search\npreferred time = now', kind: 'sys'});
  K.dec({id: 'soon', cx: R, cy: 815, text: 'Free within\na few hours?'});
  K.act({id: 'normal', cx: RR + 60, cy: 815, text: 'Offer a\nnormal\nbooking', kind: 'neutral'});
  K.end({id: 'e3', cx: RR + 60, cy: 915});
  K.act({id: 'create', cx: R, cy: 960, text: 'Send a wave of 3 urgent\nrequests in one group', kind: 'sys'});
  K.act({id: 'badge', cx: D, cy: 960, text: 'See the urgent\nbadge and alert', kind: 'admin'});
  K.act({id: 'wait', cx: R, cy: 1070, text: 'Wait for the first event', kind: 'sys'});
  K.dec({id: 'ev', cx: R, cy: 1190, text: 'First\nevent?'});
  K.act({id: 'refuse', cx: D, cy: 1190, text: 'Refuses one: only\nthat request is\ncancelled', kind: 'admin'});
  K.dec({id: 'more', cx: RL, cy: 1330, text: 'Wave left?\n(at most 3)'});
  K.act({id: 'cb', cx: RL, cy: 1455, text: 'Cancel the group,\ncall the patient back', kind: 'bad'});
  K.end({id: 'e2', cx: RL, cy: 1540});
  K.act({id: 'acc', cx: RR, cy: 1350, text: 'Confirm that request\ncancel the siblings', kind: 'good'});
  K.act({id: 'wa', cx: RR, cy: 1455, text: 'WhatsApp confirmation\nto the patient', kind: 'sys'});
  K.end({id: 'e1', cx: RR, cy: 1540});

  E({pts: [K.P('s', 'b'), K.P('sym', 't')]});
  E({pts: [K.P('sym', 'r'), [R, K.P('sym', 'r')[1]], K.P('life', 't')]});
  E({pts: [K.P('life', 'b'), K.P('samu', 't')], kind: 'amber'});
  K.guard(R + 14, 392, 'yes', '#111111', 'start');
  E({pts: [K.P('life', 'r'), [R + 230, 310], [R + 230, 540], K.P('offer', 'r')]});
  K.guard(R + 230, 420, 'no,\nurgent only', '#111111');
  E({pts: [K.P('samu', 'b'), K.P('offer', 't')]});
  E({pts: [K.P('offer', 'b'), [R, 605], [P, 605], K.P('agree', 't')]});
  E({pts: [K.P('agree', 'r'), K.P('fit', 'l')], kind: 'amber'});
  K.guard((K.P('agree', 'r')[0] + K.P('fit', 'l')[0]) / 2 - 20, 658, 'yes', '#111111');
  E({pts: [K.P('agree', 'b'), K.P('e0', 't')], kind: 'amber'});
  K.guard(P + 14, 750, 'no', '#111111', 'start');
  E({pts: [K.P('fit', 'b'), K.P('soon', 't')]});
  // nobody free soon
  E({pts: [K.P('soon', 'r'), K.P('normal', 'l')], kind: 'amber'});
  K.guard((K.P('soon', 'r')[0] + K.P('normal', 'l')[0]) / 2, 792, 'no', '#111111');
  E({pts: [K.P('normal', 'b'), K.P('e3', 't')]});
  E({pts: [K.P('soon', 'b'), K.P('create', 't')], kind: 'amber'});
  K.guard(R + 14, 900, 'yes', '#111111', 'start');
  E({pts: [K.P('create', 'r'), K.P('badge', 'l')]});
  E({pts: [K.P('create', 'b'), K.P('wait', 't')]});
  E({pts: [K.P('wait', 'b'), K.P('ev', 't')]});
  // refusal loop
  E({pts: [K.P('ev', 'r'), K.P('refuse', 'l')], kind: 'amber'});
  K.guard((K.P('ev', 'r')[0] + K.P('refuse', 'l')[0]) / 2, 1167, 'a doctor refuses');
  E({pts: [K.P('refuse', 't'), [D, 1070], K.P('wait', 'r')]});
  K.guard(D - 6, 1107, 'others stay open', '#111111');
  // wave over: next wave or callback
  E({pts: [K.P('ev', 'l'), [RL, 1190], K.P('more', 't')], kind: 'amber'});
  K.guard(RL - 4, 1228, '4 min pass or\nall refuse', '#333333');
  E({pts: [K.P('more', 'l'), [LOOP, 1330], [LOOP, 960], K.P('create', 'l')], kind: 'amber'});
  K.guard(LOOP, 1150, 'yes: next\n3 doctors', '#111111');
  E({pts: [K.P('more', 'b'), K.P('cb', 't')], kind: 'amber'});
  K.guard(RL + 14, 1395, 'no', '#111111', 'start');
  E({pts: [K.P('cb', 'b'), K.P('e2', 't')]});
  // accept
  E({pts: [K.P('ev', 'b'), [R, 1280], [RR, 1280], K.P('acc', 't')], kind: 'amber'});
  K.guard(RR + 12, 1280, 'a doctor accepts', '#111111', 'start');
  E({pts: [K.P('acc', 'b'), K.P('wa', 't')]});
  E({pts: [K.P('wa', 'b'), K.P('e1', 't')]});
}
