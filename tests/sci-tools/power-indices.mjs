// #752 Power indices: the 1958 EEC Council game (a standard textbook case), symmetric games with known
// answers, and the tool's made-up example. Cross-checked against brute-force Python (all orderings for
// Shapley-Shubik, all coalitions for Banzhaf, Deegan-Packel, Holler and Johnston) on 301 random games up to
// 12 players (all matched to 1e-12), and against an exact big-integer Python DP on a 50-player game.
import * as P from '../../src/lib/sci/powerindex.ts';

export default async (check) => {
  const close = (a, b, t = 1e-12) => a.length === b.length && a.every((x, i) => Math.abs(x - b[i]) < t);
  // [12; 4, 4, 4, 2, 2, 1]: Luxembourg (weight 1) is a dummy.
  const eu = P.power({ quota: 12, weights: [4, 4, 4, 2, 2, 1] });
  check('power: EEC 1958 Shapley-Shubik 7/30, 7/30, 7/30, 3/20, 3/20, 0', close(eu.shapley, [7 / 30, 7 / 30, 7 / 30, 3 / 20, 3 / 20, 0]));
  check('power: EEC 1958 Banzhaf swings 10,10,10,6,6,0', eu.swings.join() === '10,10,10,6,6,0' && close(eu.banzhaf, [5 / 21, 5 / 21, 5 / 21, 1 / 7, 1 / 7, 0]) && close(eu.banzhafAbs, [0.3125, 0.3125, 0.3125, 0.1875, 0.1875, 0]));
  check('power: EEC pivots out of 720 orderings', eu.pivots.join() === '168,168,168,108,108,0' && eu.orderings === '720' && eu.winning === 14 && eu.dummy[5] && !eu.veto.some(Boolean));
  // Brute force (Python) for the same game: 4 minimal winning coalitions.
  const m = P.mwcIndices({ quota: 12, weights: [4, 4, 4, 2, 2, 1] });
  check('power: EEC minimal winning coalitions', m.mwc === 4 && close(m.deeganPackel, [5 / 24, 5 / 24, 5 / 24, 3 / 16, 3 / 16, 0]) && close(m.holler, [0.2, 0.2, 0.2, 0.2, 0.2, 0]) && close(m.johnston, [0.25, 0.25, 0.25, 0.125, 0.125, 0]) && m.vulnerable === 12);
  // 50 equal players, simple majority: everyone 1/50; swings C(49, 25).
  const e = P.power({ quota: 26, weights: Array(50).fill(1) });
  check('power: 50 equal players', Math.abs(e.shapley[0] - 0.02) < 1e-12 && e.swings[0] === 63205303218876 && Math.abs(e.banzhafAbs[0] - 0.11227517265921705) < 1e-15);
  // 50 unequal players, matched against Python exact rational DP.
  const w = Array.from({ length: 50 }, (_, i) => ((i * 37) % 97) + 1), T = w.reduce((a, b) => a + b);
  const g = P.power({ quota: Math.floor(T / 2) + 1, weights: w });
  check('power: 50-player game matches exact Python', g.swings[0] === 1130400519256 && g.swings[49] === 77630259826046 && Math.abs(g.shapley[1] - 0.015629149729646352) < 1e-15 && Math.abs(g.shapley.reduce((a, b) => a + b) - 1) < 1e-12);
  check('power: veto player', P.power({ quota: 6, weights: [4, 2, 1] }).veto.join() === 'true,true,false');
  check('power: decimals scaled', close(P.power({ quota: 1.2, weights: [0.4, 0.4, 0.4, 0.2, 0.2, 0.1] }).shapley, eu.shapley));
  check('power: quota above total refused', (() => { try { P.power({ quota: 20, weights: [4, 4] }); return false; } catch (x) { return /more than all the weights/.test(x.message); } })());
  const pp = P.parsePlayers('Harbour 34\nValley 27\nRidge 18\nCoast 12\nForest 6\nLake 3');
  check('power: parse players', pp.names.join() === 'Harbour,Valley,Ridge,Coast,Forest,Lake' && pp.weights.join() === '34,27,18,12,6,3' && P.parsePlayers('3, 2, 1').names.join() === 'P1,P2,P3');
};
