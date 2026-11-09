// #623 analog filter designer. Checked against SciPy: signal.butter / signal.cheby1(analog=True, output='zpk')
// poles grouped into sections (f0, Q), signal.freqs magnitudes for low- and high-pass, buttord / cheb1ord, and the
// LC ladders simulated with the #621 circuit simulator against SciPy's |H|² (available power gain).
import * as F from '../../src/lib/sci/eng-filter.ts';
import * as C from '../../src/lib/sci/eng-circuit.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const ref = {
    'butter 4': [[2, 1, 0.541196100146197], [2, 1, 1.3065629648763764]],
    'butter 5': [[1, 1, 0.5], [2, 1, 0.6180339887498948], [2, 1, 1.6180339887498947]],
    'cheby 4 1': [[2, 0.528581208642581, 0.7845484744441986], [2, 0.9932295179446688, 3.5590440713871456]],
    'cheby 5 0.5': [[1, 0.36231962424902453, 0.5], [2, 0.6904831735303045, 1.1778055654206503], [2, 1.0177347430953843, 4.54496332974823]],
    'cheby 3 3': [[1, 0.29862020827067426, 0.5], [2, 0.9160644239285908, 3.0676571730813835]],
  };
  for (const [k, r] of Object.entries(ref)) {
    const [kind, n, rip] = k.split(' '), st = F.stages(+n, kind, +(rip ?? 1));
    check(`filter: ${k} sections vs scipy zpk`, st.length === r.length && st.every((s, i) => s.order === r[i][0] && near(s.w0, r[i][1], 1e-12) && near(s.q, r[i][2], 1e-12)));
  }
  const wc = 2 * Math.PI * 1000, fs = [100, 500, 900, 1000, 1100, 2000, 5000];
  const db = (h) => 20 * Math.log10(Math.hypot(h.re, h.im));
  // SciPy freqs (even-order Chebyshev shifted by +ripple, since this cascade has unity DC gain).
  const sp = {
    'lp butter 4': fs.map((f) => -10 * Math.log10(1 + (f / 1000) ** 8)),
    'lp cheby 4': [0.13805456068116168, 0.7275995715462762, 0.9403038367610492, 0, -4.2911758432919465, -32.86896372610454, -66.75838160327179],
    'hp butter 4': [-80.00000004342944, -24.099331233312945, -5.215378315904888, -3.0102999566398116, -1.6628425291240945, -0.01693158019445091, -1.1117924506728289e-05],
  };
  for (const [k, v] of Object.entries(sp)) {
    const [resp, kind, n] = k.split(' '), st = F.stages(+n, kind, 1);
    check(`filter: ${k} response vs scipy freqs`, fs.every((f, i) => near(db(F.response(st, resp, wc, 2 * Math.PI * f)), v[i], 1e-9)));
    const sk = F.sallenKey(st, resp, wc, 10e-9);
    check(`filter: ${k} Sallen-Key parts give the same response`, fs.every((f, i) => { let re = 1, im = 0; for (const p of sk) { const h = F.skStageResponse(p, resp, 2 * Math.PI * f); [re, im] = [re * h.re - im * h.im, re * h.im + im * h.re]; } return near(db({ re, im }), v[i], 1e-9); }));
  }
  { const sk = F.sallenKey(F.stages(2, 'butter'), 'lp', wc, 10e-9)[0]; check('filter: 2nd-order Butterworth LP Sallen-Key (C1 = 2C, R = 1/(√2 ω C))', near(sk.c1, 20e-9, 1e-20) && near(sk.r1, 1 / (Math.SQRT2 * wc * 10e-9), 1e-6) && sk.r1 === sk.r2); }
  { const sk = F.sallenKey(F.stages(2, 'butter'), 'hp', wc, 10e-9)[0]; check('filter: 2nd-order Butterworth HP Sallen-Key (R2 = 2 R1)', near(sk.r2 / sk.r1, 2, 1e-12) && near(Math.sqrt(sk.r1 * sk.r2) * 10e-9 * wc, 1, 1e-12)); }
  { const g = F.gValues(4, 'cheby', 0.5); check('filter: Chebyshev 0.5 dB n=4 g-values (textbook 1.6703, 1.1926, 2.3661, 0.8419, 1.9841)', [1.6703, 1.1926, 2.3661, 0.8419].every((x, i) => near(g.g[i], x, 1e-4)) && near(g.gLoad, 1.9841, 1e-4)); }
  check('filter: Butterworth n=3 g-values 1, 2, 1', F.gValues(3, 'butter').g.every((x, i) => near(x, [1, 2, 1][i], 1e-12)));
  for (const resp of ['lp', 'hp']) for (const [kind, n, rip] of [['butter', 4, 1], ['cheby', 4, 1], ['cheby', 5, 0.5]]) for (const first of ['shunt', 'series']) {
    const L = F.ladder(n, kind, rip, resp, wc, 50, first), nl = C.parseNetlist(F.ladderNetlist(L.parts, 50, L.rLoad)), b = C.bode(C.acSweep(nl, fs), 'out');
    const st = F.stages(n, kind, rip), shift = kind === 'cheby' && n % 2 === 0 ? rip : 0;
    check(`filter: ${resp} ${kind} ${n} LC ladder (${first} first) simulated vs response`, fs.every((f, i) => near(10 * Math.log10(b.mag[i] ** 2 * 4 * 50 / L.rLoad), db(F.response(st, resp, wc, 2 * Math.PI * f)) - shift, 1e-9)));
  }
  check('filter: minimum order vs scipy buttord / cheb1ord', F.minOrder('butter', 0, 40, 2) === 7 && F.minOrder('cheby', 1, 40, 2) === 5 && F.minOrder('cheby', 0.5, 60, 3) === 5);
  let m = ''; try { F.stages(13, 'butter'); } catch (e) { m = e.message; } check('filter: order limit', m.includes('1 to 12'));
};
