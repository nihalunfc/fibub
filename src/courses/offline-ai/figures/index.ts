// Figures and simulations for the Offline AI lessons, by the name used in the text as <!--fig:name-->.
import CourseMap from './CourseMap.astro';
import TwoHomes from './TwoHomes.astro';
import WhatTravels from './WhatTravels.astro';
import PickTrack from './PickTrack.astro';
import WillItFit from './WillItFit.astro';
import ToyTokenizer from './ToyTokenizer.astro';
import NextWord from './NextWord.astro';
import Experts from './Experts.astro';
import ContextBucket from './ContextBucket.astro';
import TokenBudget from './TokenBudget.astro';
import SpeedLimit from './SpeedLimit.astro';
import BuildRig from './BuildRig.astro';
import PowerBill from './PowerBill.astro';
import KvCache from './KvCache.astro';

export const FIGURES: Record<string, any> = {
  'course-map': CourseMap,
  'two-homes': TwoHomes,
  'what-travels': WhatTravels,
  'pick-track': PickTrack,
  'will-it-fit': WillItFit,
  'toy-tokenizer': ToyTokenizer,
  'next-word': NextWord,
  'experts': Experts,
  'context-bucket': ContextBucket,
  'token-budget': TokenBudget,
  'speed-limit': SpeedLimit,
  'build-rig': BuildRig,
  'power-bill': PowerBill,
  'kv-cache': KvCache,
};
