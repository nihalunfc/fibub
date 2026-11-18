// Progress for the long text courses (src/courses/). Kept only in the learner's browser:
// sessionStorage (this tab) by default, localStorage when they tick "Remember my progress on this device".
// They can download it as a JSON file and load it back on another device. Nothing is sent anywhere.
type Progress = { v: 1; course: string; done: Record<string, string>; quiz: Record<string, [number, number]> };

// The lesson list is open beside the text on computers and folded at the top on phones.
const side = document.querySelector<HTMLDetailsElement>('.cs-side');
if (side && matchMedia('(min-width: 960px)').matches) side.open = true;

const root = document.querySelector<HTMLElement>('[data-course]');
if (root) {
  const id = root.dataset.course!;
  const KEY = `fibub-course-${id}-v1`;
  const empty = (): Progress => ({ v: 1, course: id, done: {}, quiz: {} });
  const get = (s: Storage) => { try { return s.getItem(KEY); } catch { return null; } };
  const valid = (p: unknown): p is Progress => !!p && typeof p === 'object' && (p as Progress).v === 1 && (p as Progress).course === id
    && typeof (p as Progress).done === 'object' && typeof (p as Progress).quiz === 'object';
  const parse = (s: string | null) => { try { const p = s && JSON.parse(s); return valid(p) ? p : null; } catch { return null; } };

  let remember = !!get(localStorage);
  let prog: Progress = parse(get(localStorage)) ?? parse(get(sessionStorage)) ?? empty();
  const today = () => new Date().toISOString().slice(0, 10);

  function save() {
    try {
      const s = JSON.stringify(prog);
      if (remember) { localStorage.setItem(KEY, s); sessionStorage.removeItem(KEY); }
      else { sessionStorage.setItem(KEY, s); localStorage.removeItem(KEY); }
    } catch { /* storage blocked: progress lasts for this page only */ }
    paint();
  }

  const msg = (t: string) => { const m = root.querySelector('[data-prog-msg]'); if (m) m.textContent = t; };
  const lessonSlug = root.dataset.lesson;

  function paint() {
    root!.querySelectorAll<HTMLAnchorElement>('a[data-lesson]').forEach((a) => a.classList.toggle('done', !!prog.done[a.dataset.lesson!]));
    const total = Number(root!.dataset.total || 0), n = Object.keys(prog.done).length;
    root!.querySelectorAll('[data-prog-count]').forEach((e) => (e.textContent = String(n)));
    root!.querySelectorAll<HTMLElement>('[data-prog-bar]').forEach((e) => (e.style.width = `${total ? Math.min(100, (100 * n) / total) : 0}%`));
    const rem = root!.querySelector<HTMLInputElement>('[data-prog-remember]'); if (rem) rem.checked = remember;
    const btn = root!.querySelector<HTMLButtonElement>('[data-mark-done]');
    if (btn && lessonSlug) { const d = !!prog.done[lessonSlug]; btn.textContent = d ? '✓ Done (tap to undo)' : 'Mark this lesson as done'; btn.classList.toggle('is-done', d); }
  }

  root.querySelector('[data-mark-done]')?.addEventListener('click', () => {
    if (!lessonSlug) return;
    if (prog.done[lessonSlug]) delete prog.done[lessonSlug]; else prog.done[lessonSlug] = today();
    save();
  });
  root.querySelector<HTMLInputElement>('[data-prog-remember]')?.addEventListener('change', (e) => { remember = (e.target as HTMLInputElement).checked; save(); });
  root.querySelector('[data-prog-clear]')?.addEventListener('click', () => {
    prog = empty(); try { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY); } catch { /* */ }
    remember = false; paint(); msg('Progress cleared from this browser.');
  });
  root.querySelector('[data-prog-download]')?.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(prog, null, 2)], { type: 'application/json' }));
    a.download = `fibub-${id}-progress-${today()}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  root.querySelector<HTMLInputElement>('[data-prog-upload]')?.addEventListener('change', async (e) => {
    const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return;
    const p = parse(await f.text());
    if (!p) { msg('That file is not a progress file for this course.'); return; }
    Object.assign(prog.done, p.done); Object.assign(prog.quiz, p.quiz); save();
    msg(`Loaded: ${Object.keys(p.done).length} lessons marked done.`);
  });

  // Quiz: pick one answer per question; the reason shows either way. The score is kept with the progress.
  const quiz = root.querySelector<HTMLElement>('[data-quiz]');
  if (quiz && lessonSlug) {
    const qs = [...quiz.querySelectorAll<HTMLFieldSetElement>('.cs-q')];
    let right = 0, answered = 0;
    qs.forEach((fs) => fs.addEventListener('click', (ev) => {
      const b = (ev.target as HTMLElement).closest<HTMLButtonElement>('button[data-choice]');
      if (!b || fs.dataset.done) return;
      fs.dataset.done = '1'; answered++;
      const ok = Number(b.dataset.choice) === Number(fs.dataset.ans); if (ok) right++;
      b.classList.add(ok ? 'right' : 'wrong');
      fs.querySelector<HTMLButtonElement>(`button[data-choice="${fs.dataset.ans}"]`)?.classList.add('right');
      fs.querySelectorAll('button').forEach((x) => x.setAttribute('aria-disabled', 'true'));
      const why = fs.querySelector<HTMLElement>('.cs-why')!; why.hidden = false; why.prepend(ok ? 'Right. ' : 'Not quite. ');
      if (answered === qs.length) {
        quiz.querySelector('[data-quiz-score]')!.textContent = `You got ${right} of ${qs.length}.${right === qs.length ? ' Well done.' : ' Read the reasons above, then try the lesson again later.'}`;
        prog.quiz[lessonSlug] = [right, qs.length]; save();
      }
    }));
  }
  paint();
}
