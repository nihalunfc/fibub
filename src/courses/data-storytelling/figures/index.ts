// Figures and simulations for the Data storytelling lessons, by the name used in the text as <!--fig:name arg-->.
// Charts are drawn by ./charts.ts from the Northbay numbers in ./data.ts; shared look in ./figs.css.
import ChartChooser from './ChartChooser.astro';
import Declutter from './Declutter.astro';
import AxisHonesty from './AxisHonesty.astro';
import ColourVision from './ColourVision.astro';
import KpiBuilder from './KpiBuilder.astro';
import TitleCoach from './TitleCoach.astro';
import DsChart from './DsChart.astro';

export const FIGURES: Record<string, any> = {
  'chart-chooser': ChartChooser,
  declutter: Declutter,
  'axis-honesty': AxisHonesty,
  'colour-vision': ColourVision,
  'kpi-builder': KpiBuilder,
  'title-coach': TitleCoach,
  'ds-chart': DsChart,
};
