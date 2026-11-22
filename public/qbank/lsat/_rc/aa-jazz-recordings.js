// LSAT RC passage (humanities): recordings and the nature of improvised music. Original, written for fibub.
import { rc } from './h.js';
const it = rc('p3');
export default {
  group: 'p3',
  passage: { title: 'Passage: the recorded improvisation', passage: `<p>Improvised music presents historians with an odd problem. A jazz solo, in the traditional understanding, is made up in the moment and never played the same way twice; its value lies partly in that unrepeatability. Yet almost everything we know about the history of jazz comes from recordings, which fix one performance permanently and allow it to be heard thousands of times. The music’s history, it seems, is written in a medium that contradicts the music’s nature.</p>
<p>Some critics have drawn a pessimistic conclusion from this. A recording, they argue, turns an event into an object. Listeners memorise a famous solo note for note; younger players transcribe it and practise it until they can reproduce it exactly; and the solo, which was once a single unrepeatable response to a particular evening, becomes a fixed text, studied like a written composition. On this view, recording has quietly converted an art of spontaneity into an art of imitation.</p>
<p>The worry is understandable but, I think, overstated. It assumes that the musicians of the early recording era improvised freely each night and that recording alone changed this. In fact, players of that time often worked out their solos in advance and repeated their best ideas from night to night; audiences came to expect a favourite phrase, and players supplied it. Improvisation was never pure invention from nothing. It was, and remains, a practice of recombining learned material in new ways, and transcription is simply a newer and more efficient means of acquiring that material.</p>
<p>Nor does the record of a solo freeze the music in the way the critics fear. A young player who learns a famous solo exactly does not thereby lose the ability to improvise; the solo becomes part of a vocabulary, to be broken apart and reassembled. The danger, where it exists, lies not in recordings but in teaching that treats a transcription as the goal rather than as raw material. Recordings did change jazz, as every new technology changes the art made with it. But they gave the music a memory, and a tradition without a memory has little to improvise upon.</p>` },
  items: [
    it('lsat-raa-301', 3, 'author’s attitude', 'The author’s attitude toward the critics described in the second paragraph is best described as',
      ['sympathetic to their concern but convinced that they exaggerate it', 'in complete agreement with them', 'contemptuous of their knowledge of jazz', 'uncertain whether their argument is relevant', 'grateful that they changed how jazz is taught'],
      '<p>"The worry is understandable but, I think, overstated." {A} captures both parts.</p>'),
    it('lsat-raa-302', 3, 'main point', 'Which one of the following most accurately expresses the main point of the passage?',
      ['Recordings did not turn jazz improvisation into mere imitation; they gave the tradition a memory that improvisers can build on.', 'Recordings have destroyed the spontaneity of jazz.', 'Early jazz musicians never repeated their solos.', 'Young players should stop transcribing famous solos.', 'Historians should not rely on recordings to study jazz.'],
      '<p>The author rejects the pessimistic view and ends: recordings "gave the music a memory". {A}. {B} is the critics’ view; {C} is contradicted in paragraph 3.</p>'),
    it('lsat-raa-303', 4, 'detail', 'According to the passage, players of the early recording era often',
      ['worked out solos in advance and repeated favourite ideas from night to night', 'refused to be recorded', 'never played the same phrase twice', 'learned their solos from transcriptions', 'improvised without any learned material'],
      '<p>Paragraph 3 states {A}. {C} and {E} describe the idealised picture the author denies.</p>'),
    it('lsat-raa-304', 4, 'inference', 'The author would most likely agree that a music teacher who has students memorise a famous solo',
      ['is acting reasonably if the students then use the solo as material for their own improvising', 'is destroying the students’ ability to improvise', 'should instead forbid students from listening to recordings', 'is teaching a written composition rather than jazz', 'is following the practice of all early jazz players'],
      '<p>The danger "lies not in recordings but in teaching that treats a transcription as the goal rather than as raw material". Memorising is fine if the solo becomes vocabulary. {A}.</p>'),
    it('lsat-raa-305', 5, 'function', 'The third paragraph functions primarily to',
      ['challenge an assumption on which the critics’ argument depends', 'provide further support for the critics’ argument', 'describe how recordings are made', 'introduce a new problem unrelated to the critics’ view', 'summarise the history of jazz education'],
      '<p>It opens: "It assumes that the musicians of the early recording era improvised freely ... In fact ..." It attacks the critics’ assumption. {A}.</p>'),
    it('lsat-raa-306', 5, 'tone of a phrase', 'In the final sentence, the author’s claim that "a tradition without a memory has little to improvise upon" is best understood as expressing',
      ['the view that improvisation depends on a stock of remembered material', 'regret that recordings were invented', 'doubt that improvisation is possible at all', 'the critics’ central objection', 'a prediction that jazz will stop changing'],
      '<p>It echoes paragraph 3’s point that improvisation is "recombining learned material"; recordings supply that memory. {A}.</p>'),
  ],
};
