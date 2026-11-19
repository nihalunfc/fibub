// Starts the Nobel series explainers: every <div data-nx="name"></div> in an article loads
// src/scripts/nobel/x/<name>.ts the first time it comes near the screen (so a page loads only
// the explainers someone scrolls to).
const mods = import.meta.glob('./x/*.ts') as Record<string, () => Promise<{ default: (el: HTMLElement) => void }>>;

export function start() {
  const els = [...document.querySelectorAll<HTMLElement>('[data-nx]')];
  if (!els.length) return;
  const load = (el: HTMLElement) => {
    if (el.dataset.nxOn) return;
    el.dataset.nxOn = '1';
    const f = mods[`./x/${el.dataset.nx}.ts`];
    if (!f) return;
    f().then((m) => { el.textContent = ''; m.default(el); }).catch(() => { el.textContent = 'This explainer could not load. Reload the page to try again.'; });
  };
  if (!('IntersectionObserver' in window)) { els.forEach(load); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); load(e.target as HTMLElement); } }), { rootMargin: '400px 0px' });
  els.forEach((el) => io.observe(el));
}
