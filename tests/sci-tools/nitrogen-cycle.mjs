// #1275 Nitrogen cycle game. The fewest-step answers (breadth-first search) checked by hand for every pair of
// stores, and the cycle's arrows checked for sense (every store can be reached from every other).
import { STORES, PROCESSES, outOf, shortest, shortestLoop } from '../../src/lib/sci/nitrogen-cycle.ts';

export default async (check) => {
  const S = Object.keys(STORES);
  check('nitrogen: every process joins two known, different stores', PROCESSES.every((p) => S.includes(p.from) && S.includes(p.to) && p.from !== p.to && p.simple && p.detail));
  check('nitrogen: unique ids', new Set(PROCESSES.map((p) => p.id)).size === PROCESSES.length);
  check('nitrogen: every store reaches every other', S.every((a) => S.every((b) => shortest(a, b) !== null)));
  // Hand-worked fewest steps.
  const H = { 'air>animals': 3, 'animals>air': 4, 'dead>plants': 2, 'air>plants': 2, 'plants>ammonium': 2, 'dead>air': 3, 'nitrate>animals': 2, 'animals>plants': 3, 'ammonium>air': 2 };
  check('nitrogen: hand-worked fewest steps', Object.entries(H).every(([k, n]) => shortest(...k.split('>')).length === n));
  const p = shortest('animals', 'air');
  check('nitrogen: animals to air goes through decay and denitrification', p.join() === 'dieA,ammon,nitrif,denit');
  check('nitrogen: only denitrification returns N to the air', PROCESSES.filter((x) => x.to === 'air').map((x) => x.id).join() === 'denit');
  check('nitrogen: three ways out of the air', outOf('air').length === 3 && outOf('air').filter((x) => x.human).length === 1);
  check('nitrogen: shortest loop from air has 2 steps (lightning, denitrification)', shortestLoop('air').join() === 'light,denit' && shortestLoop('animals').length === 4);
  // Paths are real: each step starts where the last ended.
  let ok = true;
  for (const a of S) for (const b of S) { let at = a; for (const id of shortest(a, b)) { const pr = PROCESSES.find((x) => x.id === id); if (pr.from !== at) ok = false; at = pr.to; } if (at !== b) ok = false; }
  check('nitrogen: every path is joined end to end', ok);
};
