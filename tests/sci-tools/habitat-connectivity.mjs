// #511 Habitat connectivity. On the made-up example: patches matched scipy.ndimage.label with 8-connectivity; all
// least-cost distances matched scikit-image's MCP_Geometric (fully connected, sampling = cell size) exactly;
// IIC, PC, dIIC and dPC matched networkx (all_pairs_shortest_path_length on the link graph, Dijkstra on −ln p for
// p*) to 1e-12, at thresholds 1500, 5000 and 9000 with p = 0.5 and 0.2; the drawn path's cost was re-added cell by cell.
import { findPatches, costDistance, patchDistances, leastCostPath, components, indices, importance, exampleLandscape, DEFAULT_CLASSES } from '../../src/lib/sci/connectivity.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  // Cost distance by hand: a straight step costs its length × mean resistance; a diagonal √2 × that.
  const res = Float64Array.from([1, 3, 5, 1, 1, 1, 1, 1, 1]);
  const { cost } = costDistance(3, 3, res, [0], 10);
  check('hc: step costs length × mean resistance', near(cost[1], 10 * 2) && near(cost[3], 10) && near(cost[4], 10 * Math.SQRT2) && near(cost[8], 2 * 10 * Math.SQRT2));
  check('hc: cheaper detour beats a straight costly line', near(cost[2], 10 * Math.SQRT2 + 10 + 10 * 3) && cost[2] < 20 + 10 * 4);
  // Patches, 8-connected, minimum size.
  const mk = (rows, cell = 100) => ({ w: rows[0].length, h: rows.length, cls: Int32Array.from(rows.join('').split('').map(Number)), classes: [{ code: 0, name: 'm', habitat: false, resistance: 1, colour: '#fff' }, { code: 1, name: 'h', habitat: true, resistance: 1, colour: '#000' }], cell });
  const L1 = mk(['1100', '0010', '0000', '0001']);
  check('hc: diagonal cells join one patch; areas in ha', findPatches(L1).patches.length === 2 && findPatches(L1).patches[0].area === 3 && findPatches(L1, 2).patches.length === 1);
  check('hc: components', components(4, [[0, 1], [2, 3]]).join() === '0,0,1,1' && components(3, []).join() === '0,1,2');
  // One patch filling the landscape: IIC = PC = 1.
  const one = indices([5], [[0]], 100, 0.5, 5);
  check('hc: one patch covering everything gives IIC = PC = 1', near(one.iic, 1) && near(one.pc, 1));
  // Two patches of area 1 in a landscape of 4: linked at distance d ≤ threshold.
  const two = indices([1, 1], [[0, 50], [50, 0]], 100, 0.5, 4);
  check('hc: two linked patches by hand', near(two.iic, (1 + 1 + 2 * 0.5) / 16) && near(two.pc, (2 + 2 * Math.exp(Math.log(0.5) * 50 / 100)) / 16));
  const apart = indices([1, 1], [[0, 150], [150, 0]], 100, 0.5, 4);
  check('hc: unlinked pair adds nothing to IIC but some to PC', near(apart.iic, 2 / 16) && near(apart.pc, (2 + 2 * 0.5 ** 1.5) / 16));
  // A stepping stone: PC uses the best path through it.
  const step3 = indices([1, 1, 1], [[0, 100, 200], [100, 0, 100], [200, 100, 0]], 100, 0.5, 3);
  check('hc: stepping stone (IIC counts 2 links; PC multiplies probabilities)', near(step3.iic, (3 + 4 * 0.5 + 2 / 3) / 9) && near(step3.pc, (3 + 4 * 0.5 + 2 * 0.25) / 9));
  // Example: skimage and networkx values.
  const L = exampleLandscape(), { patches } = findPatches(L), D = patchDistances(L, patches);
  check('hc: example has 8 patches', patches.length === 8 && patches.map((p) => p.area).join() === '63,23,32,9,68,63,21,33');
  check('hc: example distances (skimage MCP_Geometric)', near(D[0][1], 1348.528137423857) && near(D[4][5], 3262.741699796952) && near(D[6][7], 3969.8484809834995) && near(D[0][7], 24621, 1e-4));
  const AL = (L.w * L.h * L.cell * L.cell) / 1e4;
  const imp = importance(patches.map((p) => p.area), D, 5000, 0.5, AL);
  check('hc: example IIC and PC (networkx)', near(imp.all.iic, 0.009389241536458334, 1e-12) && near(imp.all.pc, 0.015221964749139748, 1e-12));
  check('hc: example dPC (networkx)', [30.141723, 12.839008, 8.737191, 4.325212, 42.949608, 37.188937, 10.410828, 11.222702].every((v, i) => near(imp.dPC[i], v, 1e-6)));
  check('hc: example dIIC (networkx)', [24.458288, 8.929216, 4.622607, 0.365655, 40.213073, 37.25623, 5.119177, 8.04442].every((v, i) => near(imp.dIIC[i], v, 1e-6)));
  const links = []; for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) if (D[i][j] <= 5000) links.push([i, j]);
  check('hc: example components at 5000', new Set(components(8, links)).size === 5);
  const p = leastCostPath(L, patches[0], patches[4]);
  check('hc: least-cost path ends in the target patch and costs the distance', near(p.cost, D[0][4], 1e-12) && patches[0].cells.includes(p.cells[0]) && patches[4].cells.includes(p.cells[p.cells.length - 1]));
  check('hc: default classes', DEFAULT_CLASSES.length === 6 && DEFAULT_CLASSES.filter((c) => c.habitat).length === 1);
};
