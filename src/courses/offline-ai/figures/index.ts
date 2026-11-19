// Figures and simulations for the Offline AI lessons, by the name used in the text as <!--fig:name-->.
import CourseMap from './CourseMap.astro';
import TwoHomes from './TwoHomes.astro';
import WhatTravels from './WhatTravels.astro';
import PickTrack from './PickTrack.astro';
import WillItFit from './WillItFit.astro';
import ToyTokenizer from './ToyTokenizer.astro';

export const FIGURES: Record<string, any> = {
  'course-map': CourseMap,
  'two-homes': TwoHomes,
  'what-travels': WhatTravels,
  'pick-track': PickTrack,
  'will-it-fit': WillItFit,
  'toy-tokenizer': ToyTokenizer,
};
