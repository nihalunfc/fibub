// LSAT Argumentative Writing practice prompts (unscored on the real test). Original prompts written for fibub.
// Each is an `open` item: timers, a self-check list and a model answer; nothing is scored or stored.
const F = { section: 'writing', qtype: 'writing' };
const SOL = '<p>There is no single right answer: readers look for a clear position, reasons with support, and a fair answer to the strongest objection. Check your essay against the list, then compare it with the model essay.</p>';
const checklist = ['States a clear position in the first paragraph', 'Gives at least two reasons, each with support from the perspectives or your own reasoning', 'Takes on the strongest opposing point and answers it', 'Ends with a conclusion that follows from the reasons', 'Organised in paragraphs; plain, precise sentences'];
export default {
  topic: 'argumentative-writing',
  items: [
    { id: 'lsat-aw-001', type: 'open', level: 3, exams: ['lsat'], sub: 'policy debate', facets: F, format: 'essay', timers: { prep: 900, words: 600 }, checklist, sol: SOL,
      q: `<p><b>Key question:</b> Should a city require all new apartment buildings to include a share of units rented below market price?</p>
<p><b>Perspective 1:</b> Requiring affordable units in every new building spreads lower-income households across neighbourhoods and ensures that growth benefits more people.</p>
<p><b>Perspective 2:</b> Such requirements raise the cost of building, so fewer buildings get built, and the shortage that drives rents up gets worse.</p>
<p><b>Perspective 3:</b> The goal is right, but the city should pay for affordable units directly with public money rather than placing the cost on builders.</p>
<p>Write an argumentative essay in which you take a position on the key question. You may draw on the perspectives above, your own experience and reasoning.</p>`,
      model: `<p>The city should require a share of below-market units in new buildings, but only together with measures that keep building worthwhile; a requirement on its own risks the very shortage Perspective 2 describes.</p>
<p>The case for a requirement is strongest on location. Public money alone (Perspective 3) tends to buy affordable housing where land is cheapest, which concentrates lower-income households in a few areas. A share in every new building spreads them across neighbourhoods with better schools and transit, which Perspective 1 rightly values.</p>
<p>Perspective 2 raises the strongest objection: if the requirement makes projects unprofitable, builders stop building, and rents rise for everyone. That risk is real, but it argues for designing the rule well rather than dropping it. The city can offset the cost by letting buildings that include affordable units go taller or skip parking minimums, so the market-rate units pay for the rest.</p>
<p>A requirement paired with such offsets keeps the location benefit while protecting the supply of housing. The question is not whether builders should bear some of the cost, but how to make sure the trade still leaves building worth doing.</p>` },
    { id: 'lsat-aw-002', type: 'open', level: 3, exams: ['lsat'], sub: 'institutional rule', facets: F, format: 'essay', timers: { prep: 900, words: 600 }, checklist, sol: SOL,
      q: `<p><b>Key question:</b> Should universities make class attendance count toward course grades?</p>
<p><b>Perspective 1:</b> Attendance is part of learning; students who come to class learn more, and grading it encourages the habit.</p>
<p><b>Perspective 2:</b> Adults should be judged on what they can show they know. Grading attendance rewards being present, not learning.</p>
<p><b>Perspective 3:</b> Attendance rules hurt students who work or care for family, who are often the students with the least support.</p>
<p>Write an argumentative essay in which you take a position on the key question. You may draw on the perspectives above, your own experience and reasoning.</p>`,
      model: `<p>Universities should not grade attendance itself; they should grade the work that attendance makes possible, such as in-class exercises that can be made up.</p>
<p>Perspective 1 is right that showing up matters, but it confuses a cause of learning with learning. If students who attend learn more, that will show in their grades without a separate mark for being there. Grading presence adds nothing for those students and penalises the rest twice.</p>
<p>Perspective 3 shows who the rest often are: students with jobs or caring duties. A rule that docks their grades for absences measures their circumstances, not their understanding, which is what Perspective 2 says grades should measure.</p>
<p>The strongest point for attendance grades is motivation: some students skip class unless it costs them. Short in-class tasks answer that: they reward engagement, and a fair make-up policy keeps them from punishing students who cannot always be there. Grades should measure learning, and the best way to encourage attendance is to make class worth attending.</p>` },
  ],
};
