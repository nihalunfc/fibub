// Reaction kinetics fitter: a dye-degradation check (blog: ag-tio2-cotton-photocatalyst-band-gap-dye-kinetics).
// A first-order run that loses 88 % in 90 min has k = -ln(0.12)/90 = 0.0235585 per min and a half-life of
// ln 2 / k = 29.42 min (worked by hand); exact data sampled every 10 min must give that k back and prefer first order.
import * as KIN from '../../src/lib/sci/kinetics.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const k = -Math.log(0.12) / 90;
  check('kinetics: 88 % gone in 90 min means k = 0.0235585 /min', near(k, 0.0235585, 1e-6));
  const t = Array.from({ length: 10 }, (_, i) => i * 10), c = t.map((x) => KIN.conc(1, 1, k, x));
  check('kinetics: C/C0 at 90 min = 0.12000', near(c[9], 0.12, 1e-12));
  const f = KIN.fitOrders(t, c), w = KIN.akaikeWeights(f.map((x) => x.aicc));
  check('kinetics: first-order fit of the dye run gives k = 0.0235585 /min and half-life 29.42 min', near(f[1].k, k, 1e-8) && near(f[1].halfLife, 29.4224, 1e-3));
  check('kinetics: AICc weights prefer first order for the dye run', w[1] > 0.99);
};
