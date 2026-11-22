// LSAT RC comparative passages (environmental policy): street trees and city heat. Original, written for fibub.
import { rc } from './h.js';
const it = rc('p2');
export default {
  group: 'p2',
  passage: { title: 'Comparative reading: Passage A and Passage B on trees and urban heat', passage: `<p><b>Passage A</b></p>
<p>Cities are hotter than the countryside around them, sometimes by several degrees on a summer evening, because pavement and buildings absorb sunlight during the day and release it at night. As heat waves grow more frequent, this difference has become a matter of public health: heat kills more people in many wealthy countries than any other kind of weather event. Trees offer one of the most effective remedies available. A mature street tree shades the pavement beneath it and cools the air through the evaporation of water from its leaves. Studies comparing neighbourhoods have found that streets with dense tree cover can be markedly cooler at street level than nearby streets without it. City governments should therefore set ambitious targets for tree canopy, and they should begin with the neighbourhoods that have the least, which are very often the poorest and the hottest.</p>
<p><b>Passage B</b></p>
<p>Planting trees has become the favourite answer to urban heat, and it is easy to see why: trees are popular, visible and cheap to plant. But planting is the cheap part. A young tree in a city street faces compacted soil, little water, road salt and damage from vehicles, and in many programmes a large share of newly planted trees die within their first several years. A tree delivers most of its cooling only when its canopy is large, which can take decades. Programmes that count trees planted rather than trees surviving can therefore report success while delivering little shade. None of this means trees are a poor investment. It means that a planting target without long-term funding for watering, soil improvement and care is closer to a gesture than a policy. Cities would also do well to pair trees with measures that work immediately, such as reflective roofing and shaded bus stops, in the neighbourhoods where heat is most dangerous.</p>` },
  items: [
    it('lsat-rcc-201', 3, 'shared view', 'Both authors would most likely agree with which one of the following?',
      ['Mature trees can cool city streets.', 'Planting targets alone are an adequate heat policy.', 'Reflective roofing works better than trees.', 'Most newly planted street trees survive.', 'Urban heat is not a public health concern.'],
      '<p>A cites studies of cooler tree-lined streets; B says a tree cools "when its canopy is large" and calls trees not "a poor investment". {A}. B rejects {B}.</p>'),
    it('lsat-rcc-202', 3, 'relationship', 'Which one of the following best describes the relationship between the two passages?',
      ['Passage B accepts the value of trees that Passage A argues for but warns that planting programmes often fail to deliver it without long-term care.', 'Passage B rejects tree planting as useless.', 'Passage A answers objections that Passage B raises.', 'The passages discuss entirely different problems.', 'Passage B provides the evidence for Passage A’s statistics.'],
      '<p>B agrees trees are worthwhile but says planting without care "is closer to a gesture than a policy". {A}. Passage A does not respond to B, so {C} is wrong.</p>'),
    it('lsat-rcc-203', 4, 'difference', 'The authors would most likely disagree about whether',
      ['setting a tree-canopy target is, by itself, a sound response to urban heat', 'cities are hotter than the countryside', 'poorer neighbourhoods often face the most heat', 'trees cool the air through evaporation', 'heat waves are a public health problem'],
      '<p>A recommends "ambitious targets for tree canopy"; B says a target without care funding is "closer to a gesture". {A}. Both accept or do not dispute the others.</p>'),
    it('lsat-rcc-204', 4, 'detail', 'Passage B mentions which one of the following that Passage A does not?',
      ['Many newly planted trees die within their first several years.', 'Pavement absorbs sunlight during the day.', 'Tree-lined streets can be cooler.', 'Heat is a public health risk.', 'Poor neighbourhoods often have few trees.'],
      '<p>Only B discusses young-tree mortality. {A}. The rest are in A.</p>'),
    it('lsat-rcc-205', 5, 'application', 'Which one of the following city programmes would the author of Passage B most likely praise?',
      ['A programme that plants fewer trees but funds watering and care for ten years, while installing shaded bus stops in the hottest districts', 'A programme that plants a million trees in a year and reports the number planted', 'A programme that plants trees only in wealthy districts', 'A programme that replaces all trees with reflective roofing', 'A programme that stops all tree planting'],
      '<p>B wants long-term care and immediate measures "such as reflective roofing and shaded bus stops" where heat is worst. {A}. {B} is the planted-count approach B criticises.</p>'),
    it('lsat-rcc-206', 5, 'author’s attitude', 'The attitude of the author of Passage B toward tree planting is best described as',
      ['supportive of trees but critical of how planting programmes are often run', 'hostile to planting trees in cities', 'enthusiastic and uncritical', 'indifferent to urban heat', 'uncertain whether trees provide shade'],
      '<p>"None of this means trees are a poor investment" plus sustained criticism of count-based programmes. {A}.</p>'),
  ],
};
