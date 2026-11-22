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
// Modules 4-6
import PollSim from './PollSim.astro';
import ResponseBias from './ResponseBias.astro';
import CLTSim from './CLTSim.astro';
import SEShrink from './SEShrink.astro';
import BootstrapCI from './BootstrapCI.astro';
import CIMean from './CIMean.astro';
import MarginOfError from './MarginOfError.astro';
import CICoverage from './CICoverage.astro';
import SampleSizeCurve from './SampleSizeCurve.astro';
import NullSim from './NullSim.astro';
import PValueDance from './PValueDance.astro';
import TTestSim from './TTestSim.astro';
import PowerCurves from './PowerCurves.astro';
import ChiSquareTable from './ChiSquareTable.astro';
import AnovaSim from './AnovaSim.astro';
import RankTest from './RankTest.astro';
import MultipleTests from './MultipleTests.astro';
import EffectSize from './EffectSize.astro';
// Modules 7-8
import ABFlow from './ABFlow.astro';
import MetricTree from './MetricTree.astro';
import ABPlanner from './ABPlanner.astro';
import PeekingSim from './PeekingSim.astro';
import ABReadout from './ABReadout.astro';
import SRMCheck from './SRMCheck.astro';
import BayesAB from './BayesAB.astro';
import NoveltySim from './NoveltySim.astro';
import SlopeCI from './SlopeCI.astro';
import SimpsonBars from './SimpsonBars.astro';
import TSDecompose from './TSDecompose.astro';
import ForecastCompare from './ForecastCompare.astro';
import ControlChart from './ControlChart.astro';
import CorrelationSlider from '../../ml-foundations/figures/CorrelationSlider.astro';
import HiddenCause from '../../ml-foundations/figures/HiddenCause.astro';
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
  'poll-sim': PollSim,
  'response-bias': ResponseBias,
  'clt-sim': CLTSim,
  'se-shrink': SEShrink,
  'bootstrap-ci': BootstrapCI,
  'ci-mean': CIMean,
  'margin-of-error': MarginOfError,
  'ci-coverage': CICoverage,
  'sample-size-curve': SampleSizeCurve,
  'null-sim': NullSim,
  'p-value-dance': PValueDance,
  't-test-sim': TTestSim,
  'power-curves': PowerCurves,
  'chi-square-table': ChiSquareTable,
  'anova-sim': AnovaSim,
  'rank-test': RankTest,
  'multiple-tests': MultipleTests,
  'effect-size': EffectSize,
  'ab-flow': ABFlow,
  'metric-tree': MetricTree,
  'ab-planner': ABPlanner,
  'peeking-sim': PeekingSim,
  'ab-readout': ABReadout,
  'srm-check': SRMCheck,
  'bayes-ab': BayesAB,
  'novelty-sim': NoveltySim,
  'correlation-slider': CorrelationSlider,
  'hidden-cause': HiddenCause,
  'slope-ci': SlopeCI,
  'simpson-bars': SimpsonBars,
  'ts-decompose': TSDecompose,
  'forecast-compare': ForecastCompare,
  'control-chart': ControlChart,
};
