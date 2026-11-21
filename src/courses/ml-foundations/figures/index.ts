// Figures and simulations for the ML foundations lessons, by the name used in the text as <!--fig:name-->.
// Shared canvas helpers: ./kit.ts. Shared look: ./figs.css. The sums: src/lib/ml/.
import RulesVsLearning from './RulesVsLearning.astro';
import LearnARule from './LearnARule.astro';
import FeatureTable from './FeatureTable.astro';
import SlopeExplorer from './SlopeExplorer.astro';
import DotProduct from './DotProduct.astro';
import Downhill from './Downhill.astro';
import SamplingHistogram from './SamplingHistogram.astro';
import Workflow from './Workflow.astro';
import DataTypes from './DataTypes.astro';
import MeanMedian from './MeanMedian.astro';
import TruncatedAxis from './TruncatedAxis.astro';
import CorrelationSlider from './CorrelationSlider.astro';
import HiddenCause from './HiddenCause.astro';
import Scaling from './Scaling.astro';
import MissingValues from './MissingValues.astro';
import SplitShuffler from './SplitShuffler.astro';
// Modules 3-4
import LinearAnatomy from './LinearAnatomy.astro';
import FitByHand from './FitByHand.astro';
import LeastSquares from './LeastSquares.astro';
import LossBowl from './LossBowl.astro';
import RegressionPlane from './RegressionPlane.astro';
import Residuals from './Residuals.astro';
import PolyDegree from './PolyDegree.astro';
import OverfitCurve from './OverfitCurve.astro';
import RidgeLasso from './RidgeLasso.astro';
import RegVsClass from './RegVsClass.astro';
import SigmoidFit from './SigmoidFit.astro';
import LogLossCurve from './LogLossCurve.astro';
import Boundary from './Boundary.astro';
import Threshold from './Threshold.astro';
import RocCurve from './RocCurve.astro';
import KnnRegions from './KnnRegions.astro';
import SpamBayes from './SpamBayes.astro';

export const FIGURES: Record<string, any> = {
  'rules-vs-learning': RulesVsLearning,
  'learn-a-rule': LearnARule,
  'feature-table': FeatureTable,
  'slope-explorer': SlopeExplorer,
  'dot-product': DotProduct,
  'downhill': Downhill,
  'sampling-histogram': SamplingHistogram,
  'workflow': Workflow,
  'data-types': DataTypes,
  'mean-median': MeanMedian,
  'truncated-axis': TruncatedAxis,
  'correlation-slider': CorrelationSlider,
  'hidden-cause': HiddenCause,
  'scaling': Scaling,
  'missing-values': MissingValues,
  'split-shuffler': SplitShuffler,
  'linear-anatomy': LinearAnatomy,
  'fit-by-hand': FitByHand,
  'least-squares': LeastSquares,
  'loss-bowl': LossBowl,
  'regression-plane': RegressionPlane,
  'residuals': Residuals,
  'poly-degree': PolyDegree,
  'overfit-curve': OverfitCurve,
  'ridge-lasso': RidgeLasso,
  'reg-vs-class': RegVsClass,
  'sigmoid-fit': SigmoidFit,
  'log-loss-curve': LogLossCurve,
  'boundary': Boundary,
  'threshold': Threshold,
  'roc-curve': RocCurve,
  'knn-regions': KnnRegions,
  'spam-bayes': SpamBayes,
};
