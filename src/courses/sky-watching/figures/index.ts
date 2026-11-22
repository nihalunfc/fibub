// Figures and simulations for the sky watching lessons, by the name used in the text as <!--fig:name-->.
// Shared canvas helper: ../../ml-foundations/figures/kit.ts; shared look: the ML course's figs.css. The sums: src/lib/astrocourse/.

import SphereSide from './SphereSide.astro';
import StarTrails from './StarTrails.astro';
import SunPath from './SunPath.astro';
import MoonPhases from './MoonPhases.astro';
import Retrograde from './Retrograde.astro';
import SkyDome from './SkyDome.astro';
import MagnitudeScale from './MagnitudeScale.astro';
import AltazPointer from './AltazPointer.astro';
import RadecMap from './RadecMap.astro';
import SiderealDay from './SiderealDay.astro';
import JdConverter from './JdConverter.astro';
import PrecessionCircle from './PrecessionCircle.astro';
import AirmassCurve from './AirmassCurve.astro';
import DarkAdapt from './DarkAdapt.astro';
import BortleSky from './BortleSky.astro';
import SeeingBlur from './SeeingBlur.astro';
import TwilightBands from './TwilightBands.astro';
import LensRays from './LensRays.astro';
import ApertureGrasp from './ApertureGrasp.astro';
import EyepieceView from './EyepieceView.astro';
import AiryPair from './AiryPair.astro';
import ScopeTypes from './ScopeTypes.astro';
import PolarDrift from './PolarDrift.astro';
import SetupCompare from './SetupCompare.astro';
import VenusPhases from './VenusPhases.astro';
import SurfaceBrightness from './SurfaceBrightness.astro';
import DoubleStarField from './DoubleStarField.astro';
import VariableCurve from './VariableCurve.astro';
import ZhrCalc from './ZhrCalc.astro';
import EclipseGeometry from './EclipseGeometry.astro';
import LogEntry from './LogEntry.astro';
import Sampling from './Sampling.astro';
import SnrGrowth from './SnrGrowth.astro';
import CalibFrames from './CalibFrames.astro';
import StackNoise from './StackNoise.astro';
import TrailRules from './TrailRules.astro';
import FovFrame from './FovFrame.astro';
import StretchCurve from './StretchCurve.astro';

export const FIGURES: Record<string, any> = {
  'sphere-side': SphereSide,
  'star-trails': StarTrails,
  'sun-path': SunPath,
  'moon-phases': MoonPhases,
  'retrograde': Retrograde,
  'sky-dome': SkyDome,
  'magnitude-scale': MagnitudeScale,
  'altaz-pointer': AltazPointer,
  'radec-map': RadecMap,
  'sidereal-day': SiderealDay,
  'jd-converter': JdConverter,
  'precession-circle': PrecessionCircle,
  'airmass-curve': AirmassCurve,
  'dark-adapt': DarkAdapt,
  'bortle-sky': BortleSky,
  'seeing-blur': SeeingBlur,
  'twilight-bands': TwilightBands,
  'lens-rays': LensRays,
  'aperture-grasp': ApertureGrasp,
  'eyepiece-view': EyepieceView,
  'airy-pair': AiryPair,
  'scope-types': ScopeTypes,
  'polar-drift': PolarDrift,
  'setup-compare': SetupCompare,
  'venus-phases': VenusPhases,
  'surface-brightness': SurfaceBrightness,
  'double-star-field': DoubleStarField,
  'variable-curve': VariableCurve,
  'zhr-calc': ZhrCalc,
  'eclipse-geometry': EclipseGeometry,
  'log-entry': LogEntry,
  'sampling': Sampling,
  'snr-growth': SnrGrowth,
  'calib-frames': CalibFrames,
  'stack-noise': StackNoise,
  'trail-rules': TrailRules,
  'fov-frame': FovFrame,
  'stretch-curve': StretchCurve,
};
