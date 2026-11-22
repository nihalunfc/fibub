// Figures and simulations for the Statistics for analysts lessons, by the name used in the text as
// <!--fig:name-->. Canvas helpers: ./skit.ts (on top of the ML foundations kit). Shared look: the ML
// foundations figs.css. The sums: src/lib/stats/. A few ML foundations figures are reused as they are.
import AnalystLoop from './AnalystLoop.astro';
import SpreadCompare from './SpreadCompare.astro';
import BoxPlot from './BoxPlot.astro';
import ZScore from './ZScore.astro';
import PeopleGrid from './PeopleGrid.astro';
import BayesGrid from './BayesGrid.astro';
import EVSim from './EVSim.astro';
import DiceSum from './DiceSum.astro';
import BinomialBars from './BinomialBars.astro';
import PoissonBars from './PoissonBars.astro';
import NormalArea from './NormalArea.astro';
import SkewedDists from './SkewedDists.astro';
import QQPlot from './QQPlot.astro';
import MeanMedian from '../../ml-foundations/figures/MeanMedian.astro';
import SamplingHistogram from '../../ml-foundations/figures/SamplingHistogram.astro';

export const FIGURES: Record<string, any> = {
  'analyst-loop': AnalystLoop,
  'mean-median': MeanMedian,
  'spread-compare': SpreadCompare,
  'box-plot': BoxPlot,
  'z-score': ZScore,
  'people-grid': PeopleGrid,
  'bayes-grid': BayesGrid,
  'ev-sim': EVSim,
  'dice-sum': DiceSum,
  'binomial-bars': BinomialBars,
  'poisson-bars': PoissonBars,
  'normal-area': NormalArea,
  'sampling-histogram': SamplingHistogram,
  'skewed-dists': SkewedDists,
  'qq-plot': QQPlot,
};
