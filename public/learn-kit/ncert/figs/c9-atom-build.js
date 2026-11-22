// Class 9 Journey Inside the Atom: atom builder. Add protons, neutrons and electrons with the sliders. The nucleus is
// drawn with p and n, electrons fill shells 2, 8, 8, 2 (the first 20 elements). The panel names the element from its
// proton count (atomic number Z), gives the mass number A = p + n, the net charge and whether it is an ion.
import { canvas, text, title, dot, row, slider, readout } from '../../kit.js';

const SYM = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca'];
const NAME = ['', 'hydrogen', 'helium', 'lithium', 'beryllium', 'boron', 'carbon', 'nitrogen', 'oxygen', 'fluorine', 'neon', 'sodium', 'magnesium', 'aluminium', 'silicon', 'phosphorus', 'sulphur', 'chlorine', 'argon', 'potassium', 'calcium'];
export default function (host) {
  let p = 6, nn = 6, e = 6;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'An atom builder showing protons neutrons and electrons in shells with the element name and charge' });
  const ctl = row(host);
  slider(ctl, { label: 'Protons', min: 1, max: 20, step: 1, value: p, fmt: (v) => v, oninput: (v) => { p = v; upd(); } });
  slider(ctl, { label: 'Neutrons', min: 0, max: 22, step: 1, value: nn, fmt: (v) => v, oninput: (v) => { nn = v; upd(); } });
  slider(ctl, { label: 'Electrons', min: 0, max: 20, step: 1, value: e, fmt: (v) => v, oninput: (v) => { e = v; upd(); } });
  const out = readout(host);
  const shells = (k) => { const c = []; for (const cap of [2, 8, 8, 2]) { const x = Math.min(cap, k); c.push(x); k -= x; } return c.filter((x) => x > 0); };
  function upd() {
    const q = p - e, A = p + nn;
    out.innerHTML = `Z = ${p} protons: this is <b>${NAME[p]}</b>. Mass number A = ${p} + ${nn} = <b>${A}</b>. Charge = +${p} − ${e} = <b>${q === 0 ? 'neutral atom' : q > 0 ? `+${q} (positive ion)` : `${q} (negative ion)`}</b>. Shells: <b>${shells(e).join(', ') || '–'}</b>. Change the protons and the element changes; change only the neutrons and you get an isotope; change only the electrons and you get an ion.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const q = p - e, sup = q === 0 ? '' : (Math.abs(q) > 1 ? Math.abs(q) : '') + (q > 0 ? '+' : '−');
    title(ctx, `${SYM[p]}${sup ? ' ' + sup : ''} · ${NAME[p]} · A = ${p + nn}`, col);
    const cx = w / 2, cy = h * 0.55, sh = shells(e), Rmax = Math.min(w * 0.47, h * 0.42);
    const radii = [0.32, 0.55, 0.78, 1].map((f) => f * Rmax);
    sh.forEach((c, i) => {
      ctx.beginPath(); ctx.arc(cx, cy, radii[i], 0, 7); ctx.strokeStyle = col.line; ctx.lineWidth = 1.2; ctx.stroke();
      for (let k = 0; k < c; k++) { const a = (k / c) * Math.PI * 2 + i * 0.5 - 1.2; dot(ctx, cx + Math.cos(a) * radii[i], cy + Math.sin(a) * radii[i], 4.3, col.s[2]); }
    });
    // nucleus: pack p and n into a spiral
    const tot = p + nn, nr = 4.6; const parts = [];
    for (let i = 0; i < tot; i++) parts.push(i < p ? 'p' : 'n');
    parts.sort((a, b) => ((a.charCodeAt(0) * 7) % 5) - ((b.charCodeAt(0) * 7) % 5));
    const mix = []; let a = p, b = nn; for (let i = 0; i < tot; i++) { if ((i % 2 === 0 && a > 0) || b === 0) { mix.push('p'); a--; } else { mix.push('n'); b--; } }
    mix.forEach((kind, i) => { const r = nr * 1.5 * Math.sqrt(i) , th = i * 2.4; dot(ctx, cx + Math.cos(th) * r, cy + Math.sin(th) * r, nr, kind === 'p' ? col.s[1] : col.muted); });
    const lab = (s, y, c) => text(ctx, s, 10, y, { color: c, size: 10.5, weight: 700 });
    dot(ctx, 16, h - 44, 4, col.s[1]); text(ctx, `protons +${p}`, 24, h - 44, { color: col.ink, size: 10.5 });
    dot(ctx, 16, h - 28, 4, col.muted); text(ctx, `neutrons ${nn}`, 24, h - 28, { color: col.ink, size: 10.5 });
    dot(ctx, 16, h - 12, 4, col.s[2]); text(ctx, `electrons −${e}`, 24, h - 12, { color: col.ink, size: 10.5 });
    void lab;
    text(ctx, `charge ${q > 0 ? '+' : ''}${q}`, w - 10, h - 12, { color: Math.abs(q) ? col.s[3] : col.good, size: 12, weight: 700, align: 'right' });
  };
  upd();
}
