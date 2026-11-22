// Class 9 Journey Inside the Atom: valency from the outer shell. An atom is steady with a full outer shell (2 for
// the first shell, 8 for the others). With 1 to 3 outer electrons it tends to LOSE them (valency = outer electrons);
// with 5 to 7 it tends to GAIN (valency = 8 minus outer electrons); 4 shares; a full shell means valency 0.
// Pick an element and press Show: the outer electrons leave or arrive and the ion with its charge appears.
import { canvas, text, title, dot, row, choice, button, readout, loop, ease } from '../../kit.js';

const EL = { Na: [11, [2, 8, 1]], Mg: [12, [2, 8, 2]], Al: [13, [2, 8, 3]], C: [6, [2, 4]], O: [8, [2, 6]], Cl: [17, [2, 8, 7]], Ne: [10, [2, 8]] };
export default function (host) {
  let el = 'Na', f = 0, going = false;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 300, label: 'An atom losing or gaining outer electrons to reach a full shell, with its valency' });
  const ctl = row(host);
  choice(ctl, 'Element', Object.keys(EL).map((k) => [k, k]), el, (v) => { el = v; f = 0; going = false; upd(); });
  button(ctl, '▶ Show', () => { f = 0; going = true; });
  const out = readout(host);
  const info = () => { const sh = EL[el][1], o = sh.at(-1), full = sh.length === 1 ? 2 : 8; if (o === full) return { kind: 'none', v: 0, o }; if (o <= 3) return { kind: 'lose', v: o, o }; if (o >= 5) return { kind: 'gain', v: 8 - o, o }; return { kind: 'share', v: 4, o }; };
  function upd() {
    const i = info(), sh = EL[el][1].join(', ');
    out.innerHTML = `${el}: Z = ${EL[el][0]}, electrons ${sh}. Outer shell has <b>${i.o}</b>. ` + ({ lose: `It loses ${i.v} electron${i.v > 1 ? 's' : ''} to be steady: becomes ${el}${i.v > 1 ? i.v : ''}⁺. Valency = <b>${i.v}</b>.`, gain: `It gains ${i.v} electron${i.v > 1 ? 's' : ''} to reach 8: becomes ${el}${i.v > 1 ? i.v : ''}⁻. Valency = <b>${i.v}</b> (8 − ${i.o}).`, share: 'Carbon has 4 outer electrons: gaining or losing 4 is too costly, so it shares them. Valency = <b>4</b>.', none: 'The outer shell is already full: it is unreactive. Valency = <b>0</b>.' })[i.kind]; cv.redraw();
  }
  loop(host, (dt) => { if (going) { f += dt * 0.5; if (f >= 1) { f = 1; going = false; } cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    const [Z, sh] = EL[el], I = info(); title(ctx, `${el}: valency ${I.v}`, col);
    const cx = w * 0.42, cy = h * 0.5, Rm = Math.min(w * 0.36, h * 0.38), radii = [0.38, 0.7, 1].map((k) => k * Rm), e = ease(f);
    sh.forEach((c, i) => {
      ctx.beginPath(); ctx.arc(cx, cy, radii[i], 0, 7); ctx.strokeStyle = i === sh.length - 1 ? col.s[3] : col.line; ctx.lineWidth = i === sh.length - 1 ? 2 : 1.2; ctx.stroke();
      const out = i === sh.length - 1;
      let cnt = c; if (out && I.kind === 'lose') cnt = c - I.v * (f > 0.5 ? 1 : 0);
      for (let k = 0; k < c; k++) {
        const a = (k / c) * Math.PI * 2 - 1.2; let x = cx + Math.cos(a) * radii[i], y = cy + Math.sin(a) * radii[i];
        if (out && I.kind === 'lose' && k < I.v) { x += (w * 0.96 - x) * e * 0.35 + Math.cos(0) * 0; y += (h * 0.2 - y) * e * 0.5; if (e > 0.98) continue; }
        dot(ctx, x, y, 4, col.s[2]);
      }
      void cnt;
    });
    if (I.kind === 'gain') for (let k = 0; k < I.v; k++) { const a = Math.PI * 0.15 + (k - (I.v - 1) / 2) * 0.35, tx = cx + Math.cos(a) * radii[sh.length - 1], ty = cy + Math.sin(a) * radii[sh.length - 1]; const sx = w - 24, sy = h * 0.25 + k * 24; dot(ctx, sx + (tx - sx) * e, sy + (ty - sy) * e, 4, col.s[4]); }
    dot(ctx, cx, cy, 10, col.s[1]); text(ctx, `${Z}+`, cx, cy, { color: col.panel, size: 9, weight: 700, align: 'center', fit: false });
    const ion = I.kind === 'lose' ? `${el}${I.v > 1 ? I.v : ''}⁺` : I.kind === 'gain' ? `${el}${I.v > 1 ? I.v : ''}⁻` : el;
    text(ctx, f >= 1 ? `now: ${ion}` : `outer electrons: ${I.o}`, w * 0.98, h - 18, { color: f >= 1 ? col.s[2] : col.muted, size: 12, weight: 700, align: 'right' });
    text(ctx, { lose: 'loses electrons (to the right)', gain: 'gains electrons (from the right)', share: 'shares electrons with other atoms', none: 'full outer shell: nothing to do' }[I.kind], 10, h - 18, { color: col.muted, size: 10.5 });
  };
  upd();
}
