// #737 Interlinear gloss (Leipzig Glossing Rules). Alignment verdicts for 15 word/gloss pairs and the padded
// plain-text columns were compared with an independent Python script written for this tool: all agree.
import * as I from '../../src/lib/sci/igt.ts';

const EX = `# Turkish
Çocuklar okula gitti.
Çocuk-lar okul-a git-ti.
child-PL school-DAT go-PST
"The children went to school."

# Spanish
Dámelo.
Da=me=lo.
give.IMP=1SG.DAT=3SG.M.ACC
'Give it to me.'`;

export default async (check) => {
  const PAIRS = [['Çocuk-lar', 'child-PL'], ['git-ti', 'go'], ['Da=me=lo', 'give.IMP=1SG.DAT=3SG.M.ACC'], ['a-b', 'x=y'], ['b<um>ili', '<AV>buy'], ['b<um>ili', 'buy'], ['ka~kain', 'PL~eat'], ['ka-kain', 'PL~eat'], ['ev-ler-imiz-de', 'house-PL-1PL.POSS-LOC'], ['ev-ler-imiz-de', 'house-PL-1PL.POSS'], ['word', 'gloss.with.dots'], ['a=b-c', 'x=y-z'], ['a=b-c', 'x-y=z'], ['Ø-run', '3SG-run'], ['walk:PST', 'walk:PST']];
  const PY = [true, false, true, false, true, false, true, false, true, false, true, true, false, true, true];
  check('igt: 15 alignment verdicts match Python', PAIRS.every(([s, g], i) => (I.checkWord(s, g) === '') === PY[i]));
  check('igt: count message', I.checkWord('git-ti', 'go') === '"git-ti" has 2 morphemes but its gloss "go" has 1.');
  check('igt: wrong boundary message', /hyphen where its gloss "x=y" has a clitic boundary/.test(I.checkWord('a-b', 'x=y')));
  check('igt: infix message', /1 infix in < > but its gloss "buy" has 0/.test(I.checkWord('b<um>ili', 'buy')));
  const { examples, errors } = I.parseExamples(EX);
  check('igt: two examples, no problems', errors.length === 0 && examples.length === 2 && examples.every((e) => !e.problems.length));
  check('igt: title, source, translation unquoted', examples[0].title === 'Turkish' && examples[0].source === 'Çocuklar okula gitti.' && examples[0].translation === 'The children went to school.' && examples[1].translation === 'Give it to me.');
  const wc = I.parseExamples('a b-c d\nx y=z\nfree', false).examples[0].problems;
  check('igt: word count mismatch and boundary problem found', wc.length === 2 && /3 words but the gloss line has 2/.test(wc[0]) && /^Word 2:/.test(wc[1]));
  check('igt: wrong number of lines is an error', /has 2 lines; it needs 4/.test(I.parseExamples('a\nb').errors[0]));
  check('igt: translation may be left out', I.parseExamples('a-b\nx-y', false).examples[0].translation === '' && I.parseExamples('a-b\nx-y', false).errors.length === 0);
  check('igt: abbreviations split 1SG into 1 and SG', I.abbreviationsUsed(examples).join(' ') === 'PL DAT PST IMP 1 SG 3 M ACC');
  check('igt: lexical glosses are not small caps', I.glossRuns('give.IMP').map((r) => `${r.t}:${r.abbr}`).join('|') === 'give:false|.:false|IMP:true');
  const plain = I.toPlain(examples).split('\n');
  check('igt: plain text columns (Python)', plain[0] === '(1) Turkish' && plain[2] === '    Çocuk-lar  okul-a      git-ti.' && plain[3] === '    child-PL   school-DAT  go-PST' && plain[4] === '    ‘The children went to school.’');
  const gb = I.toGb4e(examples);
  check('igt: gb4e \\glll with small caps and \\trans', gb.includes('\\glll Çocuklar okula gitti.\\\\\n     Çocuk-lar okul-a git-ti.\\\\\n     child-\\textsc{pl} school-\\textsc{dat} go-\\textsc{pst}\\\\\n\\trans `The children went to school.\'') && gb.startsWith('% \\usepackage{gb4e}\n\\begin{exe}') && gb.endsWith('\\end{exe}'));
  const ux = I.toGb4e(I.parseExamples('Ab cd ef\nab-cd ef\nx-y z\nt').examples);
  check('igt: gb4e uses \\gll when the original line has other word counts', ux.includes('\\textit{Ab cd ef}\\\\\n\\gll ab-cd ef'));
  const xp = I.toExpex(examples);
  check('igt: expex lines', xp.includes('\\begingl\n\\glpreamble Dámelo.//\n\\gla Da=me=lo.//\n\\glb give.\\textsc{imp}=\\textsc{1sg}.\\textsc{dat}=\\textsc{3sg}.\\textsc{m}.\\textsc{acc}//\n\\glft `Give it to me.\'//\n\\endgl\n\\xe'));
  check('igt: LaTeX escapes ~ < > _ %', I.toGb4e(I.parseExamples('ka~kain b<um>ili\nPL~eat <AV>buy_it\n50%', false).examples).includes('ka\\textasciitilde{}kain b\\textless{}um\\textgreater{}ili'));
  const html = I.toHtml(examples);
  check('igt: HTML escapes and small caps', html.includes('child-<span style="font-variant:small-caps;text-transform:lowercase">PL</span>') && I.toHtml(I.parseExamples('<b>\nx\n', false).examples).includes('&lt;b&gt;'));
};
