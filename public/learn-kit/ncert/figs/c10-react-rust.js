// Class 10 Chemical Reactions: corrosion and rancidity as slow oxidation, over days.
// Rusting needs both oxygen (air) and water; salt speeds it up. Rancidity is oxidation of fats and oils in food;
// antioxidants, nitrogen flushing and cold slow it down. Move the day slider to watch four samples age.
import { canvas, text, title, row, slider, choice, readout, clamp, lerp } from '../../kit.js';

export default function (host) {
  let mode = 'rust', day = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Four test tubes of iron nails or four food samples ageing over days' });
  const ctl = row(host);
  choice(ctl, 'Show', [['rust', 'Rusting nails'], ['rancid', 'Rancid chips']], mode, (v) => { mode = v; say(); });
  slider(ctl, { label: 'Days passed', min: 0, max: 14, step: 1, value: 0, fmt: (v) => `${v} d`, oninput: (v) => { day = v; say(); } });
  const out = readout(host);
  const RUST = [['Dry air', 'CaCl₂ keeps it dry', 0], ['Boiled water + oil', 'no air', 0], ['Air + water', 'rusts', 0.09], ['Air + salt water', 'rusts faster', 0.22]];
  const RAN = [['Open air', 'oxygen reaches it', 0.1], ['With antioxidant', 'BHA added', 0.025], ['Nitrogen flushed', 'no oxygen', 0.004], ['In a fridge', 'cold, slow', 0.03]];
  function say() {
    out.innerHTML = mode === 'rust' ? 'Rust (hydrated iron(III) oxide, Fe₂O₃·xH₂O) forms only where the iron meets <b>both</b> air and water. Salt in the water makes the water conduct better, so it rusts faster: this is why ships and coastal bridges rust quickly.'
      : 'Oils and fats in chips, ghee or namkeen react slowly with oxygen to make smelly, bad-tasting compounds. A bag filled with nitrogen has no oxygen, so the chips stay fresh. Antioxidants and cold slow the same reaction.';
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'rust' ? 'Four iron nails, day ' + day : 'Four bags of chips, day ' + day, col) + 8;
    const D = mode === 'rust' ? RUST : RAN, tw = w / 4, ty = top + 16, th = h - ty - 62;
    D.forEach(([nm, sub, rate], i) => {
      const cx = tw * (i + 0.5), x0 = cx - 24, lvl = clamp(1 - Math.exp(-rate * day), 0, 1);
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x0, ty, 48, th);
      if (mode === 'rust') {
        if (i === 2 || i === 3) { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25; ctx.fillRect(x0 + 1, ty + th * 0.35, 46, th * 0.65 - 1); ctx.globalAlpha = 1; }
        if (i === 1) { ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.5; ctx.fillRect(x0 + 1, ty + th * 0.3, 46, 7); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25; ctx.fillRect(x0 + 1, ty + th * 0.3 + 7, 46, th * 0.7 - 8); ctx.globalAlpha = 1; }
        if (i === 0) { ctx.fillStyle = col.soft; ctx.fillRect(x0 + 6, ty + th - 16, 36, 14); text(ctx, 'CaCl₂', cx, ty + th - 9, { color: col.muted, size: 9, align: 'center' }); }
        // nail
        const nx = cx - 4, ny = ty + th * 0.22, nh = th * 0.62;
        ctx.fillStyle = '#8f949a'; ctx.fillRect(nx, ny, 8, nh); ctx.fillRect(nx - 5, ny - 4, 18, 5);
        ctx.fillStyle = `rgba(190,80,20,${lvl * 0.95})`; ctx.fillRect(nx - 1, ny + (i === 2 || i === 3 ? nh * 0.2 : 0), 10, nh * (i > 1 ? 0.8 : 1) * Math.max(0, lvl));
        if (lvl > 0.02) for (let k = 0; k < 5 * lvl + 1; k++) { ctx.fillStyle = `rgba(190,80,20,${0.5 * lvl})`; ctx.fillRect(nx - 3 + ((k * 7) % 14), ny + nh * 0.3 + ((k * 13) % 20), 3, 3); }
      } else {
        const rr = Math.round(lerp(238, 120, lvl)), gg = Math.round(lerp(190, 80, lvl)), bb = Math.round(lerp(60, 30, lvl));
        ctx.fillStyle = `rgb(${rr},${gg},${bb})`; ctx.fillRect(x0 + 2, ty + th * 0.4, 44, th * 0.58);
        text(ctx, lvl < 0.25 ? 'fresh' : lvl < 0.6 ? 'stale' : 'rancid', cx, ty + th * 0.7, { color: '#111', size: 10, weight: 700, align: 'center', fit: false });
      }
      text(ctx, nm, cx, ty + th + 12, { color: col.ink, size: 10, weight: 700, align: 'center' });
      text(ctx, sub, cx, ty + th + 25, { color: col.muted, size: 9, align: 'center' });
      const bx = x0, by = ty + th + 36;
      ctx.fillStyle = col.soft; ctx.fillRect(bx, by, 48, 7); ctx.fillStyle = lvl > 0.5 ? col.bad : col.s[1]; ctx.fillRect(bx, by, 48 * lvl, 7);
    });
    text(ctx, mode === 'rust' ? 'bar: how much rust' : 'bar: how rancid', 10, h - 6, { color: col.muted, size: 10 });
  };
  say();
}
