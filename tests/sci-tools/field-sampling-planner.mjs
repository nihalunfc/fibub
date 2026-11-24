// #158 Field sampling planner: sample numbers for a mean or against an action level, hot-spot geometry and grid
// spacing. Reference values from the iterated t formula (SciPy t quantiles) and from the exact disc geometry.
import { nForMean, nForAction, hotspotP, spacingFor, spacingForN, cellArea, lens } from '../../src/lib/sci/sampling.ts';
import { tInv } from '../../src/lib/sci/stats.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  // Samples for a mean within a relative margin: n = (t(1-a/2, n-1) * CV / relErr)^2, solved by iteration.
  check('sampling: CV 0.30, +/-10 % at 95 % needs 37 samples', nForMean(0.3, 0.1, 0.95) === 37 && nForMean(0.3, 0.05, 0.95) === 141);
  check('sampling: a smaller confidence level needs fewer samples', nForMean(0.3, 0.1, 0.9) === 27 && nForMean(0.3, 0.1, 0.99) === 64);
  check('sampling: never fewer than 2 samples', nForMean(0.01, 0.5, 0.95) === 2);
  // One-sample t test against an action level (normal approximation plus the 1/2 z^2 term).
  check('sampling: SD 10, gap 5, alpha 5 %, power 80 % needs 27', nForAction(10, 5, 0.05, 0.2) === 27);
  // Hot-spot geometry: a square grid at a spacing equal to the radius always hits the patch; half-diagonal is the limit.
  check('sampling: square grid at spacing = radius always hits', hotspotP(5, 5, 'square') === 1 && near(hotspotP(3, 5, 'square'), 0.95091113, 1e-8));
  check('sampling: widest 95 % spacing for a 10 m patch is 16.69 m', near(spacingFor(10, 0.95, 'square'), 16.692974, 1e-5));
  check('sampling: cell areas and the two-disc lens', cellArea(5, 'square') === 25 && near(cellArea(5, 'tri'), 21.650635, 1e-6) && lens(5, 10) === 0 && near(lens(5, 5), 30.709242, 1e-5));
  // Blog: /blog/discoveries/soil-moisture-sampling-number-scale-cv-relative-error/ (Wang et al. 2023, Atmosphere).
  // The paper's six nested scales: its published CV, and the sample number it reports at 95 % confidence, 10 % error.
  const CV = [0.074, 0.109, 0.110, 0.197, 0.350, 0.778], THEIRS = [2, 5, 5, 8, 20, 42];
  check('sampling: the paper’s CVs need 3, 7, 7, 18, 50, 235 samples', CV.map((c) => nForMean(c, 0.1, 0.95)).join() === '3,7,7,18,50,235');
  const margin = CV.map((c, i) => +(100 * (tInv(0.975, THEIRS[i] - 1) * c) / Math.sqrt(THEIRS[i])).toFixed(1));
  check(`sampling: the paper’s sample numbers really give 66.5 to 24.2 % margins (${margin.join()})`, margin.join() === '66.5,13.5,13.7,16.5,16.4,24.2');
  check('sampling: 42 nodes on a 160 m square sit 24.69 m apart', near(spacingForN(160 * 160, 42, 'square'), 24.688536, 1e-6) && near(spacingForN(160 * 160, 235, 'square'), 10.437249, 1e-6));
};
