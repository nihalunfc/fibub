// Channelrhodopsin-2 in a cell membrane, held at −70 mV (a voltage clamp, as in Nagel's frog-egg and kidney-cell
// recordings). Switch the light on: channels open in about a millisecond, positive ions flow in (a downward,
// inward current), the current sags from a peak to a plateau as some channels desensitise, and closes about
// 10 ms after the light goes off. Change the colour: blue works best, red hardly at all.
import { stage, clear, text, dot, line, plot, rng, type Stage } from '../kit';
import { visibleRGB, photon } from '../../../lib/sci/em-spectrum';

// Approximate action spectrum of ChR2: a broad band peaking near 470 nm (rounded, for illustration).
const act = (nm: number) => Math.exp(-(((nm - 470) / 48) ** 2));

export default function (el: HTMLElement) {
  const s: Stage = stage(el, { tag: 'Try it: a channel opened by light', title: 'Shine light on channelrhodopsin and record the current', h: 390, alt: 'A membrane with channel proteins; when light shines, ions pass inward and a current trace below dips down to a peak, settles to a plateau and returns when the light switches off.', caption: 'Three-state picture (closed → open → desensitised, open in about 1.5 ms, closing about 10 ms after the light). Time is slowed about 20 times. Action spectrum: a smooth band around 470 nm, rounded from published ChR2 spectra.' });
  const r = rng(31);
  let nm = 470, I0 = 0.7, light = false, O = 0, D = 0, tr: number[] = [], lt: boolean[] = [];
  s.slider('Light colour', 400, 650, 5, nm, (v) => `${v} nm`, (v) => { nm = v; });
  s.slider('Brightness', 0, 1, 0.05, I0, (v) => `${Math.round(v * 100)}%`, (v) => { I0 = v; });
  const b = s.button('Light on', () => { light = !light; b.textContent = light ? 'Light off' : 'Light on'; b.setAttribute('aria-pressed', String(light)); });
  const ions = Array.from({ length: 40 }, () => ({ ch: Math.floor(r() * 6), p: r(), k: r() < 0.7 ? 'Na⁺' : r() < 0.5 ? 'H⁺' : 'Ca²⁺' }));
  s.play((dt) => {
    const ms = dt * 50;
    for (let k = 0; k < 10; k++) {
      const h = ms / 10, drive = light ? (I0 * act(nm)) : 0;
      const kOn = drive / 1.5, kOff = 1 / 10, kDes = drive / 40, kRec = 1 / 2000;
      const C = 1 - O - D;
      O += h * (kOn * C - kOff * O - kDes * O); D += h * (kDes * O - kRec * D);
    }
    tr.push(-O * 100); lt.push(light); if (tr.length > 400) { tr.shift(); lt.shift(); }
    clear(s); const c = s.col;
    const rgb = visibleRGB(nm) ?? [128, 128, 128];
    if (light) { s.c.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.15 + 0.35 * I0})`; s.c.fillRect(0, 0, s.W, 30); for (let i = 0; i < 6; i++) line(s, [[80 + i * 90, 0], [80 + i * 90 + 10, 40]], `rgb(${rgb.join(',')})`, 2); }
    const my = 70;
    s.c.fillStyle = c.soft; s.c.fillRect(20, my - 14, s.W - 40, 28);
    for (let i = 0; i < 6; i++) { const x = 80 + i * 90, gap = 2 + 7 * O; s.c.fillStyle = c.violet; s.c.fillRect(x - 6 - gap, my - 16, 6, 32); s.c.fillRect(x + gap, my - 16, 6, 32); }
    for (const io of ions) { io.p += dt * (0.2 + 2.5 * O); if (io.p > 1) { io.p = 0; io.ch = Math.floor(r() * 6); } if (O > 0.03) dot(s, 80 + io.ch * 90 + 3, my - 40 + 80 * io.p, 2.6, io.k === 'Na⁺' ? c.amber : io.k === 'H⁺' ? c.bad : c.teal, Math.min(1, O * 3)); }
    text(s, 'outside', s.W - 24, my - 22, { size: 11, colour: c.muted, align: 'right' }); text(s, 'inside (−70 mV)', s.W - 24, my + 30, { size: 11, colour: c.muted, align: 'right' });
    const box = { x: 70, y: 125, w: s.W - 90, h: 200 };
    const P = plot(s, box, [0, 400], [-100, 10], { yLabel: 'Current (relative)', yTicks: [-100, -50, 0] });
    for (let i = 1; i < lt.length; i++) if (lt[i]) { s.c.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.12)`; s.c.fillRect(P.X(i - 1), box.y, P.X(i) - P.X(i - 1) + 0.5, box.h); }
    line(s, tr.map((v, i) => [P.X(i), P.Y(v)] as [number, number]), c.ink, 2);
    const E = photon(nm * 1e-9).eV;
    text(s, `${nm} nm · photon ${E.toFixed(2)} eV · ${Math.round(act(nm) * 100)}% as effective as 470 nm · open ${Math.round(O * 100)}%`, box.x, box.y + box.h + 34, { bold: true, size: 12.5 });
    s.mark();
    s.out(light ? (act(nm) < 0.1 ? 'Hardly anything: this colour is outside channelrhodopsin-2\'s band. Red-shifted relatives (like Chrimson) were found later for light that goes deeper into tissue.' : 'Inward current: <b>Na⁺, H⁺ and Ca²⁺</b> flow into the cell through the open channels. Note the <b>peak</b> then a lower <b>plateau</b> while the light stays on.') : 'Press Light on. One protein is both the light sensor and the ion channel: no other molecules are needed, which is what made it such a useful tool.');
  });
}
