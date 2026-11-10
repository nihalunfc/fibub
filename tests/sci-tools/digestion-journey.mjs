// #1301 Digestion journey. The model's numbers were worked by hand for the Roti, dal and sabzi meal (60/18/12/10 g):
// 42 g starch whole after the mouth, 10.8 g protein whole and 7.2 g peptides after the stomach, 90 g absorbed and
// 10 g of fibre egested at the end. Mass balance (nothing appears or disappears) is checked for random meals.
import { journey, STOPS, MEALS, timeTo, leftInGut, NUTRIENTS } from '../../src/lib/sci/digestion.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const J = journey(MEALS[0].meal);
  check('digestion: seven stops', STOPS.length === 7 && J.length === 7);
  check('digestion: mouth leaves 42 g starch whole and 18 g maltose', near(J[0].starch.whole, 42) && near(J[0].starch.part, 18) && J[0].protein.whole === 18);
  check('digestion: oesophagus changes nothing', JSON.stringify(J[0]) === JSON.stringify(J[1]));
  check('digestion: stomach makes 7.2 g peptides, no starch change', near(J[2].protein.part, 7.2) && near(J[2].protein.whole, 10.8) && near(J[2].starch.whole, 42) && near(J[2].fat.part, 0.6));
  check('digestion: duodenum by hand', near(J[3].starch.whole, 4.2) && near(J[3].starch.part, 55.8) && near(J[3].protein.end, 5.076) && near(J[3].fat.end, 7.2) && near(J[3].fat.part, 4.8));
  check('digestion: all absorbed after the small intestine, fibre egested', near(J[4].starch.absorbed, 60) && near(J[4].protein.absorbed, 18) && near(J[4].fat.absorbed, 12) && J[6].fibre.whole === 10 && J[6].fibre.absorbed === 0 && near(leftInGut(J[6]), 10));
  let ok = true;
  for (let i = 0; i < 200; i++) {
    const m = { starch: Math.random() * 100, protein: Math.random() * 60, fat: Math.random() * 60, fibre: Math.random() * 30 };
    const j = journey(m);
    for (const st of j) for (const n of NUTRIENTS) { const a = st[n.id]; if (!near(a.whole + a.part + a.end + a.absorbed, m[n.id], 1e-9) || Math.min(a.whole, a.part, a.end, a.absorbed) < -1e-12) ok = false; }
    for (let k = 1; k < j.length; k++) for (const n of NUTRIENTS) if (j[k][n.id].absorbed < j[k - 1][n.id].absorbed - 1e-12) ok = false;
  }
  check('digestion: 200 random meals keep their mass at every stop and absorption never goes down', ok);
  const [lo, hi] = timeTo(5);
  check('digestion: time to the large intestine is roughly 5 to 10 hours', lo > 5 && lo < 6 && hi > 9 && hi < 10);
};
