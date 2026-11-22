// IELTS Listening Part 4: one speaker, an academic lecture, note completion. Original lectures written for fibub;
// facts are general knowledge, simplified for the test format.
const N = (level, extra = {}) => ({ type: 'text', level, exams: ['academic', 'general'], facets: { skill: 'listening', part: '4', qtype: 'form' }, maxWords: 1, ...extra });

export default {
  topic: 'listening-part4',
  groups: {
    seaweed: {
      title: 'Lecture: the uses of seaweed',
      passage: `<p><b>Questions 31 to 40.</b> Complete the notes. Write <b>ONE WORD ONLY</b> for each answer.</p><div class="qb-notes"><p><b>Seaweed</b></p>
<p><b>Food</b></p><ul><li>In Japan, a basic (31) ______ in soups</li><li>Rich in (32) ______, which the body needs for the thyroid</li></ul>
<p><b>Farming</b></p><ul><li>Used by coastal farmers as a (33) ______</li><li>Added to animal feed; may reduce the (34) ______ cattle produce</li></ul>
<p><b>Industry</b></p><ul><li>A gel from red seaweed thickens (35) ______ such as ice cream</li><li>A related jelly, agar, is used to grow (36) ______ in laboratories</li></ul>
<p><b>Environment</b></p><ul><li>Seaweed forests give (37) ______ to young fish</li><li>Grows very fast: some kelp grows half a (38) ______ a day</li><li>Problem: warmer water causes seaweed to (39) ______</li><li>Farming seaweed needs no fresh water or (40) ______</li></ul></div>`,
      audio: [
        { who: 'N', text: 'You will hear a lecture about seaweed. Look at questions 31 to 40.' },
        { who: 'A', text: 'Good morning. Today I want to talk about a plant that most of us ignore when we walk along the beach: seaweed. Strictly speaking, seaweeds are algae, not plants, but I will use the everyday word.' },
        { who: 'A', text: 'Let us begin with food. In Japan, seaweed is a basic ingredient in soups, and it is used to wrap rice. Nutritionally, it is rich in iodine, which the body needs for the thyroid gland. In fact, too much can be a problem, so it is best eaten in moderation.' },
        { who: 'A', text: 'Turning now to farming. For centuries, coastal farmers have spread seaweed on their fields to feed the soil, in other words as a fertiliser. More recently, researchers have added small amounts of one red seaweed to cattle feed, and early studies suggest it may reduce the methane that cattle produce, which is a powerful greenhouse gas.' },
        { who: 'A', text: 'Now, industry. A gel extracted from red seaweed is used to thicken desserts, ice cream being the best known example. A related substance, agar, is used in laboratories as a jelly on which scientists grow bacteria. You may have seen it in round glass dishes.' },
        { who: 'A', text: 'Finally, the environment. Large seaweeds such as kelp form underwater forests, which give shelter to young fish, protecting them from larger animals. Kelp is also one of the fastest growing living things on Earth: some species grow half a metre a day.' },
        { who: 'A', text: 'But these forests are under threat. When the water becomes too warm, seaweed tends to die, and in some regions large areas have already disappeared.' },
        { who: 'A', text: 'On a more positive note, seaweed farming is attracting interest because, unlike crops on land, it needs no fresh water and no fertiliser at all. It simply takes what it needs from the sea.' },
      ],
    },
    bridges: {
      title: 'Lecture: why some old bridges have lasted',
      passage: `<p><b>Questions 31 to 38.</b> Complete the notes. Write <b>ONE WORD ONLY</b> for each answer.</p><div class="qb-notes"><p><b>Long-lasting stone bridges</b></p>
<ul><li>The arch shape turns the weight of the bridge into (31) ______, which stone resists well</li><li>Builders used a wooden frame called a (32) ______ to hold stones until the arch was finished</li>
<li>The last stone placed at the top is the (33) ______</li><li>Roman builders mixed volcanic (34) ______ into their concrete</li>
<li>In sea water, this concrete becomes (35) ______ over time</li><li>Main threat to old bridges today: (36) ______, which washes away the river bed</li>
<li>Modern traffic is much (37) ______ than the carts the bridges were built for</li><li>Engineers now use (38) ______ to check for cracks without damaging the stone</li></ul></div>`,
      audio: [
        { who: 'N', text: 'You will hear part of a lecture about old stone bridges. Look at questions 31 to 38.' },
        { who: 'A', text: 'Some stone bridges built two thousand years ago still carry traffic today. Why have they lasted so long?' },
        { who: 'A', text: 'The first answer is the arch. An arch turns the weight of the bridge and its load into compression, a squeezing force. Stone is weak when you bend or stretch it, but it is extremely strong when it is squeezed.' },
        { who: 'A', text: 'Building an arch, though, is tricky, because it cannot stand until it is complete. So builders used a temporary wooden frame, called a centring, to support the stones. The very last stone, placed at the top, is called the keystone. Once it was in, the frame could be removed.' },
        { who: 'A', text: 'The second answer is the material. Roman builders made concrete by mixing lime with volcanic ash. Recent studies show that in sea water this concrete actually becomes stronger over time, as new minerals grow inside it.' },
        { who: 'A', text: 'So what threatens these bridges now? Not age, surprisingly, and not frost, although frost does some damage. The main threat is flooding, because fast flood water washes away the river bed around the foundations.' },
        { who: 'A', text: 'There is also traffic. Modern trucks are far heavier than the carts these bridges were designed for.' },
        { who: 'A', text: 'To look after them, engineers now use radar to check for hidden cracks inside the stone without drilling into it or causing any damage.' },
      ],
    },
  },
  items: [
    { id: 'lp4-sea-1', ...N(2), group: 'seaweed', q: '31 a basic ______ in soups', answer: ['ingredient'], sol: '"A basic ingredient in soups".' },
    { id: 'lp4-sea-2', ...N(3), group: 'seaweed', q: '32 Rich in ______', answer: ['iodine'], sol: '"Rich in iodine, which the body needs for the thyroid gland".' },
    { id: 'lp4-sea-3', ...N(2), group: 'seaweed', q: '33 used as a ______', answer: ['fertiliser', 'fertilizer'], sol: '"To feed the soil, in other words as a fertiliser". Both spellings are accepted.' },
    { id: 'lp4-sea-4', ...N(3), group: 'seaweed', q: '34 may reduce the ______ cattle produce', answer: ['methane'], sol: '"May reduce the methane that cattle produce".' },
    { id: 'lp4-sea-5', ...N(2), group: 'seaweed', q: '35 thickens ______ such as ice cream', answer: ['desserts'], sol: '"Thicken desserts, ice cream being the best known example". Plural.' },
    { id: 'lp4-sea-6', ...N(3), group: 'seaweed', q: '36 agar is used to grow ______', answer: ['bacteria'], sol: '"A jelly on which scientists grow bacteria". Bacteria is already plural.' },
    { id: 'lp4-sea-7', ...N(2), group: 'seaweed', q: '37 give ______ to young fish', answer: ['shelter'], sol: '"Give shelter to young fish".' },
    { id: 'lp4-sea-8', ...N(2), group: 'seaweed', q: '38 half a ______ a day', answer: ['metre', 'meter'], sol: '"Half a metre a day".' },
    { id: 'lp4-sea-9', ...N(3), group: 'seaweed', q: '39 warmer water causes seaweed to ______', answer: ['die'], sol: '"When the water becomes too warm, seaweed tends to die".' },
    { id: 'lp4-sea-10', ...N(3), group: 'seaweed', q: '40 needs no fresh water or ______', answer: ['fertiliser', 'fertilizer'], sol: '"Needs no fresh water and no fertiliser at all".' },
    { id: 'lp4-br-1', ...N(3), group: 'bridges', q: '31 turns the weight into ______', answer: ['compression'], sol: '"Into compression, a squeezing force".' },
    { id: 'lp4-br-2', ...N(4), group: 'bridges', q: '32 a wooden frame called a ______', answer: ['centring', 'centering'], sol: '"A temporary wooden frame, called a centring". American spelling "centering" is also accepted.' },
    { id: 'lp4-br-3', ...N(2), group: 'bridges', q: '33 The last stone at the top is the ______', answer: ['keystone'], sol: '"The very last stone, placed at the top, is called the keystone".' },
    { id: 'lp4-br-4', ...N(2), group: 'bridges', q: '34 mixed volcanic ______ into their concrete', answer: ['ash'], sol: '"Mixing lime with volcanic ash".' },
    { id: 'lp4-br-5', ...N(3), group: 'bridges', q: '35 this concrete becomes ______ over time', answer: ['stronger'], sol: '"Becomes stronger over time".' },
    { id: 'lp4-br-6', ...N(3), group: 'bridges', q: '36 Main threat: ______', answer: ['flooding', 'floods'], sol: 'Not age, not frost: "the main threat is flooding".', trap: 'Frost is mentioned and set aside.' },
    { id: 'lp4-br-7', ...N(2), group: 'bridges', q: '37 Modern traffic is much ______', answer: ['heavier'], sol: '"Far heavier than the carts".' },
    { id: 'lp4-br-8', ...N(3), group: 'bridges', q: '38 Engineers now use ______ to check for cracks', answer: ['radar'], sol: '"Engineers now use radar to check for hidden cracks".' },
  ],
};
