// Health summary card: the data model and the three outputs (summary sections, wallet card PDF, lock-screen PNG).
// Everything is what the person typed; nothing is checked, suggested or looked up.
import type { Section } from '../report';

export type ListKey = 'conditions' | 'medicines' | 'allergies' | 'surgeries' | 'vaccinations' | 'devices' | 'doctors' | 'contacts';
export type Data = { name: string; dob: string; blood: string; language: string; notes: string; lists: Record<ListKey, string[][]> };

export const LISTS: { key: ListKey; title: string; cols: string[]; hint?: string }[] = [
  { key: 'conditions', title: 'Health conditions', cols: ['Condition'] },
  { key: 'medicines', title: 'Medicines', cols: ['Medicine', 'How you take it'], hint: 'Write what is on your own label or prescription. fibub does not check medicines.' },
  { key: 'allergies', title: 'Allergies and reactions', cols: ['Allergic to', 'What happens'] },
  { key: 'surgeries', title: 'Operations and hospital stays', cols: ['What', 'When'] },
  { key: 'vaccinations', title: 'Vaccinations', cols: ['Vaccine', 'Date'] },
  { key: 'devices', title: 'Devices and implants', cols: ['Device or implant', 'Note'] },
  { key: 'doctors', title: 'Doctor and pharmacy', cols: ['Who', 'Name', 'Phone'] },
  { key: 'contacts', title: 'Emergency contacts', cols: ['Name', 'Relationship', 'Phone'] },
];
export const KEY = 'fibub-healthcard-v1';
export const emptyData = (): Data => ({ name: '', dob: '', blood: '', language: '', notes: '', lists: Object.fromEntries(LISTS.map((l) => [l.key, [l.cols.map(() => '')]])) as Data['lists'] });

/** The made-up person used by "Fill in an example". */
export function exampleData(): Data {
  return {
    name: 'Asha Example', dob: '1984-03-12', blood: 'O+', language: 'English, Hindi', notes: 'Wears glasses. Carries an inhaler in her bag.',
    lists: {
      conditions: [['Asthma'], ['Type 2 diabetes']],
      medicines: [['Metformin 500 mg', 'One tablet with breakfast and dinner'], ['Salbutamol inhaler', 'Two puffs when needed']],
      allergies: [['Penicillin', 'Rash and swelling'], ['Peanuts', 'Hives']],
      surgeries: [['Appendix removed', '2012']],
      vaccinations: [['Tetanus booster', '2021-06'], ['Flu', '2025-10']],
      devices: [['None', '']],
      doctors: [['Family doctor', 'Dr Rao', '555 0101'], ['Pharmacy', 'Green Cross Pharmacy', '555 0102']],
      contacts: [['Ravi Example', 'Brother', '555 0142'], ['Mina Example', 'Mother', '555 0177']],
    },
  };
}

/** Keep only rows with something in them, trimmed. */
export function clean(d: Data): Data {
  const lists = Object.fromEntries(LISTS.map((l) => [l.key, (d.lists[l.key] ?? []).map((r) => l.cols.map((_, i) => (r[i] ?? '').trim())).filter((r) => r.some(Boolean))])) as Data['lists'];
  return { name: d.name.trim(), dob: d.dob.trim(), blood: d.blood.trim(), language: d.language.trim(), notes: d.notes.trim(), lists };
}
export const isEmpty = (d: Data) => !d.name && !d.dob && !d.blood && !d.language && !d.notes && LISTS.every((l) => !d.lists[l.key].length);

export const madeOn = (now = new Date()) => now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
export const upToDate = (when: string) => `Made on ${when}. Check it is up to date.`;
const nice = (iso: string) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso); if (!m) return iso; return new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); };
export const niceDate = nice;
const dash = (r: string[]) => r.filter(Boolean).join(' – ');
const phone = (r: string[]) => [r[0], r[1] && `(${r[1]})`, r[2]].filter(Boolean).join(' ');

/** Text lines for one list, as they appear on the card and lock screen. */
export function listLines(d: Data, k: ListKey): string[] {
  const rows = d.lists[k];
  if (k === 'contacts') return rows.map((r) => phone(r));
  if (k === 'doctors') return rows.map((r) => [r[0] && r[0] + ':', r[1], r[2]].filter(Boolean).join(' '));
  return rows.map((r) => dash(r));
}

/** The one-page summary as report sections. */
export function summarySections(d: Data, when: string): Section[] {
  const out: Section[] = [];
  const facts: [string, string][] = [];
  if (d.name) facts.push(['Name', d.name]);
  if (d.dob) facts.push(['Date of birth', nice(d.dob)]);
  if (d.blood) facts.push(['Blood group', d.blood]);
  if (d.language) facts.push(['Language', d.language]);
  if (facts.length) out.push({ title: 'About me', facts });
  const tab = (title: string, head: string[], rows: string[][]) => rows.length && out.push({ title, table: { head, rows } });
  tab('Allergies and reactions', ['Allergic to', 'What happens'], d.lists.allergies);
  tab('Health conditions', ['Condition'], d.lists.conditions);
  tab('Medicines', ['Medicine', 'How I take it'], d.lists.medicines);
  tab('Operations and hospital stays', ['What', 'When'], d.lists.surgeries);
  tab('Vaccinations', ['Vaccine', 'Date'], d.lists.vaccinations);
  tab('Devices and implants', ['Device or implant', 'Note'], d.lists.devices);
  tab('Doctor and pharmacy', ['Who', 'Name', 'Phone'], d.lists.doctors);
  tab('Emergency contacts', ['Name', 'Relationship', 'Phone'], d.lists.contacts);
  if (d.notes) out.push({ title: 'Notes', text: [d.notes] });
  out.push({ title: 'Please check', text: [`${upToDate(when)} Written by me from my own records; it is not a medical record and not medical advice.`] });
  return out;
}

export type Block = { head: string; lines: string[] };
/** What goes on the front and back of the wallet card. */
export function cardPanels(d: Data): { front: Block[]; back: Block[] } {
  const id = [d.name, d.dob && `Born ${nice(d.dob)}`, d.blood && `Blood group ${d.blood}`, d.language && `Speaks ${d.language}`].filter(Boolean);
  const b = (head: string, lines: string[]): Block[] => (lines.length ? [{ head, lines }] : []);
  return {
    front: [...b('', id), ...b('Allergies', listLines(d, 'allergies')), ...b('Conditions', listLines(d, 'conditions')), ...b('Devices / implants', listLines(d, 'devices'))],
    back: [...b('Emergency contacts', listLines(d, 'contacts')), ...b('Medicines', listLines(d, 'medicines')), ...b('Doctor / pharmacy', listLines(d, 'doctors')), ...(d.notes ? b('Notes', [d.notes]) : [])],
  };
}

const MM = 72 / 25.4;
/** A4 sheet with the card (85.6 × 54 mm per side) drawn as one strip: front | back, a dotted fold line between. */
export async function cardPdf(d: Data, when: string): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const { pdfSafe } = await import('../resume/pdf');
  const doc = await PDFDocument.create();
  doc.setTitle('Emergency medical card'); doc.setCreator('fibub.com');
  const reg = await doc.embedFont(StandardFonts.Helvetica), bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const [W, H] = [595.28, 841.89], cw = 85.6 * MM, ch = 54 * MM, x0 = (W - 2 * cw) / 2, y0 = H - 60 - ch;
  const page = doc.addPage([W, H]);
  const ink = rgb(0.05, 0.05, 0.05), grey = rgb(0.4, 0.4, 0.4);
  const safe = (s: string) => pdfSafe(s).text;
  const wrap = (t: string, f: typeof reg, size: number, w: number) => {
    const out: string[] = []; let line = '';
    for (const word of safe(t).split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word;
      if (f.widthOfTextAtSize(next, size) <= w || !line) line = next; else { out.push(line); line = word; }
    }
    if (line) out.push(line); return out;
  };
  page.drawText('Cut along the solid outline and fold on the dotted line. Each side is bank-card size (85.6 × 54 mm).', { x: x0, y: y0 + ch + 14, size: 9, font: reg, color: grey });
  page.drawRectangle({ x: x0, y: y0, width: 2 * cw, height: ch, borderColor: ink, borderWidth: 0.8 });
  page.drawLine({ start: { x: x0 + cw, y: y0 }, end: { x: x0 + cw, y: y0 + ch }, thickness: 0.6, color: grey, dashArray: [2, 2] });
  const panel = (blocks: Block[], px: number, title: string) => {
    const pad = 7, w = cw - pad * 2, size = 6.6, lh = size * 1.22;
    let y = y0 + ch - pad - 7;
    page.drawText(title, { x: px + pad, y, size: 7.5, font: bold, color: ink }); y -= 3;
    const floor = y0 + pad + 8;
    let cut = false;
    outer: for (const b of blocks) {
      if (b.head) { y -= lh + 1; if (y < floor) { cut = true; break; } page.drawText(safe(b.head).toUpperCase(), { x: px + pad, y, size: 5.6, font: bold, color: grey }); }
      for (const l of b.lines) for (const ln of wrap(l, b === blocks[0] && !b.head ? bold : reg, size, w)) {
        y -= lh; if (y < floor) { cut = true; break outer; }
        page.drawText(ln, { x: px + pad, y, size, font: b === blocks[0] && !b.head ? bold : reg, color: ink });
      }
    }
    if (cut) page.drawText('… more on the summary page', { x: px + pad, y: y0 + pad + 6, size: 5.6, font: reg, color: grey });
    page.drawText(safe(upToDate(when)), { x: px + pad, y: y0 + pad - 1, size: 5.2, font: reg, color: grey });
  };
  const p = cardPanels(d);
  panel(p.front, x0, 'EMERGENCY MEDICAL CARD');
  panel(p.back, x0 + cw, 'IF FOUND, PLEASE CALL');
  page.drawText('Made with fibub.com. Written by the card holder; not a medical record.', { x: x0, y: y0 - 16, size: 8, font: reg, color: grey });
  return doc.save();
}

/** The phone lock-screen picture: 1080 × 1920, light text on black, with the top left clear for the phone's clock. */
export function lockCanvas(d: Data, when: string): HTMLCanvasElement {
  const c = document.createElement('canvas'); c.width = 1080; c.height = 1920;
  const ctx = c.getContext('2d')!;
  const font = (px: number, w = 400) => `${w} ${px}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
  const wrap = (t: string, px: number, w: number, weight = 400) => {
    ctx.font = font(px, weight);
    const out: string[] = []; let line = '';
    for (const word of t.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width <= w || !line) line = next; else { out.push(line); line = word; }
    }
    if (line) out.push(line); return out;
  };
  const blocks: Block[] = [
    ...(d.name || d.dob || d.blood ? [{ head: '', lines: [d.name, d.dob && `Born ${nice(d.dob)}`, d.blood && `Blood group ${d.blood}`].filter(Boolean) as string[] }] : []),
    ...(d.lists.allergies.length ? [{ head: 'Allergies', lines: listLines(d, 'allergies') }] : []),
    ...(d.lists.conditions.length ? [{ head: 'Conditions', lines: listLines(d, 'conditions') }] : []),
    ...(d.lists.devices.length ? [{ head: 'Devices / implants', lines: listLines(d, 'devices') }] : []),
    ...(d.lists.contacts.length ? [{ head: 'Emergency contacts', lines: listLines(d, 'contacts') }] : []),
  ];
  const top = 520, bottom = 1790, W = 1080 - 120;
  // Try the biggest text that fits between the clock area and the footer.
  let size = 60, plan: { t: string; px: number; w: number; gap: number }[] = [];
  for (; size >= 30; size -= 2) {
    plan = []; let h = 0;
    for (const b of blocks) {
      if (b.head) { plan.push({ t: b.head.toUpperCase(), px: Math.round(size * 0.6), w: 700, gap: Math.round(size * 0.7) }); h += size * 0.6 * 1.3 + size * 0.7; }
      for (const l of b.lines) for (const ln of wrap(l, size, W, b === blocks[0] ? 700 : 400)) { plan.push({ t: ln, px: size, w: b === blocks[0] && !b.head ? 700 : 400, gap: 0 }); h += size * 1.3; }
      h += size * 0.4;
    }
    if (h <= bottom - top) break;
  }
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 1080, 1920);
  ctx.fillStyle = '#fff'; ctx.textBaseline = 'top';
  ctx.font = font(44, 700); ctx.fillText('IN AN EMERGENCY', 60, 400);
  let y = top;
  for (const p of plan) {
    y += p.gap;
    ctx.fillStyle = p.gap ? '#bdbdbd' : '#fff'; ctx.font = font(p.px, p.w); ctx.fillText(p.t, 60, y); y += p.px * 1.3;
  }
  ctx.fillStyle = '#bdbdbd'; ctx.font = font(30); ctx.fillText(upToDate(when) + ' fibub.com', 60, 1850);
  return c;
}
