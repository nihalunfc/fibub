// Letter builder: six everyday letter templates with plain example text the user edits. The Word, PDF and text files
// reuse the cover-letter layout code (one column, standard fonts), so the result opens anywhere.
import { emptyLetter, plainText, letterDocx, letterPdf, type Letter } from './coverletter';

export type Kind = 'formal' | 'complaint' | 'request' | 'resignation' | 'reference' | 'leave';
export type Template = { id: Kind; name: string; blurb: string; subject: string; salutation: string; closing: string; body: string };

export const TEMPLATES: Template[] = [
  { id: 'formal', name: 'Formal letter', blurb: 'A general business letter.', subject: '[What the letter is about]', salutation: 'Dear Sir or Madam,', closing: 'Yours faithfully',
    body: 'I am writing to [say why you are writing, in one sentence].\n\n[Give the facts the reader needs: what happened, when, and any reference number.]\n\nI would be grateful if you could [say what you want them to do] by [date]. Please contact me at the details above if you need anything more.\n\nThank you for your time.' },
  { id: 'complaint', name: 'Complaint', blurb: 'Tell a company what went wrong and what you want.', subject: 'Complaint about [product or service], order [number]', salutation: 'Dear Customer Service,', closing: 'Yours sincerely',
    body: 'I am writing to complain about [the product or service] that I [bought or received] on [date].\n\n[Describe the problem in a few plain sentences: what you expected, what happened, and who you spoke to.]\n\nTo put this right, I would like [a refund, a replacement or a repair]. Please reply within 14 days. I have kept my receipt and can send copies of any records.\n\nThank you for looking into this.' },
  { id: 'request', name: 'Request', blurb: 'Ask for information, a document or a favour.', subject: 'Request for [what you are asking for]', salutation: 'Dear Sir or Madam,', closing: 'Kind regards',
    body: 'I am writing to ask whether you could [what you are asking for].\n\n[Explain why you need it, and give any details that help them find it, such as your account number or dates.]\n\nIf possible, I would be grateful to receive it by [date]. If there is a form or a fee, please let me know.\n\nThank you for your help.' },
  { id: 'resignation', name: 'Resignation', blurb: 'Give notice and leave on good terms.', subject: 'Resignation: [your job title]', salutation: 'Dear [Manager name],', closing: 'Sincerely',
    body: 'Please accept this letter as my formal notice that I am resigning from my position as [job title] at [company]. My last working day will be [date], in line with my [number]-week notice period.\n\nThank you for the opportunities I have had here. I will do all I can to hand over my work smoothly before I leave.\n\nPlease let me know what else you need from me, and the arrangements for my final pay and any remaining leave.' },
  { id: 'reference', name: 'Reference letter', blurb: 'Recommend a person you know well.', subject: 'Reference for [person\'s name]', salutation: 'To whom it may concern,', closing: 'Sincerely',
    body: 'I am pleased to recommend [name]. I have known [name] for [number] years as their [manager, teacher or colleague] at [place].\n\n[Describe two or three strengths with a real example of each, such as a project they led or a problem they solved.]\n\nI recommend [name] without reservation for [the role or course]. Please contact me at the details above if you would like to know more.' },
  { id: 'leave', name: 'Leave request', blurb: 'Ask your employer or school for time off.', subject: 'Leave request: [start date] to [end date]', salutation: 'Dear [Manager name],', closing: 'Kind regards',
    body: 'I would like to request [number] days of [annual, sick or unpaid] leave from [start date] to [end date], returning on [date].\n\n[Optional: the reason, and how your work will be covered, for example "I will finish the monthly report before I go and [colleague] will cover my calls".]\n\nPlease let me know if you need any more information, or if these dates cause a problem.' },
];

export type LetterForm = {
  kind: Kind; name: string; address: string; email: string; phone: string; date: string;
  toName: string; toOrg: string; toAddress: string; subject: string; salutation: string; body: string; closing: string;
  paper: 'letter' | 'a4'; serif: boolean;
};

export const tpl = (k: Kind) => TEMPLATES.find((t) => t.id === k)!;

export function emptyForm(kind: Kind = 'formal'): LetterForm {
  const t = tpl(kind);
  return { kind, name: '', address: '', email: '', phone: '', date: new Date().toISOString().slice(0, 10), toName: '', toOrg: '', toAddress: '', subject: t.subject, salutation: t.salutation, body: t.body, closing: t.closing, paper: 'letter', serif: false };
}

/** Switch template. Fields you have not changed from the old template take the new one's text; typed text is kept. */
export function switchKind(f: LetterForm, kind: Kind): LetterForm {
  const o = tpl(f.kind), n = tpl(kind);
  const pick = (cur: string, was: string, now: string) => (cur.trim() === '' || cur === was ? now : cur);
  return { ...f, kind, subject: pick(f.subject, o.subject, n.subject), salutation: pick(f.salutation, o.salutation, n.salutation), body: pick(f.body, o.body, n.body), closing: pick(f.closing, o.closing, n.closing) };
}

/** "Dear Ms Jones," when a recipient name is given and the greeting is still the template's generic one. */
export function toLetter(f: LetterForm): Letter {
  const generic = TEMPLATES.some((t) => t.salutation === f.salutation);
  const sal = f.toName.trim() && generic ? `Dear ${f.toName.trim()},` : f.salutation;
  return {
    ...emptyLetter(), name: f.name, address: f.address, email: f.email, phone: f.phone, date: f.date,
    manager: f.toName, company: f.toOrg, companyAddress: f.toAddress, role: f.subject,
    p1: f.body, closing: f.closing, paper: f.paper, serif: f.serif, salutation: sal, docTitle: tpl(f.kind).name,
  };
}

export const text = (f: LetterForm) => plainText(toLetter(f));
export const docx = (f: LetterForm) => letterDocx(toLetter(f));
export const pdf = (f: LetterForm) => letterPdf(toLetter(f));
/** [bracketed] bits still left to fill in. */
export const leftovers = (f: LetterForm): number => (text(f).match(/\[[^\]]+\]/g) ?? []).length;
export const words = (f: LetterForm) => f.body.split(/\s+/).filter(Boolean).length;
