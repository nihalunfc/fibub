// Orbit transfer calculator: Hohmann transfer in dimensionless form (μ = 1, start radius 1), against the closed forms
// Δv/v = √(2ρ/(1+ρ)) − 1 + √(1/ρ)(1 − √(2/(1+ρ))) and t = π √(((1+ρ)/2)³). The LEO-to-GEO and Earth-to-Mars checks
// live in tests/sci.mjs. New with the article on Quarta (2025), Aerospace 12: 307 (augmented Hohmann transfer).
import { hohmann } from '../../src/lib/sci/orbit.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const closed = (p) => Math.abs(Math.sqrt((2 * p) / (1 + p)) - 1) + Math.sqrt(1 / p) * Math.abs(1 - Math.sqrt(2 / (1 + p)));
  check('orbit transfer: doubling the radius costs 28.45 % of the starting speed', near(hohmann(1, 1, 2).dv, closed(2)) && near(hohmann(1, 1, 2).dv, 0.284457, 1e-5));
  check('orbit transfer: halving the radius costs 40.23 %', near(hohmann(1, 1, 0.5).dv, closed(0.5)) && near(hohmann(1, 1, 0.5).dv, 0.402283, 1e-5));
  check('orbit transfer: flight time π((1+ρ)/2)^1.5', near(hohmann(1, 1, 2).tof, Math.PI * 1.5 ** 1.5) && near(hohmann(1, 1, 0.5).tof, Math.PI * 0.75 ** 1.5));
  check('orbit transfer: the Hohmann cost peaks at ratio 15.58 (53.6 %)', hohmann(1, 1, 15.58).dv > hohmann(1, 1, 14).dv && hohmann(1, 1, 15.58).dv > hohmann(1, 1, 17).dv && near(hohmann(1, 1, 15.58).dv, 0.536258, 1e-5));
};
