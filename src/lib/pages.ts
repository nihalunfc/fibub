// The pages that exist in every language: home, shelves, subjects and tools. The English routes
// (src/pages/...) and the translated ones (src/pages/[lang]/...) both build their lists from here.
import { SHELVES, SUBJECTS } from '../site';
import { allTools, bySubject, relatedTools } from './tools';

export async function shelfAndToolPages() {
  const tools = await allTools();
  const live = tools.filter((t) => t.data.status === 'live');
  const toolPages = live.map((t) => ({ params: { shelf: t.data.shelf, tool: t.id }, props: { tool: t, related: relatedTools(t, tools) } }));
  const subjectPages = SHELVES.filter((s) => SUBJECTS[s.id]).flatMap((s) => bySubject(s.id, live).map((sj) => ({ params: { shelf: s.id, tool: sj.id }, props: { subjectPage: { shelf: s.id, subject: sj } } })));
  return [...toolPages, ...subjectPages];
}

export const shelfPages = () => SHELVES.map((s) => ({ params: { shelf: s.id }, props: { shelf: s } }));
