// #750 Qualitative coding: counts, co-occurrence (overlap and same-document), retrieval and file round trips.
// The matrices, counts and c-coefficients were redone by brute force (itertools) in an independent Python
// script, and the passage CSV was read back with Python's csv module: all agree.
import * as Q from '../../src/lib/sci/qualcode.ts';

const P = {"docs":[{"id":"d1","name":"Interview 1","text":"I moved here for work. The rent is high, but my neighbours help with childcare, so I stay."},
{"id":"d2","name":"Interview 2","text":"Work is far away. The bus is slow and costs a lot. Still, people here look after each other."},
{"id":"d3","name":"Interview 3","text":"We have no family nearby. Money is tight, and the rent went up again, so we may leave."}],
"codes":[{"id":"c1","name":"Work","color":"#0072B2","memo":""},{"id":"c2","name":"Cost of living","color":"#D55E00","memo":""},{"id":"c3","name":"Support","color":"#009E73","memo":""},{"id":"c4","name":"Staying or leaving","color":"#CC79A7","memo":""}],
"segs":[{"id":"s1","doc":"d1","code":"c1","start":0,"end":22},{"id":"s2","doc":"d1","code":"c2","start":23,"end":40},{"id":"s3","doc":"d1","code":"c3","start":46,"end":81},{"id":"s4","doc":"d1","code":"c4","start":23,"end":89},
{"id":"s5","doc":"d2","code":"c1","start":0,"end":18},{"id":"s6","doc":"d2","code":"c2","start":19,"end":50},{"id":"s7","doc":"d2","code":"c3","start":51,"end":92},{"id":"s8","doc":"d2","code":"c1","start":0,"end":50},
{"id":"s9","doc":"d3","code":"c3","start":0,"end":25},{"id":"s10","doc":"d3","code":"c2","start":26,"end":70},{"id":"s11","doc":"d3","code":"c4","start":60,"end":84}]};

export default async (check) => {
  const o = Q.cooccurrence(P), d = Q.cooccurrence(P, 'document');
  check('qualcode: overlap co-occurrence matrix (Python)', JSON.stringify(o.n) === JSON.stringify([[3, 1, 0, 0], [1, 3, 0, 2], [0, 0, 3, 1], [0, 2, 1, 2]]));
  check('qualcode: same-document matrix (Python)', JSON.stringify(d.n) === JSON.stringify([[2, 2, 2, 1], [2, 3, 3, 2], [2, 3, 3, 2], [1, 2, 2, 2]]));
  check('qualcode: c-coefficient 2/(3+2−2) = 0.6667 (Python)', Math.abs(o.c[1][3] - 2 / 3) < 1e-12 && Math.abs(o.c[0][1] - 0.2) < 1e-12 && o.c[0][2] === 0 && Number.isNaN(o.c[0][0]));
  const cnt = Q.codeCounts(P);
  check('qualcode: counts per code and document (Python)', JSON.stringify(cnt.map((r) => r.perDoc)) === JSON.stringify([[1, 2, 0], [1, 1, 1], [1, 1, 1], [1, 0, 1]]) && cnt[0].total === 3 && cnt[0].docs === 2);
  check('qualcode: characters coded', cnt[0].chars === 22 + 18 + 50);
  const r = Q.retrieve(P, 'c4');
  check('qualcode: retrieve in document order with overlapping codes', r.length === 2 && r[0].doc.name === 'Interview 1' && r[0].text.startsWith('The rent is high') && r[0].others.join() === 'Cost of living,Support' && r[1].others.join() === 'Cost of living');
  check('qualcode: trimRange drops spaces and empty picks', JSON.stringify(Q.trimRange('  ab c  ', 0, 8)) === '[2,6]' && Q.trimRange('a   b', 1, 4) === null && JSON.stringify(Q.trimRange('abc', 3, 1)) === '[1,3]');
  const pc = Q.pieces('abcdefghij', [{ id: 'x', doc: 'd', code: 'A', start: 2, end: 6 }, { id: 'y', doc: 'd', code: 'B', start: 4, end: 8 }]);
  check('qualcode: pieces cut at every boundary', pc.map((p) => `${p.start}-${p.end}:${p.codes.join('')}`).join(' ') === '0-2: 2-4:A 4-6:AB 6-8:B 8-10:');
  const csv = Q.segmentsCsv(P);
  check('qualcode: passage CSV quotes commas', csv.startsWith('document,code,start,end,text\r\nInterview 1,Work,0,22,I moved here for work.\r\nInterview 1,Cost of living,23,40,"The rent is high,"\r\n'));
  check('qualcode: counts CSV', Q.countsCsv(P).split('\r\n')[0] === 'code,Interview 1,Interview 2,Interview 3,total,documents' && Q.countsCsv(P).split('\r\n')[1] === 'Work,1,2,0,3,2');
  check('qualcode: matrix CSV', Q.matrixCsv(P, 'overlap').split('\r\n')[2] === 'Cost of living,1,3,0,2');
  const back = Q.fromJson(Q.toJson(P));
  check('qualcode: JSON round trip', JSON.stringify(back.project) === JSON.stringify(P) && back.dropped === 0);
  const bad = Q.fromJson(JSON.stringify({ docs: [{ id: 'a', name: 'A', text: 'hello' }], codes: [{ id: 'k', name: 'K', color: 'red' }], segments: [{ doc: 'a', code: 'k', start: 0, end: 5 }, { doc: 'a', code: 'k', start: 2, end: 9 }, { doc: 'z', code: 'k', start: 0, end: 1 }, { doc: 'a', code: 'q', start: 0, end: 1 }] }));
  check('qualcode: import drops passages outside the text or with unknown links', bad.project.segs.length === 1 && bad.dropped === 3 && bad.project.codes[0].color === Q.PALETTE[0]);
  let msg = ''; try { Q.fromJson('[1,2]'); } catch (e) { msg = e.message; }
  check('qualcode: wrong JSON message', /not a coding project/.test(msg));
};
