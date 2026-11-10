// #1306 Brain map. Checked against the standard school grouping: forebrain = cerebrum (four lobes) and hypothalamus;
// midbrain; hindbrain = pons, medulla, cerebellum. Every Find the part action points to a part that exists.
import { REGIONS, SCENARIOS, DIVISIONS, regionById } from '../../src/lib/sci/brain.ts';

export default async (check) => {
  const div = (id) => regionById(id)?.division;
  check('brain: eleven parts with unique ids', REGIONS.length === 11 && new Set(REGIONS.map((r) => r.id)).size === 11);
  check('brain: forebrain parts', ['frontal', 'parietal', 'temporal', 'occipital', 'hypothalamus'].every((id) => div(id) === 'forebrain'));
  check('brain: hindbrain parts', ['pons', 'medulla', 'cerebellum'].every((id) => div(id) === 'hindbrain') && div('midbrain') === 'midbrain');
  check('brain: every division has a note', REGIONS.every((r) => DIVISIONS[r.division]));
  check('brain: every action points to real parts', SCENARIOS.length >= 12 && SCENARIOS.every((s) => s.answer.length && s.answer.every((a) => regionById(a))));
  check('brain: every part has Class 10 and Class 11 text', REGIONS.every((r) => r.t10.length > 30 && r.t11.length > 30));
  check('brain: balance is the cerebellum, sneezing the medulla', SCENARIOS.find((s) => s.text.includes('bicycle')).answer[0] === 'cerebellum' && SCENARIOS.find((s) => s.text.includes('sneeze')).answer[0] === 'medulla');
};
