// The numbers on the home page, worked out at build time from the site's own files, so they grow by
// themselves when tools, courses or curricula are added. Page views are live and come from the counter.
// A total of 0 is left out (it appears as soon as there is something to count).
import { CURRICULA, COURSES } from '../data/curricula';
import { allTools } from './tools';

export type Stat = { id: string; value: number; label: string; href?: string };

export async function siteTotals() {
  const tools = (await allTools()).filter((t) => t.data.status === 'live');
  const liveIds = new Set(tools.map((t) => t.id));
  const curricula = CURRICULA.filter((c) => c.status === 'live');
  // A student activity is a live tool on the Learn shelf, or any live tool a school chapter points to.
  const activities = new Set(tools.filter((t) => t.data.shelf === 'learn').map((t) => t.id));
  let chapters = 0, grades = 0;
  for (const c of curricula) {
    grades += c.classes.length;
    for (const k of c.classes) for (const s of k.subjects) for (const ch of s.chapters) {
      chapters++;
      for (const id of ch.tools) if (liveIds.has(id)) activities.add(id);
    }
  }
  const courses = COURSES.filter((c) => c.status === 'live').length;
  const stats: Stat[] = [
    { id: 'activities', value: activities.size, label: 'free activities and simulations for students', href: '/learn/' },
    { id: 'courses', value: courses, label: courses === 1 ? 'free course' : 'free courses', href: '/learn/courses/' },
    { id: 'curricula', value: curricula.length, label: curricula.length === 1 ? 'school curriculum covered' : 'school curricula covered', href: '/learn/school/' },
    { id: 'chapters', value: chapters, label: 'school chapters with tools' },
  ].filter((s) => s.value > 0);
  return { tools: tools.length, grades, stats };
}
