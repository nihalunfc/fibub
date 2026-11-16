// The shared engine for Home skills lessons (Learn > Courses: tyres and punctures, hand tools, light carpentry,
// wall fixings, how machines work). Markup lives in each lesson's Tool.astro; this file wires it up. Styles:
// src/styles/skill.css (sk- classes). Nothing is sent anywhere. Step ticks are kept only if the visitor ticks
// "Remember my ticks on this device" (off by default), in localStorage `fibub-skill-<id>-v1`, with a Clear button.
//
//   import { mountSteps, mountLabels, mountOrder } from '../../lib/learn/skill';
//   mountSteps(root.querySelector('.sk-steps-card')!, 'change-flat-tyre');   // <ol class="sk-steps"><li class="sk-step">...
//   mountLabels(root.querySelector('.sk-label')!);                          // an <svg> with <g data-part data-name data-note>
//   mountOrder(root.querySelector('.sk-order')!, ['First', 'Second', ...]);  // the right order; shown shuffled

const mk = <K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', txt = '') => {
  const e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e;
};
const btn = (cls: string, txt: string) => { const b = mk('button', 'sk-btn ' + cls, txt); b.type = 'button'; return b; };

/** Step cards: adds a Done tick to each `.sk-step`, a progress line, and Remember / Clear / Print buttons. */
export function mountSteps(card: HTMLElement, id: string) {
  const KEY = `fibub-skill-${id}-v1`;
  const steps = [...card.querySelectorAll<HTMLElement>('.sk-step')];
  const prog = mk('p', 'sk-progress'); prog.setAttribute('aria-live', 'polite');
  const meter = mk('div', 'sk-meter'); const fill = mk('span'); meter.append(fill);
  card.querySelector('.sk-steps')!.before(prog, meter);
  const ticks = steps.map((li, i) => {
    const lab = mk('label', 'sk-done'), cb = mk('input'); cb.type = 'checkbox';
    cb.setAttribute('aria-label', `Step ${i + 1} done`); lab.append(cb, document.createTextNode(' Done'));
    li.append(lab); return cb;
  });
  const bar = mk('div', 'sk-bar');
  const remLab = mk('label', 'sk-remember'), rem = mk('input'); rem.type = 'checkbox';
  remLab.append(rem, document.createTextNode(' Remember my ticks on this device'));
  const clear = btn('sk-clear', 'Clear ticks'), print = btn('sk-printbtn', 'Print checklist');
  bar.append(remLab, clear, print); card.append(bar);
  const note = mk('p', 'sk-small', 'Ticks stay on this page only, unless you tick Remember. Then they are kept in this browser, never sent anywhere, until you press Clear ticks.');
  card.append(note);
  const save = () => { try { if (rem.checked) localStorage.setItem(KEY, JSON.stringify(ticks.map((t) => t.checked))); else localStorage.removeItem(KEY); } catch { /* storage blocked */ } };
  const show = () => {
    const n = ticks.filter((t) => t.checked).length;
    steps.forEach((li, i) => li.classList.toggle('is-done', ticks[i].checked));
    prog.textContent = n === steps.length ? `All ${n} steps done. Nice work.` : `${n} of ${steps.length} steps done`;
    fill.style.width = `${(100 * n) / steps.length}%`;
  };
  try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (Array.isArray(s)) { rem.checked = true; s.forEach((v, i) => { if (ticks[i]) ticks[i].checked = !!v; }); } } catch { /* none */ }
  ticks.forEach((t) => t.addEventListener('change', () => { show(); save(); }));
  rem.addEventListener('change', save);
  clear.addEventListener('click', () => { ticks.forEach((t) => (t.checked = false)); rem.checked = false; save(); show(); });
  print.addEventListener('click', () => { document.documentElement.classList.add('sk-printing'); card.classList.add('sk-printable'); window.print(); });
  window.addEventListener('afterprint', () => { document.documentElement.classList.remove('sk-printing'); card.classList.remove('sk-printable'); });
  show();
  return { ticks, show };
}

/**
 * Tap-to-label picture. The box holds an <svg> whose parts are <g data-part="id" data-name="Wheel brace"
 * data-note="One line on what it does">. Explore: tap a part to see its name. Test: "Tap the ..." with a score.
 */
export function mountLabels(box: HTMLElement) {
  const parts = [...box.querySelectorAll<SVGGElement>('[data-part]')];
  const seg = mk('div', 'ax-seg sk-mode'); seg.setAttribute('role', 'group'); seg.setAttribute('aria-label', 'Mode');
  const bExp = btn('', 'Explore'), bTest = btn('', 'Test me'); seg.append(bExp, bTest);
  const out = mk('p', 'sk-label-out'); out.setAttribute('aria-live', 'polite');
  box.prepend(seg); box.append(out);
  let mode: 'explore' | 'test' = 'explore', target = -1, score = 0, tries = 0, order: number[] = [];
  const name = (i: number) => parts[i].dataset.name || parts[i].dataset.part || '';
  const mark = (i: number, cls: string) => { parts.forEach((p) => p.classList.remove('sk-on', 'sk-right', 'sk-wrong')); if (i >= 0) parts[i].classList.add(cls); };
  const next = () => {
    if (!order.length) { out.innerHTML = `<strong>Done: ${score} of ${tries} right first time.</strong> Press Test me to go again.`; target = -1; return; }
    target = order.shift()!; out.innerHTML = `Tap the <strong>${name(target)}</strong>. <span class="sk-small">${score} right so far.</span>`;
  };
  let firstTry = true;
  const setMode = (m: typeof mode) => {
    mode = m; bExp.setAttribute('aria-pressed', String(m === 'explore')); bTest.setAttribute('aria-pressed', String(m === 'test'));
    parts.forEach((p, i) => p.setAttribute('aria-label', m === 'explore' ? name(i) : `Part ${i + 1}`)); mark(-1, '');
    if (m === 'test') { order = parts.map((_, i) => i).sort(() => Math.random() - 0.5); score = 0; tries = 0; firstTry = true; next(); }
    else out.textContent = 'Tap any part of the picture to see what it is.';
  };
  const hit = (i: number) => {
    if (mode === 'explore') { mark(i, 'sk-on'); const n = parts[i].dataset.note; out.innerHTML = `<strong>${name(i)}</strong>${n ? `: ${n}` : ''}`; return; }
    if (target < 0) return;
    if (i === target) { if (firstTry) score++; tries++; firstTry = true; mark(i, 'sk-right'); out.innerHTML = `Yes, that is the <strong>${name(i)}</strong>.`; setTimeout(next, 900); }
    else { if (firstTry) { firstTry = false; } mark(i, 'sk-wrong'); out.innerHTML = `That is the ${name(i)}. Try again: tap the <strong>${name(target)}</strong>.`; }
  };
  parts.forEach((p, i) => {
    p.setAttribute('role', 'button'); p.setAttribute('tabindex', '0'); p.classList.add('sk-part');
    p.addEventListener('click', () => hit(i));
    p.addEventListener('keydown', (e) => { if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') { e.preventDefault(); hit(i); } });
  });
  bExp.addEventListener('click', () => setMode('explore')); bTest.addEventListener('click', () => setMode('test'));
  setMode('explore');
  return { parts, setMode, hit };
}

/** Put-in-order activity: shows `right` shuffled with up/down buttons; Check marks each place. */
export function mountOrder(box: HTMLElement, right: string[]) {
  const list = mk('ol', 'sk-order-list'), out = mk('p', 'sk-order-out'); out.setAttribute('aria-live', 'polite');
  const bar = mk('div', 'sk-bar'), check = btn('sk-check', 'Check my order'), mix = btn('sk-mix', 'Shuffle');
  bar.append(check, mix); box.append(list, bar, out);
  let cur: string[] = [];
  const render = (marked = false) => {
    list.replaceChildren(...cur.map((s, i) => {
      const li = mk('li', marked ? (s === right[i] ? 'sk-right' : 'sk-wrong') : ''), t = mk('span', 'sk-order-t', s);
      const up = btn('sk-up', '↑'), dn = btn('sk-dn', '↓');
      up.setAttribute('aria-label', `Move "${s}" up`); dn.setAttribute('aria-label', `Move "${s}" down`);
      up.disabled = i === 0; dn.disabled = i === cur.length - 1;
      up.addEventListener('click', () => { [cur[i - 1], cur[i]] = [cur[i], cur[i - 1]]; render(); (list.children[i - 1]?.querySelector('.sk-up, .sk-dn') as HTMLElement | null)?.focus(); });
      dn.addEventListener('click', () => { [cur[i + 1], cur[i]] = [cur[i], cur[i + 1]]; render(); (list.children[i + 1]?.querySelector('.sk-dn, .sk-up') as HTMLElement | null)?.focus(); });
      li.append(t, up, dn); return li;
    }));
  };
  const shuffle = () => {
    do { cur = [...right].sort(() => Math.random() - 0.5); } while (right.length > 1 && cur.every((s, i) => s === right[i]));
    out.textContent = 'Move the steps with the arrows, then press Check my order.'; render();
  };
  check.addEventListener('click', () => {
    const ok = cur.filter((s, i) => s === right[i]).length; render(true);
    out.textContent = ok === right.length ? `All ${ok} in the right order.` : `${ok} of ${right.length} in the right place. The ones marked ✗ need to move.`;
  });
  mix.addEventListener('click', shuffle);
  shuffle();
  return { get order() { return cur; }, set order(v: string[]) { cur = [...v]; render(); } };
}

/** A pick-one quiz item for mountQuiz with the choices shuffled: choice('Q?', 'Right one', ['Wrong', 'Wrong'], 'Why.'). */
export function choice(q: string, right: string, wrong: string[], work: string) {
  const choices = [right, ...wrong].sort(() => Math.random() - 0.5);
  return { q, choices, ans: choices.indexOf(right), work };
}
/** n items from a bank, in random order. */
export const some = <T>(bank: readonly T[], n: number) => [...bank].sort(() => Math.random() - 0.5).slice(0, n);
