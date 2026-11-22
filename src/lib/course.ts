// Helpers for the long text courses (src/courses/). See src/courses/types.ts.
import { getCollection, type CollectionEntry } from 'astro:content';
import { flatLessons, type CourseSyllabus } from '../courses/types';

export type LessonEntry = CollectionEntry<'lessons'>;

/** The written lessons of a course, by slug. Fails the build on a file the syllabus does not list. */
export async function courseLessons(c: CourseSyllabus) {
  const files = (await getCollection('lessons')).filter((e) => e.id.startsWith(`${c.id}/`));
  const slugs = flatLessons(c).map((l) => l.slug);
  const listed = new Set(slugs);
  if (listed.size !== slugs.length) throw new Error(`course ${c.id}: a lesson slug is listed twice in the syllabus`);
  const bySlug = new Map<string, LessonEntry>();
  for (const e of files) {
    const slug = e.id.slice(c.id.length + 1);
    if (!listed.has(slug)) throw new Error(`course ${c.id}: lesson file ${slug}.md is not in the syllabus`);
    e.data.quiz.forEach((q, i) => { if (q.ans >= q.choices.length) throw new Error(`course ${c.id}: ${slug}.md quiz ${i + 1} has no choice ${q.ans}`); });
    bySlug.set(slug, e);
  }
  return bySlug;
}

/** Split a lesson's HTML at <!--fig:name--> markers: text parts and figure names, in order.
 *  A marker can carry one argument for the figure, <!--fig:dax-pad sum-amount-->, passed as its `arg` prop. */
export function splitFigures(html: string): { html?: string; fig?: string; arg?: string }[] {
  const out: { html?: string; fig?: string; arg?: string }[] = [];
  const re = /<!--\s*fig:([a-z0-9-]+)(?:\s+([a-z0-9-]+))?\s*-->/g;
  let at = 0, m: RegExpExecArray | null;
  while ((m = re.exec(html))) { out.push({ html: html.slice(at, m.index) }, { fig: m[1], arg: m[2] }); at = m.index + m[0].length; }
  out.push({ html: html.slice(at) });
  return out.filter((p) => p.fig || p.html?.trim());
}
