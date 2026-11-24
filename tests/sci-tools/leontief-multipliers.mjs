// Input-output (Leontief) model: checked against NumPy (numpy.linalg.inv and matrix products) on the made-up
// 3-sector example and a random 5-sector table.
import { model, impact, satellite, productive, inverse } from '../../src/lib/sci/leontief.ts';

const REF = {"x":[100.0,250.0,250.0],"A":[[0.15,0.16,0.04],[0.2,0.24,0.18],[0.1,0.12,0.2]],"L":[[1.2584771224997853,0.2850030045497468,0.12704953214868228],[0.38200703923083523,1.4507683062923857,0.34552322087732845],[0.21461069619709847,0.25324062151257615,1.3177096746501844]],"mult":[1.8550948579277189,1.9890119323547089,1.7902824276761953],"back":[0.9877352022548943,1.059038622686067,0.9532261750590385],"fwd":[0.8894644625580862,1.1598232650262816,0.9507122724156317],"va":[55.0,120.0,145.0],"dx":[2.8500300454974683,14.507683062923856,2.5324062151257616],"w":{"coef":[0.3,0.24,0.4],"simple":[0.5550691046441754,0.534981543480127,0.6481243025152373],"typeI":[1.850230348813918,2.2290897645005296,1.6203107562880932]},"jobs":{"coef":[0.12,0.032,0.08],"simple":[0.18041033565112882,0.10088419606833206,0.13171946089793113],"typeI":[1.503419463759407,3.152631127135377,1.646493261224139]},"Z5":[[4.282458357181218,11.840525329804985,40.06372326031985,29.10810180321839,4.706432112019959],[21.65634701182369,23.9525649070417,7.986945731853928,36.728857570460725,5.6836009960701706],[19.5614095247831,25.837009131068182,21.53140102070889,29.339928571907038,36.89188936460801],[47.81336274180493,14.210058187439573,32.427360353991254,34.81079983350777,14.636037450624356],[0.07450417544180854,48.673013738320634,14.920061150843782,15.69930010171684,44.58555352225786]],"f5":[125.32932918036344,104.83573973272965,159.18986173678695,25.462281379244814,147.25371721801224],"L5":[[1.1355698571533304,0.15942194239312907,0.21894904506718177,0.34692132900318856,0.08563021619462492],[0.23320932513877132,1.2262631234250188,0.125829073340657,0.4223589843967807,0.08335918550021777],[0.23291344066732325,0.28557767691488384,1.1846754342071426,0.41369602550137763,0.23157244873981617],[0.3791225859507204,0.220646155103727,0.2470627958590328,1.4721980693382812,0.14870730801183568],[0.12438914255408712,0.3976272281086818,0.13634610084829435,0.3112219842992283,1.2515925731466189]]};

export default async (check) => {
  const close = (a, b, t = 1e-10) => a.length === b.length && a.every((v, i) => (Array.isArray(v) ? close(v, b[i], t) : Math.abs(v - b[i]) <= t * Math.max(1, Math.abs(b[i]))));
  const Z = [[15, 40, 10], [20, 60, 45], [10, 30, 50]], f = [35, 125, 160];
  const io = model(Z, f);
  check('leontief: total output = row sums + final demand', close(io.x, REF.x));
  check('leontief: technical coefficients A match NumPy', close(io.A, REF.A));
  check('leontief: Leontief inverse matches numpy.linalg.inv', close(io.L, REF.L));
  check('leontief: output multipliers (column sums) 1.8551, 1.9890, 1.7903', close(io.multipliers, REF.mult));
  check('leontief: backward and forward linkages', close(io.backward, REF.back) && close(io.forward, REF.fwd));
  check('leontief: value added = output − inputs bought', close(io.valueAdded, REF.va));
  check('leontief: impact of +10 final demand for sector 2', close(impact(io, [0, 10, 0]), REF.dx));
  const w = satellite(io, [30, 60, 100]), j = satellite(io, [12, 8, 20]);
  check('leontief: income coefficients, simple and Type I multipliers', close(w.coef, REF.w.coef) && close(w.simple, REF.w.simple) && close(w.typeI, REF.w.typeI));
  check('leontief: employment Type I multipliers', close(j.typeI, REF.jobs.typeI) && close(j.simple, REF.jobs.simple));
  check('leontief: example table is productive', productive(io).ok);
  check('leontief: given total output gives the same model', close(model(Z, null, REF.x).L, REF.L));
  check('leontief: random 5-sector table matches NumPy', close(model(REF.Z5, REF.f5).L, REF.L5, 1e-9));
  // Blog article coal-phase-out-regional-output-multipliers-leontief-inverse: the two-sector table rebuilt from
  // Table 2 of doi:10.3389/frsus.2026.1811466 must give back the paper's coal-power column.
  const Zc = [[180807, 530057], [716093, 1584479]], fc = [629922, 3000000];
  const ioc = model(Zc, fc), dxc = impact(ioc, [629922, 0]), jc = satellite(ioc, [2220, 5490]);
  check('leontief: rebuilt coal-power column, multiplier 2.233056 and inverse 1.267479 / 0.965577', close([ioc.multipliers[0], ioc.L[0][0], ioc.L[1][0]], [2.2330561957509985, 1.2674791289034169, 0.9655770668475816]));
  check('leontief: rebuilt shock gives the paper 798,413 + 608,238 of output and 1,952 jobs', close(dxc, [798412.9878370982, 608238.2371027623]) && Math.abs(dxc.reduce((t, v, i) => t + v * jc.coef[i], 0) - 1951.9434962560563) < 1e-9 && Math.abs(jc.typeI[0] - 1.8714876157348153) < 1e-12);
  check('leontief: singular I − A is caught', inverse([[1, 2], [2, 4]]) === null && (() => { try { model([[1, 0], [0, 0]], null, [1, 1]); return false; } catch { return true; } })());
};
