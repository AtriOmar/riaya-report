// Activity: doctor sign-up with email OTP, application, admin review.
const I = 'icons/';
function draw(K) {
  K.init(1180, 1510);
  const E = (o) => K.edge(o);
  const ln = K.lanes({x: 20, y: 20, h: 1470, lanes: [
    {key: 'D', kind: 'doctor', title: 'Doctor', w: 370, icon: I + 'user-doctor.svg'},
    {key: 'S', kind: 'sys', title: 'Riaya', w: 470, icon: I + 'server.svg'},
    {key: 'A', kind: 'admin', title: 'Administrator', w: 300, icon: I + 'user-shield.svg'},
  ]});
  const D = ln.D, S = ln.S - 90, A = ln.A;
  const S2 = ln.S + 100; // right column inside the Riaya lane

  K.start({id: 's', cx: D, cy: 112});
  K.act({id: 'form', cx: D, cy: 200, text: 'Fill the sign-up form\nemail, password', kind: 'doctor'});
  K.act({id: 'otp', cx: S, cy: 300, text: 'Keep the pending sign-up\nemail a 6-digit code', kind: 'sys'});
  K.act({id: 'enter', cx: D, cy: 410, text: 'Type the code', kind: 'doctor'});
  K.dec({id: 'ok', cx: S, cy: 520, text: 'Code\ncorrect?'});
  K.dec({id: 'left', cx: S2, cy: 520, text: 'Retry\nallowed?'});
  K.act({id: 'create', cx: S, cy: 650, text: 'Create the user account\nsign the doctor in', kind: 'sys'});
  K.act({id: 'app', cx: D, cy: 770, text: 'Fill the application\nCIN photos, speciality,\nMedical Council no.,\nTIN, cabinet on map', kind: 'doctor'});
  K.act({id: 'pend', cx: S, cy: 900, text: 'Save the application\nstatus: pending', kind: 'sys'});
  K.act({id: 'review', cx: A, cy: 1010, text: 'Review the\napplication', kind: 'admin'});
  K.dec({id: 'dec', cx: A, cy: 1140, text: 'Decision'});
  K.act({id: 'rej', cx: S, cy: 1140, text: 'Status: rejected\nreasons shown', kind: 'warn'});
  K.act({id: 'fix', cx: D, cy: 1140, text: 'Fix the information\nand reapply', kind: 'doctor'});
  K.act({id: 'ver', cx: S, cy: 1290, text: 'Status: verified\nprofile created\ndashboard unlocked', kind: 'good'});
  K.act({id: 'ban', cx: S, cy: 1430, text: 'Status: banned', kind: 'bad'});
  K.act({id: 'use', cx: D, cy: 1290, text: 'Use the full\ndashboard', kind: 'doctor'});
  K.end({id: 'e1', cx: D, cy: 1430});

  // flow
  E({pts: [K.P('s', 'b'), K.P('form', 't')]});
  E({pts: [K.P('form', 'r'), [S, K.P('form', 'r')[1]], K.P('otp', 't')]});
  K.text(S + 120, 238, 'code valid 10 min, 5 tries\nnew code after 60 s', {size: 16, color: '#404040'});
  E({pts: [K.P('otp', 'b'), [S, 410], K.P('enter', 'r')].slice(0, 1).concat([[S, 360], [D, 360], K.P('enter', 't')])});
  E({pts: [K.P('enter', 'b'), [D, 520], K.P('ok', 'l')]});
  E({pts: [K.P('ok', 'r'), K.P('left', 'l')], kind: 'amber'});
  K.guard((K.P('ok', 'r')[0] + K.P('left', 'l')[0]) / 2, 498, 'no');
  // tries left -> type again
  E({pts: [K.P('left', 't'), [S2, 410], K.P('enter', 'r')], kind: 'amber'});
  K.guard(S2 + 12, 440, 'yes', '#111111', 'start');
  // no tries left -> new code
  E({pts: [K.P('left', 'r'), [ln.S + 218, 520], [ln.S + 218, 300], K.P('otp', 'r')], kind: 'amber'});
  K.guard(ln.S + 218, 420, 'no:\nnew code');
  E({pts: [K.P('ok', 'b'), K.P('create', 't')], kind: 'amber'});
  K.guard(S + 26, 600, 'yes', '#111111', 'start');
  E({pts: [K.P('create', 'l'), [D, K.P('create', 'l')[1]], K.P('app', 't')]});
  E({pts: [K.P('app', 'b'), [D, 900], K.P('pend', 'l')]});
  E({pts: [K.P('pend', 'r'), [A, 900], K.P('review', 't')]});
  E({pts: [K.P('review', 'b'), K.P('dec', 't')]});
  E({pts: [K.P('dec', 'l'), K.P('rej', 'r')], kind: 'amber'});
  K.guard((K.P('dec', 'l')[0] + K.P('rej', 'r')[0]) / 2, 1118, 'reject');
  E({pts: [K.P('rej', 'l'), K.P('fix', 'r')]});
  E({pts: [K.P('fix', 't'), [D, 1010], [S - 40, 1010], [S - 40, K.P('pend', 'b')[1]]]});
  K.guard(D + 120, 1010, 'back to pending', '#111111');
  E({pts: [K.P('dec', 'b'), [A, 1290], K.P('ver', 'r')], kind: 'amber'});
  K.guard(A + 14, 1230, 'approve', '#111111', 'start');
  E({pts: [K.P('dec', 'r'), [A + 130, 1140], [A + 130, 1430], K.P('ban', 'r')], kind: 'amber'});
  K.guard(A + 130, 1360, 'ban', '#333333');
  E({pts: [K.P('ver', 'l'), K.P('use', 'r')]});
  E({pts: [K.P('use', 'b'), K.P('e1', 't')]});
  E({pts: [K.P('ban', 'l'), K.P('e1', 'r')]});
}
