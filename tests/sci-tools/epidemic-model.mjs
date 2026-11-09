// #462 epidemic model: RK4 SIR / SEIR / SEIRS against scipy solve_ivp (DOP853, rtol 1e-11, integrated piecewise
// between intervention days) and the SIR final-size equation solved with scipy brentq.
import { simulate, finalSize, cutAt, parseInterventions, validate } from '../../src/lib/sci/epidemic.ts';

export default async (check) => {
  const close = (a, b, tol) => Math.abs(a - b) <= tol;
  const cases = [
    [{ model: 'SIR', N: 100000, R0: 2.5, latent: 3, infectious: 5, I0: 10, vacc: 0, days: 200 }, { S100: 10735.0567, I50: 3890.5485, E50: 0, C: 89255.9427, pT: 32.063, pI: 23352.3709, fs: 0.89265943 }],
    [{ model: 'SEIR', N: 100000, R0: 2.5, latent: 3, infectious: 5, I0: 10, vacc: 0, days: 200 }, { S100: 11087.9370, I50: 6559.1090, E50: 5993.0664, C: 89255.9398, pT: 63.934, pI: 14386.0945, fs: 0.89265943 }],
    [{ model: 'SEIR', N: 100000, R0: 2.5, latent: 3, infectious: 5, I0: 10, vacc: 0, days: 300, interventions: [{ from: 30, to: 60, cut: 0.4 }] }, { S100: 16242.7140, I50: 1486.3088, E50: 1099.2472, C: 88074.8842, pT: 84.084, pI: 12562.7677 }],
    [{ model: 'SEIR', N: 5e6, R0: 4.2, latent: 5.2, infectious: 7, I0: 3, vacc: 0.3, days: 365, interventions: [{ from: 20, to: 80, cut: 0.5 }, { from: 50, to: 120, cut: 0.2 }] }, { S100: 3497836.8772, I50: 58.8541, E50: 54.3965, C: 3276553.7707, pT: 179.9012, pI: 575114.8669, fs: 0.65536345 }],
    [{ model: 'SIR', N: 1000, R0: 1.6, latent: 1, infectious: 2.3, I0: 1, vacc: 0.1, days: 400 }, { S100: 411.3553, I50: 5.8175, E50: 0, C: 487.6517, pT: 28.098, pI: 47.7929, fs: 0.48865168 }],
    [{ model: 'SEIRS', N: 1e6, R0: 3, latent: 2, infectious: 4, immunity: 180, I0: 50, vacc: 0.05, days: 730 }, { S100: 259503.8824, I50: 132833.1752, E50: 42069.7292, C: 3112301.3446, pT: 43.8219, pI: 181923.5645 }],
  ];
  for (const [p, r] of cases) {
    const s = simulate(p), tol = p.N * 1e-7, name = `${p.model} R0 ${p.R0}${p.interventions ? ' with interventions' : ''}`;
    check(`epidemic: ${name} matches scipy solve_ivp (S, E, I, cumulative)`, close(s.S[100], r.S100, tol) && close(s.I[50], r.I50, tol) && close(s.E[50], r.E50, tol) && close(s.C.at(-1), r.C, tol));
    check(`epidemic: ${name} peak day and size`, close(s.peakDay, r.pT, 0.02) && close(s.peakI / r.pI, 1, 1e-6));
    check(`epidemic: ${name} conserves the population`, s.S.every((v, i) => close(v + s.E[i] + s.I[i] + s.R[i], p.N, p.N * 1e-9)));
    if (r.fs) check(`epidemic: ${name} final size equation (scipy brentq ${r.fs})`, close(finalSize(p.R0, s.S0 / p.N, p.vacc).attack, r.fs, 1e-8));
  }
  // Without interventions, the long run reaches the analytic final size (SIR and SEIR alike).
  for (const model of ['SIR', 'SEIR']) {
    const p = { model, N: 1e6, R0: 1.8, latent: 4, infectious: 6, I0: 5, vacc: 0.2, days: 1500 };
    const s = simulate(p), fs = finalSize(p.R0, s.S0 / p.N, p.vacc);
    check(`epidemic: ${model} run ends at the final size`, close(s.attack, fs.attack, 1e-6));
  }
  // Below the threshold (R0 · s0 < 1) there is no epidemic: cases only fall.
  { const s = simulate({ model: 'SIR', N: 1e5, R0: 2, latent: 3, infectious: 5, I0: 10, vacc: 0.55, days: 100 });
    check('epidemic: vaccinated above 1 − 1/R0, cases only fall', s.Re0 < 1 && s.I.every((v, i) => i === 0 || v < s.I[i - 1]) && s.peakDay === 0); }
  check('epidemic: final size R0 2 (textbook 0.7968)', close(finalSize(2, 1, 0).attack, 0.796812, 1e-6));
  check('epidemic: no final epidemic below R0 1', finalSize(0.8, 1, 0).attack < 1e-9);
  check('epidemic: overlapping interventions multiply', close(cutAt(55, [{ from: 20, to: 80, cut: 0.5 }, { from: 50, to: 120, cut: 0.2 }]), 0.6, 1e-12) && cutAt(80, [{ from: 20, to: 80, cut: 0.5 }]) === 0);
  { const a = parseInterventions('30, 60, 40\n# note\n70 90 25%'), b = parseInterventions('60, 30, 40'), c = parseInterventions('a b c');
    check('epidemic: intervention lines', !a.error && a.list.length === 2 && a.list[1].cut === 0.25 && b.error && c.error); }
  check('epidemic: bad inputs', validate({ model: 'SIR', N: 100, R0: 2, latent: 1, infectious: 0, I0: 1, vacc: 0, days: 10 }) && validate({ model: 'SIR', N: 100, R0: 2, latent: 1, infectious: 5, I0: 1, vacc: 1, days: 10 }) && validate({ model: 'SEIRS', N: 100, R0: 2, latent: 1, infectious: 5, I0: 1, vacc: 0, days: 10 }) && !validate({ model: 'SEIR', N: 100, R0: 2, latent: 1, infectious: 5, I0: 1, vacc: 0, days: 10 }));
};
