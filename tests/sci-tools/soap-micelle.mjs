// #1297 Soap, micelles and hard water. Counting model checked by hand: Ca²⁺ + 2 RCOO⁻ → Ca(RCOO)₂ uses two soap
// anions per ion (the 1 : 2 ratio of the scum formula), detergent makes no scum, and lather needs CMC free molecules.
import { wash, dropsForLather, CMC, TUBES, ring } from '../../src/lib/sci/soap-school.ts';

export default async (check) => {
  check('soft water: all soap is free', JSON.stringify(wash(5, 0, 'soap')) === JSON.stringify({ scum: 0, free: 5, lather: 5 - CMC + 1, micelles: true }));
  check('hard water: 6 ions eat 12 soap', wash(12, 6, 'soap').free === 0 && wash(12, 6, 'soap').scum === 6 && wash(15, 6, 'soap').free === 3 && wash(15, 6, 'soap').micelles);
  check('odd soap: one left over', wash(7, 6, 'soap').scum === 3 && wash(7, 6, 'soap').free === 1 && !wash(7, 6, 'soap').micelles && wash(7, 6, 'soap').lather === 0);
  check('detergent ignores hardness', wash(4, 6, 'detergent').scum === 0 && wash(4, 6, 'detergent').free === 4);
  check('drops for lather', dropsForLather(0, 'soap') === CMC && dropsForLather(6, 'soap') === 12 + CMC && dropsForLather(6, 'detergent') === CMC);
  let ok = true;
  for (const t of TUBES) { const d = dropsForLather(t.ions, 'soap'); if (wash(d, t.ions, 'soap').lather !== 1 || wash(d - 1, t.ions, 'soap').lather !== 0) ok = false; }
  check('lather appears exactly at dropsForLather', ok);
  const r = ring(8, 100, 100, 30);
  check('ring of 8 heads', r.length === 8 && Math.abs(r[0].y - 70) < 1e-9 && r.every((p) => Math.abs(Math.hypot(p.x - 100, p.y - 100) - 30) < 1e-9));
  check('bad input', wash(-3, -1, 'soap').free === 0);
};
