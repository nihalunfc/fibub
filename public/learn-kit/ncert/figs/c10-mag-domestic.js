// Class 10 Magnetic Effects: a domestic electric circuit in India (230 V, 50 Hz AC). The live wire (red) brings the
// current in, the neutral wire (black) takes it back; both come from the supply, and the potential difference between
// them is 230 V. The earth wire (green) is joined to the metal body of heavy appliances and to a metal plate deep in the
// ground. Appliances are in PARALLEL, each with its own switch. A fuse or MCB in the live line cuts the circuit when
// the current is too high (overloading) or very high (short circuit). If the live wire touches a metal body, the earth wire
// gives the current an easy path to the ground, a large current flows, the MCB trips, and nobody gets a shock.
import { canvas, text, title, line, dot, arrow, row, button, choice, readout, loop } from '../../kit.js';

const APPS = [['TV', 100], ['Fan', 75], ['Iron', 1000], ['Geyser', 2000], ['AC', 1500]];
export default function (host) {
  let on = [true, true, false, false, false], rating = 16, fault = 'none', earth = true, tripped = false, t = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'A household circuit with live, neutral and earth wires, appliances in parallel and a circuit breaker' });
  const ctl = row(host);
  const grp = document.createElement('div'); grp.className = 'lk-choice'; grp.setAttribute('role', 'group'); grp.setAttribute('aria-label', 'Appliances switched on');
  const lab0 = document.createElement('span'); lab0.textContent = 'Switch on'; grp.appendChild(lab0); ctl.appendChild(grp);
  const btns = APPS.map(([nm, p], i) => { const b = document.createElement('button'); b.type = 'button'; b.addEventListener('click', () => { on[i] = !on[i]; label(); check(); }); grp.appendChild(b); return b; });
  const label = () => btns.forEach((b, i) => { b.textContent = APPS[i][0]; b.setAttribute('aria-pressed', String(on[i])); });
  choice(ctl, 'Breaker', [[6, '6 A'], [16, '16 A']], rating, (v) => { rating = v; check(); });
  choice(ctl, 'Fault', [['none', 'No fault'], ['short', 'Short circuit'], ['body', 'Live touches geyser body']], fault, (v) => { fault = v; check(); });
  choice(ctl, 'Earth wire', [['on', 'Connected'], ['off', 'Missing']], 'on', (v) => { earth = v === 'on'; check(); });
  button(ctl, 'Reset breaker', () => { tripped = false; update(); });
  const out = readout(host);
  const total = () => on.reduce((a, o, i) => a + (o ? APPS[i][1] / 230 : 0), 0);
  const faultI = () => (fault === 'short' ? 4600 : fault === 'body' && earth ? 460 : 0);
  function check() { tripped = false; if (total() + faultI() > rating) tripped = true; update(); }
  function update() {
    const I = total(), F = faultI(), tot = I + F;
    let m;
    if (fault === 'short') m = `<b>Short circuit:</b> live and neutral touch, resistance almost zero, current huge (thousands of amperes). The breaker (or fuse) cuts the circuit at once, before the wires overheat and start a fire.`;
    else if (fault === 'body') m = earth ? `<b>Earthed:</b> the live wire touches the geyser’s metal body, but the <b>earth wire</b> gives the current an easy path to the ground. A large current flows, the breaker trips, and the body never stays at 230 V.` : `<b>No earth wire:</b> the metal body becomes live at 230 V and <b>nothing trips</b>. Anyone who touches it becomes the path to the ground and gets a severe shock. That is why heavy appliances need earthing.`;
    else m = tripped ? `<b>Overloading:</b> the appliances together draw ${I.toFixed(1)} A, more than the ${rating} A rating, so the breaker has tripped.` : `Total current ${I.toFixed(1)} A (sum of P/230 for each appliance on, because they are in parallel), below the ${rating} A rating: all is well.`;
    out.innerHTML = m + (tripped ? ' Switch some appliances off and press “Reset breaker”.' : '');
    cv.redraw();
  }
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Home wiring: appliances are in parallel', col);
    const LIVE = '#e5241d', GRN = '#2bb24c', liveY = 86, neuY = h - 62, earY = h - 30, x0 = 30, x1 = w - 14, dx = (w - 100) / 4;
    const I = total();
    // supply and buses
    line(ctx, [[x0, liveY], [x1, liveY]], LIVE, 3); line(ctx, [[x0, neuY], [x1, neuY]], col.ink, 3); line(ctx, [[x0, earY], [x1, earY]], GRN, 3, [8, 5]);
    text(ctx, 'live', x1, liveY - 11, { color: LIVE, size: 10.5, weight: 700, align: 'right' }); text(ctx, 'neutral', x1, neuY + 11, { color: col.ink, size: 10.5, weight: 700, align: 'right' }); text(ctx, 'earth', x1, earY + 11, { color: GRN, size: 10.5, weight: 700, align: 'right' });
    // breaker in the live line
    ctx.fillStyle = tripped ? col.s[1] : col.panel; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.fillRect(x0 + 6, liveY - 12, 54, 24); ctx.strokeRect(x0 + 6, liveY - 12, 54, 24); text(ctx, `${rating} A ${tripped ? 'TRIPPED' : 'MCB'}`, x0 + 33, liveY, { color: tripped ? '#fff' : col.ink, size: 9.5, weight: 700, align: 'center' });
    ctx.fillStyle = col.panel; ctx.fillRect(x0 + 66, liveY - 3, 6, 6);
    // branches
    APPS.forEach(([nm, p], i) => {
      const x = 82 + i * dx - 0, bx = x - 24, by = liveY + 42, isG = nm === 'Geyser', live = on[i] && !tripped;
      line(ctx, [[x, liveY], [x, by - 12]], LIVE, 2); dot(ctx, x, liveY, 3, LIVE);
      // switch: a lever
      line(ctx, [[x, by - 12], [x, by - 4]], LIVE, 2); line(ctx, [[x, by - 4], [on[i] ? x : x + 9, by - (on[i] ? 22 : 18) + 14]], col.ink, 2.4);
      // appliance box
      ctx.save(); ctx.fillStyle = live ? col.s[4] : col.soft; ctx.globalAlpha = live ? 0.5 : 0.7; ctx.fillRect(bx, by + 8, 48, 54); ctx.globalAlpha = 1; ctx.strokeStyle = isG ? GRN : col.ink; ctx.lineWidth = isG ? 3 : 2; ctx.strokeRect(bx, by + 8, 48, 54); ctx.restore();
      text(ctx, nm, x, by + 28, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); text(ctx, `${p} W`, x, by + 44, { color: col.muted, size: 10, align: 'center' });
      line(ctx, [[x, by + 4], [x, by + 8]], LIVE, 2); line(ctx, [[x, by + 62], [x, neuY]], col.ink, 2); dot(ctx, x, neuY, 3, col.ink);
      if (live) { const ph = (t * 0.5 + i * 0.2) % 1; dot(ctx, x, liveY + (neuY - liveY) * ph, 3, col.s[3]); }
      if (isG) { line(ctx, [[x + 24, by + 35], [x + 32, by + 35], [x + 32, earY]], GRN, 2.5, earth ? undefined : [3, 6]); dot(ctx, x + 32, earY, 3, GRN); if (!earth) text(ctx, '✗ no earth wire', x + 44, by + 108, { color: col.s[1], size: 10, weight: 700, align: 'right' }); }
    });
    // fault drawings
    const gx = 82 + 3 * dx;
    if (fault === 'short') { const x = Math.min(x1 - 14, 82 + 4 * dx + dx * 0.55); line(ctx, [[x, liveY], [x, neuY]], col.s[1], 3); text(ctx, 'short', x - 4, (liveY + neuY) / 2, { color: col.s[1], size: 10.5, weight: 700, align: 'right', halo: col.panel }); if (!tripped) text(ctx, '⚡', x, (liveY + neuY) / 2 + 24, { color: col.s[1], size: 18, align: 'center' }); }
    if (fault === 'body') { line(ctx, [[gx - 24, liveY + 62], [gx - 14, liveY + 78]], col.s[1], 2.6); text(ctx, 'live wire touches the body', gx + 44, liveY + 124, { color: col.s[1], size: 10, weight: 700, align: 'right', halo: col.panel }); if (!earth && !tripped) { text(ctx, '⚡ body at 230 V: DANGER', gx + 44, liveY + 152, { color: col.s[1], size: 11, weight: 700, align: 'right', halo: col.panel }); } }
    // load meter
    const mx = 10, my = 58, mw = w - 20; ctx.fillStyle = col.soft; ctx.fillRect(mx, my, mw, 8); const f = Math.min(1, (I + (fault === 'none' ? 0 : 1000)) / (rating * 1.5)); ctx.fillStyle = f > 0.66 ? col.s[1] : col.s[0]; ctx.fillRect(mx, my, mw * Math.min(1, f), 8);
    const lim = mx + mw * (rating / (rating * 1.5)); line(ctx, [[lim, my - 3], [lim, my + 11]], col.ink, 2); text(ctx, `current ${fault === 'none' ? I.toFixed(1) + ' A' : 'very high'} (limit ${rating} A)`, mx, my - 9, { color: col.muted, size: 10 });
  };
  label(); check();
}
