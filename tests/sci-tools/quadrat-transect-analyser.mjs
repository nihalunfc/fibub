// #302 quadrat and transect analyser: reference values from an independent pandas 2.x groupby calculation
// of the same made-up data (density, frequency, cover, relative values and importance value).
import { quadrats, lineIntercept } from '../../src/lib/sci/quadrat.ts';

const Q = `Q1	Ribwort plantain	6	20
Q1	White clover	12	35
Q1	Daisy	4	5
Q2	Ribwort plantain	3	10
Q2	White clover	20	50
Q2	Dandelion	1	8
Q3	Daisy	9	12
Q3	Creeping buttercup	2	6
Q3	White clover	7	15
Q4	Ribwort plantain	5	15
Q4	Dandelion	2	10
Q5	White clover	15	40
Q5	Daisy	6	8
Q5	Creeping buttercup	4	12
Q6	Ribwort plantain	8	25
Q6	Daisy	3	4
Q7	White clover	10	30
Q7	Dandelion	1	5
Q8	Ribwort plantain	2	5
Q8	Creeping buttercup	3	10`;
const L = `T1	Sagebrush	1.2	0.9
T1	Rabbitbrush	0.6	0.5
T1	Sagebrush	0.8	0.7
T1	Bitterbrush	1.5	1.1
T2	Sagebrush	2.0	1.4
T2	Rabbitbrush	0.4	0.3
T2	Rabbitbrush	0.5	0.4
T3	Sagebrush	1.1	0.8
T3	Bitterbrush	0.9	0.6
T3	Sagebrush	0.7	0.5`;
const recs = (t) => t.split('\n').map((l) => { const [sample, species, a, b] = l.split('\t'); return { sample, species, a: Number(a), b: Number(b) }; });

export default async (check) => {
  const close = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol;
  const q = quadrats(recs(Q), 0.25);
  const wc = q.rows[0], dd = q.rows.find((r) => r.species === 'Dandelion');
  check('quadrat: 8 quadrats, White clover ranks first', q.samples === 8 && wc.species === 'White clover' && q.rows.map((r) => r.species).join(',') === 'White clover,Ribwort plantain,Daisy,Creeping buttercup,Dandelion');
  check('quadrat: White clover density 32 /m², frequency 0.625, cover 21.25 %', close(wc.density, 32) && close(wc.frequency, 0.625) && close(wc.cover, 21.25));
  check('quadrat: White clover RD 52.0325, RF 25, RC 52.3077, IV 129.3402', close(wc.relDensity, 52.03252) && close(wc.relFrequency, 25) && close(wc.relCover, 52.307692) && close(wc.iv, 129.340213));
  check('quadrat: Dandelion IV 25.3290 out of 300', close(dd.iv, 25.328956) && q.ivMax === 300);
  check('quadrat: totals 61.5 /m² and 40.625 % cover', close(q.totalDensity, 61.5) && close(q.totalCover, 40.625));
  const q12 = quadrats(recs(Q), 0.25, 12);
  check('quadrat: 4 extra empty quadrats lower density and frequency, not relative frequency', close(q12.rows[0].density, 64 / 3) && close(q12.rows[0].frequency, 5 / 12) && close(q12.rows[0].relFrequency, 25));
  const counts = quadrats(recs(Q).map((r) => ({ ...r, b: null })), 1);
  check('quadrat: counts only gives IV out of 200', counts.ivMax === 200 && counts.rows[0].relCover === null && close(counts.rows[0].iv, 77.03252));
  const t = lineIntercept(recs(L), 20);
  const sb = t.rows[0], rb = t.rows[1];
  check('transect: Sagebrush first, cover 9.6667 %, frequency 1, density 0.108399 /m²', sb.species === 'Sagebrush' && close(sb.cover, 9.666667) && close(sb.frequency, 1) && close(sb.density, 0.108399));
  check('transect: Sagebrush IV 141.1063, Rabbitbrush RD 46.3153 and IV 90.3506', close(sb.iv, 141.106261) && close(rb.relDensity, 46.315296) && close(rb.iv, 90.350642));
  check('transect: total density 0.281884 /m², cover 16.1667 %', close(t.totalDensity, 0.2818843) && close(t.totalCover, 16.166667));
  // New with the alligator weed article (Sharma and Das 2025, Front. Conserv. Sci. 6: 1615630): four species of
  // site 3 rebuilt on 15 quadrats of 2.25 m2, listing only the 5 quadrats that hold them.
  { const A = `Q1\tAlternanthera philoxeroides\t8\t54.5
Q2\tAlternanthera philoxeroides\t8\t54.5
Q3\tAlternanthera philoxeroides\t8\t54.5
Q4\tAlternanthera philoxeroides\t8\t54.5
Q5\tAlternanthera philoxeroides\t7\t54.5
Q1\tParthenium hysterophorus\t10\t44.9
Q2\tParthenium hysterophorus\t10\t44.9
Q3\tParthenium hysterophorus\t9\t44.9
Q4\tParthenium hysterophorus\t9\t44.9
Q1\tCyperus rotundus\t8\t19.8
Q2\tCyperus rotundus\t7\t19.8
Q3\tCyperus rotundus\t7\t19.8
Q4\tCyperus rotundus\t7\t19.8
Q5\tCyperus rotundus\t7\t19.8
Q1\tPhyla nodiflora\t11\t8.5
Q2\tPhyla nodiflora\t10\t8.5
Q3\tPhyla nodiflora\t10\t8.5`;
    const w = quadrats(recs(A), 2.25, 15), ap = w.rows[0];
    check('quadrat: alligator weed first on IV 103.7549 of 300', ap.species === 'Alternanthera philoxeroides' && close(ap.iv, 103.754897, 1e-5) && w.ivMax === 300);
    check('quadrat: alligator weed density 1.155556 /m², frequency 1/3, cover 18.166667 %', close(ap.density, 1.1555556, 1e-6) && close(ap.frequency, 1 / 3) && close(ap.cover, 18.1666667, 1e-6));
    check('quadrat: relative values 27.0833, 29.4118, 47.2598', close(ap.relDensity, 27.083333, 1e-5) && close(ap.relFrequency, 29.411765, 1e-5) && close(ap.relCover, 47.259799, 1e-5));
    check('quadrat: Phyla nodiflora last on 43.5973, the four add to 300', close(w.rows[3].iv, 43.597313, 1e-5) && close(w.rows.reduce((s, r) => s + r.iv, 0), 300, 1e-9));
    const w5 = quadrats(recs(A), 2.25, 5);
    check('quadrat: 5 quadrats instead of 15 treble density and leave every importance value alone', close(w5.totalDensity, 3 * w.totalDensity, 1e-9) && close(w5.rows[0].iv, ap.iv, 1e-9)); }
  let threw = false; try { lineIntercept([{ sample: 'T1', species: 'X', a: 1, b: 1 }, { sample: 'T1', species: 'Y', a: 1, b: null }], 10); } catch { threw = true; }
  check('transect: widths must be given for all or none', threw);
};
