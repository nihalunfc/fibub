// Shared question bank UI (qbank). Mounts every <div class="qbank" data-bank=".."> on the page.
// Modes: practice (one question at a time with check, trap, full solution), mock (timed paper with a question
// palette and exam marking), list (a short set with folded solutions). Format: /mnt/project-files/qbank/spec.md.
// Data files are plain ES modules in public/qbank/<bank>/; they are fetched only when the block is near the screen.
// Nothing is sent anywhere. Progress stays in this tab unless the learner ticks "Remember my progress".
import { check, score, instantiate, topicItems, topicGens, optionsOf, marksOf, matches, shuffle, newSeed, buildPaper, PATTERNS, SCHEMES } from '../lib/qbank/core.mjs';

type Item = Record<string, any>;
type Index = { id: string; name: string; exams?: Record<string, string>; facets?: Record<string, { label: string; values: Record<string, string> }>; units: { id: string; name: string; topics: { id: string; name: string }[] }[] };

const LEVELS: Record<number, string> = { 1: 'Warm-up', 2: 'Standard', 3: 'Exam level', 4: 'Hard', 5: 'Top rank' };
const TYPES: Record<string, string> = { mcq: 'One answer (MCQ)', msq: 'One or more answers (MSQ)', nat: 'Type the number (NAT)', text: 'Type the answer', order: 'Put the words in order', open: 'Write or speak' };

// ---------- maths: $...$ and $$...$$ become MathML (temml, loaded only when a question has maths) ----------
let temmlP: Promise<any> | null = null;
const hasTex = (s: string) => /(^|[^\\])\$/.test(s);
async function tex(html: string): Promise<string> {
  if (!html || !hasTex(html)) return (html ?? '').replace(/\\\$/g, '$');
  temmlP ??= import('temml').then((m) => m.default ?? m);
  const temml = await temmlP;
  const r = (t: string, display: boolean) => { try { return temml.renderToString(t, { displayMode: display, annotate: false }); } catch { return t; } };
  return html
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => r(t, true))
    .replace(/(^|[^\\])\$([^$]+?)\$/g, (_, pre, t) => pre + r(t, false))
    .replace(/\\\$/g, '$');
}
async function setHtml(el: Element, html: string) { el.innerHTML = await tex(html); }

const h = <K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, any> = {}, ...kids: (Node | string | null | undefined)[]) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v === true ? '' : String(v));
  }
  for (const k of kids) if (k != null) e.append(k);
  return e;
};

// ---------- data loading ----------
const cache = new Map<string, Promise<any>>();
const load = (path: string) => {
  if (!cache.has(path)) cache.set(path, import(/* @vite-ignore */ path).then((m) => m.default));
  return cache.get(path)!;
};
const loadIndex = (bank: string): Promise<Index> => load(`/qbank/${bank}/index.js`);
async function loadTopics(bank: string, topics: string[]) {
  const files = await Promise.all(topics.map((t) => load(`/qbank/${bank}/${t}.js`).catch(() => null)));
  const items: Item[] = [], gens: Item[] = [];
  files.forEach((f, i) => { if (!f) return; items.push(...topicItems(f, topics[i])); gens.push(...topicGens(f, topics[i])); });
  return { items, gens };
}

// ---------- progress (this tab, or this device when the learner opts in) ----------
type Prog = { v: 1; done: Record<string, 0 | 1> };
function store(bank: string) {
  const KEY = `fibub-qbank-${bank}-v1`;
  const read = (s: Storage) => { try { const p = JSON.parse(s.getItem(KEY) || 'null'); return p?.v === 1 ? (p as Prog) : null; } catch { return null; } };
  let remember = false;
  try { remember = !!localStorage.getItem(KEY); } catch { /* blocked */ }
  let prog: Prog = (remember ? read(localStorage) : read(sessionStorage)) ?? { v: 1, done: {} };
  const save = () => { try { const s = JSON.stringify(prog); if (remember) { localStorage.setItem(KEY, s); sessionStorage.removeItem(KEY); } else { sessionStorage.setItem(KEY, s); localStorage.removeItem(KEY); } } catch { /* page only */ } };
  return {
    get prog() { return prog; },
    get remember() { return remember; },
    setRemember(v: boolean) { remember = v; save(); },
    mark(id: string, right: boolean) { if (prog.done[id] !== 1) prog.done[id] = right ? 1 : 0; save(); },
    clear() { prog = { v: 1, done: {} }; try { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY); } catch { /* */ } },
  };
}


// ---------- listening: scripts read aloud by the browser's own voices (speechSynthesis), nothing downloaded or sent ----------
type Line = { who?: string; text: string };
let voicesP: Promise<SpeechSynthesisVoice[]> | null = null;
function englishVoices(): Promise<SpeechSynthesisVoice[]> {
  voicesP ??= new Promise((res) => {
    const get = () => speechSynthesis.getVoices().filter((v) => /^en([-_]|$)/i.test(v.lang));
    const now = get();
    if (now.length) return res(now);
    speechSynthesis.addEventListener('voiceschanged', () => res(get()), { once: true });
    setTimeout(() => res(get()), 1500);
  });
  return voicesP;
}
const ACCENT: Record<string, string> = { GB: 'British', AU: 'Australian', US: 'American', CA: 'Canadian', IN: 'Indian', IE: 'Irish', NZ: 'New Zealand', ZA: 'South African' };
const accentOf = (v: SpeechSynthesisVoice) => ACCENT[(v.lang.split(/[-_]/)[1] || '').toUpperCase()] ?? v.lang;
let playing: { stop(): void } | null = null;

/** A player for a listening script: Play / Pause / Stop, speed, accent, and a once-only exam mode. */
function audioPlayer(lines: Line[], onEnd?: () => void) {
  const box = h('div', { class: 'qb-audio' });
  if (!('speechSynthesis' in window)) {
    box.append(h('p', { class: 'qb-hint' }, 'This browser cannot read text aloud, so the script is shown instead. Read it once, quickly, then answer.'));
    const t = h('div', { class: 'qb-script' }); lines.forEach((l) => t.append(h('p', {}, h('b', {}, l.who && l.who !== 'N' ? `${l.who}: ` : ''), l.text))); box.append(t);
    return box;
  }
  const play = h('button', { type: 'button', class: 'btn' }, '▶ Play recording');
  const stop = h('button', { type: 'button', class: 'btn ghost' }, '■ Stop');
  const speed = h('select', { 'aria-label': 'Speed' }, ...[['0.8', 'Slower'], ['0.95', 'Normal'], ['1.1', 'Faster']].map(([v, t]) => h('option', { value: v, selected: v === '0.95' }, t)));
  const accent = h('select', { 'aria-label': 'Accent' }, h('option', { value: '' }, 'Mixed accents'));
  const once = h('input', { type: 'checkbox' });
  const status = h('span', { class: 'qb-astatus', 'aria-live': 'polite' }, 'Read the questions first, then press Play.');
  const script = h('details', { class: 'qb-script' }, h('summary', {}, 'Transcript (open after you answer)'));
  lines.forEach((l) => script.append(h('p', {}, l.who && l.who !== 'N' ? h('b', {}, `Speaker ${l.who}: `) : h('i', {}, ''), l.text)));
  box.append(h('div', { class: 'qb-abar' }, play, stop, h('label', { class: 'qb-sel' }, h('span', {}, 'Speed'), speed), h('label', { class: 'qb-sel' }, h('span', {}, 'Voices'), accent)),
    h('label', { class: 'qb-rem' }, once, ' Test conditions: play once only, no pausing'), status, script);
  englishVoices().then((vs) => {
    const seen = [...new Set(vs.map(accentOf))];
    seen.forEach((a) => accent.append(h('option', { value: a }, `${a} English`)));
    if (!vs.length) status.textContent = 'No English voice found on this device: the transcript is below.';
  });
  let i = 0, state: 'idle' | 'playing' | 'paused' | 'done' = 'idle', used = false;
  const label = () => { play.textContent = state === 'playing' ? '❚❚ Pause' : state === 'paused' ? '▶ Resume' : state === 'done' ? '↻ Play again' : '▶ Play recording'; };
  const halt = () => { speechSynthesis.cancel(); state = i >= lines.length ? 'done' : 'idle'; label(); };
  async function speakFrom() {
    const vs = await englishVoices();
    const pool = accent.value ? vs.filter((v) => accentOf(v) === accent.value) : vs;
    const byWho = new Map<string, SpeechSynthesisVoice>();
    const pickFor = (who: string) => {
      if (!pool.length) return undefined;
      if (!byWho.has(who)) {
        // different voices for different speakers where the device has them; prefer a mix of accents when "Mixed"
        const k = byWho.size;
        const order = accent.value ? pool : [...pool].sort((a, b) => accentOf(a).localeCompare(accentOf(b)));
        byWho.set(who, order[(k * Math.max(1, Math.floor(order.length / 3)) + (who === 'N' ? 0 : 1)) % order.length]);
      }
      return byWho.get(who);
    };
    const next = () => {
      if (state !== 'playing') return;
      if (i >= lines.length) { state = 'done'; label(); status.textContent = 'End of recording.'; if (once.checked) play.disabled = true; onEnd?.(); return; }
      const l = lines[i];
      const u = new SpeechSynthesisUtterance(l.text);
      u.rate = Number(speed.value); u.lang = 'en-GB';
      const v = pickFor(l.who ?? 'N'); if (v) { u.voice = v; u.lang = v.lang; }
      if (l.who === 'B' || l.who === 'D') u.pitch = 1.08; else if (l.who === 'C') u.pitch = 0.92;
      u.onend = () => { i++; setTimeout(next, 280); };
      u.onerror = () => { i++; next(); };
      status.textContent = `Playing… ${Math.min(lines.length, i + 1)} of ${lines.length}`;
      speechSynthesis.speak(u);
    };
    next();
  }
  play.addEventListener('click', () => {
    if (state === 'playing') { if (once.checked) return; speechSynthesis.pause(); state = 'paused'; label(); return; }
    if (state === 'paused') { speechSynthesis.resume(); state = 'playing'; label(); return; }
    if (once.checked && used) return;
    playing?.stop();
    playing = { stop: halt };
    speechSynthesis.cancel();
    if (state === 'done') i = 0;
    used = true; state = 'playing'; label(); speakFrom();
  });
  stop.addEventListener('click', () => { if (once.checked && state === 'playing') return; i = 0; speechSynthesis.cancel(); state = 'idle'; label(); status.textContent = 'Stopped.'; });
  return box;
}

/** Timers for speaking (prep, then speak) and a word counter for writing. Nothing is recorded or saved. */
function openTools(it: Item, host: HTMLElement) {
  const t = it.timers ?? {};
  if (t.prep || t.speak) {
    const show = h('span', { class: 'qb-timer', role: 'timer' }, '');
    let left = 0, phase = '', iv: any = 0;
    const fmt = (n: number) => `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;
    const run = (secs: number, name: string, then?: () => void) => { clearInterval(iv); left = secs; phase = name; show.textContent = `${phase} ${fmt(left)}`; iv = setInterval(() => { left--; show.textContent = `${phase} ${fmt(Math.max(0, left))}`; if (left <= 0) { clearInterval(iv); then ? then() : (show.textContent = `${phase}: time is up`); } }, 1000); };
    const start = h('button', { type: 'button', class: 'btn' }, t.prep ? `Start: ${t.prep / 60 >= 1 ? t.prep / 60 + ' min' : t.prep + ' s'} to prepare` : 'Start speaking');
    start.addEventListener('click', () => t.prep ? run(t.prep, 'Prepare', () => run(t.speak, 'Speak now')) : run(t.speak, 'Speak now'));
    host.append(h('div', { class: 'qb-abar' }, start, show), h('p', { class: 'qb-hint' }, 'Speak out loud, and record yourself with your phone\'s voice recorder if you can. Then compare with the model answer.'));
    host.append(h('textarea', { rows: 4, class: 'qb-open', 'aria-label': 'Notes (not saved, not sent)', placeholder: 'Your notes (not saved, not sent)' }));
    return;
  }
  const ta = h('textarea', { rows: 10, class: 'qb-open', 'aria-label': 'Your answer (not saved, not sent)', placeholder: 'Write your answer here. It stays on this page only.' }) as HTMLTextAreaElement;
  const wc = h('span', { class: 'qb-wc' }, '0 words');
  ta.addEventListener('input', () => { const n = ta.value.trim().split(/\s+/).filter(Boolean).length; wc.textContent = `${n} word${n === 1 ? '' : 's'}${t.words ? ` (aim for at least ${t.words})` : ''}`; wc.classList.toggle('short', !!t.words && n < t.words); });
  host.append(ta, h('p', { class: 'qb-hint' }, wc, t.minutes ? ` · Suggested time: ${t.minutes} minutes` : ''));
}

// ---------- renderers by type: draw the answer area, read the response ----------
type Renderer = { draw(it: Item, host: HTMLElement, name: string): Promise<void> | void; read(host: HTMLElement): any; show?(it: Item, host: HTMLElement): void };
export const RENDER: Record<string, Renderer> = {
  mcq: {
    async draw(it, host, name) {
      const opts = optionsOf(it);
      for (let i = 0; i < opts.length; i++) {
        const lab = h('label', { class: 'qb-opt' }, h('input', { type: 'radio', name, value: i }), h('span', { class: 'qb-key' }, String.fromCharCode(65 + i)), h('span', { class: 'qb-otext' }));
        await setHtml(lab.querySelector('.qb-otext')!, opts[i]);
        host.append(lab);
      }
    },
    read: (host) => { const c = host.querySelector<HTMLInputElement>('input:checked'); return c ? Number(c.value) : null; },
    show(it, host) { markOptions(host, new Set([it.answer])); },
  },
  msq: {
    async draw(it, host, name) {
      host.append(h('p', { class: 'qb-hint' }, 'Tick every correct option. There is no partial credit in JAM and GATE.'));
      const opts = optionsOf(it);
      for (let i = 0; i < opts.length; i++) {
        const lab = h('label', { class: 'qb-opt' }, h('input', { type: 'checkbox', name, value: i }), h('span', { class: 'qb-key' }, String.fromCharCode(65 + i)), h('span', { class: 'qb-otext' }));
        await setHtml(lab.querySelector('.qb-otext')!, opts[i]);
        host.append(lab);
      }
    },
    read: (host) => [...host.querySelectorAll<HTMLInputElement>('input:checked')].map((c) => Number(c.value)),
    show(it, host) { markOptions(host, new Set(it.answer)); },
  },
  nat: {
    draw(it, host) {
      host.append(h('label', { class: 'qb-nat' }, h('span', {}, 'Your answer'), h('input', { type: 'text', inputmode: 'decimal', autocomplete: 'off', 'aria-label': 'Your answer' }), it.unit ? h('span', { class: 'qb-unit' }, it.unit) : null));
    },
    read: (host) => host.querySelector<HTMLInputElement>('input')?.value ?? '',
  },
  text: {
    draw(it, host) {
      host.append(h('label', { class: 'qb-nat' }, h('span', {}, it.maxWords ? `Your answer (no more than ${it.maxWords} word${it.maxWords > 1 ? 's' : ''})` : 'Your answer'), h('input', { type: 'text', autocomplete: 'off', 'aria-label': 'Your answer' })));
    },
    read: (host) => host.querySelector<HTMLInputElement>('input')?.value ?? '',
  },
  order: {
    // Word chips: tap a chip to move it into the answer line, tap it again to send it back.
    draw(it, host) {
      const built = h('div', { class: 'qb-built', 'aria-label': 'Your sentence' });
      const pool = h('div', { class: 'qb-pool' });
      const chips = [...(it.options ?? [])].sort(() => Math.random() - 0.5).map((w: string) => {
        const b = h('button', { type: 'button', class: 'qb-chip' }, w);
        b.addEventListener('click', () => (b.parentNode === pool ? built : pool).append(b));
        pool.append(b);
        return b;
      });
      const clear = h('button', { type: 'button', class: 'qb-clear' }, 'Clear');
      clear.addEventListener('click', () => chips.forEach((c) => pool.append(c)));
      host.append(built, pool, clear);
    },
    read: (host) => [...host.querySelectorAll('.qb-built .qb-chip')].map((c) => c.textContent ?? ''),
  },
  open: {
    draw(it, host) { openTools(it, host); },
    read: () => null,
  },
};
function markOptions(host: HTMLElement, right: Set<number>) {
  host.querySelectorAll<HTMLLabelElement>('.qb-opt').forEach((l, i) => {
    const picked = l.querySelector('input')!.checked;
    l.classList.toggle('right', right.has(i));
    l.classList.toggle('wrong', picked && !right.has(i));
  });
}

const answerText = async (it: Item) => {
  if (it.type === 'mcq') { const o = optionsOf(it)[it.answer]; const plain = String(o ?? '').replace(/<[^>]+>/g, ''); return `Answer: ${String.fromCharCode(65 + it.answer)}${plain && plain.length <= 60 && plain !== String.fromCharCode(65 + it.answer) ? ` (${plain})` : ''}`; }
  if (it.type === 'msq') return `Answer: ${(it.answer as number[]).map((i) => String.fromCharCode(65 + i)).join(', ')}`;
  if (it.type === 'nat') return `Answer: ${+Number(it.answer).toPrecision(6)}${it.unit ? ' ' + it.unit : ''}${it.tol ? ` (accepted ${+(it.answer - it.tol).toPrecision(6)} to ${+(it.answer + it.tol).toPrecision(6)})` : ''}`;
  if (it.type === 'text') return `Accepted: ${(it.answer ?? []).join(' / ')}`;
  if (it.type === 'order') return `Answer: ${(it.answer ?? [])[0] ?? ''}`;
  return '';
};

/** A group's shared material: title, passage (reading text, form, plan), lists for matching, and audio. */
async function groupBlock(g: Item) {
  const el = h('div', { class: 'qb-group' });
  if (g.title) el.append(h('p', { class: 'qb-gtitle' }, g.title));
  if (g.audio) el.append(audioPlayer(g.audio, () => el.closest('.qb-set')?.classList.add('heard')));
  if (g.passage) { const p = h('div', { class: 'qb-passage' }); await setHtml(p, g.passage); el.append(p); }
  if (g.list1) {
    const t = h('table', { class: 'qb-match' }, h('tr', {}, h('th', {}, 'List I'), h('th', {}, 'List II')));
    const n = Math.max(g.list1.length, g.list2?.length ?? 0);
    for (let i = 0; i < n; i++) {
      const a = h('td'), b = h('td');
      if (g.list1[i]) await setHtml(a, `${String.fromCharCode(65 + i)}. ${g.list1[i]}`);
      if (g.list2?.[i]) await setHtml(b, `${['P', 'Q', 'R', 'S', 'T', 'U'][i]}. ${g.list2[i]}`);
      t.append(h('tr', {}, a, b));
    }
    el.append(t);
  }
  return el;
}

let uid = 0;

/** One question card: badges, group material, the question, the answer area and (after checking) the solution. */
async function card(it: Item, ctx: { bankName?: string; topicName?: (t: string) => string; mode: 'practice' | 'mock' | 'list'; onCheck?: (r: any) => void; onNew?: () => void; noGroup?: boolean }) {
  const name = `qb${++uid}`;
  const el = h('article', { class: 'qb-card', 'data-id': it.id });
  const badges = h('p', { class: 'qb-badges' },
    ctx.topicName ? h('span', {}, ctx.topicName(it.topic)) : null,
    h('span', {}, it.type?.toUpperCase()),
    h('span', { class: `qb-lv qb-lv${it.level}` }, LEVELS[it.level] ?? `Level ${it.level}`),
    h('span', {}, `${marksOf(it)} mark${marksOf(it) > 1 ? 's' : ''}`),
    it.format && it.format !== 'single' && it.format !== 'multi' ? h('span', {}, it.format) : null,
    it.gen ? h('span', { class: 'qb-fresh', title: 'Made from a template: new numbers every time' }, 'Fresh numbers') : null,
  );
  el.append(badges);
  if (!ctx.noGroup && (it.grp?.passage || it.grp?.list1 || it.grp?.audio)) el.append(await groupBlock(it.grp));
  if (it.audio && !it.grp) el.append(audioPlayer(it.audio));
  const q = h('div', { class: 'qb-q' });
  await setHtml(q, it.q);
  el.append(q);
  const ans = h('div', { class: 'qb-ans' });
  const R = RENDER[it.type] ?? RENDER.open;
  await R.draw(it, ans, name);
  el.append(ans);
  if (ctx.mode === 'mock') return { el, read: () => R.read(ans), reveal: () => reveal() };

  const out = h('div', { class: 'qb-out', 'aria-live': 'polite' });
  const sol = h('div', { class: 'qb-sol', hidden: true });
  const bar = h('p', { class: 'qb-bar' });
  const btnCheck = h('button', { type: 'button', class: 'btn', hidden: it.type === 'open' }, 'Check');
  const btnSol = h('button', { type: 'button', class: 'btn ghost' }, it.type === 'open' ? 'Show the model answer and checklist' : 'Show solution');
  bar.append(btnCheck, btnSol);
  if (it.gen && ctx.onNew) bar.append(h('button', { type: 'button', class: 'btn ghost', onclick: ctx.onNew }, 'New numbers'));
  el.append(bar, out, sol);
  async function reveal() {
    if (!sol.hidden) return;
    sol.hidden = false;
    R.show?.(it, ans);
    const parts = [`<p class="qb-answer">${await answerText(it)}</p>`, `<div class="qb-soltext">${it.sol ?? ''}</div>`];
    if (it.trap) parts.push(`<p class="qb-trap"><b>Why people get this wrong:</b> ${it.trap}</p>`);
    if (it.model) parts.push(`<div class="qb-model"><b>Model answer</b>${it.model}</div>`);
    if (it.checklist?.length) parts.push(`<div class="qb-check"><b>Check your own answer</b><ul>${it.checklist.map((c: string) => `<li><label><input type="checkbox"> ${c}</label></li>`).join('')}</ul></div>`);
    await setHtml(sol, parts.join(''));
    btnSol.hidden = true;
  }
  btnCheck.addEventListener('click', async () => {
    const r = check(it, R.read(ans));
    out.className = 'qb-out ' + (r.right ? 'ok' : 'bad');
    out.textContent = r.blank ? 'Choose or type an answer first.' : r.unreadable ? 'That is not a number I can read. Try 3.2, 3e8 or 3×10^8.' : r.right ? 'Correct.' : it.type === 'msq' && r.partial ? 'Not quite: some of your picks are right, but MSQ needs every correct option and no wrong one.' : 'Not right yet. Try again, or open the solution.';
    if (r.blank || r.unreadable) { out.className = 'qb-out'; return; }
    if (r.right) await reveal();
    ctx.onCheck?.(r);
  });
  btnSol.addEventListener('click', () => { reveal(); ctx.onCheck?.({ right: false, gaveUp: true }); });
  return { el, read: () => R.read(ans), reveal };
}

// ---------- practice ----------
async function practice(root: HTMLElement) {
  const d = root.dataset;
  const bank = d.bank!;
  const idx = await loadIndex(bank).catch(() => null);
  const topicName = (t: string) => idx?.units.flatMap((u) => u.topics).find((x) => x.id === t)?.name ?? t;
  const fixedTopics = d.topics ? d.topics.split(',').map((s) => s.trim()).filter(Boolean) : null;
  const st = store(bank);
  const f: Record<string, any> = {
    exam: d.exam || '', type: d.type || '', level: d.level ? d.level.split(',').map(Number) : null, format: d.format || '', sub: d.sub || '',
    facets: d.facets ? Object.fromEntries(d.facets.split(',').map((kv) => kv.split('='))) : {},
  };
  const n = d.n ? Number(d.n) : 0;
  let topics = fixedTopics ?? [];
  let order: 'level' | 'shuffle' = 'level';
  let pool: Item[] = [], gens: Item[] = [], queue: (Item | { __gen: Item })[] = [], pos = 0;
  const tally = { tried: 0, right: 0 };

  root.innerHTML = '';
  const tools = h('div', { class: 'qb-tools' });
  const stage = h('div', { class: 'qb-stage' });
  const foot = h('div', { class: 'qb-foot' });
  root.append(tools, stage, foot);

  const sel = (label: string, opts: [string, string][], val: string, on: (v: string) => void) => {
    const s = h('select', { 'aria-label': label }, ...opts.map(([v, t]) => h('option', { value: v, selected: v === val }, t)));
    s.addEventListener('change', () => on(s.value));
    return h('label', { class: 'qb-sel' }, h('span', {}, label), s);
  };
  if (!fixedTopics && idx) {
    const opts: [string, string][] = [['', 'All topics']];
    for (const u of idx.units) { opts.push([`unit:${u.id}`, `${u.name} (all)`]); for (const t of u.topics) opts.push([t.id, `  · ${t.name}`]); }
    tools.append(sel('Topic', opts, '', (v) => { topics = !v ? idx.units.flatMap((u) => u.topics.map((t) => t.id)) : v.startsWith('unit:') ? idx.units.find((u) => u.id === v.slice(5))!.topics.map((t) => t.id) : [v]; refresh(true); }));
    topics = idx.units.flatMap((u) => u.topics.map((t) => t.id)).slice(0, 0);
  }
  if (!d.type) tools.append(sel('Type', [['', 'All types'], ...Object.entries(TYPES).filter(([k]) => ['mcq', 'msq', 'nat'].includes(k) || bank.match(/ielts|toefl|celpip/)) as [string, string][]], '', (v) => { f.type = v; refresh(); }));
  if (!d.level) tools.append(sel('Level', [['', 'All levels'], ...Object.entries(LEVELS) as [string, string][]], '', (v) => { f.level = v ? [Number(v)] : null; refresh(); }));
  if (!d.exam && idx?.exams && Object.keys(idx.exams).length > 1) tools.append(sel('Exam', [['', 'Any exam'], ...Object.entries(idx.exams)], '', (v) => { f.exam = v; refresh(); }));
  if (idx?.facets) for (const [k, fc] of Object.entries(idx.facets)) if (!f.facets[k]) tools.append(sel(fc.label, [['', 'All'], ...Object.entries(fc.values)], '', (v) => { f.facets[k] = v; refresh(); }));
  tools.append(sel('Order', [['level', 'In order: easy to hard'], ['shuffle', 'Shuffled']], 'level', (v) => { order = v as any; refresh(); }));

  const count = h('p', { class: 'qb-count' });
  root.insertBefore(count, stage);

  async function refresh(reload = false) {
    if (reload || !pool.length) {
      if (!topics.length && idx) topics = idx.units.flatMap((u) => u.topics.map((t) => t.id));
      stage.innerHTML = '<p class="qb-wait">Loading questions…</p>';
      ({ items: pool, gens } = await loadTopics(bank, topics));
    }
    const its = pool.filter((it) => matches(it, f) && it.type !== 'open' || (it.type === 'open' && (!f.type || f.type === 'open') && matches(it, f)));
    const gs = gens.filter((g) => matches(g, f));
    let q: (Item | { __gen: Item })[] = [...its, ...gs.map((g) => ({ __gen: g }))];
    const lv = (x: any) => (x.__gen ?? x).level;
    if (order === 'level') {
      const done = st.prog.done;
      q = q.sort((a, b) => lv(a) - lv(b));
      if (st.remember) q = [...q.filter((x: any) => done[(x.__gen ?? x).id] !== 1), ...q.filter((x: any) => done[(x.__gen ?? x).id] === 1)];
    } else q = shuffle(q);
    // Items that share a group (a passage or a recording) become one set, shown together in the group's own order.
    const bundled: any[] = [], sets = new Map<string, any>();
    for (const x of q as any[]) {
      const it = x.__gen ? null : x;
      if (it?.group && it.grp) {
        const key = `${it.topic}/${it.group}`;
        if (!sets.has(key)) { const set = { __set: key, grp: it.grp, items: [] as Item[] }; sets.set(key, set); bundled.push(set); }
        sets.get(key).items.push(it);
      } else bundled.push(x);
    }
    for (const set of sets.values()) set.items.sort((a: Item, b: Item) => pool.indexOf(a) - pool.indexOf(b));
    if (n) { let c = 0; queue = []; for (const x of bundled) { if (c >= n) break; queue.push(x); c += x.__set ? x.items.length : 1; } } else queue = bundled;
    pos = 0;
    count.textContent = `${its.length} written question${its.length === 1 ? '' : 's'}${gs.length ? ` + ${gs.length} template${gs.length === 1 ? '' : 's'} that make fresh numbers every time` : ''}${n && q.length > n ? ` (showing ${n})` : ''}.`;
    show();
  }

  async function show(seed?: number) {
    stage.innerHTML = '';
    if (!queue.length) { stage.append(h('p', { class: 'qb-wait' }, 'No questions match these filters yet. Try another level or type.')); return; }
    const x: any = queue[pos % queue.length];
    const nav = () => h('p', { class: 'qb-nav' },
      h('button', { type: 'button', class: 'btn ghost', disabled: pos === 0, onclick: () => { pos--; show(); } }, '← Previous'),
      h('span', {}, `${x.__set ? 'Set' : 'Question'} ${pos % queue.length + 1} of ${queue.length}`),
      h('button', { type: 'button', class: 'btn', onclick: () => { pos++; show(); } }, 'Next →'));
    if (x.__set) {
      const wrap = h('div', { class: 'qb-set' });
      const side = h('div', { class: 'qb-setside' }, await groupBlock(x.grp));
      const qs = h('div', { class: 'qb-setqs' });
      for (const it of x.items) {
        const c = await card(it, { topicName, mode: 'practice', noGroup: true,
          onCheck: (r) => { if (r.gaveUp && it.__counted) return; if (!it.__counted) { it.__counted = 1; tally.tried++; if (r.right) tally.right++; st.mark(it.id, !!r.right); paintFoot(); } } });
        qs.append(c.el);
      }
      wrap.append(side, qs);
      stage.append(wrap, nav());
      return;
    }
    const it = x.__gen ? instantiate(x.__gen, seed ?? newSeed()) : x;
    const c = await card(it, {
      topicName, mode: 'practice',
      onCheck: (r) => { if (r.gaveUp && it.__counted) return; if (!it.__counted) { it.__counted = 1; tally.tried++; if (r.right) tally.right++; st.mark(x.__gen ? x.__gen.id : it.id, !!r.right); paintFoot(); } },
      onNew: () => show(),
    });
    stage.append(c.el, nav());
  }

  function paintFoot() {
    foot.innerHTML = '';
    const solved = Object.values(st.prog.done).filter((v) => v === 1).length;
    const rem = h('input', { type: 'checkbox', checked: st.remember });
    rem.addEventListener('change', () => { st.setRemember((rem as HTMLInputElement).checked); paintFoot(); });
    foot.append(
      h('p', {}, `This session: ${tally.right} right out of ${tally.tried} tried. Solved so far: ${solved}.`),
      h('label', { class: 'qb-rem' }, rem, ' Remember my progress on this device (kept only in this browser; solved questions move to the end).'),
      h('button', { type: 'button', class: 'btn ghost', onclick: () => { st.clear(); tally.tried = tally.right = 0; paintFoot(); } }, 'Clear my progress'),
    );
  }
  paintFoot();
  await refresh(true);
}

// ---------- list (a short set with folded solutions) ----------
async function list(root: HTMLElement) {
  const d = root.dataset;
  const topics = (d.topics ?? '').split(',').filter(Boolean);
  const { items, gens } = await loadTopics(d.bank!, topics);
  const f = { exam: d.exam, type: d.type, level: d.level ? d.level.split(',').map(Number) : null, sub: d.sub };
  let set: Item[] = [...items.filter((i) => matches(i, f)), ...gens.filter((g) => matches(g, f)).map((g) => instantiate(g, newSeed()))];
  set = set.sort((a, b) => a.level - b.level).slice(0, Number(d.n || 5));
  root.innerHTML = '';
  for (const it of set) root.append((await card(it, { mode: 'practice' })).el);
}

// ---------- mock test ----------
async function mock(root: HTMLElement) {
  const d = root.dataset;
  const bank = d.bank!;
  const idx = await loadIndex(bank);
  const pat = (PATTERNS as any)[d.pattern || 'jam'];
  const scheme = SCHEMES[pat.scheme as keyof typeof SCHEMES];
  const mins = Number(d.minutes || pat.minutes);
  const topics = d.topics ? d.topics.split(',') : idx.units.flatMap((u) => u.topics.map((t) => t.id));
  const topicName = (t: string) => idx.units.flatMap((u) => u.topics).find((x) => x.id === t)?.name ?? t;
  root.innerHTML = '';
  const total = pat.sections.reduce((s: number, x: any) => s + x.count * (pat.marksMap?.[x.marks] ?? x.marks), 0);
  const intro = h('div', { class: 'qb-mockintro' },
    h('p', {}, `${pat.name}: ${pat.sections.reduce((s: number, x: any) => s + x.count, 0)} questions, ${total} marks, ${mins} minutes. Marking: ${scheme.name}. A new paper is drawn from the bank every time.`),
    h('ul', {}, ...pat.sections.map((s: any) => h('li', {}, `${s.name}: ${s.count} questions`))),
  );
  const start = h('button', { type: 'button', class: 'btn' }, 'Start the test');
  intro.append(start);
  root.append(intro);
  start.addEventListener('click', async () => {
    start.disabled = true; start.textContent = 'Drawing a paper…';
    const { items, gens } = await loadTopics(bank, topics);
    const ex = d.exam || pat.scheme;
    const pool = items.filter((i) => !i.exams || i.exams.includes(ex));
    const gpool = gens.filter((g) => !g.exams || g.exams.includes(ex));
    const paper = buildPaper(pat, pool, gpool);
    const qs: { it: Item; sec: string; marks: number; card?: any; resp?: any; flag?: boolean }[] = [];
    for (const s of paper.sections) for (const it of s.items) qs.push({ it, sec: s.name, marks: pat.marksMap?.[s.marks] ?? s.marks });
    const short = paper.sections.reduce((a: number, s: any) => a + s.short, 0);
    root.innerHTML = '';
    const head = h('div', { class: 'qb-mockhead' });
    const timer = h('span', { class: 'qb-timer', role: 'timer' });
    const pal = h('div', { class: 'qb-palette', role: 'navigation', 'aria-label': 'Questions' });
    const body = h('div', { class: 'qb-mockbody' });
    const submit = h('button', { type: 'button', class: 'btn' }, 'Submit test');
    head.append(timer, submit);
    root.append(head, short ? h('p', { class: 'qb-hint' }, `The bank does not have enough questions for every section yet, so this paper has ${short} fewer. It grows with every update.`) : '', pal, body);
    let cur = 0;
    const end = Date.now() + mins * 60000;
    async function go(i: number) {
      if (qs[cur]?.card) qs[cur].resp = qs[cur].card.read();
      cur = i;
      const q = qs[i];
      body.innerHTML = '';
      q.card ??= await card(q.it, { mode: 'mock', topicName });
      body.append(h('p', { class: 'qb-sec' }, `${q.sec} · Question ${i + 1} of ${qs.length}`), q.card.el,
        h('p', { class: 'qb-nav' },
          h('button', { type: 'button', class: 'btn ghost', disabled: i === 0, onclick: () => go(i - 1) }, '← Previous'),
          h('button', { type: 'button', class: 'btn ghost', onclick: () => { q.flag = !q.flag; paint(); } }, q.flag ? 'Unmark review' : 'Mark for review'),
          h('button', { type: 'button', class: 'btn', onclick: () => go(Math.min(qs.length - 1, i + 1)) }, 'Save and next →')));
      paint();
    }
    function answered(q: any) { const r = q === qs[cur] && q.card ? q.card.read() : q.resp; return !(r == null || r === '' || (Array.isArray(r) && !r.length)); }
    function paint() {
      pal.innerHTML = '';
      qs.forEach((q, i) => pal.append(h('button', { type: 'button', class: `qb-pb${i === cur ? ' cur' : ''}${answered(q) ? ' done' : ''}${q.flag ? ' flag' : ''}`, onclick: () => go(i), 'aria-label': `Question ${i + 1}` }, String(i + 1))));
    }
    const tick = setInterval(() => {
      const left = Math.max(0, end - Date.now());
      const m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
      timer.textContent = `Time left ${m}:${String(s).padStart(2, '0')}`;
      if (!left) finish();
    }, 1000);
    async function finish() {
      clearInterval(tick);
      if (qs[cur]?.card) qs[cur].resp = qs[cur].card.read();
      let got = 0, right = 0, wrong = 0, blank = 0;
      const rows = new Map<string, { got: number; max: number }>();
      for (const q of qs) {
        const r = score(pat.scheme, q.it, q.resp, q.marks);
        got += r.marks; r.blank ? blank++ : r.right ? right++ : wrong++;
        const t = topicName(q.it.topic); const row = rows.get(t) ?? { got: 0, max: 0 }; row.got += r.marks; row.max += q.marks; rows.set(t, row);
        (q as any).r = r;
      }
      root.innerHTML = '';
      const max = qs.reduce((s, q) => s + q.marks, 0);
      root.append(h('div', { class: 'qb-result' },
        h('p', { class: 'qb-big' }, `${Math.round(got * 100) / 100} / ${max}`),
        h('p', {}, `${right} right, ${wrong} wrong, ${blank} left blank. Marking: ${scheme.name}.`),
        h('table', { class: 'qb-topics' }, h('tr', {}, h('th', {}, 'Topic'), h('th', {}, 'Marks')), ...[...rows].sort((a, b) => a[1].got / a[1].max - b[1].got / b[1].max).map(([t, r]) => h('tr', {}, h('td', {}, t), h('td', {}, `${Math.round(r.got * 100) / 100} / ${r.max}`)))),
        h('p', { class: 'qb-hint' }, 'Weakest topics are at the top. Your answers and solutions are below.'),
        h('button', { type: 'button', class: 'btn', onclick: () => mock(root) }, 'Take another paper')));
      for (const [i, q] of qs.entries()) {
        const c = await card(q.it, { mode: 'practice', topicName });
        const r = (q as any).r;
        c.el.prepend(h('p', { class: `qb-out ${r.right ? 'ok' : r.blank ? '' : 'bad'}` }, `Q${i + 1}: ${r.blank ? 'not answered' : r.right ? 'right' : 'wrong'} (${r.marks >= 0 ? '+' : ''}${r.marks})`));
        await c.reveal();
        root.append(c.el);
      }
    }
    submit.addEventListener('click', () => { if (submit.dataset.sure) finish(); else { submit.dataset.sure = '1'; submit.textContent = 'Press again to submit'; setTimeout(() => { delete submit.dataset.sure; submit.textContent = 'Submit test'; }, 4000); } });
    go(0);
  });
}

// ---------- mount ----------
const MODES: Record<string, (el: HTMLElement) => Promise<void>> = { practice, mock, list };
function mountAll() {
  document.querySelectorAll<HTMLElement>('.qbank[data-bank]:not([data-qb-on])').forEach((el) => {
    el.dataset.qbOn = '1';
    const run = () => (MODES[el.dataset.mode || 'practice'] ?? practice)(el).catch((e) => { console.error('qbank', e); el.textContent = 'These questions could not load. Try reloading the page.'; });
    if (!('IntersectionObserver' in window)) return run();
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); run(); } }, { rootMargin: '400px' });
    io.observe(el);
  });
}
mountAll();
