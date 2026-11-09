// #587 Agent-based model playground: maths checks.
// REF: an independent Python implementation of the Schelling and grid-SIR rules, fed the same mulberry32 random
// stream, gave these grid hashes (SHA-1 of the cell string) and move counts / final S, I, R counts.
import { createHash } from 'node:crypto';
import { rng, schellingInit, schellingStep, schellingStats, unhappy, neighbours, sirInit, sirStep, sirCounts, boidsInit, boidsStep, boidsStats, wrapD } from '../../src/lib/sci/abm.ts';

const REF = {"sch": [{"p": {"w": 20, "h": 20, "empty": 0.1, "shareA": 0.5, "threshold": 0.5, "wrap": true, "seed": 1}, "steps": 10, "hash": "7882b7fd282d4403d4d4bb0bdbe23c84ad66a112", "moves": [139, 67, 44, 26, 20, 13, 8, 9, 6, 5]}, {"p": {"w": 30, "h": 25, "empty": 0.2, "shareA": 0.6, "threshold": 0.4, "wrap": false, "seed": 7}, "steps": 15, "hash": "24c6f547264803e9725aad93ea7849dbd4bbc9b7", "moves": [166, 100, 67, 47, 38, 25, 19, 16, 11, 9, 6, 5, 4, 3, 2]}, {"p": {"w": 15, "h": 15, "empty": 0.05, "shareA": 0.5, "threshold": 0.7, "wrap": true, "seed": 3}, "steps": 30, "hash": "188bee74c29f756e18ab963d8646bbb2d57ed8a1", "moves": [183, 173, 154, 150, 138, 141, 133, 135, 142, 122, 114, 113, 99, 93, 78, 69, 72, 74, 78, 76, 86, 81, 79, 82, 71, 67, 62, 68, 60, 55]}, {"p": {"w": 40, "h": 40, "empty": 0.3, "shareA": 0.3, "threshold": 0.34, "wrap": true, "seed": 11}, "steps": 8, "hash": "8e906a68912487193379e60e18d5ea5724b70076", "moves": [267, 171, 120, 97, 74, 51, 40, 33]}], "sir": [{"p": {"w": 30, "h": 30, "beta": 0.3, "gamma": 0.1, "initial": 3, "moore": false, "wrap": true, "seed": 5}, "steps": 25, "hash": "cd88e950706efac08a273a5b87ad3fff3ee80ba5", "last": [167, 314, 419]}, {"p": {"w": 25, "h": 20, "beta": 0.5, "gamma": 0.25, "initial": 1, "moore": true, "wrap": false, "seed": 9}, "steps": 20, "hash": "5f02324a23cb14a9a6b62f5ecc857dd7a5656bbd", "last": [29, 110, 361]}, {"p": {"w": 40, "h": 40, "beta": 0.2, "gamma": 0.05, "initial": 10, "moore": false, "wrap": false, "seed": 2}, "steps": 30, "hash": "da20681bfa2415bc21c7974e44a441d4a7b40595", "last": [674, 470, 456]}]};

export default async (check) => {
  const sha = (g) => createHash('sha1').update(Array.from(g).join('')).digest('hex');
  { const r = rng(42); check('abm: mulberry32 stream matches Python (seed 42)', [r(), r(), r()].join() === '0.6011037519201636,0.44829055899754167,0.8524657934904099'); }
  for (const c of REF.sch) { const s = schellingInit(c.p), mv = []; for (let k = 0; k < c.steps; k++) mv.push(schellingStep(s));
    check(`abm: Schelling ${c.p.w}×${c.p.h} threshold ${c.p.threshold} matches Python after ${c.steps} steps`, sha(s.grid) === c.hash && mv.join() === c.moves.join()); }
  for (const c of REF.sir) { const s = sirInit(c.p); for (let k = 0; k < c.steps; k++) sirStep(s);
    check(`abm: grid SIR β ${c.p.beta} γ ${c.p.gamma} matches Python after ${c.steps} steps`, sha(s.grid) === c.hash && sirCounts(s).join() === c.last.join()); }
  // Schelling rules by hand.
  { const s = schellingInit({ w: 10, h: 10, empty: 0.2, shareA: 0.5, threshold: 0.5, wrap: true, seed: 1 });
    const n = (v) => Array.from(s.grid).filter((x) => x === v).length; check('abm: Schelling counts 40 A, 40 B, 20 empty', n(1) === 40 && n(2) === 40 && n(0) === 20);
    s.grid.fill(0); s.grid[11] = 1; s.grid[12] = 1; s.grid[21] = 2; s.grid[22] = 2; s.grid[13] = 2;
    check('abm: neighbour counts', neighbours(s, 12).join() === '1,3' && unhappy(s, 12) && !unhappy(s, 22));
    s.p.threshold = 0; check('abm: threshold 0 means nobody moves', schellingStep(s) === 0); }
  { const s = schellingInit({ w: 40, h: 40, empty: 0.1, shareA: 0.5, threshold: 0.375, wrap: true, seed: 4 }); const a = schellingStats(s).similar; for (let k = 0; k < 40; k++) schellingStep(s); const b = schellingStats(s);
    check(`abm: Schelling segregates (similar ${a.toFixed(2)} → ${b.similar.toFixed(2)}, unhappy ${b.unhappy.toFixed(3)})`, a < 0.55 && b.similar > 0.7 && b.unhappy < 0.02); }
  // SIR rules: β = 1, γ = 0 from one centre cell spreads as a diamond (von Neumann) or square (Moore) of radius t.
  { const s = sirInit({ w: 21, h: 21, beta: 1, gamma: 0, initial: 0, moore: false, wrap: false, seed: 1 }); s.grid[10 * 21 + 10] = 1; for (let k = 0; k < 4; k++) sirStep(s);
    check('abm: SIR β=1 diamond of radius 4 (41 cells)', sirCounts(s)[1] === 41 && s.grid[10 * 21 + 14] === 1 && s.grid[14 * 21 + 14] === 0); }
  { const s = sirInit({ w: 21, h: 21, beta: 1, gamma: 0, initial: 0, moore: true, wrap: false, seed: 1 }); s.grid[10 * 21 + 10] = 1; for (let k = 0; k < 3; k++) sirStep(s);
    check('abm: SIR Moore square of side 7 (49 cells)', sirCounts(s)[1] === 49); }
  { const s = sirInit({ w: 10, h: 10, beta: 0, gamma: 1, initial: 7, moore: false, wrap: true, seed: 2 }); sirStep(s); check('abm: SIR γ=1 everyone recovers in one step', sirCounts(s).join() === '93,0,7'); }
  { const s = sirInit({ w: 50, h: 50, beta: 0.4, gamma: 0.1, initial: 5, moore: false, wrap: true, seed: 8 }); let ok = true, prevS = 2500; for (let k = 0; k < 60; k++) { sirStep(s); const c = sirCounts(s); if (c[0] > prevS || c[0] + c[1] + c[2] !== 2500) ok = false; prevS = c[0]; } check('abm: SIR S never rises and the total stays 2500', ok); }
  // Boids.
  check('abm: torus distance', wrapD(90, 100) === -10 && wrapD(-60, 100) === 40 && wrapD(30, 100) === 30);
  { const p = { n: 2, size: 100, vision: 10, separation: 5, sepWeight: 0.1, alignWeight: 0, cohWeight: 0, maxSpeed: 10, minSpeed: 0, noise: 0, seed: 1 };
    const b = boidsInit(p); b.x.set([50, 52]); b.y.set([50, 50]); b.vx.fill(0); b.vy.fill(0); boidsStep(b);
    check('abm: separation pushes two close boids apart by sepWeight × offset', Math.abs(b.vx[0] + 0.2) < 1e-12 && Math.abs(b.vx[1] - 0.2) < 1e-12 && Math.abs(b.x[0] - 49.8) < 1e-12); }
  { const p = { n: 2, size: 100, vision: 10, separation: 0, sepWeight: 0, alignWeight: 0, cohWeight: 0.5, maxSpeed: 10, minSpeed: 0, noise: 0, seed: 1 };
    const b = boidsInit(p); b.x.set([1, 97]); b.y.set([50, 50]); b.vx.fill(0); b.vy.fill(0); boidsStep(b);
    check('abm: cohesion across the wrapped edge moves each boid halfway (to 99)', Math.abs(b.x[0] - 99) < 1e-12 && Math.abs(b.x[1] - 99) < 1e-12); }
  { const p = { n: 3, size: 100, vision: 50, separation: 0, sepWeight: 0, alignWeight: 1, cohWeight: 0, maxSpeed: 10, minSpeed: 0, noise: 0, seed: 1 };
    const b = boidsInit(p); b.x.set([10, 20, 30]); b.y.set([10, 10, 10]); b.vx.set([1, 0, 2]); b.vy.set([0, 3, 0]); boidsStep(b);
    check('abm: alignment weight 1 takes the neighbours average heading', b.vx[0] === 1 && b.vy[0] === 1.5 && b.vx[1] === 1.5 && b.vy[1] === 0); }
  { const p = { n: 1, size: 100, vision: 10, separation: 2, sepWeight: 0, alignWeight: 0, cohWeight: 0, maxSpeed: 2, minSpeed: 1, noise: 0, seed: 1 };
    const b = boidsInit(p); b.vx[0] = 5; b.vy[0] = 0; boidsStep(b); const fast = b.vx[0]; b.vx[0] = 0.1; boidsStep(b); check('abm: speed limits', fast === 2 && b.vx[0] === 1); }
  { const p = { n: 120, size: 200, vision: 25, separation: 6, sepWeight: 0.05, alignWeight: 0.1, cohWeight: 0.005, maxSpeed: 3, minSpeed: 1, noise: 0.05, seed: 3 };
    const b = boidsInit(p), o0 = boidsStats(b).order; for (let k = 0; k < 400; k++) boidsStep(b); const o1 = boidsStats(b).order;
    const c = boidsInit(p); for (let k = 0; k < 400; k++) boidsStep(c);
    check(`abm: flocking raises polarisation (${o0.toFixed(2)} → ${o1.toFixed(2)})`, o0 < 0.3 && o1 > 0.8);
    check('abm: boids repeatable with a seed', c.x.join() === b.x.join()); }
};
