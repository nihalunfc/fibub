// #578 entropy-calculator maths. Reference numbers from scipy 1.x (scipy.stats.entropy, scipy.spatial.distance
// .jensenshannon), scikit-learn mutual_info_score, and channel capacities from scipy.optimize (Nelder-Mead
// maximisation of I(X;Y) over the input simplex, 20 random starts), independent of Blahut-Arimoto.
import { entropy, summarise, countSymbols, byteCounts, joint, divergence, bscCapacity, becCapacity, zCapacity, channelInfo, channelMatrix, blahutArimoto, readDist, readTable, h2, EXAMPLE_TEXT } from '../../src/lib/sci/entropy.ts';

export default async (check) => {
  const near = (name, a, b, tol = 1e-9) => check(`entropy: ${name} (${a} vs ${b})`, Math.abs(a - b) <= tol);
  near('H(1/2,1/4,1/8,1/8) bits', entropy([0.5, 0.25, 0.125, 0.125]), 1.75);
  near('same in nats', entropy([0.5, 0.25, 0.125, 0.125], Math.E), 1.2130075659799042);
  near('same in hartleys', entropy([0.5, 0.25, 0.125, 0.125], 10), 0.526802492411967);
  near('counts 3,1,1,7,0,2', entropy([3, 1, 1, 7, 0, 2]), 1.9211854965885542);
  const s = summarise([3, 1, 1, 7, 0, 2]);
  near('min-entropy', s.minEntropy, 1.0); near('collision entropy', s.collision, 1.6147098441152081);
  check('entropy: counts flagged as normalised, support 5 of 6', s.normalised && s.support === 5 && s.n === 6);
  near('max entropy log2 6', s.Hmax, Math.log2(6)); near('perplexity 2^H', s.perplexity, 2 ** 1.9211854965885542, 1e-9);
  near('uniform 8 = 3 bits', entropy([1, 1, 1, 1, 1, 1, 1, 1]), 3);
  near('certain = 0', entropy([0, 1, 0]), 0);
  near('binary entropy h(0.11)', h2(0.11), 1 - 0.500084041835472);
  const cv = (m) => [...m.values()];
  near('example text, characters', entropy(cv(countSymbols(EXAMPLE_TEXT, 'char'))), 4.240634426587137);
  check('entropy: example text has 27 distinct characters', countSymbols(EXAMPLE_TEXT, 'char').size === 27);
  near('example text, words', entropy(cv(countSymbols(EXAMPLE_TEXT, 'word'))), 3.6168746059562213);
  const u = 'naïve café — ünïcödé ☃';
  near('unicode characters', entropy(cv(countSymbols(u, 'char'))), 3.6412498004554785);
  near('unicode UTF-8 bytes', entropy(cv(countSymbols(u, 'byte'))), 3.8903195311147822);
  const bytes = new Uint8Array([...Array.from({ length: 768 }, (_, i) => i % 256), ...new TextEncoder().encode('hello')]);
  near('file bytes', entropy(byteCounts(bytes)), 7.998152170522999);
  const j = joint([[40, 5], [20, 15], [2, 18]]);
  near('H(X)', j.Hx, 1.5128876215181606); near('H(Y)', j.Hy, 0.9580420222262995); near('H(X,Y)', j.Hxy, 2.1779828384970448);
  near('H(X|Y)', j.HxGy, 1.2199408162707452); near('H(Y|X)', j.HyGx, 0.6650952169788842); near('I(X;Y) = sklearn', j.I, 0.292946805247415);
  near('independent table I = 0', joint([[1, 2], [2, 4]]).I, 0, 1e-15);
  const d = divergence([0.4, 0.3, 0.2, 0.1], [0.25, 0.25, 0.25, 0.25]);
  near('KL(P||Q)', d.pq, 0.15356065532898477); near('KL(Q||P)', d.qp, 0.17568746970707302);
  near('cross-entropy', d.crossPQ, 2); near('Jensen-Shannon', d.js, 0.040201582346141844);
  const inf = divergence([0.5, 0.5], [1, 0]);
  check('entropy: KL infinite when Q is 0 where P is not', inf.pq === Infinity && inf.infiniteAt[0] === 1 && Number.isFinite(inf.qp));
  near('BSC 0.11', bscCapacity(0.11), 0.500084041835472); near('BEC 0.3', becCapacity(0.3), 0.7);
  near('Z channel 0.5 closed form', zCapacity(0.5), 0.32192809488736235);
  const ba = (W) => blahutArimoto(channelMatrix(W).W);
  const ex = ba([[0.8, 0.1, 0.1], [0.1, 0.8, 0.1], [0, 0.3, 0.7]]);
  near('BA example = scipy optimiser', ex.capacity, 0.6791928677632098, 1e-8);
  near('BA example optimal input p1', ex.px[0], 0.38388282, 1e-6); near('BA example optimal input p3', ex.px[2], 0.40641014, 1e-6);
  check('entropy: BA converged with gap below 1e-12', ex.converged && ex.gap < 1e-11);
  near('BA BSC 0.11 = 1 - h(0.11)', ba([[0.89, 0.11], [0.11, 0.89]]).capacity, 0.500084041835472, 1e-10);
  near('BA BEC 0.3', ba([[0.7, 0.3, 0], [0, 0.3, 0.7]]).capacity, 0.7, 1e-10);
  const z = ba([[1, 0], [0.5, 0.5]]);
  near('BA Z channel', z.capacity, 0.32192809488736235, 1e-9); near('BA Z channel input 0.6', z.px[0], 0.6, 1e-6);
  near('BA 3x4 asymmetric', ba([[0.6, 0.3, 0.1, 0], [0, 0.5, 0.4, 0.1], [0.2, 0.2, 0.2, 0.4]]).capacity, 0.4634203650254936, 1e-8);
  near('BA in nats', blahutArimoto([[0.89, 0.11], [0.11, 0.89]], Math.E).capacity, 0.500084041835472 * Math.LN2, 1e-10);
  near('I(X;Y) with uniform input on BSC', channelInfo([0.5, 0.5], [[0.89, 0.11], [0.11, 0.89]]), 0.500084041835472);
  near('useless channel capacity 0', ba([[0.5, 0.5], [0.5, 0.5]]).capacity, 0, 1e-12);
  check('entropy: channel rows of counts rescaled', channelMatrix([[2, 2], [1, 3]]).rescaled && channelMatrix([[2, 2], [1, 3]]).W[1][1] === 0.75);
  check('entropy: reads fractions and mixed separators', JSON.stringify(readDist('1/2  0.25\n1/8 0.125').values) === '[0.5,0.25,0.125,0.125]');
  check('entropy: comma list', JSON.stringify(readDist('0.5, 0.25, 0.125, 0.125').values) === '[0.5,0.25,0.125,0.125]');
  { const r = readDist('symbol,count\na,5\nb,3\nc,2'); check('entropy: labelled pairs with a header', JSON.stringify(r) === '{"labels":["a","b","c"],"values":[5,3,2]}'); }
  check('entropy: rejects words', (() => { try { readDist('0.5, half'); return false; } catch (e) { return /half/.test(e.message); } })());
  { const t = readTable(',no,yes\nsun,40,5\ncloud,20,15\nrain,2,18'); check('entropy: table with row and column names', JSON.stringify(t.rows) === '[[40,5],[20,15],[2,18]]' && t.rowNames.join() === 'sun,cloud,rain' && t.colNames.join() === 'no,yes'); }
  check('entropy: plain table', JSON.stringify(readTable('1, 2\n# note\n3 , 4').rows) === '[[1,2],[3,4]]');
  check('entropy: rejects negatives', (() => { try { entropy([0.5, -0.5]); return false; } catch { return true; } })());
  check('entropy: ragged joint table rejected', (() => { try { joint([[1, 2], [3]]); return false; } catch (e) { return /same number/.test(e.message); } })());
};
