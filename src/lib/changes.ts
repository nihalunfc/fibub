// The site's change log (built from the git history by scripts/changelog.mjs before each build).
import data from '../data/changelog.json';
export type Change = { sha: string; date: string; title: string; tools: string[]; site: boolean };
export const CHANGES = data as Change[];
export const REPO = 'https://github.com/nihalunfc/fibub';
export const commitUrl = (sha: string) => `${REPO}/commit/${sha}`;
/** "8 Nov 2026, 00:03 UTC" */
export function when(iso: string) {
  const d = new Date(iso);
  const day = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  return `${day}, ${d.toISOString().slice(11, 16)} UTC`;
}
export const changesFor = (toolId: string) => CHANGES.filter((c) => c.tools.includes(toolId));
