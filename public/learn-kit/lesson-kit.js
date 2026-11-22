// Lesson kit runtime: loaded on the lessons of courses with `kit: true` in their syllabus (src/courses/<id>/syllabus.ts).
// What it turns on, from plain HTML in a lesson's Markdown:
//   <div class="fig" data-fig="name"></div>           an interactive figure: /learn-kit/<course>/figs/<name>.js (default export mount(el, api))
//   <div class="steps" data-fig="name"> <div class="step">...</div> ... </div>
//                                                       "Watch it happen": one step at a time with Back, Play and Next;
//                                                       the figure is told the step (controller.step(i))
//   <div class="problem" data-problem="id"></div>       a live problem from /learn-kit/<course>/problems.js: fresh numbers, check, hint, solution
//   <span class="count" data-to="13.8"></span>          a number that counts up when it scrolls into view
//   class="reveal" on any block                         fades in when it scrolls into view
//   [data-action="summary-sheet"]                       prints the one-page summary (key points, meaning boxes, formulas)
// Nothing is sent anywhere; figures run in the browser.
const root = document.querySelector('[data-kit]');
const base = root?.dataset.kit || '';
const course = root?.dataset.course || 'figure';
const ver = new URL(import.meta.url).search;
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const onView = (el, fn, margin = '200px') => {
  if (!('IntersectionObserver' in window)) return fn();
  const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); fn(); } }, { rootMargin: margin });
  io.observe(el);
};

const mods = new Map();
const load = (name) => {
  if (!mods.has(name)) mods.set(name, import(`${base}figs/${name}.js${ver}`));
  return mods.get(name);
};

/** Mount a figure into `host`; resolves to its controller (may be undefined). */
async function mount(host, name, extra = {}) {
  host.classList.add('lk-fig');
  try {
    const m = await load(name);
    const ctl = await m.default(host, { ...extra, data: { ...host.dataset } });
    addDownload(host, name);
    return ctl;
  } catch (e) {
    console.error('figure', name, e);
    const p = document.createElement('p');
    p.className = 'lk-err';
    p.textContent = 'This figure could not load. Try reloading the page.';
    host.appendChild(p);
  }
}

/** A "Download PNG" link for the figure's first canvas (with its watermark). */
function addDownload(host, name) {
  const c = host.querySelector('canvas');
  if (!c || host.querySelector('.lk-dl')) return;
  const a = document.createElement('button');
  a.type = 'button'; a.className = 'lk-dl'; a.textContent = '⤓ PNG';
  a.title = 'Download this figure as a picture';
  a.addEventListener('click', () => {
    const cv = host.querySelector('canvas');
    cv.toBlob((b) => {
      const u = URL.createObjectURL(b), l = document.createElement('a');
      l.href = u; l.download = `fibub-${course}-${name}.png`;
      document.body.appendChild(l); l.click(); l.remove();
      setTimeout(() => URL.revokeObjectURL(u), 2000);
    });
  });
  const cap = host.querySelector(':scope > figcaption');
  cap ? host.insertBefore(a, cap) : host.appendChild(a);
}

// 1. Plain figures
for (const el of document.querySelectorAll('.fig[data-fig]')) onView(el, () => mount(el, el.dataset.fig));

// 2. "Watch it happen" step players
for (const box of document.querySelectorAll('.steps')) {
  const steps = [...box.querySelectorAll(':scope > .step')];
  if (!steps.length) continue;
  box.classList.add('lk-steps');
  const head = document.createElement('p');
  head.className = 'lk-steps-head';
  head.textContent = box.dataset.title || 'Watch it happen';
  const stage = document.createElement('div');
  stage.className = 'lk-stage';
  const textWrap = document.createElement('div');
  textWrap.className = 'lk-step-text';
  textWrap.setAttribute('aria-live', 'polite');
  steps.forEach((s) => textWrap.appendChild(s));
  const bar = document.createElement('div');
  bar.className = 'lk-step-bar';
  const back = Object.assign(document.createElement('button'), { type: 'button', className: 'lk-btn', textContent: '◀ Back' });
  const play = Object.assign(document.createElement('button'), { type: 'button', className: 'lk-btn lk-play', textContent: '▶ Play' });
  const next = Object.assign(document.createElement('button'), { type: 'button', className: 'lk-btn', textContent: 'Next ▶' });
  const dots = document.createElement('span');
  dots.className = 'lk-dots';
  const dotEls = steps.map((_, i) => {
    const d = Object.assign(document.createElement('button'), { type: 'button', className: 'lk-dot' });
    d.setAttribute('aria-label', `Step ${i + 1}`);
    d.addEventListener('click', () => { stopPlay(); go(i); });
    dots.appendChild(d);
    return d;
  });
  const count = document.createElement('span');
  count.className = 'lk-count';
  bar.append(back, play, next, dots, count);
  box.replaceChildren(head, ...(box.dataset.fig ? [stage] : []), textWrap, bar);

  let i = 0, ctl = null, timer = 0;
  const go = (k) => {
    i = Math.max(0, Math.min(steps.length - 1, k));
    steps.forEach((s, j) => { s.hidden = j !== i; s.classList.toggle('lk-in', j === i && !calm); });
    dotEls.forEach((d, j) => d.setAttribute('aria-current', String(j === i)));
    count.textContent = `${i + 1} / ${steps.length}`;
    back.disabled = i === 0;
    next.disabled = i === steps.length - 1;
    ctl?.step?.(i, steps.length);
  };
  const stopPlay = () => { clearTimeout(timer); timer = 0; play.textContent = '▶ Play'; };
  const tick = () => {
    if (i >= steps.length - 1) return stopPlay();
    go(i + 1);
    timer = setTimeout(tick, +(steps[i].dataset.ms || box.dataset.ms || 5500));
  };
  play.addEventListener('click', () => {
    if (timer) return stopPlay();
    if (i >= steps.length - 1) go(0);
    play.textContent = '❚❚ Pause';
    timer = setTimeout(tick, +(steps[i].dataset.ms || box.dataset.ms || 5500));
  });
  back.addEventListener('click', () => { stopPlay(); go(i - 1); });
  next.addEventListener('click', () => { stopPlay(); go(i + 1); });
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { stopPlay(); go(i + 1); }
    if (e.key === 'ArrowLeft') { stopPlay(); go(i - 1); }
  });
  go(0);
  if (box.dataset.fig) onView(stage, async () => { ctl = await mount(stage, box.dataset.fig, { steps: steps.length }); ctl?.step?.(i, steps.length); });
}

// 3. Live problems
const problemEls = document.querySelectorAll('.problem[data-problem]');
let problemsMod;
const parseNum = (s) => {
  let t = String(s).trim().toLowerCase().replace(/[\s,]/g, '').replace(/−/g, '-');
  t = t.replace(/(?:×|x|\*)10\^?(-?\d+)/, 'e$1').replace(/^10\^(-?\d+)$/, '1e$1');
  if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/.test(t)) return NaN;
  return parseFloat(t);
};
const show = (n) => {
  const a = Math.abs(n);
  if (a !== 0 && (a >= 1e6 || a < 1e-3)) return n.toExponential(3).replace(/e\+?(-?\d+)/, ' × 10^$1');
  return (+n.toPrecision(4)).toLocaleString('en-CA', { maximumFractionDigits: 6 });
};
for (const el of problemEls) {
  onView(el, async () => {
    problemsMod ??= import(`${base}problems.js${ver}`);
    let P;
    try { P = (await problemsMod).default[el.dataset.problem]; } catch (e) { console.error(e); }
    if (!P) { el.textContent = 'This problem could not load.'; return; }
    el.classList.add('lk-problem');
    const render = () => {
      const p = P.make(Math.random);
      el.innerHTML = '';
      const h = document.createElement('p');
      h.className = 'lk-p-head';
      h.textContent = `Try it: ${P.title}`;
      const q = document.createElement('div');
      q.className = 'lk-p-q';
      q.innerHTML = p.q;
      const form = document.createElement('form');
      form.className = 'lk-p-form';
      const inp = Object.assign(document.createElement('input'), { type: 'text', inputMode: 'decimal', autocomplete: 'off', placeholder: 'Your answer' });
      inp.setAttribute('aria-label', 'Your answer' + (p.unit ? ` in ${p.unit}` : ''));
      const unit = document.createElement('span');
      unit.className = 'lk-unit';
      unit.innerHTML = p.unit || '';
      const check = Object.assign(document.createElement('button'), { type: 'submit', className: 'lk-btn lk-primary', textContent: 'Check' });
      const hintB = Object.assign(document.createElement('button'), { type: 'button', className: 'lk-btn', textContent: 'Hint' });
      const solB = Object.assign(document.createElement('button'), { type: 'button', className: 'lk-btn', textContent: 'Show solution' });
      const newB = Object.assign(document.createElement('button'), { type: 'button', className: 'lk-btn', textContent: '↻ New numbers' });
      form.append(inp, unit, check, hintB, solB, newB);
      const fb = document.createElement('p');
      fb.className = 'lk-p-fb'; fb.setAttribute('role', 'status');
      const hint = document.createElement('div');
      hint.className = 'lk-p-hint'; hint.hidden = true; hint.innerHTML = '<b>Hint:</b> ' + p.hint;
      const sol = document.createElement('div');
      sol.className = 'lk-p-sol'; sol.hidden = true;
      sol.innerHTML = '<b>Worked solution</b>' + p.solution + `<p class="lk-p-ans">Answer: <b>${show(p.answer)}</b> ${p.unit || ''}</p>`;
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const v = parseNum(inp.value);
        if (Number.isNaN(v)) { fb.className = 'lk-p-fb'; fb.textContent = 'Type a number, for example 4.2 or 3e8.'; return; }
        const tol = p.tol ?? 0.02;
        const ok = p.answer === 0 ? Math.abs(v) < (p.abs ?? 1e-9) : Math.abs(v - p.answer) <= Math.abs(p.answer) * tol + (p.abs ?? 0);
        fb.className = 'lk-p-fb ' + (ok ? 'ok' : 'no');
        fb.textContent = ok ? `Correct! The answer is ${show(p.answer)} ${p.unit ? p.unit.replace(/<[^>]+>/g, '') : ''}.` : (p.check?.(v) || 'Not quite. Check your units and powers of ten, or take the hint.');
      });
      hintB.addEventListener('click', () => { hint.hidden = !hint.hidden; });
      solB.addEventListener('click', () => { sol.hidden = !sol.hidden; solB.textContent = sol.hidden ? 'Show solution' : 'Hide solution'; });
      newB.addEventListener('click', render);
      el.append(h, q, form, fb, hint, sol);
    };
    render();
  });
}

// 4. Count-up numbers and reveals
for (const el of document.querySelectorAll('.count[data-to]')) {
  const to = parseFloat(el.dataset.to), dp = (el.dataset.to.split('.')[1] || '').length;
  el.textContent = calm ? to.toFixed(dp) : (0).toFixed(dp);
  if (calm) continue;
  onView(el, () => {
    const t0 = performance.now(), dur = 1400;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = (to * e).toLocaleString('en-CA', { minimumFractionDigits: dp, maximumFractionDigits: dp });
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, '0px');
}
if (!calm) for (const el of document.querySelectorAll('.cs-body .reveal')) {
  el.classList.add('lk-hide');
  onView(el, () => el.classList.remove('lk-hide'), '-40px');
}

// 5. Summary sheet (print to PDF) and full print: show every step
// The sheet is built on demand from the lesson: title, summary, key points, physical-meaning boxes,
// misconception boxes and the display formulas, with the address so a printout leads back here.
function buildSheet() {
  document.getElementById('lk-sheet')?.remove();
  const art = document.querySelector('.cs-lesson') || document.body;
  const sheet = document.createElement('div');
  sheet.id = 'lk-sheet';
  const head = document.createElement('p');
  head.className = 'lk-sheet-head';
  head.textContent = `fibub.com · ${document.querySelector('.cs-kicker')?.textContent || ''}`;
  sheet.appendChild(head);
  for (const sel of ['h1', '.lead']) { const e = art.querySelector(sel); if (e) sheet.appendChild(e.cloneNode(true)); }
  const body = art.querySelector('.cs-body') || art;
  const picks = body.querySelectorAll('.keypoints, .meaning, .myth, .cs-math');
  picks.forEach((e) => sheet.appendChild(e.cloneNode(true)));
  const foot = document.createElement('p');
  foot.className = 'lk-sheet-foot';
  foot.textContent = `Free lesson with animations, live problems and a quiz: ${location.origin}${location.pathname}`;
  sheet.appendChild(foot);
  document.body.appendChild(sheet);
}
document.querySelector('[data-action="summary-sheet"]')?.addEventListener('click', () => {
  buildSheet();
  document.body.classList.add('print-summary');
  setTimeout(() => window.print(), 50);
});
addEventListener('beforeprint', () => {
  for (const s of document.querySelectorAll('.lk-steps .step')) { s.dataset.was = s.hidden ? '1' : '0'; s.hidden = false; }
});
addEventListener('afterprint', () => {
  document.body.classList.remove('print-summary');
  document.getElementById('lk-sheet')?.remove();
  for (const s of document.querySelectorAll('.lk-steps .step[data-was]')) { s.hidden = s.dataset.was === '1'; delete s.dataset.was; }
});
