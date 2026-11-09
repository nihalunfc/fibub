// #349 stereotaxic helper: angled tracks checked against SciPy Rotation (rotate the vertical track, intersect the
// skull plane); scaling and skull-flat angles by hand / NumPy arctan2.
import * as S from '../../src/lib/sci/stereo.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
  const t = S.scaleTarget({ ap: -2, ml: 1.5, dv: 1.8 }, 4, 3.8, 'ap');
  check('stereotaxic: AP scaled by measured/reference bregma-lambda', near(t.s, 0.95) && near(t.ap, -1.9) && t.ml === 1.5 && t.dv === 1.8);
  const a = S.scaleTarget({ ap: -2, ml: 1.5, dv: 1.8 }, 4, 3.8, 'all');
  check('stereotaxic: all three axes scaled', near(a.ml, 1.425) && near(a.dv, 1.71));
  const m = S.angled(t, 10, 'ml', 'medial'), l = S.angled(t, 10, 'ml', 'lateral');
  check('stereotaxic: 10° coronal tilt matches SciPy rotation', near(m.entry.ml, 1.817388565) && near(m.entry.ap, -1.9) && near(m.length, 1.827767901) && near(l.entry.ml, 1.182611435));
  const p = S.angled(t, 20, 'ap', 'posterior'), q = S.angled(t, 20, 'ap', 'anterior');
  check('stereotaxic: 20° sagittal tilt matches SciPy rotation', near(p.entry.ap, -1.244853578) && near(q.entry.ap, -2.555146422) && near(p.length, 1.915519990) && p.entry.ml === 1.5);
  check('stereotaxic: vertical track is unchanged', near(S.angled(t, 0, 'ml', 'medial').length, 1.8) && near(S.angled(t, 0, 'ml', 'medial').entry.ml, 1.5));
  const f = S.flatness(4.50, 4.62, 3.8, 0.1);
  check('stereotaxic: skull-flat check (lambda 0.12 mm lower, 1.809°)', near(f.diff, 0.12, 1e-12) && near(f.angle, 1.808739322) && !f.flat);
  check('stereotaxic: reading that grows upwards flips the sign; within tolerance is flat', near(S.flatness(4.50, 4.62, 3.8, 0.1, false).diff, -0.12, 1e-12) && S.flatness(2, 2.05, 4, 0.1).flat && near(S.flatness(2.05, 2, 4, 0.1).angle, -0.7161599455));
};
