// Figures and simulations for the Python pandas lessons, by the name used in the text as <!--fig:name-->.
// Canvas helpers come from the ML foundations kit; shared look from the ML foundations figs.css.
import ParetoCurve from './ParetoCurve.astro';
import CohortHeat from './CohortHeat.astro';

export const FIGURES: Record<string, any> = {
  'pareto-curve': ParetoCurve,
  'cohort-heat': CohortHeat,
};
