// Buffer recipe calculator: capacity, temperature shift and the pH response to added strong acid; new with the polyoxometalate article.
import { BUFFERS, oneForm, pHOf, pHAtOtherT, betaMaxSingle } from '../../src/lib/sci/buffer.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const tris = BUFFERS.find((b) => b.id === 'tris'), phos = BUFFERS.find((b) => b.id === 'phosphate');
  const r = oneForm(tris, tris.forms[0], 8, 25, 0.1, 1, 1);
  check('buffer: 0.1 M Tris at pH 8.0 and 25 °C needs 12.11 g of base and 58.0 mL of 1 M HCl per litre', near(r.forms[0].grams, 12.1136, 1e-3) && near(r.titrantmL, 57.98, 0.01));
  check('buffer: its capacity is 56.1 mM per pH unit, 97 % of the single-pair maximum 57.6', near(r.state.beta * 1000, 56.1, 0.05) && near(r.state.beta / betaMaxSingle(0.1), 0.975, 0.002));
  check('buffer: the same recipe at 37 °C reads pH 7.64', near(pHAtOtherT(tris, r, 37), 7.64, 0.005));
  const after = (x) => { const s = r.state, base = s.C * s.nbar + s.OH - s.H - x, counter = 2 * s.I - s.alpha.reduce((a, v, i) => a + v * (tris.z0 - i) ** 2, 0) * s.C - s.H - s.OH + x; return pHOf(tris, 25, s.C, base, Math.max(counter, 0)).pH; };
  check('buffer: 45 mM of added strong acid takes 0.1 M Tris from pH 8.0 to 2.63; 43.3 mM gives pH 3.0', near(after(0.045), 2.63, 0.01) && near(after(0.0433), 3.0, 0.03));
  const p = oneForm(phos, phos.forms[0], 7, 25, 0.1, 1, 1), q = oneForm(phos, phos.forms[0], 4.5, 25, 0.1, 1, 1);
  check('buffer: 0.1 M phosphate has pKa2′ 6.81 and, at pH 4.5, only 3 % of the maximum capacity', near(p.state.pKa[1], 6.81, 0.005) && near(q.state.beta / betaMaxSingle(0.1), 0.032, 0.002));
};
