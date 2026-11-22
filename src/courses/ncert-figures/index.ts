// Astro figures for the NCERT study courses. `tool` puts a live fibub tool in the lesson: <!--fig:tool ohms-law-lab-->.
// Everything else is a lesson-kit figure (public/learn-kit/ncert/figs/<name>.js) placed as <figure class="fig" data-fig="name">.
import ToolEmbed from '../../components/course/ToolEmbed.astro';
export const FIGURES: Record<string, any> = { tool: ToolEmbed };
