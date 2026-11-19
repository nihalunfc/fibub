// Chlamydomonas swims toward light it detects with its eyespot. Click or drag to move the lamp. A "blind"
// mutant that cannot make retinal swims at random; add retinal and it steers again (Foster and colleagues,
// 1984: the clue that the alga's light sensor is a rhodopsin, a retinal protein like the ones in our eyes).
import { stage, clear, text, dot, line, rng, gauss, type Stage } from '../kit';

export default function (el: HTMLElement) {
  const s: Stage = stage(el, { tag: 'Try it: steer the algae', title: 'Move the lamp and watch single cells follow it', h: 340, alt: 'Small green ovals with two flagella swim across the frame toward a yellow lamp; when switched to blind mutants they wander randomly.', caption: 'Each cell turns a little toward the light when its eyespot faces it, as real cells do while they spin about their own axis. Speeds and turning are made up for the picture.' });
  const r = rng(21);
  let lamp = { x: s.W - 60, y: 60 }, mode = 'wild';
  const cells = Array.from({ length: 26 }, () => ({ x: r() * s.W, y: r() * s.H, a: r() * 6.28, ph: r() * 6 }));
  s.choice([['wild', 'Normal cells'], ['blind', 'Blind mutant'], ['retinal', 'Blind mutant + retinal']], mode, (v) => { mode = v; });
  s.pointer((x, y) => { lamp = { x, y }; });
  s.play((dt) => {
    const sees = mode !== 'blind';
    for (const c of cells) {
      const want = Math.atan2(lamp.y - c.y, lamp.x - c.x);
      let d = want - c.a; d = Math.atan2(Math.sin(d), Math.cos(d));
      c.a += (sees ? d * 1.6 * dt : 0) + gauss(r) * (sees ? 0.5 : 1.6) * Math.sqrt(dt);
      c.x += Math.cos(c.a) * 55 * dt; c.y += Math.sin(c.a) * 55 * dt; c.ph += dt * 12;
      if (c.x < 0) c.x += s.W; if (c.x > s.W) c.x -= s.W; if (c.y < 0) c.y += s.H; if (c.y > s.H) c.y -= s.H;
      if (sees && Math.hypot(c.x - lamp.x, c.y - lamp.y) < 26) { c.x = r() * s.W * 0.3; c.y = s.H * (0.2 + 0.6 * r()); }
    }
    clear(s); const k = s.col;
    dot(s, lamp.x, lamp.y, 34, k.amber, 0.18); dot(s, lamp.x, lamp.y, 13, k.amber);
    text(s, 'lamp (drag me)', lamp.x, lamp.y + 30, { align: 'center', size: 11, colour: k.muted });
    for (const c of cells) {
      const ca = Math.cos(c.a), sa = Math.sin(c.a);
      for (const sg of [-1, 1]) line(s, [[c.x + ca * 7, c.y + sa * 7], [c.x + ca * 14 - sa * sg * 6 * Math.sin(c.ph), c.y + sa * 14 + ca * sg * 6 * Math.sin(c.ph)]], k.muted, 1);
      s.c.fillStyle = k.teal; s.c.beginPath(); s.c.ellipse(c.x, c.y, 8, 5.5, c.a, 0, 6.29); s.c.fill();
      dot(s, c.x - sa * 3.5, c.y + ca * 3.5, 1.8, k.bad); // the eyespot
    }
    text(s, mode === 'blind' ? 'No retinal: cells cannot see' : 'Cells steer toward the light', 14, 24, { bold: true });
    s.mark();
  });
  s.out('The red dot on each cell is its <b>eyespot</b>. In 1984 Ken Foster and colleagues showed that blind mutants regain their steering when given retinal. Retinal is the light-catching part of rhodopsins, so the alga\'s sensor had to be a rhodopsin. Peter Hegemann spent the next two decades finding out which one, and how it works so fast.');
}
