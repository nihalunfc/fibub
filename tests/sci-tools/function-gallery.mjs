// #1369 function gallery. Values of [x] and signum checked against Python's math.floor and numpy.sign; domains of
// f/g checked by hand (zeros of g found with numpy.roots); combine() against direct arithmetic.
import * as G from '../../src/lib/sci/school-fgallery.ts';
export default async (check) => {
  const gifCases = [[2.7, 2], [-2.7, -3], [3, 3], [-3, -3], [0.0, 0], [-0.1, -1], [4.999, 4]];
  check('gallery: [x] = math.floor for 7 values', gifCases.every(([x, y]) => G.gif(x) === y));
  check('gallery: [0.1 + 0.2 + 0.7] = 1 despite rounding', G.gif(0.1 + 0.2 + 0.7) === 1);
  check('gallery: signum -5, 0, 7', G.sgn(-5) === -1 && G.sgn(0) === 0 && G.sgn(7) === 1);
  check('gallery: 11 functions, unique ids', G.GALLERY.length === 11 && new Set(G.GALLERY.map((g) => g.id)).size === 11);
  check('gallery: 1/x not defined at 0, √x not defined at −1, log at 0', Number.isNaN(G.at(G.gfn('reciprocal'), 0)) && Number.isNaN(G.at(G.gfn('sqrt'), -1)) && Number.isNaN(G.at(G.gfn('log'), 0)));
  check('gallery: log₂ 8 = 3, 2^-1 = 0.5', G.at(G.gfn('log'), 8) === 3 && G.at(G.gfn('exp'), -1) === 0.5);
  const sq = { kind: 'sq', a: 1, b: 0 }, lin = { kind: 'lin', a: 1, b: -1 }, rt = { kind: 'sqrt', a: 1, b: 0 }, rec = { kind: 'rec', a: 1, b: 0 };
  check('gallery: part text', G.partText(sq) === 'x²' && G.partText(lin) === 'x − 1' && G.partText({ kind: 'lin', a: -2, b: 3 }) === '−2x + 3' && G.partText({ kind: 'rec', a: 2, b: 0 }) === '2/x');
  const f = G.partFn(sq), g = G.partFn(lin);
  check('gallery: (f+g)(3) = 11, (f−g)(3) = 7, (fg)(3) = 18, (f/g)(3) = 4.5', G.combine('+', f, g)(3) === 11 && G.combine('-', f, g)(3) === 7 && G.combine('*', f, g)(3) === 18 && G.combine('/', f, g)(3) === 4.5);
  check('gallery: f/g undefined where g = 0', Number.isNaN(G.combine('/', f, g)(1)));
  check('gallery: domain of x²/(x − 1) is R − {1}', G.combinedDomain('/', sq, lin) === 'R − {1}');
  check('gallery: domain of x² + (x − 1) is R', G.combinedDomain('+', sq, lin) === 'R');
  check('gallery: domain of √x + 1/x is (0, ∞)', G.combinedDomain('+', rt, rec) === '(0, ∞)');
  check('gallery: domain of √x / (x − 1) is [0, ∞) − {1}', G.combinedDomain('/', rt, lin) === '[0, ∞) − {1}');
  check('gallery: domain of (x − 1)/(x² − 4) is R − {−2, 2} (numpy.roots)', G.combinedDomain('/', lin, { kind: 'sq', a: 1, b: -4 }) === 'R − {−2, 2}');
  check('gallery: domain of x/x² is R − {0}', G.combinedDomain('/', { kind: 'lin', a: 1, b: 0 }, sq) === 'R − {0}');
  check('gallery: domain of f/0 is empty', G.combinedDomain('/', sq, { kind: 'lin', a: 0, b: 0 }).startsWith('empty'));
  check('gallery: zeros of x² − 2 are ±√2', (() => { const z = G.zeros((x) => x * x - 2, -5, 5); return z.length === 2 && Math.abs(z[1] - Math.SQRT2) < 1e-9; })());
};
