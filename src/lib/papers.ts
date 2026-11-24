// The public record of research papers fibub has checked: one row per discovery article's paper,
// numbered in the order they were added (oldest first), with the tool that checked it.
// Shown at /blog/papers/ (paged) and downloadable as /blog/papers.csv.
import { allArticles, kindOf, articleUrl } from './blog';

export const PAPERS_PER_PAGE = 100;
export const papersPageUrl = (n: number) => (n <= 1 ? '/blog/papers/' : `/blog/papers/page/${n}/`);

export type PaperRow = {
  n: number; title: string; authors: string; journal: string; year: number; doi?: string; url: string; licence: string;
  reviewed: boolean; article: string; articleTitle: string; tool: string; toolName: string; toolUrl: string; subject: string; added: string;
};

let cache: PaperRow[] | null = null;
/** Every checked paper, newest first; `n` counts from the first one added. Duplicate DOIs count once. */
export async function paperRows(): Promise<PaperRow[]> {
  if (cache) return cache;
  const { allTools, toolPlace, toolUrl } = await import('./tools');
  const tools = new Map((await allTools()).map((t) => [t.id, t]));
  const list = (await allArticles()).filter((a) => kindOf(a) === 'discoveries' && a.data.paper)
    .sort((a, b) => a.data.updated.getTime() - b.data.updated.getTime() || a.id.localeCompare(b.id));
  const seen = new Set<string>();
  const rows: PaperRow[] = [];
  for (const a of list) {
    const p = a.data.paper!;
    const key = (p.doi || p.url).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const t = tools.get(a.data.tools[0]);
    rows.push({
      n: rows.length + 1, title: p.title, authors: p.authors, journal: p.journal, year: p.year, doi: p.doi, url: p.url, licence: p.licence,
      reviewed: p.reviewed, article: articleUrl(a), articleTitle: a.data.title, tool: a.data.tools[0] ?? '',
      toolName: t?.data.name ?? a.data.tools[0] ?? '', toolUrl: t ? toolUrl(t) : '', subject: t ? (toolPlace(t).subject?.name ?? '') : '',
      added: a.data.updated.toISOString().slice(0, 10),
    });
  }
  cache = rows.reverse();
  return cache;
}

/** Totals for the top of the page. */
export function paperTotals(rows: PaperRow[]) {
  return {
    papers: rows.length,
    reviewed: rows.filter((r) => r.reviewed).length,
    preprints: rows.filter((r) => !r.reviewed).length,
    journals: new Set(rows.map((r) => r.journal.toLowerCase())).size,
    tools: new Set(rows.map((r) => r.tool)).size,
    subjects: new Set(rows.map((r) => r.subject).filter(Boolean)).size,
  };
}
