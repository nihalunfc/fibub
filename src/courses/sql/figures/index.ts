// Figures for the SQL for analysts lessons, by the name used in the text as <!--fig:name-->.
// Live SQL boxes are not figures: they come from ```sql blocks (src/scripts/sqllab.ts).
import NorthbayMap from './NorthbayMap.astro';
import QueryOrder from './QueryOrder.astro';

export const FIGURES: Record<string, any> = {
  'northbay-map': NorthbayMap,
  'query-order': QueryOrder,
};
