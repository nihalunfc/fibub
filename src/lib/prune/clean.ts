// Text cleaning shared by every input type of the Prompt pruner.

export interface PruneOptions {
  headers: boolean;     // repeated page headers and footers
  pageNumbers: boolean; // "Page 3 of 10", lone numbers
  boilerplate: boolean; // copyright, "all rights reserved", confidentiality and legal footers
  whitespace: boolean;  // trailing spaces, runs of blank lines, tabs
  licences: boolean;    // licence headers at the top of code files
  comments: boolean;    // all comments in code (off by default: comments often explain intent)
}
export const DEFAULTS: PruneOptions = { headers: true, pageNumbers: true, boilerplate: true, whitespace: true, licences: true, comments: false };

/** About 4 characters per token for English text; code and other scripts differ, so it's an estimate. */
export const tokens = (s: string) => Math.ceil(s.replace(/\s+/g, ' ').trim().length / 4);

export const PAGE_NUMBER = /^\s*(?:page\s*)?[-–—(]?\s*\d{1,4}\s*(?:(?:of|\/)\s*\d{1,4})?\s*[-–—)]?\s*$|^\s*[ivxlc]{1,6}\s*$/i;
const BOILERPLATE = [
  /^\s*(©|\(c\)|copyright\b).{0,160}$/i,
  /\ball rights reserved\b/i,
  /^\s*(strictly\s+)?(private and )?confidential(\s*[-–:].{0,80})?\s*$/i,
  /^\s*(this (e-?mail|message|document|communication)( and any attachments)? (is|are|may be) (confidential|intended)).{0,400}$/i,
  /^\s*(disclaimer|legal notice)\s*:?.{0,400}$/i,
  /^\s*(unsubscribe|view (this|in) (e-?mail )?(in )?(your )?browser|manage (your )?preferences)\b.{0,120}$/i,
  /^\s*(printed|generated|downloaded) (on|from|by)\b.{0,80}$/i,
  /^\s*(do not (distribute|copy)|for internal use only|proprietary( and confidential)?)\b.{0,80}$/i,
];
export const isBoilerplate = (line: string) => BOILERPLATE.some((re) => re.test(line));

/** A line with its digits blanked, so "Report 2026 – page 3" and "… page 4" count as the same. */
export const shape = (line: string) => line.trim().toLowerCase().replace(/\d+/g, '#').replace(/\s+/g, ' ');

export function tidy(text: string, o: PruneOptions): string {
  let lines = text.replace(/\r\n?/g, '\n').split('\n');
  if (o.pageNumbers) lines = lines.filter((l) => !PAGE_NUMBER.test(l) || l.trim() === '');
  if (o.boilerplate) lines = lines.filter((l) => !isBoilerplate(l));
  let out = lines.join('\n');
  if (o.whitespace) {
    out = out
      .replace(/[ \t]+$/gm, '')
      .replace(/\u00a0/g, ' ')
      .replace(/([^\s`|])[ \t]{2,}(?=\S)/g, '$1 ') // runs of spaces inside text (not indentation)
      .replace(/\n{3,}/g, '\n\n')
      .trim() + '\n';
  }
  return out;
}

/** Lines that repeat across most pages (running headers and footers). */
export function repeatedLines(pages: string[][], minShare = 0.5): Set<string> {
  if (pages.length < 3) return new Set();
  const seen = new Map<string, number>();
  for (const lines of pages) {
    // Only the first and last few lines of a page can be a header or footer.
    const edge = new Set([...lines.slice(0, 3), ...lines.slice(-3)].map(shape).filter((s) => s.length > 1));
    for (const s of edge) seen.set(s, (seen.get(s) ?? 0) + 1);
  }
  return new Set([...seen].filter(([, n]) => n >= Math.max(3, pages.length * minShare)).map(([s]) => s));
}
