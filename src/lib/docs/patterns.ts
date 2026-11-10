// Find things worth hiding in a page's text: your own words, and common shapes of personal numbers.
// Plain TypeScript, no DOM. A shape is a guess about what a string looks like; always check the result.
export interface Hit { start: number; end: number; label: string }

export const PATTERNS: { id: string; label: string; re: RegExp; check?: (s: string) => boolean }[] = [
  { id: 'email', label: 'Email address', re: /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g },
  { id: 'phone', label: 'Phone number', re: /(?:\+\d{1,3}[\s.-]?)?(?:\(\d{3}\)\s?|\d{3}[\s.-])\d{3}[\s.-]\d{4}(?!\d)|\+\d{1,3}[\s-]?\d{5}[\s-]?\d{5}(?!\d)|(?<![\d-])[6-9]\d{4}[\s-]\d{5}(?!\d)/g },
  { id: 'card', label: 'Card number', re: /(?<![\d-])\d(?:[ -]?\d){12,18}(?![\d-])/g, check: (s) => luhn(s.replace(/\D/g, '')) },
  { id: 'ssn', label: 'US Social Security number', re: /(?<![\d-])\d{3}-\d{2}-\d{4}(?![\d-])/g },
  { id: 'sin', label: 'Canadian SIN', re: /(?<![\d-])\d{3}[ -]\d{3}[ -]\d{3}(?![\d-])/g },
  { id: 'aadhaar', label: 'Aadhaar number', re: /(?<![\d-])[2-9]\d{3}[ -]\d{4}[ -]\d{4}(?![\d-])/g },
  { id: 'pan', label: 'PAN (India)', re: /\b[A-Z]{5}\d{4}[A-Z]\b/g },
  { id: 'ni', label: 'UK National Insurance number', re: /\b[A-CEGHJ-PR-TW-Z][A-CEGHJ-NPR-TW-Z] ?\d{2} ?\d{2} ?\d{2} ?[A-D]\b/g },
];

export function luhn(digits: string): boolean {
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0, dbl = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (dbl) { d *= 2; if (d > 9) d -= 9; }
    sum += d; dbl = !dbl;
  }
  return sum % 10 === 0;
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Words are matched as typed (whole text of the line), case-insensitive unless matchCase. */
export function findHits(text: string, words: string[], patternIds: string[], matchCase = false): Hit[] {
  const hits: Hit[] = [];
  for (const w of words.map((x) => x.trim()).filter(Boolean)) {
    // Spaces in a phrase match any run of spaces, since PDFs space words unevenly.
    const re = new RegExp(w.split(/\s+/).map(esc).join('\\s+'), matchCase ? 'g' : 'gi');
    for (const m of text.matchAll(re)) if (m[0]) hits.push({ start: m.index!, end: m.index! + m[0].length, label: `Word "${w}"` });
  }
  for (const p of PATTERNS) {
    if (!patternIds.includes(p.id)) continue;
    for (const m of text.matchAll(new RegExp(p.re.source, p.re.flags))) {
      if (p.check && !p.check(m[0])) continue;
      hits.push({ start: m.index!, end: m.index! + m[0].length, label: p.label });
    }
  }
  hits.sort((a, b) => a.start - b.start || b.end - a.end);
  // Drop a hit that lies inside an earlier, longer one (a phone shape inside a card number).
  const out: Hit[] = [];
  for (const h of hits) { const last = out[out.length - 1]; if (last && h.start < last.end) continue; out.push(h); }
  return out;
}
