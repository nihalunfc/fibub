// Vocabulary range meter: type or paste an answer (it stays on your device) or load a sample, and see how many words come from
// a list of the most common English words and how many are less common, plus how many different words you used. A rough guide
// only: examiners judge precision and naturalness, not a percentage. Try the two samples, then improve one of your own.
import { canvas, text, title, row, button, readout, put } from '../kit.js';
import { box } from './_lang.js';

const COMMON = new Set(('a able about after again all also always am an and any are as at back be because been before being best big but by can come could day did do does down each even every first for from get give go going good got great had has have he her here him his how i if in into is it its just know like little long look made make many may me more most much my new no not now of off on one only or other our out over people place put said see she should so some such take than that the their them then there these they thing think this those time to too two up us use very want was way we well were what when which who will with would year you your things many lot really important problem people government good bad').split(/\s+/));
const SAMPLES = {
  plain: 'I think that technology is very good for people. A lot of people use phones every day and they get a lot of things done. But it can be bad too, because some people spend too much time on it and do not talk to their family. I think we should use it in a good way.',
  rich: 'Technology has undoubtedly transformed daily life, enabling millions of people to communicate instantly and access information that was once out of reach. Nevertheless, excessive screen time can erode face-to-face relationships, so users should adopt sensible habits and treat devices as tools rather than distractions.',
};
export default function (host) {
  const cv = canvas(host, { aspect: 0.4, max: 170, min: 150, label: 'Bars showing common and less common words' });
  const ta = document.createElement('textarea'); ta.rows = 5; ta.value = SAMPLES.plain; ta.setAttribute('aria-label', 'Your answer, not saved or sent');
  ta.style.cssText = 'width:100%;box-sizing:border-box;padding:8px;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--ink);font:inherit;font-size:14px;margin:4px 0;resize:vertical;'; put(host, ta);
  const ctl = row(host), view = box(host, 'font-size:14px;line-height:1.7;margin:6px 0;'), out = readout(host);
  button(ctl, 'Plain sample', () => { ta.value = SAMPLES.plain; go(); }); button(ctl, 'Richer sample', () => { ta.value = SAMPLES.rich; go(); }); button(ctl, 'Clear', () => { ta.value = ''; go(); });
  ta.addEventListener('input', go);
  let st = { c: 0, r: 0, u: 0, n: 0 };
  function go() {
    const words = ta.value.match(/[A-Za-z']+/g) || [];
    view.innerHTML = '';
    let c = 0, r = 0; const seen = new Set();
    for (const w of ta.value.split(/(\s+)/)) {
      const bare = w.toLowerCase().replace(/[^a-z']/g, ''), s = document.createElement('span'); s.textContent = w;
      if (bare) { seen.add(bare); if (COMMON.has(bare)) c++; else { r++; s.style.cssText = 'background:var(--accent-soft);border-radius:3px;font-weight:700;'; } }
      view.appendChild(s);
    }
    st = { c, r, u: seen.size, n: words.length }; cv.redraw();
    out.textContent = words.length ? `${words.length} words: ${c} common, ${r} less common (highlighted), ${seen.size} different words. Highlight does not mean "better": use a less common word only when it is exactly right and you know how it is used.` : 'Type or paste an answer above.';
  }
  cv.draw = (ctx, W, H, col) => {
    const y0 = title(ctx, 'Common and less common words', col) + 10, n = Math.max(1, st.n), bw = W - 24;
    ctx.fillStyle = col.line; ctx.fillRect(12, y0, bw, 28);
    ctx.fillStyle = col.s[7]; ctx.globalAlpha = 0.7; ctx.fillRect(12, y0, bw * st.c / n, 28); ctx.globalAlpha = 1;
    ctx.fillStyle = col.s[0]; ctx.fillRect(12 + bw * st.c / n, y0, bw * st.r / n, 28);
    text(ctx, `common ${st.c}`, 18, y0 + 14, { color: col.ink, size: 12, weight: 700, halo: col.panel, fit: false });
    text(ctx, `less common ${st.r}`, W - 18, y0 + 14, { color: col.ink, size: 12, weight: 700, halo: col.panel, align: 'right', fit: false });
    const v = st.n ? st.u / st.n : 0; text(ctx, `Different words: ${st.u} of ${st.n}`, 12, y0 + 52, { color: col.ink, size: 12, weight: 600 });
    ctx.fillStyle = col.line; ctx.fillRect(12, y0 + 64, bw, 10); ctx.fillStyle = col.s[2]; ctx.fillRect(12, y0 + 64, bw * v, 10);
  };
  go();
}
