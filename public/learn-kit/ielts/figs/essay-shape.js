// 7.2 / 7.3 The shape of each Task 2 essay type: pick a type and see the paragraph plan, what each paragraph
// does and roughly how many words it gets (for a 270 to 300 word essay).
import { row, choice, readout, put } from '../../kit.js';

const PLANS = {
  opinion: { name: 'Opinion (agree or disagree)', ask: 'To what extent do you agree or disagree?', paras: [
    ['Introduction', 'Paraphrase the statement and give your position clearly: agree, disagree, or agree in part.', 45],
    ['Body 1', 'Main reason for your position: point, explanation, example.', 95],
    ['Body 2', 'Second reason, or the other side and why it is weaker (for a partly-agree answer).', 95],
    ['Conclusion', 'Restate your position in new words and sum up the two reasons.', 40]] },
  discussion: { name: 'Discussion (both views)', ask: 'Discuss both views and give your own opinion.', paras: [
    ['Introduction', 'Paraphrase both views and say which you support.', 45],
    ['Body 1', 'View A: why some people hold it, with an example.', 95],
    ['Body 2', 'View B: why others hold it, with an example, and why you find it more convincing (or a separate short opinion paragraph).', 95],
    ['Conclusion', 'Both views in one sentence, then your opinion again.', 40]] },
  advdis: { name: 'Advantages and disadvantages', ask: 'Do the advantages outweigh the disadvantages?', paras: [
    ['Introduction', 'Paraphrase the development and say whether the advantages outweigh the disadvantages.', 45],
    ['Body 1', 'The main advantages, explained, with an example.', 95],
    ['Body 2', 'The main disadvantages, explained, and why they matter less (or more).', 95],
    ['Conclusion', 'Your judgement again, in new words.', 40]] },
  problem: { name: 'Problem and solution (causes and solutions)', ask: 'What problems does this cause? What can be done?', paras: [
    ['Introduction', 'Paraphrase the issue and preview: there are several problems, and some practical solutions.', 45],
    ['Body 1', 'Two problems (or causes), each explained with an example.', 95],
    ['Body 2', 'Solutions that match those problems: who should do what, and how it helps.', 95],
    ['Conclusion', 'Sum up problems and solutions in one or two sentences.', 40]] },
  twopart: { name: 'Two-part question', ask: 'Why is this happening? Is it a positive or negative development?', paras: [
    ['Introduction', 'Paraphrase the topic and answer BOTH questions in brief.', 45],
    ['Body 1', 'Full answer to question 1, with explanation and example.', 95],
    ['Body 2', 'Full answer to question 2, with explanation and example.', 95],
    ['Conclusion', 'Both answers again, briefly.', 40]] },
};

export default function (host) {
  let k = 'opinion';
  const ctl = row(host);
  choice(ctl, 'Essay type', Object.keys(PLANS).map((x) => [x, PLANS[x].name.split(' (')[0]]), k, (v) => { k = v; show(); });
  const box = document.createElement('div'); box.className = 'ie-plan'; put(host, box);
  const out = readout(host);
  const show = () => {
    const p = PLANS[k], total = p.paras.reduce((a, x) => a + x[2], 0);
    box.innerHTML = `<p><b>Typical instruction:</b> "${p.ask}"</p>` + p.paras.map(([n, d, w]) =>
      `<div style="display:flex;gap:10px;align-items:stretch;margin:6px 0"><div style="flex:0 0 108px;background:var(--accent-soft,#eee);border-radius:6px;padding:6px 8px;font-weight:700">${n}<br><small style="font-weight:400">~${w} words</small></div><div style="flex:1">${d}</div></div>`).join('');
    out.textContent = `${p.name}: four paragraphs, about ${total} words. Every type needs a clear answer in the introduction.`;
  };
  show();
}
