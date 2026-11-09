// #335 log scale: board-foot rules by formula and cubic volume. Reference values from an independent Python
// calculation; the International 1/4-inch rule is also checked against Grosenbaugh's closed-form fit of it.
import { doyle, scribner, international, scaleLog } from '../../src/lib/sci/logscale.ts';
export default async (check) => {
  const near = (a, b, t = 1e-6) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  check('log scale: Doyle 16 in × 16 ft = 144 bd ft', doyle(16, 16) === 144 && doyle(3, 16) === 0);
  check('log scale: Scribner formula 16 in × 16 ft', near(scribner(16, 16), 166.24));
  check('log scale: International 1/4 12 in × 16 ft (tables, rounded to 5: 95)', near(international(12, 16), 96.9436));
  check('log scale: International 1/4 with a 2 ft leftover', near(international(14, 18), 155.9496));
  const gro = (D, L) => 0.049621 * D * D * L + 0.00622 * D * L * L - 0.185476 * D * L + 0.000259 * L ** 3 - 0.011592 * L * L + 0.042222 * L;
  let mx = 0; for (let D = 8; D <= 30; D += 2) for (const L of [8, 12, 16, 20]) mx = Math.max(mx, Math.abs(international(D, L) / gro(D, L) - 1));
  check(`log scale: International 1/4 within 0.5 % of Grosenbaugh's formula (${(100 * mx).toFixed(2)} %)`, mx < 0.005);
  const r = scaleLog({ id: 'L2', small: 16, length: 16, large: 19, mid: 17.4 }, true);
  check('log scale: Smalian, Huber, Newton in ft³', near(r.smalian, 26.921704) && near(r.huber, 26.420794) && near(r.newton, 26.587764));
  const m = scaleLog({ id: 'M', small: 30, length: 4, large: 34 }, false);
  check('log scale: metric log converted for board-foot rules, Smalian in m³', near(m.doyle, 50.04272475736553) && near(m.intl, 74.40099478383681) && near(m.scrib, 67.73554229523158) && near(m.smalian, 0.3229557247890308) && Number.isNaN(m.huber));
};
