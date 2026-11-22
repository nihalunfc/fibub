// Class 12 Biology, Organisms and Populations: how organisms respond to a changing environment over a year: regulate, conform, migrate or suspend.
// Regulators (birds, mammals) keep body temperature (and osmotic concentration) almost constant and pay for it in energy. Conformers (most fish, reptiles,
// plants) follow the surroundings. Migrants leave when conditions turn bad. Some organisms suspend: hibernation, aestivation, spores, diapause, seeds.
import { canvas, axes, line, text, title, row, choice, readout } from '../../kit.js';

export default function (host) {
  let k = 'regulate';
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 280, label: 'Outside temperature through a year and the body temperature of an organism that regulates, conforms, migrates or suspends' });
  const ctl = row(host), ro = readout(host);
  const INFO = { regulate: 'Regulate: a mammal such as a human keeps its body near 37 °C whatever the weather, by sweating, shivering and changing blood flow. This costs a lot of energy.', conform: 'Conform: a fish or a lizard has a body temperature that follows the surroundings. It spends little energy but its life slows in the cold and it may die in extremes.', migrate: 'Migrate: the organism moves away temporarily from a stressful habitat to a better one, as Siberian cranes do when they reach Keoladeo (Bharatpur) in winter.', suspend: 'Suspend: bears hibernate in winter, snails and fish aestivate in summer, bacteria and fungi form spores, plants make seeds: life slows almost to a halt until conditions improve.' };
  choice(ctl, 'Strategy', [['regulate', 'Regulate'], ['conform', 'Conform'], ['migrate', 'Migrate'], ['suspend', 'Suspend']], 'regulate', (v) => { k = v; go(); });
  const out = (m) => 22 + 18 * Math.sin((m - 3.2) / 12 * 6.283);
  const go = () => { ro.textContent = INFO[k]; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'One year, four strategies', col);
    const a = axes(ctx, w, h, col, { x: [0, 12], y: [0, 50], xlabel: 'month of the year (Jan to Dec)', ylabel: 'temperature (°C)', l: 46, t: 36, xt: [0, 3, 6, 9, 12], yt: [0, 10, 20, 30, 40, 50] });
    const O = []; for (let m = 0; m <= 12; m += 0.25) O.push([a.X(m), a.Y(out(m))]); ctx.setLineDash([5, 4]); line(ctx, O, col.muted, 2); ctx.setLineDash([]);
    text(ctx, 'outside temperature', a.X(6.5), a.Y(out(6.5)) - 10, { color: col.muted, size: 10.5, weight: 700, align: 'center' });
    const lim = (m) => out(m) > 12 && out(m) < 36;
    if (k === 'regulate') { line(ctx, [[a.X(0), a.Y(37)], [a.X(12), a.Y(37)]], col.s[2], 3); text(ctx, 'body 37 °C all year', a.X(1.6), a.Y(37) - 10, { color: col.s[2], size: 11, weight: 700 }); }
    if (k === 'conform') { const P = []; for (let m = 0; m <= 12; m += 0.25) P.push([a.X(m), a.Y(out(m) + 1)]); line(ctx, P, col.s[2], 3); text(ctx, 'body follows outside', a.X(0.4), a.Y(out(0.4)) + 22, { color: col.s[2], size: 11, weight: 700 }); }
    if (k === 'migrate') { let seg = []; for (let m = 0; m <= 12.01; m += 0.25) { if (lim(m)) seg.push([a.X(m), a.Y(out(m) + 1)]); else { if (seg.length > 1) line(ctx, seg, col.s[2], 3); seg = []; } } if (seg.length > 1) line(ctx, seg, col.s[2], 3); for (let m = 0; m < 12; m += 0.25) if (!lim(m)) { ctx.fillStyle = col.soft; ctx.fillRect(a.X(m), a.T, a.X(m + 0.25) - a.X(m), a.B - a.T); } text(ctx, 'away (migrated)', a.X(0.2), a.T + 14, { color: col.muted, size: 10.5, weight: 700 }); text(ctx, 'present', a.X(6.2), a.B - 14, { color: col.s[2], size: 10.5, weight: 700, align: 'center' }); }
    if (k === 'suspend') { let seg = [], dash = false; for (let m = 0; m <= 12.01; m += 0.25) { const on = lim(m); if (on !== dash && seg.length > 1) { ctx.setLineDash(dash ? [3, 4] : []); line(ctx, seg, dash ? col.bad : col.s[2], 3); ctx.setLineDash([]); seg = [seg[seg.length - 1]]; } dash = on ? false : true; seg.push([a.X(m), a.Y(out(m) + 1)]); } if (seg.length > 1) { ctx.setLineDash(dash ? [3, 4] : []); line(ctx, seg, dash ? col.bad : col.s[2], 3); ctx.setLineDash([]); } text(ctx, 'dashed = dormant (hibernation, aestivation, spores)', a.X(6), a.B - 14, { color: col.bad, size: 10.5, weight: 700, align: 'center' }); }
  };
  go();
}
