// #570 confusion matrix: metrics checked against scikit-learn 1.9 (confusion_matrix, precision_recall_fscore_support
// per class and macro/micro/weighted with zero_division=0, accuracy_score, balanced_accuracy_score, matthews_corrcoef,
// cohen_kappa_score) and statsmodels 0.14 (cohens_kappa std_kappa; proportion_confint method='wilson').
// Cases: the tool's 3-class example, its spam/ham pairs, a binary table, and a random 4-class set (numpy seed 5,
// 300 rows) in which class 3 is never predicted.
import { metrics, fromPairs, binary, parseMatrix, wilson, sortLabels, EXAMPLE_MATRIX, EXAMPLE_PAIRS } from '../../src/lib/sci/confusion.ts';
import { readTable } from '../../src/lib/sci/dataset.ts';
import { parseCsv } from '../../src/lib/convert/table.ts';

const REF = {"matrix":{"m":[[42,6,2],[8,37,5],[1,4,25]],"precision":[0.8235294117647058,0.7872340425531915,0.78125],"recall":[0.84,0.74,0.8333333333333334],"f1":[0.8316831683168316,0.7628865979381443,0.8064516129032258],"support":[50,50,30],"accuracy":0.8,"balanced":0.8044444444444445,"mcc":0.6942838996045394,"kappa":0.693840579710145,"macro":[0.7973378181059658,0.8044444444444445,0.8003404597194006],"micro":[0.8,0.8,0.8],"weighted":[0.799812867045345,0.8,0.7994002823065043],"kappa_se":0.05388041413823585,"acc_ci":[0.723078551876637,0.8597005114067041],"rec_ci":[[0.7148578393696499,0.9166257932196658],[0.6044684273515116,0.841284725064476],[0.6643564949358397,0.9266345762815146]]},"rand4":{"m":[[53,11,12,0],[8,64,7,0],[8,5,57,0],[5,8,14,48]],"precision":[0.7162162162162162,0.7272727272727273,0.6333333333333333,1],"recall":[0.6973684210526315,0.810126582278481,0.8142857142857143,0.64],"f1":[0.7066666666666667,0.7664670658682635,0.7125,0.7804878048780488],"support":[76,79,70,75],"accuracy":0.74,"balanced":0.7404451794042067,"mcc":0.6594055632314593,"kappa":0.653456548782655,"macro":[0.7692055692055693,0.7404451794042067,0.7415303843532448],"micro":[0.74,0.74,0.74],"weighted":[0.7707343707343707,0.74,0.7422305007870438],"kappa_se":0.033518877427932345,"acc_ci":[0.6875519770721528,0.7863793967400652],"rec_ci":[[0.5866579842518126,0.7890866532224751],[0.7100735815818702,0.8814176922024057],[0.7077442179325668,0.8881269999809798],[0.5270066131909779,0.7393507109138366]]},"rand4_pairs":[[2,3,0,3,1,2,2,1,3,0,1,1,2,1,0,0,0,0,0,3,0,2,3,0,1,1,1,3,0,3,3,3,0,1,2,1,2,2,2,0,3,2,3,1,1,3,0,0,1,2,0,3,1,0,2,3,3,3,1,0,3,2,3,0,0,2,1,1,3,0,2,1,1,3,0,1,0,0,1,2,2,1,0,3,3,0,0,1,0,3,2,2,1,2,3,0,3,0,1,3,3,0,3,3,1,1,3,3,2,1,0,3,1,2,2,0,1,2,0,2,3,2,2,1,3,0,1,2,2,0,0,2,3,2,3,1,1,3,0,0,0,1,0,3,3,1,0,2,0,2,0,3,2,3,2,2,1,3,0,0,1,2,1,3,3,1,1,2,2,1,2,3,2,1,1,1,0,0,3,1,1,2,2,3,2,3,2,1,1,3,2,0,3,3,0,0,2,1,1,0,0,3,3,3,2,0,1,2,3,1,2,1,2,2,2,0,3,3,3,1,1,1,1,0,2,0,3,0,2,1,0,3,1,3,0,1,1,1,0,2,1,3,0,1,0,3,2,1,3,2,3,2,2,2,0,2,3,2,1,0,2,0,3,0,1,0,2,0,1,0,3,0,0,2,0,3,3,1,1,1,2,1,1,2,0,3,1,3,1,1,3,2,0,1,0,3,1,0,2,3],[2,1,0,3,1,2,2,1,3,1,1,1,2,1,0,0,0,0,1,3,0,0,3,0,1,2,1,3,0,3,3,3,2,1,1,1,2,2,2,0,3,2,3,1,2,3,1,0,1,2,0,2,1,0,2,3,3,3,1,0,2,2,1,2,0,0,1,1,3,2,2,1,0,2,0,1,2,0,0,2,2,1,0,3,3,0,0,1,0,3,2,2,1,0,3,0,2,0,1,1,0,0,3,3,0,2,3,3,2,1,2,0,1,2,2,0,1,0,0,2,3,2,0,1,3,1,1,1,2,0,2,2,1,2,1,1,1,2,0,0,0,1,1,3,2,1,1,2,2,2,2,3,2,3,2,2,1,1,0,0,1,2,1,0,2,1,0,2,2,1,2,2,2,1,1,1,0,1,3,1,1,0,2,0,2,3,2,1,1,3,2,0,3,3,2,2,1,2,1,0,0,3,0,3,2,1,1,2,2,1,2,1,2,2,2,0,3,3,2,1,0,1,1,0,2,0,2,2,2,1,0,1,0,3,0,2,0,1,0,2,1,3,0,1,0,3,1,1,2,2,3,2,2,2,0,0,2,2,1,0,2,0,3,0,0,1,2,0,1,0,2,0,2,2,1,3,3,1,1,2,2,1,1,2,1,3,1,3,1,1,3,1,0,1,0,3,2,0,0,1]],"bin":{"m":[[42,8],[6,44]],"precision":[0.875,0.8461538461538461],"recall":[0.84,0.88],"f1":[0.8571428571428571,0.8627450980392157],"support":[50,50],"accuracy":0.86,"balanced":0.86,"mcc":0.7205766921228921,"kappa":0.72,"macro":[0.8605769230769231,0.86,0.8599439775910365],"micro":[0.86,0.86,0.86],"weighted":[0.860576923076923,0.86,0.8599439775910364],"kappa_se":0.06934186614160309,"acc_ci":[0.7786281178903616,0.9147365634006086],"rec_ci":[[0.7148578393696499,0.9166257932196658],[0.7619518261679701,0.9438239984906771]]},"bin_ci":{"sens":[0.7148578393696499,0.9166257932196658],"spec":[0.7619518261679701,0.9438239984906771],"ppv":[0.7529954171361316,0.9414294856142803],"npv":[0.7247591482358985,0.9199231498321968]},"pairs":{"m":[[9,2],[2,7]],"precision":[0.8181818181818182,0.7777777777777778],"recall":[0.8181818181818182,0.7777777777777778],"f1":[0.8181818181818182,0.7777777777777778],"support":[11,9],"accuracy":0.8,"balanced":0.797979797979798,"mcc":0.5959595959595959,"kappa":0.595959595959596,"macro":[0.797979797979798,0.797979797979798,0.797979797979798],"micro":[0.8,0.8,0.8],"weighted":[0.8,0.8,0.8],"kappa_se":0.18050790652119023,"acc_ci":[0.5839825677481064,0.919342337420202],"rec_ci":[[0.5230194380391557,0.9486323102539149],[0.45258896910698887,0.9367748928821533]]}};

export default async (check) => {
  const close = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const same = (M, r, name) => {
    const bad = [];
    if (JSON.stringify(M.m) !== JSON.stringify(r.m)) bad.push('matrix');
    M.classes.forEach((c, i) => { for (const k of ['precision', 'recall', 'f1']) if (!close(c[k], r[k][i])) bad.push(k + i); if (c.support !== r.support[i]) bad.push('support' + i); });
    for (const [k, rk] of [['accuracy', 'accuracy'], ['balancedAccuracy', 'balanced'], ['mcc', 'mcc'], ['kappa', 'kappa']]) if (!close(M[k], r[rk])) bad.push(k + ' ' + M[k] + ' vs ' + r[rk]);
    for (const av of ['macro', 'micro', 'weighted']) ['precision', 'recall', 'f1'].forEach((k, j) => { if (!close(M[av][k], r[av][j])) bad.push(av + ' ' + k); });
    if (!close(M.kappaSE, r.kappa_se, 1e-9)) bad.push('kappa SE ' + M.kappaSE + ' vs ' + r.kappa_se);
    if (!close(M.accuracyCI[0], r.acc_ci[0], 1e-9) || !close(M.accuracyCI[1], r.acc_ci[1], 1e-9)) bad.push('accuracy CI');
    M.classes.forEach((c, i) => { if (!close(c.recallCI[0], r.rec_ci[i][0], 1e-9) || !close(c.recallCI[1], r.rec_ci[i][1], 1e-9)) bad.push('recall CI' + i); });
    check(`confusion-matrix: ${name}: matrix, per-class P/R/F1, macro/micro/weighted, accuracy, balanced accuracy, MCC, kappa and its SE, Wilson CIs as sklearn/statsmodels ${bad.join('; ')}`, !bad.length);
  };
  const ex = parseMatrix(parseCsv(EXAMPLE_MATRIX));
  check('confusion-matrix: example matrix parsed with class names', ex.labels.join() === 'cat,dog,rabbit' && JSON.stringify(ex.m) === JSON.stringify(REF.matrix.m));
  same(metrics(ex.labels, ex.m), REF.matrix, '3-class example');
  const t = readTable(EXAMPLE_PAIRS), P = fromPairs(t.rows.map((r) => r[0]), t.rows.map((r) => r[1]));
  same(metrics(P.labels, P.m), REF.pairs, 'spam/ham pairs');
  const [y, p] = REF.rand4_pairs, R = fromPairs(y.map(String), p.map(String));
  same(metrics(R.labels, R.m), REF.rand4, 'random 4 classes, one never predicted');
  same(metrics(['0', '1'], [[42, 8], [6, 44]]), REF.bin, 'binary table');
  const b = binary(44, 6, 8, 42); // positive class = 1: TP 44, FN 6, FP 8, TN 42
  const ci = REF.bin_ci;
  check('confusion-matrix: binary sensitivity, specificity, PPV, NPV with Wilson CIs as statsmodels', close(b.sensitivity, 44 / 50) && close(b.specificity, 42 / 50) && close(b.ppv, 44 / 52) && close(b.npv, 42 / 48)
    && close(b.sensitivityCI[0], ci.spec[0], 1e-9) && close(b.specificityCI[1], ci.sens[1], 1e-9) && close(b.ppvCI[0], ci.npv[0], 1e-9) && close(b.npvCI[1], ci.ppv[1], 1e-9));
  check('confusion-matrix: binary LR+, LR−, Youden, F1 by hand (0.88/0.16 = 5.5; 0.12/0.84; 0.72; 88/102)', close(b.lrPlus, 5.5) && close(b.lrMinus, 0.12 / 0.84) && close(b.youden, 0.72) && close(b.f1, 88 / 102));
  check('confusion-matrix: Wilson interval 0 of 10 (0, 0.2775) as statsmodels', close(wilson(0, 10)[0], 0) && close(wilson(0, 10)[1], 0.27753279986288106, 1e-9));
  check('confusion-matrix: labels sorted like sklearn (2 < 10 for numbers, text A-Z)', sortLabels(['10', '2', '1']).join() === '1,2,10' && sortLabels(['b', 'B', 'a']).join() === 'B,a,b');
  let msg = ''; try { metrics(['a', 'b'], [[1, 2], [3]]); } catch (e) { msg = e.message; }
  check('confusion-matrix: a ragged matrix is refused', msg.includes('square'));
  msg = ''; try { parseMatrix([['1', '2'], ['3', 'x']]); } catch (e) { msg = e.message; }
  check('confusion-matrix: a non-number cell is refused', msg.includes('count'));
  const plain = parseMatrix([['5', '1'], ['2', '7']]);
  check('confusion-matrix: matrix without names gets Class 1, Class 2', plain.labels.join() === 'Class 1,Class 2');
};
