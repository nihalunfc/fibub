// #1365 Markovnikov addition predictor. Checked against the standard textbook outcomes of Markovnikov's rule and
// the peroxide (Kharasch) effect: propene + HBr → 2-bromopropane, with peroxide → 1-bromopropane; HCl is not
// affected by peroxide; 2-methylpropene + HBr → 2-bromo-2-methylpropane; acid hydration of propene → propan-2-ol.
import * as M from '../../src/lib/sci/markovnikov-addition.ts';
const A = (id) => M.ALKENES.find((a) => a.id === id);
export default async (check) => {
  check('markovnikov: propene + HBr → 2-bromopropane', M.predict(A('propene'), 'HBr', false).name === '2-bromopropane' && M.predict(A('propene'), 'HBr', false).product === 'CH₃–CH(Br)–CH₃');
  check('markovnikov: propene + HBr + peroxide → 1-bromopropane', M.predict(A('propene'), 'HBr', true).name === '1-bromopropane' && M.predict(A('propene'), 'HBr', true).mode === 'radical' && !M.predict(A('propene'), 'HBr', true).markovnikov);
  check('markovnikov: peroxide does not change HCl or HI', M.predict(A('propene'), 'HCl', true).name === '2-chloropropane' && M.predict(A('propene'), 'HI', true).name === '2-iodopropane');
  check('markovnikov: 2-methylpropene → tertiary product', M.predict(A('methylpropene'), 'HBr', false).name === '2-bromo-2-methylpropane' && M.predict(A('methylpropene'), 'HBr', true).name === '1-bromo-2-methylpropane');
  check('markovnikov: hydration of propene → propan-2-ol', M.predict(A('propene'), 'H2O', false).name === 'propan-2-ol');
  check('markovnikov: 2-methylbut-2-ene', M.predict(A('methylbut2ene'), 'HCl', false).name === '2-chloro-2-methylbutane' && M.predict(A('methylbut2ene'), 'HBr', true).name === '2-bromo-3-methylbutane');
  check('markovnikov: symmetric alkenes give one product either way', M.predict(A('but2ene'), 'HBr', true).name === '2-bromobutane' && M.predict(A('ethene'), 'HBr', false).name === 'bromoethane' && M.predict(A('ethene'), 'HBr', false).tie);
  check('markovnikov: cation classes', M.klass(0) === 'primary (1°)' && M.klass(1) === 'secondary (2°)' && M.klass(2) === 'tertiary (3°)');
};
