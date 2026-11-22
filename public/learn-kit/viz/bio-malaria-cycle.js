// The life cycle of Plasmodium (malaria) as a step player across two hosts: the female Anopheles mosquito injects
// sporozoites, they multiply in liver cells, then in red blood cells (bursting every 48 or 72 hours causes the fever
// cycle, with haemozoin released), and gametocytes taken up by a mosquito mate in its gut and become sporozoites again.
import { text, title } from '../kit.js';
import { stepper, mix, wrap } from './_bio-kit.js';

const NODES = [['Mosquito bite', 0.5, 0.1], ['Liver cells', 0.82, 0.3], ['Red blood cells', 0.82, 0.62], ['Burst: fever', 0.5, 0.78], ['Gametocytes', 0.18, 0.62], ['Mosquito gut', 0.18, 0.3]];
const STEPS = [
  ['1. Sporozoites enter the blood', 'An infected female Anopheles injects sporozoites (the infective stage) with saliva. They reach the liver within minutes.'],
  ['2. Liver stage', 'Sporozoites multiply asexually in liver cells (no symptoms yet), then release thousands of merozoites.'],
  ['3. Red blood cell stage', 'Merozoites enter red blood cells, grow (ring and trophozoite stages) and divide.'],
  ['4. Cells burst: fever and chills', 'Infected red cells rupture together, releasing merozoites and haemozoin (toxin) at regular intervals: the chills and high fever (every 48 h for P. vivax, 72 h for P. malariae).'],
  ['5. Gametocytes form', 'Some parasites become male and female gametocytes in the blood. A mosquito that bites picks them up.'],
  ['6. Sexual stage in the mosquito', 'In the mosquito gut, gametes fuse to a zygote, which becomes an oocyst. Sporozoites form and move to the salivary glands, ready to infect the next person.'],
];

export default function (host) {
  return stepper(host, { aspect: 1.1, max: 450, min: 360, stages: 6, label: 'The malaria parasite life cycle between humans and mosquitoes' }, (ctx, w, h, col, st, k, t, pv) => {
    title(ctx, STEPS[st][0], col);
    const P = NODES.map((n) => [n[1] * w, 56 + n[2] * (h - 170)]);
    // two hosts
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.1; ctx.fillRect(w * 0.3, 44, w * 0.68, h - 150); ctx.globalAlpha = 1; text(ctx, 'HUMAN', w * 0.96, 56, { color: col.s[3], size: 10, weight: 700, align: 'right', fit: false });
    ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.1; ctx.fillRect(4, 44, w * 0.26, h - 150); ctx.globalAlpha = 1; text(ctx, 'MOSQUITO', 8, 56, { color: col.s[2], size: 10, weight: 700, fit: false });
    for (let i = 0; i < 6; i++) { const [x0, y0] = P[i], [x1, y1] = P[(i + 1) % 6], on = i === st; ctx.strokeStyle = on ? col.s[1] : col.line; ctx.lineWidth = on ? 4 : 2; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }
    NODES.forEach((n, i) => { const [x, y] = P[i], on = i === st || i === (st + 1) % 6; ctx.beginPath(); ctx.ellipse(x, y, 44, 17, 0, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = i === st ? col.s[1] : col.muted; ctx.lineWidth = i === st ? 3.5 : 1.5; ctx.stroke(); text(ctx, n[0], x, y, { color: col.ink, size: 10.5, weight: 700, align: 'center', fit: false }); });
    const a = P[st], b = P[(st + 1) % 6], f = (t * 0.5) % 1; ctx.beginPath(); ctx.arc(mix(a[0], b[0], f), mix(a[1], b[1], f), 6, 0, 7); ctx.fillStyle = col.bad; ctx.fill();
    wrap(ctx, STEPS[st][1], w / 2, h - 86, w - 24, { color: col.ink, size: 10.5, lh: 13 });
  });
}
