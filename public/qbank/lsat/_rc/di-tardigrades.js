// LSAT RC passage (natural science): surviving without water. Original, written for fibub.
import { rc } from './h.js';
const it = rc('p2');
export default {
  group: 'p2',
  passage: { title: 'Passage: life without water', passage: `<p>Water is usually described as essential to life, and for most organisms the description is accurate: a cell that loses most of its water suffers damage it cannot repair. Yet a scattered group of organisms, including certain mosses, roundworms and the microscopic animals known as tardigrades, can lose nearly all their water, remain dry and motionless for years, and then resume normal activity within hours of being wetted. Biologists call this state anhydrobiosis, "life without water."</p>
<p>The danger of drying is not simply the absence of water but what happens to the cell’s other contents as water leaves. Proteins fold into precise shapes that depend on surrounding water molecules; as the cell dries, they tend to unfold and stick to one another, and the membranes that enclose the cell and its compartments can fuse or rupture. An organism that survives drying must somehow hold these structures in place.</p>
<p>For several decades the leading explanation centred on a sugar called trehalose. Some anhydrobiotic organisms, such as brine shrimp and certain roundworms, accumulate large amounts of it as they dry. Trehalose appears to replace water around proteins and membranes and, as drying finishes, to form a glassy solid in which the cell’s contents are suspended, unable to move far enough to collide and clump. Experiments in which trehalose protected isolated proteins and membranes from drying damage supported this picture.</p>
<p>Tardigrades complicated it. Measurements found that many tardigrade species produce little or no trehalose, far too little to explain their resistance. Researchers searching for an alternative identified a family of proteins found in tardigrades and not, so far as is known, in other animals. These proteins have no fixed shape in solution; as the animal dries, they too appear to form a glass-like material. When the genes for them were inserted into yeast and bacteria, those organisms became noticeably more tolerant of drying, and when their activity was reduced in tardigrades, the animals survived drying less often.</p>
<p>The discovery does not overturn the trehalose explanation so much as reveal that it described one solution among several. Different lineages, it now appears, arrived at the same basic strategy, turning the drying cell’s interior to glass, using different molecules. The finding has drawn interest beyond biology, from researchers who hope that similar materials might one day let vaccines and medicines be stored without refrigeration.</p>` },
  items: [
    it('lsat-rdi-201', 3, 'detail', 'According to the passage, one danger a drying cell faces is that',
      ['its proteins tend to unfold and stick together', 'it produces too much trehalose', 'its genes are inserted into other organisms', 'it absorbs water too quickly when wetted', 'it forms a glassy solid'],
      '<p>Paragraph 2: proteins "tend to unfold and stick to one another" and membranes may fuse or rupture. {A}. Forming glass ({E}) is the protection, not the danger.</p>'),
    it('lsat-rdi-202', 3, 'detail', 'The passage states that tardigrades complicated the trehalose explanation because',
      ['many tardigrade species produce far too little trehalose to account for their resistance to drying', 'tardigrades die when they are dried', 'trehalose was found to damage proteins', 'tardigrades live only in water', 'brine shrimp produce no trehalose'],
      '<p>Paragraph 4 opens with {A}. {E} reverses paragraph 3, where brine shrimp accumulate large amounts.</p>'),
    it('lsat-rdi-203', 4, 'inference', 'It can be inferred from the passage that the tardigrade proteins and trehalose are similar in that both',
      ['appear to protect cells by forming a glass-like material as drying finishes', 'are found in every animal', 'have a fixed shape in solution', 'were first discovered in yeast', 'are sugars'],
      '<p>Trehalose forms "a glassy solid"; the proteins "too appear to form a glass-like material". The last paragraph names the shared strategy: "turning the drying cell’s interior to glass". {A}. The proteins have "no fixed shape", so {C} is wrong.</p>'),
    it('lsat-rdi-204', 4, 'evidence', 'Which one of the following findings described in the passage most directly supports the claim that the tardigrade proteins help protect against drying?',
      ['Yeast and bacteria given the genes for the proteins became more tolerant of drying.', 'Tardigrades can stay dry for years.', 'Brine shrimp accumulate trehalose as they dry.', 'Proteins depend on water molecules to keep their shape.', 'Some mosses survive drying.'],
      '<p>Adding the genes made other organisms more drying-tolerant, which is direct evidence that the proteins do the protecting. {A}. (Reducing their activity in tardigrades is further support.)</p>'),
    it('lsat-rdi-205', 5, 'author’s view', 'The author’s view of the trehalose explanation is that it',
      ['correctly describes how some organisms survive drying but is not the only way organisms do so', 'has been completely disproved', 'explains tardigrade survival fully', 'was never supported by experiments', 'applies only to roundworms'],
      '<p>"The discovery does not overturn the trehalose explanation so much as reveal that it described one solution among several." {A}.</p>'),
    it('lsat-rdi-206', 5, 'purpose of a detail', 'The author mentions vaccines and medicines in the last sentence primarily in order to',
      ['note a possible practical use of the research outside biology', 'argue that vaccines should contain trehalose', 'show that tardigrade proteins are found in medicines', 'suggest that refrigeration damages proteins', 'explain why tardigrades produce little trehalose'],
      '<p>The sentence says the finding "has drawn interest beyond biology" from researchers hoping similar materials might let medicines be stored without refrigeration. {A}.</p>'),
  ],
};
