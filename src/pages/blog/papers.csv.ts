// The public record of research papers fibub has checked, as a spreadsheet (one row per paper, oldest first),
// each credited to its authors and journal with its DOI and licence.
import { paperRows } from '../../lib/papers';
import { SITE } from '../../site';
const q = (v: unknown) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
export async function GET() {
  const rows = [...(await paperRows())].reverse();
  const head = ['no', 'paper_title', 'authors', 'journal', 'year', 'doi', 'paper_url', 'licence', 'peer_reviewed', 'article_url', 'main_tool', 'tool_url', 'subject', 'added'];
  const body = rows.map((r) => [r.n, r.title, r.authors, r.journal, r.year, r.doi, r.url, r.licence, r.reviewed ? 'yes' : 'no', SITE.url + r.article, r.toolName, r.toolUrl ? SITE.url + r.toolUrl : '', r.subject, r.added].map(q).join(','));
  return new Response([head.join(','), ...body].join('\n') + '\n', { headers: { 'Content-Type': 'text/csv; charset=utf-8' } });
}
