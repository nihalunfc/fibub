// Weekly and monthly planner: dates, quick-add parsing and the downloadable picture.
// Plans are kept only in this browser (localStorage). Nothing is sent anywhere.

export interface Item { id: string; t: string; e: string; text: string; c: number; d?: boolean }
export type Plan = Record<string, Item[]>; // key: YYYY-MM-DD

export const COLOURS = ['#0e8f84', '#6d4aff', '#d97706', '#e0457b', '#2f6fde', '#3f8f3a'];
export const COLOUR_NAMES = ['Teal', 'Violet', 'Amber', 'Pink', 'Blue', 'Green'];
const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const fromIso = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const startOfWeek = (d: Date, weekStart: number) => addDays(d, -((d.getDay() - weekStart + 7) % 7));
export const weekDays = (d: Date, weekStart: number) => Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(d, weekStart), i));

/** The days shown on a month grid: whole weeks covering the month. */
export function monthDays(d: Date, weekStart: number) {
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const start = startOfWeek(first, weekStart);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const weeks = Math.ceil(((last.getTime() - start.getTime()) / 864e5 + 1) / 7);
  return Array.from({ length: weeks * 7 }, (_, i) => addDays(start, i));
}

const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString(undefined, o);
export const dayShort = (d: Date) => fmt(d, { weekday: 'short' });
export const weekLabel = (days: Date[]) => new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).formatRange(days[0], days[6]);
export const monthLabel = (d: Date) => fmt(d, { month: 'long', year: 'numeric' });

/** "14:30" -> "2:30 pm" or "14:30", following the browser's clock style. */
export function timeLabel(t: string) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return new Date(2000, 0, 1, h, m).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }).replace(/\s?([AP])M/i, (_, x) => x.toLowerCase() + 'm');
}
export const sortItems = (a: Item, b: Item) => (a.t || '00:00').localeCompare(b.t || '00:00') || (a.t ? 1 : 0) - (b.t ? 1 : 0);

const hhmm = (h: number, m: number, ap?: string) => {
  if (ap) { ap = ap.toLowerCase(); if (h === 12) h = 0; if (ap.startsWith('p')) h += 12; }
  return h < 24 && m < 60 ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}` : '';
};

/**
 * Quick add: "Gym 7am tue", "Call mum tomorrow 6:30pm", "Standup 9-9:15am fri", "Dentist 14:00".
 * Day words pick a day inside the week being shown (or today/tomorrow).
 */
export function parseQuick(input: string, shown: Date[], today = new Date()): { date: string; t: string; e: string; text: string } {
  let s = ` ${input} `;
  let t = '', e = '';
  const range = /\s(?:from\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*(?:-|–|to)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?(?=\s)/i;
  const r = s.match(range);
  if (r && (r[3] || r[6] || r[2] || r[5])) {
    const ap2 = r[6] || r[3];
    // "11-1pm" means 11 am to 1 pm; "9-11pm" means 9 pm to 11 pm.
    const ap1 = r[3] || (r[6] && hhmm(+r[1], +(r[2] ?? 0), r[6]) > hhmm(+r[4], +(r[5] ?? 0), r[6]) ? 'am' : r[6]);
    t = hhmm(+r[1], +(r[2] ?? 0), ap1); e = hhmm(+r[4], +(r[5] ?? 0), ap2);
    s = s.replace(r[0], ' ');
  } else {
    const one = s.match(/\s(?:at\s+|@\s*)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)(?=\s)/i) ?? s.match(/\s(?:at\s+|@\s*)?(\d{1,2}):(\d{2})(?=\s)/);
    if (one) { t = hhmm(+one[1], +(one[2] ?? 0), one[3]); s = s.replace(one[0], ' '); }
  }
  let date = '';
  const dm = s.match(/\s(?:on\s+)?(today|tomorrow|tmrw|tmr|sun|mon|tue|tues|wed|thu|thur|thurs|fri|sat)(?:day|nesday|rsday|urday)?(?=\s)/i);
  if (dm) {
    const w = dm[1].toLowerCase();
    if (w === 'today') date = iso(today);
    else if (w.startsWith('tm') || w === 'tomorrow') date = iso(addDays(today, 1));
    else {
      const idx = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].indexOf(w.slice(0, 3));
      date = iso(shown.find((d) => d.getDay() === idx)!);
    }
    s = s.replace(dm[0], ' ');
  }
  if (!date) date = iso(shown.some((d) => iso(d) === iso(today)) ? today : shown[0]);
  return { date, t, e, text: s.replace(/\s+/g, ' ').trim() };
}

// ---------- picture for download (always light, landscape A4 at 200 dpi) ----------

export const PAGE = { w: 2339, h: 1654 };
const INK = '#121826', MUTED = '#5d6577', LINE = '#e4e7ef', SOFT = '#f6f7fb';
const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif';

function wrap(x: CanvasRenderingContext2D, text: string, width: number): string[] {
  const out: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const test = line ? `${line} ${word}` : word;
    if (x.measureText(test).width <= width || !line) line = test;
    else { out.push(line); line = word; }
    while (x.measureText(line).width > width && line.length > 1) { // a very long word
      let cut = line.length - 1;
      while (cut > 1 && x.measureText(line.slice(0, cut)).width > width) cut--;
      out.push(line.slice(0, cut)); line = line.slice(cut);
    }
  }
  if (line) out.push(line);
  return out;
}

function header(x: CanvasRenderingContext2D, title: string, sub: string) {
  x.fillStyle = '#fff'; x.fillRect(0, 0, PAGE.w, PAGE.h);
  x.fillStyle = INK; x.font = `800 64px ${FONT}`; x.textBaseline = 'alphabetic';
  x.fillText(title, 90, 150);
  x.fillStyle = MUTED; x.font = `500 36px ${FONT}`;
  x.fillText(sub, 92, 200);
  x.textAlign = 'right'; x.font = `600 28px ${FONT}`; x.fillStyle = '#9aa1b0';
  x.fillText('fibub.com', PAGE.w - 90, PAGE.h - 50);
  x.textAlign = 'left';
}

const itemLine = (i: Item) => [i.t ? timeLabel(i.t) + (i.e ? `–${timeLabel(i.e)}` : '') : '', i.text].filter(Boolean).join('  ');

export function drawWeek(canvas: HTMLCanvasElement, plan: Plan, days: Date[], title: string) {
  canvas.width = PAGE.w; canvas.height = PAGE.h;
  const x = canvas.getContext('2d')!;
  header(x, title || 'My week', weekLabel(days));
  const left = 90, top = 250, gap = 16, bottom = PAGE.h - 100;
  const colW = (PAGE.w - left * 2 - gap * 6) / 7;
  const todayIso = iso(new Date());
  days.forEach((d, i) => {
    const cx = left + i * (colW + gap);
    x.fillStyle = SOFT; roundRect(x, cx, top, colW, bottom - top, 18); x.fill();
    x.fillStyle = iso(d) === todayIso ? COLOURS[0] : INK;
    x.font = `700 34px ${FONT}`; x.fillText(dayShort(d), cx + 22, top + 52);
    x.font = `500 34px ${FONT}`; x.fillStyle = MUTED; x.textAlign = 'right';
    x.fillText(String(d.getDate()), cx + colW - 22, top + 52); x.textAlign = 'left';
    x.strokeStyle = LINE; x.lineWidth = 2; x.beginPath(); x.moveTo(cx + 18, top + 76); x.lineTo(cx + colW - 18, top + 76); x.stroke();
    const items = [...(plan[iso(d)] ?? [])].sort(sortItems);
    // Shrink the text until everything fits, down to a readable minimum.
    let size = 28, blocks: { lines: string[]; time: string; item: Item }[] = [], h = 0;
    for (; size >= 18; size -= 2) {
      x.font = `500 ${size}px ${FONT}`;
      blocks = items.map((it) => ({ item: it, time: it.t ? timeLabel(it.t) + (it.e ? `–${timeLabel(it.e)}` : '') : '', lines: wrap(x, it.text, colW - 56) }));
      h = blocks.reduce((n, b) => n + (b.time ? size * 1.3 : 0) + b.lines.length * size * 1.3 + 22, 0);
      if (h <= bottom - top - 110) break;
    }
    let y = top + 100;
    let shown = 0;
    for (const b of blocks) {
      const bh = (b.time ? size * 1.3 : 0) + b.lines.length * size * 1.3;
      if (y + bh > bottom - 50 && shown < blocks.length) {
        x.fillStyle = MUTED; x.font = `600 ${size}px ${FONT}`; x.fillText(`+${blocks.length - shown} more`, cx + 24, y + size); break;
      }
      x.fillStyle = COLOURS[b.item.c] ?? COLOURS[0];
      roundRect(x, cx + 18, y, 7, bh, 3); x.fill();
      let ly = y + size;
      if (b.time) { x.fillStyle = MUTED; x.font = `600 ${size * 0.85}px ${FONT}`; x.fillText(b.time, cx + 38, ly); ly += size * 1.3; }
      x.fillStyle = b.item.d ? '#9aa1b0' : INK; x.font = `500 ${size}px ${FONT}`;
      for (const l of b.lines) {
        x.fillText(l, cx + 38, ly);
        if (b.item.d) { const w = x.measureText(l).width; x.fillRect(cx + 38, ly - size * 0.32, w, 2); }
        ly += size * 1.3;
      }
      y += bh + 22; shown++;
    }
  });
}

export function drawMonth(canvas: HTMLCanvasElement, plan: Plan, month: Date, weekStart: number, title: string) {
  canvas.width = PAGE.w; canvas.height = PAGE.h;
  const x = canvas.getContext('2d')!;
  header(x, title || monthLabel(month), title ? monthLabel(month) : 'Monthly plan');
  const days = monthDays(month, weekStart);
  const rows = days.length / 7;
  const left = 90, top = 250, bottom = PAGE.h - 100, headH = 50;
  const colW = (PAGE.w - left * 2) / 7, rowH = (bottom - top - headH) / rows;
  x.font = `700 28px ${FONT}`; x.fillStyle = MUTED;
  days.slice(0, 7).forEach((d, i) => x.fillText(dayShort(d).toUpperCase(), left + i * colW + 16, top + 32));
  x.strokeStyle = LINE; x.lineWidth = 2;
  const todayIso = iso(new Date());
  days.forEach((d, n) => {
    const cx = left + (n % 7) * colW, cy = top + headH + Math.floor(n / 7) * rowH;
    const inMonth = d.getMonth() === month.getMonth();
    if (!inMonth) { x.fillStyle = SOFT; x.fillRect(cx, cy, colW, rowH); }
    x.strokeRect(cx, cy, colW, rowH);
    x.font = `700 30px ${FONT}`;
    x.fillStyle = iso(d) === todayIso ? COLOURS[0] : inMonth ? INK : '#9aa1b0';
    x.fillText(String(d.getDate()), cx + 16, cy + 40);
    const items = [...(plan[iso(d)] ?? [])].sort(sortItems);
    const size = 22, lh = size * 1.35, room = Math.floor((rowH - 60) / lh);
    x.font = `500 ${size}px ${FONT}`;
    items.slice(0, items.length > room ? room - 1 : room).forEach((it, k) => {
      const y = cy + 56 + k * lh;
      x.fillStyle = COLOURS[it.c] ?? COLOURS[0];
      x.beginPath(); x.arc(cx + 22, y + size * 0.55, 6, 0, Math.PI * 2); x.fill();
      x.fillStyle = it.d ? '#9aa1b0' : INK;
      let s = itemLine(it);
      while (s.length > 1 && x.measureText(s).width > colW - 50) s = s.slice(0, -2) + '…';
      x.fillText(s, cx + 36, y + size * 0.9);
    });
    if (items.length > room) { x.fillStyle = MUTED; x.font = `600 ${size}px ${FONT}`; x.fillText(`+${items.length - room + 1} more`, cx + 16, cy + 56 + (room - 1) * lh + size * 0.9); }
  });
}

function roundRect(x: CanvasRenderingContext2D, X: number, Y: number, w: number, h: number, r: number) {
  x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath();
}

/** One A4 landscape PDF page holding the picture. */
export async function toPdf(canvas: HTMLCanvasElement): Promise<Blob> {
  const { PDFDocument } = await import('pdf-lib');
  const png = await new Promise<Blob>((ok) => canvas.toBlob((b) => ok(b!), 'image/png'));
  const doc = await PDFDocument.create();
  const img = await doc.embedPng(new Uint8Array(await png.arrayBuffer()));
  const page = doc.addPage([841.89, 595.28]);
  page.drawImage(img, { x: 0, y: 0, width: 841.89, height: 595.28 });
  doc.setTitle('Plan'); doc.setProducer('fibub.com'); doc.setCreator('fibub.com');
  return new Blob([(await doc.save()) as BlobPart], { type: 'application/pdf' });
}

export const DAY_NAMES = DAY;
