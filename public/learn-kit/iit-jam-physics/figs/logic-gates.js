// 7.7 A clickable logic gate. Pick a gate, tap the inputs A and B (on the drawing or with the buttons) and watch
// the output lamp and the matching row of the truth table. Wires carrying 1 are drawn thick and coloured.
import { canvas, line, dot, text, row, button, choice, readout } from '../../kit.js';

const GATES = {
  AND: { f: (a, b) => a & b, tex: 'Y = A·B', note: '1 only when both inputs are 1' },
  OR: { f: (a, b) => a | b, tex: 'Y = A + B', note: '1 when at least one input is 1' },
  NAND: { f: (a, b) => 1 - (a & b), tex: 'Y = (A·B)′', note: '0 only when both inputs are 1; universal' },
  NOR: { f: (a, b) => 1 - (a | b), tex: 'Y = (A + B)′', note: '1 only when both inputs are 0; universal' },
  XOR: { f: (a, b) => a ^ b, tex: 'Y = A ⊕ B', note: '1 when the inputs differ (a 1-bit adder\'s sum)' },
  XNOR: { f: (a, b) => 1 - (a ^ b), tex: 'Y = (A ⊕ B)′', note: '1 when the inputs are equal (an equality detector)' },
};

export default function (host) {
  const cv = canvas(host, { aspect: 0.55, max: 330, min: 230, label: 'A two-input logic gate with clickable inputs and its truth table' });
  let gate = 'NAND', A = 1, B = 0;
  const ctl = row(host);
  const out = readout(host);
  let hit = []; // clickable input zones, filled in draw()
  const show = () => {
    const g = GATES[gate];
    out.innerHTML = `${gate}: ${g.tex}, ${g.note}. Now A = ${A}, B = ${B}, so Y = <b>${g.f(A, B)}</b>.`;
    bA.textContent = `A = ${A}`; bB.textContent = `B = ${B}`;
  };
  choice(ctl, 'Gate', Object.keys(GATES).map((k) => [k, k]), gate, (v) => { gate = v; cv.redraw(); show(); });
  const bA = button(ctl, 'A', () => { A = 1 - A; cv.redraw(); show(); });
  const bB = button(ctl, 'B', () => { B = 1 - B; cv.redraw(); show(); });
  cv.c.style.cursor = 'pointer';
  cv.c.addEventListener('click', (e) => {
    const rc = cv.c.getBoundingClientRect(), x = e.clientX - rc.left, y = e.clientY - rc.top;
    for (const z of hit) if (Math.hypot(x - z.x, y - z.y) < 24) { z.k === 'A' ? (A = 1 - A) : (B = 1 - B); cv.redraw(); show(); }
  });

  cv.draw = (ctx, w, h, col) => {
    const g = GATES[gate], Y = g.f(A, B);
    const on = col.s[2], off = col.muted;
    const split = w * 0.6;
    // gate body
    const gx = split * 0.32, gy = h * 0.52, gw = Math.min(110, split * 0.36), gh = gw * 0.8;
    const x0 = gx, x1 = gx + gw, top = gy - gh / 2, bot = gy + gh / 2;
    const yA = gy - gh * 0.25, yB = gy + gh * 0.25, inX = Math.max(26, x0 - gw * 0.7);
    const wire = (pts, v) => line(ctx, pts, v ? on : off, v ? 3.5 : 1.8);
    const isOr = gate === 'OR' || gate === 'NOR' || gate === 'XOR' || gate === 'XNOR';
    const isX = gate === 'XOR' || gate === 'XNOR';
    const bubble = gate === 'NAND' || gate === 'NOR' || gate === 'XNOR';
    const back = isOr ? x0 + gw * 0.18 : x0; // where the input wires meet the body
    wire([[inX, yA], [back, yA]], A);
    wire([[inX, yB], [back, yB]], B);
    ctx.save();
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.fillStyle = col.panel;
    ctx.beginPath();
    if (!isOr) {
      ctx.moveTo(x0, top); ctx.lineTo(x0 + gw * 0.5, top);
      ctx.arc(x0 + gw * 0.5, gy, gh / 2, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(x0, bot); ctx.closePath();
    } else {
      ctx.moveTo(x0, top);
      ctx.quadraticCurveTo(x0 + gw * 0.6, top, x1, gy);
      ctx.quadraticCurveTo(x0 + gw * 0.6, bot, x0, bot);
      ctx.quadraticCurveTo(x0 + gw * 0.3, gy, x0, top);
    }
    ctx.fill(); ctx.stroke();
    if (isX) { ctx.beginPath(); ctx.moveTo(x0 - 9, top); ctx.quadraticCurveTo(x0 - 9 + gw * 0.3, gy, x0 - 9, bot); ctx.stroke(); }
    ctx.restore();
    let xe = isOr ? x1 : x0 + gw * 0.5 + gh / 2;
    if (bubble) { ctx.save(); ctx.beginPath(); ctx.arc(xe + 6, gy, 6, 0, 2 * Math.PI); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); xe += 12; }
    const lampX = Math.min(split - 26, xe + gw * 0.55);
    wire([[xe, gy], [lampX - 12, gy]], Y);
    dot(ctx, lampX, gy, 12, Y ? on : col.panel, col.ink);
    text(ctx, `Y = ${Y}`, lampX, gy + 26, { color: Y ? on : col.muted, size: 13, weight: 700, align: 'center' });
    text(ctx, gate, x0 + gw * 0.42, gy, { color: col.ink, size: 12, weight: 700, align: 'center' });
    // input buttons on the drawing
    for (const [k, v, yy] of [['A', A, yA], ['B', B, yB]]) {
      dot(ctx, inX, yy, 13, v ? on : col.panel, col.ink);
      text(ctx, `${k}=${v}`, inX, yy, { color: v ? col.panel : col.ink, size: 10, weight: 700, align: 'center' });
    }
    hit = [{ k: 'A', x: inX, y: yA }, { k: 'B', x: inX, y: yB }];
    text(ctx, 'Tap A or B to switch it', 10, h - 12, { color: col.muted, size: 11 });
    // truth table
    const tx = split + 10, tw2 = w - tx - 10, rh = Math.min(30, (h - 60) / 5), ty = Math.max(30, (h - rh * 5) / 2);
    const cols = [tx + tw2 * 0.18, tx + tw2 * 0.5, tx + tw2 * 0.82];
    ['A', 'B', 'Y'].forEach((s, i) => text(ctx, s, cols[i], ty + rh / 2, { color: col.ink, size: 13, weight: 700, align: 'center' }));
    line(ctx, [[tx, ty + rh], [tx + tw2, ty + rh]], col.line, 1);
    for (let r = 0; r < 4; r++) {
      const a = r >> 1, b = r & 1, y0 = ty + rh * (r + 1);
      if (a === A && b === B) { ctx.fillStyle = col.soft; ctx.fillRect(tx, y0 + 1, tw2, rh - 2); ctx.strokeStyle = on; ctx.lineWidth = 2; ctx.strokeRect(tx, y0 + 1, tw2, rh - 2); }
      [a, b, g.f(a, b)].forEach((v, i) => text(ctx, String(v), cols[i], y0 + rh / 2, { color: i === 2 && v ? on : col.ink, size: 13, weight: i === 2 ? 700 : 400, align: 'center' }));
    }
  };
  cv.redraw(); show();
}
