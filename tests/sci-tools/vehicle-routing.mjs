// #586 vehicle routing: src/lib/sci/vrp.ts. Held-Karp route order against brute force over every permutation (in
// this file); the exact capacitated optimum against an integer program (two-index formulation with MTZ load
// constraints) solved by scipy.optimize.milp (HiGHS) — the reference totals below came from it. PuLP 4.2 in the build
// environment had no solver installed, so scipy's MILP solver was used instead. During the build the exact method was
// compared with that integer program on 40 random instances of 2 to 8 customers (all equal, including the 5 with too
// few vehicles), and the heuristic was within 5.6 % of the optimum (mean 0.33 %, optimal in 31 of 35).
import * as V from '../../src/lib/sci/vrp.ts';

export default async (check) => {
  const near = (a, b, t = 1e-6) => Math.abs(a - b) <= t;
  const make = (xy, dem, cap, K = 0) => ({ names: xy.map((_, i) => (i ? `C${i}` : 'Depot')), d: V.euclid(xy), demand: dem, cap, vehicles: K, xy });
  const perms = (a) => (a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p])));
  { let ok = true;
    for (let t = 0; t < 60; t++) {
      const k = 1 + (t % 7), pts = Array.from({ length: k + 1 }, (_, i) => [Math.sin(t * 7 + i * 3.1) * 50, Math.cos(t * 3 + i * 1.3) * 50]), d = V.euclid(pts), stops = [...Array(k).keys()].map((i) => i + 1);
      const bf = Math.min(...perms(stops).map((p) => V.routeLength(d, p))), hk = V.heldKarp(d, stops);
      if (!near(bf, hk.length, 1e-9) || !near(V.routeLength(d, hk.order), hk.length, 1e-9)) ok = false;
    }
    check('vrp: Held-Karp equals brute force over all orders (60 random routes of 1-7 stops)', ok); }
  const cases = [
    [[[30, 6], [14, 16], [64, 75], [8, 99]], [0, 7, 2, 5], 13, 271.1508784423645],
    [[[53, 11], [98, 34], [26, 50], [35, 43], [5, 25], [90, 0], [52, 7], [48, 62]], [0, 3, 1, 4, 7, 2, 1, 2], 25, 252.0702958711276],
    [[[86, 66], [75, 72], [99, 88], [11, 44], [14, 74], [46, 57], [26, 51], [25, 73], [95, 2]], [0, 7, 6, 1, 7, 2, 4, 4, 8], 16, 427.21418429334915],
    [[[49, 37], [78, 1], [45, 36], [18, 61], [71, 35], [17, 11], [95, 71], [37, 89], [15, 8]], [0, 7, 8, 3, 9, 7, 3, 5, 8], 20, 385.24394037974747],
  ];
  cases.forEach(([xy, dem, cap, opt], k) => {
    const inst = make(xy, dem, cap), ex = V.exact(inst), h = V.heuristic(inst);
    const covers = (s) => s.routes.flat().sort((a, b) => a - b).join() === [...Array(xy.length - 1).keys()].map((i) => i + 1).join() && s.loads.every((l) => l <= cap);
    check(`vrp: instance ${k + 1}: exact optimum ${opt.toFixed(4)} equals the scipy MILP; heuristic is feasible and not shorter`, near(ex.length, opt) && covers(ex) && covers(h.improved) && h.improved.length >= ex.length - 1e-9 && h.improved.length <= h.savings.length + 1e-9);
  });
  const rows = V.EXAMPLE.split('\n').slice(1).map((l) => l.split(',')), xy = rows.map((r) => [+r[1], +r[2]]), dem = rows.map((r) => +r[3]);
  { const inst = { ...make(xy, dem, 15, 3), names: rows.map((r) => r[0]) }, ex = V.exact(inst), h = V.heuristic(inst);
    check('vrp: example: 3 routes, 404.12 (exact, equal to the scipy MILP; savings and the improved heuristic find the same)', near(ex.length, 404.12288357907835) && ex.routes.length === 3 && near(h.improved.length, ex.length) && near(h.savings.length, ex.length));
    check('vrp: example: two vehicles cannot carry 37 crates of capacity 15', V.exact({ ...inst, vehicles: 2 }) === null); }
  { const inst = make([[0, 0], [10, 0], [-10, 0], [0, 10]], [0, 5, 5, 5], 10, 0), s = V.savings(inst);
    check('vrp: savings respects capacity (loads of 10 max)', s.every((r) => r.reduce((t, i) => t + inst.demand[i], 0) <= 10)); }
  { const d = V.euclid([[0, 0], [1, 0], [2, 1], [1, 1], [0, 2]]), r = V.twoOpt(d, [1, 2, 3, 4]);
    check('vrp: 2-opt never lengthens a route', V.routeLength(d, r) <= V.routeLength(d, [1, 2, 3, 4]) + 1e-12); }
  check('vrp: a demand above capacity is refused with the place named', (() => { try { V.heuristic(make([[0, 0], [1, 1]], [0, 9], 5)); return false; } catch (e) { return e.message.startsWith('C1 needs 9'); } })());
  { const m = V.mds([[0, 3, 4], [3, 0, 5], [4, 5, 0]]), dd = (a, b) => Math.hypot(m[a][0] - m[b][0], m[a][1] - m[b][1]);
    check('vrp: picture from distances keeps a 3-4-5 triangle exact', near(dd(0, 1), 3, 1e-6) && near(dd(0, 2), 4, 1e-6) && near(dd(1, 2), 5, 1e-6)); }
  { let s = 7; const r = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
    const pts = Array.from({ length: 101 }, () => [r() * 100, r() * 100]), inst = make(pts, [0, ...Array.from({ length: 100 }, () => 1 + Math.floor(r() * 9))], 40), h = V.heuristic(inst);
    check('vrp: 100 customers: every customer served once, loads fit, improvement never worse than savings', h.improved.routes.flat().sort((a, b) => a - b).every((v, i) => v === i + 1) && h.improved.loads.every((l) => l <= 40) && h.improved.length <= h.savings.length + 1e-9); }
};
