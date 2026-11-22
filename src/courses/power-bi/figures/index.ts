// Figures and simulations for the Power BI lessons, by the name used in the text as <!--fig:name arg-->.
// Shared look: ./figs.css. The DAX engine: src/lib/dax/. Practice editors: <!--fig:dax-pad <exercise id>-->.
import DaxPad from './DaxPad.astro';
import ModelMap from './ModelMap.astro';
import NorthbayData from './NorthbayData.astro';
import BiPipeline from './BiPipeline.astro';
import DesktopTour from './DesktopTour.astro';
import PqSteps from './PqSteps.astro';
import JoinViz from './JoinViz.astro';
import FilterFlow from './FilterFlow.astro';
import StarVsFlat from './StarVsFlat.astro';

export const FIGURES: Record<string, any> = {
  'dax-pad': DaxPad,
  'model-map': ModelMap,
  'northbay-data': NorthbayData,
  'bi-pipeline': BiPipeline,
  'desktop-tour': DesktopTour,
  'pq-steps': PqSteps,
  'join-viz': JoinViz,
  'filter-flow': FilterFlow,
  'star-vs-flat': StarVsFlat,
};
