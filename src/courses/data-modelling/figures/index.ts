// Figures for the Data modelling lessons, by the name used in the text as <!--fig:name-->.
import NorthbayMap from '../../sql/figures/NorthbayMap.astro';
import SurrogateKeyMap from './SurrogateKeyMap.astro';
import ConformedDims from './ConformedDims.astro';
import RolePlayingDates from './RolePlayingDates.astro';
import StarVsSnowflake from './StarVsSnowflake.astro';
import ScdTimeline from './ScdTimeline.astro';
import AsWasAsIs from './AsWasAsIs.astro';
import OltpOlap from './OltpOlap.astro';
import NorthbayErd from './NorthbayErd.astro';
import FourSteps from './FourSteps.astro';
import StarSchema from './StarSchema.astro';
import BusMatrix from './BusMatrix.astro';
import FactTypes from './FactTypes.astro';
import InmonKimball from './InmonKimball.astro';
import VaultTables from './VaultTables.astro';
import Medallion from './Medallion.astro';
import WarehouseLayers from './WarehouseLayers.astro';
import PartitionPruning from './PartitionPruning.astro';
import CapstoneErd from './CapstoneErd.astro';

export const FIGURES: Record<string, any> = {
  'northbay-map': NorthbayMap,
  'surrogate-key-map': SurrogateKeyMap,
  'conformed-dims': ConformedDims,
  'role-playing-dates': RolePlayingDates,
  'star-vs-snowflake': StarVsSnowflake,
  'scd2-timeline': ScdTimeline,
  'as-was-as-is': AsWasAsIs,
  'oltp-olap': OltpOlap,
  'northbay-erd': NorthbayErd,
  'four-steps': FourSteps,
  'star-schema': StarSchema,
  'bus-matrix': BusMatrix,
  'fact-types': FactTypes,
  'inmon-kimball': InmonKimball,
  'vault-tables': VaultTables,
  'medallion': Medallion,
  'warehouse-layers': WarehouseLayers,
  'partition-pruning': PartitionPruning,
  'capstone-erd': CapstoneErd,
};
