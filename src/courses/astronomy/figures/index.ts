// Figures and simulations for the astronomy lessons, by the name used in the text as <!--fig:name-->.
// Shared canvas helper: ../../ml-foundations/figures/kit.ts; shared look: the ML course's figs.css. The sums: src/lib/astrocourse/.

import SpectrumWindows from './SpectrumWindows.astro';
import PlanckCurves from './PlanckCurves.astro';
import HydrogenLines from './HydrogenLines.astro';
import DopplerShift from './DopplerShift.astro';
import InverseSquare from './InverseSquare.astro';
import BeyondVisible from './BeyondVisible.astro';
import KeplerOrbit from './KeplerOrbit.astro';
import OrbitSpeed from './OrbitSpeed.astro';
import OrbitElements from './OrbitElements.astro';
import Hohmann from './Hohmann.astro';
import PlanetsCompare from './PlanetsCompare.astro';
import SolarCycle from './SolarCycle.astro';
import ParallaxShift from './ParallaxShift.astro';
import HrPlot from './HrPlot.astro';
import StarLifetime from './StarLifetime.astro';
import BinaryRv from './BinaryRv.astro';
import CepheidPl from './CepheidPl.astro';
import Remnants from './Remnants.astro';
import MilkyWayMap from './MilkyWayMap.astro';
import GalaxyShapes from './GalaxyShapes.astro';
import CosmoGateway from './CosmoGateway.astro';
import ApertureSum from './ApertureSum.astro';
import Periodogram from './Periodogram.astro';
import ExoTransit from './ExoTransit.astro';
import WaveCal from './WaveCal.astro';
import ArraySlice from './ArraySlice.astro';
import ConeSearch from './ConeSearch.astro';
import LineFit from './LineFit.astro';
import ReadPaper from './ReadPaper.astro';
import Coverage from './Coverage.astro';
import CapstonePlan from './CapstonePlan.astro';

export const FIGURES: Record<string, any> = {
  'spectrum-windows': SpectrumWindows,
  'planck-curves': PlanckCurves,
  'hydrogen-lines': HydrogenLines,
  'doppler-shift': DopplerShift,
  'inverse-square': InverseSquare,
  'beyond-visible': BeyondVisible,
  'kepler-orbit': KeplerOrbit,
  'orbit-speed': OrbitSpeed,
  'orbit-elements': OrbitElements,
  'hohmann': Hohmann,
  'planets-compare': PlanetsCompare,
  'solar-cycle': SolarCycle,
  'parallax-shift': ParallaxShift,
  'hr-plot': HrPlot,
  'star-lifetime': StarLifetime,
  'binary-rv': BinaryRv,
  'cepheid-pl': CepheidPl,
  'remnants': Remnants,
  'milky-way-map': MilkyWayMap,
  'galaxy-shapes': GalaxyShapes,
  'cosmo-gateway': CosmoGateway,
  'aperture-sum': ApertureSum,
  'periodogram': Periodogram,
  'exo-transit': ExoTransit,
  'wave-cal': WaveCal,
  'array-slice': ArraySlice,
  'cone-search': ConeSearch,
  'line-fit': LineFit,
  'read-paper': ReadPaper,
  'coverage': Coverage,
  'capstone-plan': CapstonePlan,
};
