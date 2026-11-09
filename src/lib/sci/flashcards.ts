// Flashcards with SM-2 spaced repetition, plus reading card lists (CSV, TSV, Anki plain-text export) and study
// statistics. Plain TypeScript, no DOM.
//
// SM-2 (P. A. Wozniak, 1990, the algorithm published on supermemo.com):
//   - Every card starts with an easiness factor EF = 2.5.
//   - After each answer, grade it q = 0 … 5.
//   - If q ≥ 3 the repetition counts: the next interval is 1 day after the 1st, 6 days after the 2nd, and
//     I(n) = I(n−1) × EF after later ones, rounded up to whole days (EF as it was before this answer).
//   - If q < 3 the card starts again from the 1st repetition (interval 1 day); its EF is not reset.
//   - After every answer EF' = EF + (0.1 − (5 − q) × (0.08 + (5 − q) × 0.02)), never below 1.3.
//   - In a study session, cards graded below 4 come back the same day until they score 4 or 5 (only the first
//     answer of the day changes the schedule).
// EF only ever changes in steps of 0.02, so it is kept to 2 decimals; this avoids 2.5000000000000004-type
// rounding pushing an interval up by a day.

export type Card = {
  id: string;
  front: string;
  back: string;
  tags: string;
  ef: number;        // easiness factor
  n: number;         // repetitions in a row with q ≥ 3
  interval: number;  // days until the next review, as last set
  due: number;       // day number of the next review (new cards: NaN)
  log: [number, number][]; // [day number, grade] of every graded answer that set the schedule
};
export type Deck = { id: string; name: string; cards: Card[]; newPerDay: number };

export const GRADES: { q: number; name: string; help: string }[] = [
  { q: 0, name: 'Blank', help: 'Complete blackout' },
  { q: 1, name: 'Wrong', help: 'Wrong, but the answer looked familiar' },
  { q: 2, name: 'Almost', help: 'Wrong, but it seemed easy once seen' },
  { q: 3, name: 'Hard', help: 'Right, with serious effort' },
  { q: 4, name: 'Good', help: 'Right, after a little thought' },
  { q: 5, name: 'Easy', help: 'Right, straight away' },
];

/** The SM-2 change in EF for a grade. */
export const efDelta = (q: number) => 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
const r2 = (x: number) => Math.round(x * 100) / 100;

export type Sched = { ef: number; n: number; interval: number };
/** One SM-2 step: the schedule after answering with grade q (0 … 5). */
export function sm2(s: Sched, q: number): Sched {
  if (!(Number.isInteger(q) && q >= 0 && q <= 5)) throw new Error('The grade must be a whole number from 0 to 5.');
  let { ef, n, interval } = s;
  if (q < 3) { n = 0; interval = 1; }
  else {
    interval = n === 0 ? 1 : n === 1 ? 6 : Math.ceil(interval * ef - 1e-9);
    n += 1;
  }
  ef = Math.max(1.3, r2(ef + efDelta(q)));
  return { ef, n, interval };
}

export const newCard = (front: string, back: string, tags = '', id = randomId()): Card => ({ id, front, back, tags, ef: 2.5, n: 0, interval: 0, due: NaN, log: [] });
export const isNew = (c: Card) => c.log.length === 0;

/** Grade a card on `today` (a day number): update its schedule. Returns a new card. */
export function grade(c: Card, q: number, today: number): Card {
  const s = sm2(c, q);
  return { ...c, ...s, due: today + s.interval, log: [...c.log, [today, q]] };
}

/** The cards to study today: cards due (oldest first), then up to `newLeft` new cards in the order they were added. */
export function todayQueue(d: Deck, today: number, newLeft = d.newPerDay): Card[] {
  const due = d.cards.filter((c) => !isNew(c) && c.due <= today).sort((a, b) => a.due - b.due || a.ef - b.ef);
  const fresh = d.cards.filter(isNew).slice(0, Math.max(0, newLeft));
  return [...due, ...fresh];
}
/** New cards already started today (first answer given today). */
export const newStartedToday = (d: Deck, today: number) => d.cards.filter((c) => c.log.length && c.log[0][0] === today).length;

/**
 * A study session. The first answer of the day for each card sets its schedule. A card graded below 4 goes back
 * into the queue (a few cards later, or at the end) until it is graded 4 or 5; those extra answers only drill.
 */
export type Session = { queue: string[]; graded: Set<string>; done: number; again: number };
export function startSession(cards: Card[]): Session {
  return { queue: cards.map((c) => c.id), graded: new Set(), done: 0, again: 0 };
}
/** Apply an answer to the card at the front of the queue. Returns the updated card (or null if only drilled). */
export function answer(sess: Session, deck: Deck, q: number, today: number, gap = 3): Card | null {
  const id = sess.queue.shift();
  if (!id) return null;
  const i = deck.cards.findIndex((c) => c.id === id);
  if (i < 0) return null;
  let out: Card | null = null;
  if (!sess.graded.has(id)) {
    out = grade(deck.cards[i], q, today);
    deck.cards[i] = out;
    sess.graded.add(id);
  }
  if (q < 4) { sess.queue.splice(Math.min(gap, sess.queue.length), 0, id); sess.again++; }
  else sess.done++;
  return out;
}

// ---- statistics ----
export type Stats = {
  total: number; fresh: number; learning: number; young: number; mature: number;
  dueToday: number; dueTomorrow: number; avgEf: number;
  reviews30: number; right30: number; days: { day: number; n: number; right: number }[]; forecast: number[];
};
/**
 * Counts for a deck. Learning: seen but not yet past the first two repetitions (interval under 6 days). Young:
 * interval 6 to 20 days. Mature: 21 days or more (Anki's line). Right means grade 3 or more.
 */
export function stats(d: Deck, today: number, span = 30, ahead = 14): Stats {
  const s: Stats = { total: d.cards.length, fresh: 0, learning: 0, young: 0, mature: 0, dueToday: 0, dueTomorrow: 0, avgEf: NaN, reviews30: 0, right30: 0, days: [], forecast: Array(ahead).fill(0) };
  const per = new Map<number, { n: number; right: number }>();
  let efSum = 0, seen = 0;
  for (const c of d.cards) {
    if (isNew(c)) { s.fresh++; continue; }
    seen++; efSum += c.ef;
    if (c.interval >= 21) s.mature++; else if (c.interval >= 6) s.young++; else s.learning++;
    if (c.due <= today) s.dueToday++;
    if (c.due <= today + 1) s.dueTomorrow++;
    const k = Math.max(0, c.due - today);
    if (k < ahead) s.forecast[k]++;
    for (const [day, q] of c.log) {
      if (day > today - span && day <= today) {
        const e = per.get(day) ?? { n: 0, right: 0 };
        e.n++; if (q >= 3) e.right++;
        per.set(day, e);
      }
    }
  }
  s.avgEf = seen ? efSum / seen : NaN;
  for (let k = span - 1; k >= 0; k--) { const day = today - k; const e = per.get(day) ?? { n: 0, right: 0 }; s.days.push({ day, ...e }); s.reviews30 += e.n; s.right30 += e.right; }
  return s;
}

// ---- reading and writing card lists ----
/** Split text into rows of fields with a separator, honouring double quotes ("a, b" and "" for a quote). */
export function splitRows(text: string, sep: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = '', inQ = false, quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else inQ = false; }
      else cell += ch;
    } else if (ch === '"' && cell === '' && !quoted) { inQ = true; quoted = true; }
    else if (ch === sep) { row.push(cell); cell = ''; quoted = false; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = ''; quoted = false;
    } else cell += ch;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

const ENT: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
/** Card text from HTML (Anki fields): line breaks kept, tags dropped, entities decoded. */
export function stripHtml(s: string): string {
  return s
    .replace(/<\s*br\s*\/?>/gi, '\n').replace(/<(div|p|li)\b[^>]*>/gi, '\n').replace(/<[^>]*>/g, '')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
      if (e[0] === '#') { const n = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : m; }
      return ENT[e.toLowerCase()] ?? m;
    })
    .replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

export type ImportOpts = { swap?: boolean; html?: 'auto' | 'yes' | 'no' };
export type Imported = { cards: { front: string; back: string; tags: string }[]; problems: string[]; sep: string; header: boolean };
const SEPS: Record<string, string> = { tab: '\t', comma: ',', semicolon: ';', pipe: '|', space: ' ', colon: ':' };

/**
 * Cards from a CSV or TSV list or an Anki "Notes in Plain Text" export. Column 1 is the front, column 2 the
 * back, an optional column 3 the tags (or the column named by Anki's "#tags column:N"). Anki's "#separator:" and
 * "#html:" header lines are followed; other lines starting with # are skipped. A first row such as
 * "front, back" or "question, answer" is taken as a header.
 */
export function parseCards(text: string, o: ImportOpts = {}): Imported {
  text = text.replace(/^﻿/, '');
  const lines = text.split(/\r?\n/);
  let sep = '', html: boolean | null = o.html === 'yes' ? true : o.html === 'no' ? false : null, tagCol = 3, skip = 0;
  for (const l of lines) {
    if (!l.startsWith('#')) break;
    skip++;
    const m = /^#([a-z ]+):(.*)$/i.exec(l.trim());
    if (!m) continue;
    const k = m[1].trim().toLowerCase(), v = m[2].trim().toLowerCase();
    if (k === 'separator') sep = SEPS[v] ?? (v.length === 1 ? v : '');
    if (k === 'html' && o.html !== 'no' && o.html !== 'yes') html = v === 'true';
    if (k === 'tags column') tagCol = Number(v) || 3;
  }
  const body = lines.slice(skip).join('\n');
  if (!sep) {
    const first = body.split('\n').slice(0, 20).join('\n');
    sep = first.includes('\t') ? '\t' : first.includes(';') && !first.includes(',') ? ';' : ',';
  }
  const rows = splitRows(body, sep).filter((r) => r.some((c) => c.trim() !== ''));
  const problems: string[] = [];
  let header = false;
  if (rows.length && /^(front|question|term|word|prompt|side ?1|q)$/i.test(rows[0][0]?.trim() ?? '') && /^(back|answer|definition|meaning|side ?2|a)$/i.test(rows[0][1]?.trim() ?? '')) { header = true; rows.shift(); }
  const looksHtml = html ?? rows.some((r) => r.some((c) => /<(br|div|p|b|i|span|img)\b[^>]*>|&nbsp;|&amp;/i.test(c)));
  const clean = (s: string) => (looksHtml ? stripHtml(s) : s.trim());
  const cards: Imported['cards'] = [];
  rows.forEach((r, i) => {
    let front = clean(r[0] ?? ''), back = clean(r[1] ?? '');
    if (o.swap) [front, back] = [back, front];
    if (!front || !back) { problems.push(`Row ${i + 1 + (header ? 1 : 0)}: needs text on both sides, skipped.`); return; }
    if (/<img\b/i.test((r[0] ?? '') + (r[1] ?? ''))) problems.push(`Row ${i + 1 + (header ? 1 : 0)}: has a picture, which is left out (only text is kept).`);
    cards.push({ front, back, tags: (r[tagCol - 1] ?? '').trim() });
  });
  return { cards, problems, sep: sep === '\t' ? 'tab' : sep, header };
}

const tsvCell = (s: string) => (/[\t\n\r"]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
/** A plain-text file Anki can import (File, Import): tab-separated front, back and tags, with Anki's header lines. */
export function toAnkiText(cards: Card[]): string {
  return ['#separator:tab', '#html:false', '#tags column:3', ...cards.map((c) => [c.front, c.back, c.tags].map(tsvCell).join('\t'))].join('\n') + '\n';
}

/** Rows for a CSV of a deck with each card's schedule. */
export function scheduleRows(cards: Card[]): string[][] {
  return [['Front', 'Back', 'Tags', 'Reviews', 'Lapses', 'Easiness', 'Interval (days)', 'Next review', 'Last grade'], ...cards.map((c) => [
    c.front, c.back, c.tags, String(c.log.length), String(c.log.filter(([, q]) => q < 3).length), isNew(c) ? '' : c.ef.toFixed(2), isNew(c) ? '' : String(c.interval), isNew(c) ? 'new' : isoDay(c.due), c.log.length ? String(c.log[c.log.length - 1][1]) : ''])];
}

export const isoDay = (d: number) => new Date(d * 864e5).toISOString().slice(0, 10);
export const randomId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

/** JSON backup of all decks. */
export const toJson = (decks: Deck[]) => JSON.stringify({ app: 'fibub flashcards', version: 1, decks: decks.map((d) => ({ ...d, cards: d.cards.map((c) => ({ ...c, due: Number.isFinite(c.due) ? c.due : null })) })) });
export function fromJson(text: string): Deck[] {
  let d: unknown;
  try { d = JSON.parse(text); } catch { throw new Error('This file is not valid JSON.'); }
  const arr = (d as { decks?: unknown })?.decks;
  if (!Array.isArray(arr)) throw new Error('This JSON file has no decks (expected a fibub flashcards backup).');
  const str = (v: unknown) => (typeof v === 'string' ? v : '');
  return arr.filter((x) => x && typeof x === 'object').map((x) => {
    const k = x as Record<string, unknown>;
    const cards = (Array.isArray(k.cards) ? k.cards : []).filter((c) => c && typeof c === 'object' && str((c as Card).front) && str((c as Card).back)).map((c) => {
      const v = c as Record<string, unknown>;
      const log = Array.isArray(v.log) ? (v.log as unknown[]).filter((e): e is [number, number] => Array.isArray(e) && Number.isInteger(e[0]) && Number.isInteger(e[1]) && e[1] >= 0 && e[1] <= 5) : [];
      const ef = Number(v.ef), n = Number(v.n), interval = Number(v.interval), due = v.due == null ? NaN : Number(v.due);
      return { id: str(v.id) || randomId(), front: str(v.front), back: str(v.back), tags: str(v.tags), ef: Number.isFinite(ef) && ef >= 1.3 ? ef : 2.5, n: Number.isInteger(n) && n >= 0 ? n : 0, interval: Number.isFinite(interval) && interval >= 0 ? interval : 0, due: log.length && Number.isFinite(due) ? due : NaN, log };
    });
    return { id: str(k.id) || randomId(), name: str(k.name) || 'Deck', cards, newPerDay: Number.isInteger(k.newPerDay) && (k.newPerDay as number) >= 0 ? (k.newPerDay as number) : 20 };
  });
}

/** A small made-up example deck of general science facts. */
export function exampleDeck(): Deck {
  const c: [string, string, string][] = [
    ['SI unit of force', 'newton (N) = kg·m/s²', 'physics units'],
    ['SI unit of electric charge', 'coulomb (C)', 'physics units'],
    ['Avogadro constant', '6.022 140 76 × 10²³ per mole (exact)', 'chemistry constants'],
    ['Speed of light in vacuum', '299 792 458 m/s (exact)', 'physics constants'],
    ['Powerhouse of the cell', 'Mitochondrion: makes most of the cell’s ATP', 'biology'],
    ['pH of a neutral solution at 25 °C', '7', 'chemistry'],
    ['Base pairs in DNA', 'A with T, G with C', 'biology'],
    ['Ohm’s law', 'V = I × R', 'physics'],
    ['Most abundant gas in Earth’s air', 'Nitrogen (about 78 % by volume)', 'earth science'],
    ['Chemical symbol of sodium', 'Na', 'chemistry'],
  ];
  return { id: 'example', name: 'Science basics (example)', newPerDay: 20, cards: c.map(([f, b, t], i) => newCard(f, b, t, `ex${i}`)) };
}
