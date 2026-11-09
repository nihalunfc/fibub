// #1155 HCF and LCM with factor trees. Checked against Python math.gcd and math.lcm for every pair up to 300 and
// hand-worked examples (HCF(96, 404) = 4, LCM = 9696; 360 = 2³ × 3² × 5; Euclid on 455 and 42 gives HCF 7).
import { factorTree, powers, powerText, venn, euclid } from '../../src/lib/sci/hcf-school.ts';

export default async (check) => {
  const leaves = (t) => (t.left ? [...leaves(t.left), ...leaves(t.right)] : [t.n]);
  const nodesOk = (t) => (t.left ? t.left.n * t.right.n === t.n && nodesOk(t.left) && nodesOk(t.right) : true);
  check('tree: 360 splits into 2, 2, 2, 3, 3, 5 and each node is the product of its children', leaves(factorTree(360)).join() === '2,2,2,3,3,5' && nodesOk(factorTree(360)));
  check('tree: a prime is a leaf; 1 is a leaf', !factorTree(97).left && !factorTree(1).left && leaves(factorTree(4)).join() === '2,2');
  check('powers: 360 = 2³ × 3² × 5', JSON.stringify(powers(360)) === '[[2,3],[3,2],[5,1]]' && powerText(360) === '2³ × 3² × 5' && powerText(1024) === '2¹⁰' && powerText(1) === '1');
  const v = venn(96, 404);
  check('venn: 96 and 404 share 2, 2 → HCF 4, LCM 9696', v.both.join() === '2,2' && v.hcf === 4 && v.lcm === 9696 && v.onlyA.join() === '2,2,2,3' && v.onlyB.join() === '101');
  const e = euclid(455, 42);
  check('euclid: 455 = 42 × 10 + 35, 42 = 35 × 1 + 7, 35 = 7 × 5 + 0', e.length === 3 && e[0].q === 10 && e[0].r === 35 && e[1].r === 7 && e[2].b === 7 && e[2].r === 0);
  check('euclid: order does not matter; equal numbers', euclid(42, 455).length === 3 && euclid(12, 12).length === 1 && euclid(12, 12)[0].b === 12);
  // Python: all(gcd and lcm match) for 1 <= a, b <= 300.
  const g = (a, b) => (b ? g(b, a % b) : a);
  let ok = true;
  for (let a = 1; a <= 300; a++) for (let b = 1; b <= 300; b++) { const w = venn(a, b), H = g(a, b); const E = euclid(a, b); if (w.hcf !== H || w.lcm !== (a * b) / H || E.at(-1).b !== H || w.hcf * w.lcm !== a * b) ok = false; }
  check('all pairs up to 300: Venn HCF and LCM, Euclid HCF, and HCF × LCM = a × b', ok);
  // Python: sum(math.lcm(a, b)) and sum(math.gcd(a, b)) over 1 <= a, b <= 300.
  let sl = 0, sg = 0; for (let a = 1; a <= 300; a++) for (let b = 1; b <= 300; b++) { const w = venn(a, b); sl += w.lcm; sg += w.hcf; }
  check('all pairs up to 300: totals match Python math.lcm (1485491616) and math.gcd (336784)', sl === 1485491616 && sg === 336784);
};
