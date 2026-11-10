// #1454 malaria life cycle. Stage order and hosts, and the fever rhythm (tertian 48 h, quartan 72 h),
// checked by hand: 48 h attacks fall on days 1, 3, 5, …; 72 h attacks on days 1, 4, 7, ….
import * as M from '../../src/lib/sci/malaria-r.ts';
export default async (check) => {
  check('malaria: nine stages, human first, then mosquito', M.STAGES.length === 9 && M.STAGES.slice(0, 5).every((s) => s.host === 'human') && M.STAGES.slice(5).every((s) => s.host === 'mosquito'));
  check('malaria: fertilisation happens in the mosquito', M.STAGES.find((s) => s.id === 'fert').host === 'mosquito');
  check('malaria: vivax fever days 1,3,5,7,9,11 in 12 days', M.feverDays(48, 12).join() === '1,3,5,7,9,11');
  check('malaria: malariae fever days 1,4,7,10 in 12 days', M.feverDays(72, 12).join() === '1,4,7,10');
  check('malaria: fever times every 48 h', M.feverTimes(48, 4).join() === '0,48,96');
};
