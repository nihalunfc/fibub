// #1394 Sliding filament. Checked against hand geometry with thick 1.6 µm (bare zone 0.2) and thin 1.0 µm:
// S = 2.6 → I 1.0, H 0.6, overlap 0.5 per half, heads reached 0.5/0.7 = 71.4 %; S = 2.0 → I 0.4, H 0;
// S = 3.6 → no overlap; 2.6 → 2.0 is a 23.08 % shortening.
import * as F from '../../src/lib/sci/sliding-filament.ts';
const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e;
export default async (check) => {
  const a = F.bands(2.6);
  check('sarcomere: 2.6 µm bands', near(a.A, 1.6) && near(a.I, 1.0) && near(a.H, 0.6) && near(a.overlap, 0.5) && near(a.reach, 0.5 / 0.7));
  const b = F.bands(2.0);
  check('sarcomere: 2.0 µm, H zone gone, all heads reach', near(b.I, 0.4) && b.H === 0 && near(b.overlap, 0.8) && near(b.reach, 1));
  check('sarcomere: 3.6 µm, no overlap', F.bands(3.6).overlap === 0 && F.bands(3.6).reach === 0 && near(F.bands(3.6).I, 2.0));
  check('sarcomere: A band constant at every length', [1.8, 2.2, 2.8, 3.4].every((s) => F.bands(s).A === 1.6));
  check('sarcomere: I and H shrink as it shortens', F.bands(2.4).I < F.bands(2.8).I && F.bands(2.4).H < F.bands(2.8).H);
  check('sarcomere: I = S − A and H = S − 2 × thin', [2.1, 2.5, 3.3].every((s) => near(F.bands(s).I, s - 1.6, 1e-12) && near(F.bands(s).H, s - 2, 1e-12)));
  check('sarcomere: shortening 2.6 → 2.0 = 23.08 %', Math.abs(F.shortening(2.6, 2.0) - 23.0769) < 1e-3);
  check('sarcomere: seven cycle steps, Ca first, relax last', F.CYCLE.length === 7 && F.CYCLE[0].id === 'ca' && F.CYCLE[6].id === 'relax');
};
