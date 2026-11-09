// #726 IRT item analysis: EM (Bock-Aitkin) results checked against an independent Python fit (b2/irt_check.py):
// scipy BFGS on the marginal likelihood with 61-point Gauss-Hermite (numpy hermegauss), SEs from a
// finite-difference Hessian of the log-likelihood, EAP from the same posterior. Data: simulated 2PL, 300 × 8.
import { readFileSync } from 'node:fs';
import { quadrature, fitIrt, icc, info, compareModels, chi2Sf } from '../../src/lib/sci/irt.ts';

const REF = {"1pl": {"a": [1.107756433344551, 1.107756433344551, 1.107756433344551, 1.107756433344551, 1.107756433344551, 1.107756433344551, 1.107756433344551, 1.107756433344551], "b": [-1.0575031948258404, -1.0757427289072659, -0.6319394455304447, 0.014705193109610054, 0.3948559112458416, 0.5356010163808563, 1.366019340195384, 1.7003960556080413], "seA": [0.086654439665723, 0.086654439665723, 0.086654439665723, 0.086654439665723, 0.086654439665723, 0.086654439665723, 0.086654439665723, 0.086654439665723], "seB": [0.15457149492996047, 0.15537947366914862, 0.13925757936130986, 0.1303622607201977, 0.13386492905078134, 0.13677370647326673, 0.16980741889452655, 0.18999177341714626], "ll": -1382.5588529991362, "eap": [-1.6219924393812937, -1.6219924393812937, -1.6219924393812937, 0.4868999730173056, 0.8921681573885336], "psd": [0.6798726365296703, 0.6798726365296703, 0.6798726365296703, 0.599106286864173, 0.6121355983216477]}, "2pl": {"a": [0.4950859132950637, 1.579842127933246, 1.460318373434884, 1.4195632736181614, 1.4923105048322072, 0.7076648554668734, 1.2648799702577491, 0.8787262307064888], "b": [-2.011614329097537, -0.8716038635058795, -0.5331171780239016, 0.01531920919859301, 0.3334246338267001, 0.7476721626977424, 1.2549418216222452, 2.0093346311672833], "seA": [0.17689681921680112, 0.338528443830012, 0.2982105083514757, 0.2819727407162148, 0.3008411187424341, 0.18240757065082103, 0.2927048690461527, 0.24314069807824973], "seB": [0.7033083522036349, 0.1510694345280601, 0.12892590740314436, 0.11218586441907928, 0.11603829940294473, 0.24365303548935605, 0.22651304330652447, 0.4690084627099616], "ll": -1371.781239819459, "eap": [-1.5624496657815485, -1.5624496657815485, -1.5624496657815485, 0.37536626868847045, 0.6000986711177819], "psd": [0.6668267792329491, 0.6668267792329491, 0.6668267792329491, 0.5682328929625068, 0.5794432360906405]}};

export default async (check) => {
  const U = readFileSync(new URL('../fixtures/irt-item-analysis.tsv', import.meta.url), 'utf8').trim().split('\n').slice(1).map((l) => l.split('\t').map(Number));
  const Q = quadrature(41);
  const m = (f) => Q.x.reduce((s, x, i) => s + Q.w[i] * f(x), 0);
  check('irt: quadrature integrates the normal moments', Math.abs(m(() => 1) - 1) < 1e-13 && Math.abs(m((x) => x)) < 1e-13 && Math.abs(m((x) => x * x) - 1) < 1e-12 && Math.abs(m((x) => x ** 4) - 3) < 1e-11 && Math.abs(m((x) => x ** 8) - 105) < 1e-8);
  const worst = (a, b) => Math.max(...a.map((x, i) => Math.abs(x - b[i])));
  const rel = (a, b) => Math.max(...a.map((x, i) => Math.abs(x / b[i] - 1)));
  for (const model of ['1pl', '2pl']) {
    const f = fitIrt(U, model), R = REF[model];
    check(`irt: ${model} converged`, f.converged);
    check(`irt: ${model} log-likelihood (${f.logLik} vs ${R.ll})`, Math.abs(f.logLik - R.ll) < 1e-6);
    check(`irt: ${model} a and b match scipy (${worst(f.items.map((x) => x.a), R.a).toExponential(1)}, ${worst(f.items.map((x) => x.b), R.b).toExponential(1)})`, worst(f.items.map((x) => x.a), R.a) < 1e-5 && worst(f.items.map((x) => x.b), R.b) < 1e-5);
    check(`irt: ${model} standard errors (${rel(f.items.map((x) => x.seA), R.seA).toExponential(1)}, ${rel(f.items.map((x) => x.seB), R.seB).toExponential(1)})`, rel(f.items.map((x) => x.seA), R.seA) < 1e-4 && rel(f.items.map((x) => x.seB), R.seB) < 1e-4);
    check(`irt: ${model} EAP scores`, worst(f.theta.slice(0, 5), R.eap) < 1e-6 && worst(f.thetaSE.slice(0, 5), R.psd) < 1e-6);
    check(`irt: ${model} AIC and BIC`, Math.abs(f.aic - (-2 * f.logLik + 2 * f.nPar)) < 1e-9 && f.nPar === (model === '2pl' ? 16 : 9) && Math.abs(f.bic - (-2 * f.logLik + f.nPar * Math.log(300))) < 1e-9);
  }
  const m1 = fitIrt(U, '1pl'), m2 = fitIrt(U, '2pl'), lr = compareModels(m1, m2);
  check('irt: likelihood-ratio test', lr.df === 7 && Math.abs(lr.chi2 - 2 * (REF['2pl'].ll - REF['1pl'].ll)) < 2e-4 && lr.p > 0 && lr.p < 0.01);
  check('irt: chi-square tail (scipy)', Math.abs(chi2Sf(14.067140449340169, 7) - 0.05) < 1e-12);
  check('irt: curves', Math.abs(icc({ a: 1.5, b: 0.5 }, 0.5) - 0.5) < 1e-15 && Math.abs(info({ a: 2, b: 0 }, 0) - 1) < 1e-15);
  // Missing answers are skipped, not scored wrong.
  const V = U.map((r, i) => (i % 7 === 0 ? r.map((v, j) => (j === 2 ? NaN : v)) : r));
  const fm = fitIrt(V, '2pl');
  check('irt: missing answers are allowed', fm.converged && fm.items[2].n === 300 - 43 && Math.abs(fm.items[4].a - m2.items[4].a) < 0.2);
  check('irt: item everyone got right is refused', (() => { try { fitIrt(U.map((r) => [...r, 1]), '2pl'); return false; } catch (e) { return /everyone/.test(e.message); } })());
};
