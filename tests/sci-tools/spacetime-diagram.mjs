// #967 spacetime diagram. References: SymPy (interval invariance and velocity composition of 2 × 2 boosts), NumPy
// numbers for the example events, and a numerical integral of the traveller's proper time for the twin paradox.
import * as S from '../../src/lib/sci/phsr.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const ev = [[2, 1, 1.7320508075688776, 0], [1, 3, -0.5773502691896258, 2.886751345948129], [3, 3, 1.7320508075688776, 1.7320508075688776]];
  check('sr: boosts of the example events at β = 0.5 (NumPy)', ev.every(([t, x, tp, xp]) => { const [a, b] = S.boost(t, x, 0.5); return near(a, tp) && near(b, xp); }));
  check('sr: interval is invariant', [[2, 1], [1, 3], [5, -2]].every(([t, x]) => { const [a, b] = S.boost(t, x, -0.73); return near(S.interval(a, b), S.interval(t, x), 1e-12); }));
  check('sr: two boosts compose by velocity addition (SymPy)', (() => { const [a, b] = S.boost(...S.boost(3, 1, 0.4), 0.3); const [c, d] = S.boost(3, 1, (0.4 + 0.3) / (1 + 0.12)); return near(a, c) && near(b, d); })());
  check('sr: rapidities add', near(S.rapidity((0.4 + 0.3) / (1 + 0.12)), S.rapidity(0.4) + S.rapidity(0.3)));
  check('sr: γ(0.8) = 5/3, γ(0.6) = 1.25', near(S.gamma(0.8), 5 / 3) && near(S.gamma(0.6), 1.25));
  check('sr: classification', S.classify(2, 1) === 'timelike' && S.classify(1, 3) === 'spacelike' && S.classify(3, 3) === 'lightlike' && S.classify(-2, 2) === 'lightlike');
  check('sr: light stays at c in every frame', near(S.velIn(1, 0.9), 1) && near(S.velIn(-1, 0.9), -1));
  check('sr: frame where spacelike events are simultaneous', (() => { const b = S.simultaneousFrame(1, 3); return near(S.boost(1, 3, b)[0], 0, 1e-12) && Number.isNaN(S.simultaneousFrame(3, 1)); })());
  check('sr: frame where timelike events are at one place', (() => { const b = S.samePlaceFrame(2, 1); return near(S.boost(2, 1, b)[1], 0, 1e-12) && near(S.boost(2, 1, b)[0], Math.sqrt(3)); })());
  const T = S.twin(0.8, 4);
  check('sr: twin at 0.8c to 4 ly: Earth 10 y, traveller 6 y (numerical proper time 6.000)', near(T.earth, 10) && near(T.traveller, 6));
  check('sr: simultaneity jump at turnaround 2βD = 6.4 y', near(T.jump, 6.4) && near(T.tOut, 1.8) && near(T.tIn, 8.2));
  check('sr: Earth signals received 1 on the way out and 9 back; Doppler k = 3', near(T.signalsOut, 1) && near(T.signalsIn, 9) && near(T.kOut, 3));
  check('sr: traveller time equals out-leg signals × k plus back-leg signals ÷ k', near(T.signalsOut * T.kOut + T.signalsIn / T.kOut, T.traveller));
};
