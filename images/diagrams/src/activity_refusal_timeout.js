// Activity: what happens after a normal phone booking (accept, refuse, 10 min timeout, review).
const I = 'icons/';
function draw(K) {
  K.init(1240, 1300);
  const E = (o) => K.edge(o);
  const ln = K.lanes({x: 20, y: 20, h: 1260, lanes: [
    {key: 'P', kind: 'patient', title: 'Patient', w: 270, icon: I + 'phone.svg'},
    {key: 'R', kind: 'sys', title: 'Riaya (server and jobs)', w: 690, icon: I + 'server.svg'},
    {key: 'D', kind: 'admin', title: 'Doctor', w: 240, icon: I + 'user-doctor.svg'},
  ]});
  const P = ln.P, R = ln.R, D = ln.D, RL = R - 240, RR = R + 230;

  K.start({id: 's', cx: P, cy: 110});
  K.act({id: 'call', cx: P, cy: 200, text: 'Call, pick a\ndoctor and slot', kind: 'patient'});
  K.act({id: 'create', cx: R, cy: 300, text: 'Create a pending request\nstart the 10 min timer', kind: 'sys'});
  K.act({id: 'see', cx: D, cy: 300, text: 'See it live on\nthe calendar', kind: 'admin'});
  K.dec({id: 'ans', cx: R, cy: 430, text: 'Doctor\nanswer?'});
  // accept column
  K.act({id: 'conf', cx: RL, cy: 570, text: 'Confirm, link the\npatient file', kind: 'good'});
  K.act({id: 'wa', cx: RL, cy: 680, text: 'WhatsApp\nconfirmation', kind: 'sys'});
  K.act({id: 'rev', cx: RL, cy: 790, text: 'Review job runs\n2 h after the visit', kind: 'sys'});
  K.act({id: 'rate', cx: P, cy: 900, text: 'Rate the doctor\nfrom the link', kind: 'patient'});
  K.end({id: 'e1', cx: P, cy: 1000});
  // refuse / timeout
  K.act({id: 'ref', cx: R, cy: 570, text: 'Cancel it, keep the\nrequest 24 h in Redis', kind: 'warn'});
  K.act({id: 'to', cx: RR, cy: 570, text: 'Timeout job\ncancels it', kind: 'warn'});
  K.dec({id: 'blk', cx: R, cy: 720, text: 'Blocked\nnumber?'});
  K.end({id: 'e2', cx: RR + 40, cy: 720});
  K.act({id: 'cb', cx: R, cy: 860, text: 'Call the patient back\nrefused: 3 other doctors\ntimeout: call again', kind: 'sys'});
  K.dec({id: 'pick', cx: R, cy: 1010, text: 'Answered?'});
  K.act({id: 'wam', cx: RR + 20, cy: 1010, text: 'Same message on\nWhatsApp (platform)', kind: 'sys'});
  K.end({id: 'e3', cx: RR + 20, cy: 1120});
  K.act({id: 'talk', cx: P, cy: 1130, text: 'Hear the options,\nbook again', kind: 'patient'});
  K.end({id: 'e4', cx: P, cy: 1240});

  E({pts: [K.P('s', 'b'), K.P('call', 't')]});
  E({pts: [K.P('call', 'r'), [R, 200], K.P('create', 't')]});
  E({pts: [K.P('create', 'r'), K.P('see', 'l')], label: 'live', at: [(K.P('create', 'r')[0] + K.P('see', 'l')[0]) / 2, 280]});
  E({pts: [K.P('create', 'b'), K.P('ans', 't')]});
  E({pts: [K.P('ans', 'l'), [RL, 430], K.P('conf', 't')], kind: 'teal'});
  K.guard(RL, 470, 'accepts', '#111111');
  E({pts: [K.P('ans', 'b'), K.P('ref', 't')], kind: 'amber'});
  K.guard(R + 14, 500, 'refuses', '#111111', 'start');
  E({pts: [K.P('ans', 'r'), [RR, 430], K.P('to', 't')], kind: 'amber'});
  K.guard(RR, 470, 'no answer\nin 10 min', '#111111');
  E({pts: [K.P('conf', 'b'), K.P('wa', 't')]});
  E({pts: [K.P('wa', 'b'), K.P('rev', 't')]});
  E({pts: [K.P('rev', 'b'), [RL, 900], K.P('rate', 'r')], label: 'WhatsApp link', at: [RL - 50, 900]});
  E({pts: [K.P('rate', 'b'), K.P('e1', 't')]});
  E({pts: [K.P('ref', 'b'), K.P('blk', 't')]});
  E({pts: [K.P('to', 'b'), [RR, 640], [R, 640]]});
  K.gEdges.lastChild.removeAttribute('marker-end');
  K.el(K.gEdges, 'circle', {cx: R, cy: 640, r: 4.5, fill: '#737373'});
  E({pts: [K.P('blk', 'r'), K.P('e2', 'l')], kind: 'red'});
  K.guard((K.P('blk', 'r')[0] + K.P('e2', 'l')[0]) / 2, 692, 'yes: nothing sent', '#333333');
  E({pts: [K.P('blk', 'b'), K.P('cb', 't')], kind: 'teal'});
  K.guard(R + 14, 790, 'no', '#111111', 'start');
  E({pts: [K.P('cb', 'b'), K.P('pick', 't')]});
  E({pts: [K.P('pick', 'r'), K.P('wam', 'l')], kind: 'amber'});
  K.guard((K.P('pick', 'r')[0] + K.P('wam', 'l')[0]) / 2, 988, 'no', '#111111');
  E({pts: [K.P('wam', 'b'), K.P('e3', 't')]});
  E({pts: [K.P('pick', 'b'), [R, 1130], K.P('talk', 'r')], kind: 'teal'});
  K.guard(R + 14, 1080, 'yes', '#111111', 'start');
  E({pts: [K.P('talk', 'b'), K.P('e4', 't')]});
  K.text(D, 560, 'Urgent request:\nno callback,\nother doctors of\nthe group can\nstill accept.', {size: 16, color: '#404040', anchor: 'middle'});
}
