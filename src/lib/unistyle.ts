// Unicode "styled letters" used to fake bold and italic where a site has no formatting (LinkedIn).
// Each style maps A-Z, a-z (and 0-9 where Unicode has them) to Mathematical Alphanumeric Symbols.
export type Style = 'bold' | 'italic' | 'bolditalic' | 'mono';
const BASES: Record<Style, { upper: number; lower: number; digit?: number }> = {
  bold: { upper: 0x1d5d4, lower: 0x1d5ee, digit: 0x1d7ec },       // sans-serif bold
  italic: { upper: 0x1d608, lower: 0x1d622 },                      // sans-serif italic
  bolditalic: { upper: 0x1d63c, lower: 0x1d656 },                  // sans-serif bold italic
  mono: { upper: 0x1d670, lower: 0x1d68a, digit: 0x1d7f6 },        // monospace
};
const TO_PLAIN = new Map<number, string>();
for (const b of Object.values(BASES)) {
  for (let i = 0; i < 26; i++) {
    TO_PLAIN.set(b.upper + i, String.fromCharCode(65 + i));
    TO_PLAIN.set(b.lower + i, String.fromCharCode(97 + i));
  }
  if (b.digit) for (let i = 0; i < 10; i++) TO_PLAIN.set(b.digit + i, String(i));
}
const UNDERLINE = '̲', STRIKE = '̶';

/** Back to plain letters: undoes every style, underline and strikethrough. */
export function plain(text: string): string {
  let out = '';
  for (const ch of text) {
    if (ch === UNDERLINE || ch === STRIKE) continue;
    out += TO_PLAIN.get(ch.codePointAt(0)!) ?? ch;
  }
  return out;
}

export function style(text: string, s: Style): string {
  const b = BASES[s];
  let out = '';
  for (const ch of plain(text)) {
    const c = ch.charCodeAt(0);
    if (c >= 65 && c <= 90) out += String.fromCodePoint(b.upper + c - 65);
    else if (c >= 97 && c <= 122) out += String.fromCodePoint(b.lower + c - 97);
    else if (b.digit && c >= 48 && c <= 57) out += String.fromCodePoint(b.digit + c - 48);
    else out += ch;
  }
  return out;
}

/** Underline or strike through: a combining mark after each visible character (not spaces). */
export function mark(text: string, kind: 'underline' | 'strike'): string {
  const m = kind === 'underline' ? UNDERLINE : STRIKE;
  let out = '';
  for (const ch of text.replaceAll(UNDERLINE, '').replaceAll(STRIKE, '')) out += /\s/.test(ch) ? ch : ch + m;
  return out;
}

/** Turn simple Markdown (**bold**, *italic*, ***both***, `code`, - lists) into LinkedIn-ready text. */
export function fromMarkdown(md: string): string {
  return md
    .replace(/\*\*\*(.+?)\*\*\*/g, (_, t) => style(t, 'bolditalic'))
    .replace(/\*\*(.+?)\*\*|__(.+?)__/g, (_, a, b) => style(a ?? b, 'bold'))
    .replace(/(^|[^\w*])\*(?!\s)(.+?)(?<!\s)\*(?!\w)/g, (_, p, t) => p + style(t, 'italic'))
    .replace(/(^|[^\w])_(?!\s)(.+?)(?<!\s)_(?!\w)/g, (_, p, t) => p + style(t, 'italic'))
    .replace(/`([^`]+)`/g, (_, t) => style(t, 'mono'))
    .replace(/^#{1,6}\s+(.+)$/gm, (_, t) => style(t, 'bold'))
    .replace(/^(\s*)[-*+]\s+/gm, '$1• ')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '$1: $2');
}

/** True if the text uses any styled letters (screen readers read them badly). */
export const hasStyled = (t: string) => [...t].some((ch) => TO_PLAIN.has(ch.codePointAt(0)!));
