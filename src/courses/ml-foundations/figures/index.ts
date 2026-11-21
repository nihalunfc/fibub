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
};
