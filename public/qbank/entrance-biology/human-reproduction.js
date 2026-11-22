// NEET UG Biology: Human reproduction (NCERT Class 12, Chapter 2 in the 2023 rationalised book). All questions original fibub work.
import { pick, int, choose, fmt, shuffleOpts, numOpts, g } from '../_entrance.js';

const items = [];
const groups = {};
let n = 0, pos = 0;
const POS = [3, 0, 2, 1];
const nid = () => `hr-${String(++n).padStart(3, '0')}`;
const ex = (level) => (level <= 3 ? ['neet', 'cuet'] : ['neet']);
const AR = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const ST = ['Both Statement I and Statement II are correct', 'Both Statement I and Statement II are incorrect', 'Statement I is correct but Statement II is incorrect', 'Statement I is incorrect but Statement II is correct'];
function mc(level, sub, q, correct, wrongs, sol, trap, format = 'single') {
  const p = POS[pos++ % 4];
  const options = [...wrongs];
  options.splice(p, 0, correct);
  items.push({ id: nid(), type: 'mcq', level, format, exams: ex(level), sub, q, options, answer: p, sol, ...(trap ? { trap } : {}) });
}
function asr(level, sub, A, R, ans, sol, trap) {
  items.push({ id: nid(), type: 'mcq', level, format: 'assertion', exams: ex(level), sub, q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: AR, answer: ans, sol, ...(trap ? { trap } : {}) });
}
function stm(level, sub, s1, s2, ans, sol, trap) {
  items.push({ id: nid(), type: 'mcq', level, format: 'statements', exams: ex(level), sub, q: `<b>Statement I:</b> ${s1}<br><b>Statement II:</b> ${s2}`, options: ST, answer: ans, sol, ...(trap ? { trap } : {}) });
}
function match(level, sub, key, title, list1, list2, correct, wrongs, sol, trap) {
  groups[key] = { title, list1, list2 };
  const p = POS[pos++ % 4];
  const options = [...wrongs]; options.splice(p, 0, correct);
  items.push({ id: nid(), type: 'mcq', level, format: 'match', exams: ex(level), sub, group: key, q: 'Match List I with List II and choose the correct code.', options, answer: p, sol, ...(trap ? { trap } : {}) });
}
function pass(key, title, passage) { groups[key] = { title, passage }; }
function pq(key, level, sub, q, correct, wrongs, sol, trap) {
  const p = POS[pos++ % 4];
  const options = [...wrongs];
  options.splice(p, 0, correct);
  items.push({ id: nid(), type: 'mcq', level, format: 'passage', exams: ex(level), sub, group: key, q, options, answer: p, sol, ...(trap ? { trap } : {}) });
}
function nat(level, sub, q, answer, sol, unit, trap, tol = 0) {
  items.push({ id: nid(), type: 'nat', level, format: tol ? 'numeric' : 'integer', exams: ['neet'], sub, q, answer, tol, ...(unit ? { unit } : {}), sol, ...(trap ? { trap } : {}) });
}

// ---------------------------------------------------------------- Level 1
mc(1, `flower structure`, `The male reproductive whorl of a flower is called the`, `androecium`, [`gynoecium`, `calyx`, `corolla`], `Androecium is the whorl of stamens and makes pollen. Gynoecium is the female whorl (pistils). Calyx and corolla are the protective and attractive whorls.`);
mc(1, `flower structure`, `A typical angiosperm anther is`, `bilobed, with each lobe having two chambers (dithecous)`, [`unilobed with one chamber`, `bilobed with one chamber in each lobe`, `trilobed with three chambers`], `A typical anther has two lobes, and each lobe has two thecae. So it is bilobed and dithecous.`);
mc(1, `microsporogenesis`, `The number of microsporangia in a typical anther is`, `four`, [`two`, `six`, `eight`], `Two lobes with two thecae each give four microsporangia (tetrasporangiate). In section the anther looks like a butterfly.`);
mc(1, `microsporogenesis`, `The innermost wall layer of a microsporangium, which nourishes the developing pollen grains, is the`, `tapetum`, [`endothecium`, `epidermis`, `middle layer`], `Wall layers from outside to inside: epidermis, endothecium, middle layers, tapetum. The tapetum supplies nutrients to the developing pollen.`);
mc(1, `microsporogenesis`, `Each cell of the sporogenous tissue is capable of forming a`, `microspore tetrad`, [`megaspore tetrad`, `triad of pollen`, `embryo sac`], `Each sporogenous cell can become a pollen mother cell (microspore mother cell), which divides by meiosis to form a tetrad of four microspores.`);

// ---------------------------------------------------------------- Level 1
mc(1, `male system`, `The primary sex organs of a human male are the`, `testes`, [`vas deferens`, `epididymis`, `prostate gland`], `Testes make sperm and the male hormone testosterone. The other organs are ducts or accessory glands.`);
mc(1, `male system`, `The testes are located outside the abdominal cavity in a pouch called the`, `scrotum`, [`prepuce`, `perineum`, `urethra`], `The scrotum keeps the testes 2 to 2.5 &deg;C lower than the body temperature, which is needed for sperm formation.`);
mc(1, `male system`, `Sperm are formed in the`, `seminiferous tubules`, [`epididymis`, `seminal vesicles`, `prostate`], `Spermatogenesis takes place in the coiled seminiferous tubules of the testis.`);
mc(1, `male system`, `Which cells of the testis produce androgens?`, `Leydig cells`, [`Sertoli cells`, `Spermatogonia`, `Granulosa cells`], `Leydig cells (interstitial cells), lying between the seminiferous tubules, make testosterone and other androgens.`);
mc(1, `male system`, `The male accessory glands include`, `seminal vesicles, prostate and bulbourethral glands`, [`testes and epididymis`, `ovaries and uterus`, `vasa efferentia and rete testis`], `The paired seminal vesicles, the prostate and the paired bulbourethral glands secrete into the seminal plasma.`);
mc(1, `female system`, `The primary female sex organs are the`, `ovaries`, [`uterus`, `fallopian tubes`, `vagina`], `Ovaries produce the ovum and the hormones oestrogen and progesterone.`);
mc(1, `female system`, `The site of normal fertilisation in humans is the`, `ampulla of the fallopian tube`, [`uterus`, `vagina`, `cervix`], `Fertilisation takes place in the ampullary-isthmic junction of the fallopian tube.`);
mc(1, `female system`, `Implantation of the embryo takes place in the`, `endometrium of the uterus`, [`ovary`, `fallopian tube`, `vagina`], `The blastocyst embeds into the endometrium, the glandular inner layer of the uterus.`);
mc(1, `female system`, `The inner glandular lining of the uterus is the`, `endometrium`, [`myometrium`, `perimetrium`, `hymen`], `Endometrium changes during the menstrual cycle. Myometrium is the middle muscle layer and perimetrium is the outer thin layer.`);
mc(1, `gametogenesis`, `The process of formation of sperm is called`, `spermatogenesis`, [`oogenesis`, `spermiation only`, `parthenogenesis`], `Spermatogenesis is the full process from spermatogonium to spermatozoon.`);
mc(1, `gametogenesis`, `Oogenesis starts in the female`, `during embryonic development`, [`at puberty`, `at menopause`, `at birth`], `Oogonia are formed in the foetal ovary and they start meiosis I there. The process is completed only after fertilisation.`);
mc(1, `sperm structure`, `The cap-like structure on the head of a sperm that holds enzymes is the`, `acrosome`, [`mitochondrion`, `centriole`, `zona pellucida`], `The acrosome is filled with enzymes that help the sperm to penetrate the egg coverings.`);
mc(1, `sperm structure`, `The middle piece of the sperm contains many`, `mitochondria`, [`ribosomes`, `lysosomes`, `chloroplasts`], `Mitochondria supply the energy for the movement of the tail.`);
mc(1, `menstrual cycle`, `The average length of the human menstrual cycle is about`, `28 days`, [`14 days`, `45 days`, `7 days`], `Menstruation repeats at an average interval of 28 or 29 days. Ovulation happens near the 14th day.`);
mc(1, `menstrual cycle`, `The first menstruation at puberty is called`, `menarche`, [`menopause`, `ovulation`, `parturition`], `Menarche is the start of menstrual cycles. The permanent stop at about 50 years is menopause.`);
mc(1, `menstrual cycle`, `Ovulation is the release of`, `a secondary oocyte from the Graafian follicle`, [`a sperm from the testis`, `a polar body from the corpus luteum`, `a zygote from the uterus`], `At ovulation the Graafian follicle bursts and releases a secondary oocyte (ovum).`);
mc(1, `fertilisation`, `The fusion of a sperm and an ovum forms a`, `zygote`, [`morula`, `blastocyst`, `gastrula`], `Their haploid nuclei fuse to give a diploid zygote.`);
mc(1, `embryo development`, `The 8 to 16 celled embryo is called a`, `morula`, [`blastocyst`, `gastrula`, `zygote`], `Cleavage divisions form blastomeres. The solid ball of 8 to 16 cells is a morula.`);
mc(1, `pregnancy`, `The structural and functional connection between the foetus and the mother is the`, `placenta`, [`corpus luteum`, `amnion`, `yolk sac`], `The placenta is made of chorionic villi and uterine tissue. It is joined to the foetus by the umbilical cord.`);
mc(1, `parturition`, `Which hormone causes strong uterine contractions during childbirth?`, `Oxytocin`, [`Prolactin`, `Progesterone`, `FSH`], `Oxytocin from the maternal pituitary acts on the uterine muscle. Prolactin helps milk production.`);
mc(1, `lactation`, `The milk produced in the first few days after delivery is called`, `colostrum`, [`lactose`, `casein`, `chyme`], `Colostrum contains antibodies that give the newborn resistance to disease.`);
mc(1, `female system`, `The finger-like projections at the funnel of the fallopian tube are the`, `fimbriae`, [`villi`, `cilia of the cervix`, `labia`], `The infundibulum has fimbriae, which help to collect the ovum after ovulation.`);

// ---------------------------------------------------------------- Level 2
mc(2, `male system`, `Which structure collects sperm from the testis and stores them?`, `Epididymis`, [`Seminal vesicle`, `Prostate`, `Urethra`], `The seminiferous tubules open into the vasa efferentia through the rete testis. These lead to the epididymis, where sperm are stored.`);
mc(2, `male system`, `The path of sperm from the testis to the outside is`, `seminiferous tubule, rete testis, vasa efferentia, epididymis, vas deferens, urethra`, [`seminiferous tubule, vas deferens, rete testis, epididymis, urethra`, `rete testis, seminiferous tubule, epididymis, vasa efferentia, urethra`, `seminiferous tubule, epididymis, rete testis, vasa efferentia, urethra`], `Sperm leave the tubules into the rete testis, then the vasa efferentia, epididymis and vas deferens. The vas deferens joins the duct of the seminal vesicle to form the ejaculatory duct, which opens into the urethra.`);
mc(2, `male system`, `Each testis has about how many compartments called testicular lobules?`, `250`, [`25`, `2500`, `25000`], `The testis is divided into about 250 lobules. Each lobule has one to three coiled seminiferous tubules.`);
mc(2, `male system`, `The urethra in a male carries`, `both urine and semen`, [`only urine`, `only semen`, `only sperm without fluid`], `The urethra begins at the urinary bladder and passes through the penis. Its opening is the urethral meatus.`);
mc(2, `male system`, `The secretion of the bulbourethral glands`, `lubricates the penis`, [`provides fructose to sperm`, `makes androgens`, `stores sperm`], `The bulbourethral glands add a lubricating fluid. Seminal vesicles provide fructose.`);
mc(2, `male system`, `The sugar present in the seminal plasma that supplies energy to sperm is`, `fructose`, [`glucose only`, `lactose`, `sucrose`], `Seminal plasma contains fructose, calcium and some enzymes.`);
mc(2, `male system`, `The glans penis is covered by a loose fold of skin called the`, `foreskin (prepuce)`, [`scrotum`, `hymen`, `labia`], `The foreskin covers the glans in many males.`);
mc(2, `female system`, `The uterine layer that shows strong contractions during delivery is the`, `myometrium`, [`endometrium`, `perimetrium`, `cervix lining`], `Myometrium is the thick middle layer of smooth muscle.`);
mc(2, `female system`, `The cervical canal along with the vagina forms the`, `birth canal`, [`fallopian canal`, `uterine cavity only`, `urethral canal`], `The baby passes through the cervix and the vagina at birth.`);
mc(2, `female system`, `The narrow part of the fallopian tube close to the uterus is the`, `isthmus`, [`ampulla`, `infundibulum`, `fimbriae`], `The tube has infundibulum (funnel), ampulla (wide) and isthmus (narrow, joining the uterus).`);
mc(2, `female system`, `The mammary gland alveoli open into`, `mammary tubules`, [`lactiferous ducts directly`, `mammary ampullae directly`, `nipples directly`], `Alveoli secrete milk into their cavities, which open into mammary tubules. Tubules join to form a mammary duct, then an ampulla and a lactiferous duct.`);
mc(2, `female system`, `The fold of skin that partially covers the vaginal opening is the`, `hymen`, [`clitoris`, `labia majora`, `mons pubis`], `The hymen may break by sports, a fall or tampon use. Its presence or absence is not a reliable test of virginity.`);
mc(2, `gametogenesis`, `The cells that give support and nutrition to the germ cells in the seminiferous tubules are the`, `Sertoli cells`, [`Leydig cells`, `Theca cells`, `Granulosa cells`], `Sertoli cells nourish spermatogenic cells. FSH acts on them.`);
mc(2, `gametogenesis`, `Spermatogonia are`, `diploid and divide by mitosis`, [`haploid and divide by meiosis`, `diploid and divide by meiosis only`, `haploid and do not divide`], `Spermatogonia (2n = 46) lie against the inner wall of the tubule and multiply by mitosis. Some become primary spermatocytes.`);
mc(2, `gametogenesis`, `A secondary spermatocyte of human has`, `23 chromosomes`, [`46 chromosomes`, `92 chromosomes`, `22 chromosomes`], `Meiosis I halves the number. The secondary spermatocyte is haploid, with 23 chromosomes.`);
mc(2, `gametogenesis`, `The transformation of spermatids into spermatozoa is called`, `spermiogenesis`, [`spermiation`, `spermatocytogenesis`, `oogenesis`], `Spermiogenesis is the change in shape of the spermatid. Spermiation is the release of sperm into the lumen of the tubule.`);
mc(2, `gametogenesis`, `Release of sperm from the Sertoli cells into the lumen of the seminiferous tubule is called`, `spermiation`, [`spermiogenesis`, `ovulation`, `capacitation`], `Spermiation releases the finished sperm into the lumen.`);
mc(2, `gametogenesis`, `At puberty, each ovary has about`, `60,000 to 80,000 primary follicles`, [`2 million primary follicles`, `400 primary follicles`, `no follicles`], `Millions of oogonia form in the foetus, but many degenerate. Only 60,000 to 80,000 follicles remain at puberty.`);
mc(2, `gametogenesis`, `A primary oocyte is surrounded by granulosa cells in a`, `primary follicle`, [`tertiary follicle`, `corpus luteum`, `Graafian follicle only`], `A primary oocyte surrounded by a layer of granulosa cells forms the primary follicle.`);
mc(2, `gametogenesis`, `The fluid-filled cavity that appears in a tertiary follicle is the`, `antrum`, [`zona`, `morula`, `acrosome`], `The antrum marks the tertiary follicle stage. The follicle then becomes the Graafian follicle.`);
mc(2, `gametogenesis`, `The first polar body is formed when`, `the primary oocyte completes meiosis I`, [`the secondary oocyte completes meiosis II`, `the zygote divides`, `the Graafian follicle bursts`], `Meiosis I is unequal. It gives a large secondary oocyte and a tiny first polar body.`);
mc(2, `sperm structure`, `At the time of ovulation, the human secondary oocyte is arrested at`, `metaphase II`, [`prophase I`, `anaphase I`, `telophase II`], `Meiosis I is completed just before ovulation. Meiosis II stops at metaphase II until a sperm enters.`);
mc(2, `menstrual cycle`, `The LH surge in the middle of the menstrual cycle mainly causes`, `rupture of the Graafian follicle`, [`breakdown of the endometrium`, `start of lactation`, `formation of the placenta`], `The LH surge around the 14th day triggers ovulation.`);
mc(2, `menstrual cycle`, `The corpus luteum secretes`, `large amounts of progesterone`, [`LH only`, `hCG`, `FSH`], `Progesterone maintains the endometrium for implantation and keeps it ready.`);
mc(2, `menstrual cycle`, `Menstruation takes place when`, `the corpus luteum degenerates and progesterone falls, with no fertilisation`, [`LH is at its peak`, `the ovum is fertilised`, `the endometrium is thinnest`], `Without fertilisation, the corpus luteum degenerates, progesterone falls and the endometrium breaks down.`);
mc(2, `menstrual cycle`, `The proliferative phase of the cycle takes place under the influence of`, `oestrogen from the growing follicles`, [`progesterone from the corpus luteum`, `hCG`, `oxytocin`], `In the follicular (proliferative) phase, oestrogen makes the endometrium regenerate.`);
mc(2, `fertilisation`, `The zona pellucida changes after sperm contact so that`, `additional sperm cannot enter`, [`the ovum is expelled`, `the zygote forms the placenta`, `meiosis I starts`], `This block against polyspermy ensures one sperm only.`);
mc(2, `fertilisation`, `Fertilisation induces the secondary oocyte to complete`, `meiosis II`, [`meiosis I`, `mitosis`, `cleavage`], `Meiosis II is completed on sperm entry, giving the ovum and the second polar body.`);
mc(2, `fertilisation`, `The sex of a human baby is decided by`, `the type of sperm (X or Y) that fertilises the ovum`, [`the ovum`, `the placenta`, `the mother's diet`], `All ova carry X. A sperm with X gives a girl and one with Y gives a boy.`);
mc(2, `embryo development`, `The outer layer of cells of the blastocyst is the`, `trophoblast`, [`inner cell mass`, `endoderm`, `amnion`], `The trophoblast attaches to the endometrium. The inner cell mass gives the embryo.`);
mc(2, `embryo development`, `The inner cell mass of the blastocyst gives rise to`, `the embryo`, [`the placenta only`, `the trophoblast`, `the umbilical cord only`], `The stem cells of the inner cell mass can form all the tissues and organs of the body.`);
mc(2, `pregnancy`, `Which hormone is secreted by the placenta only in pregnancy?`, `hCG`, [`FSH`, `LH`, `Testosterone`], `hCG, hPL (human placental lactogen) and, from the ovary, relaxin are pregnancy hormones. Oestrogen and progesterone are also made by the ovary.`);
mc(2, `pregnancy`, `The first movements of the foetus and appearance of hair on the head are usually seen in the`, `fifth month`, [`first month`, `second month`, `ninth month`], `By the end of the second month, limbs and digits form. By 12 weeks, most organ systems are formed.`);
mc(2, `pregnancy`, `The heart of the human embryo is formed after about`, `one month of pregnancy`, [`two months`, `five months`, `seven months`], `NCERT states that the heart forms after one month of pregnancy.`);
mc(2, `parturition`, `The mild uterine contractions started by signals from the foetus and placenta are called`, `foetal ejection reflex`, [`milk ejection reflex`, `implantation reflex`, `luteal reflex`], `The reflex triggers release of oxytocin from the maternal pituitary.`);
mc(2, `lactation`, `Which hormone is mainly responsible for milk production by mammary glands?`, `Prolactin`, [`Oxytocin`, `Oestrogen`, `Relaxin`], `Prolactin stimulates milk synthesis. Oxytocin pushes milk out (milk ejection).`);

// ---------------------------------------------------------------- Assertions and statements
asr(2, `male system`, `Testes lie in the scrotum outside the abdominal cavity.`, `Sperm formation needs a temperature lower than the normal body temperature.`, 0, `The scrotum keeps the testes 2 to 2.5 &deg;C cooler. R explains A.`);
asr(2, `fertilisation`, `Only one sperm enters the ovum.`, `The zona pellucida changes after the first sperm touches it.`, 0, `The membrane changes block other sperm. R explains A.`);
asr(3, `menstrual cycle`, `Menstruation takes place when the corpus luteum degenerates.`, `Progesterone from the corpus luteum maintains the endometrium.`, 0, `When the corpus luteum fails, progesterone falls. The endometrium is lost as menstrual flow. R explains A.`);
asr(3, `gametogenesis`, `All the primary oocytes of a woman are formed before her birth.`, `Oogonia stop dividing mitotically after birth in the human female.`, 0, `The foetal ovary forms millions of oogonia and primary oocytes. No new ones form after birth.`);
asr(3, `gametogenesis`, `Spermatogenesis produces four functional sperm from one primary spermatocyte, but oogenesis gives only one ovum from one primary oocyte.`, `Divisions in oogenesis are unequal and the polar bodies get little cytoplasm.`, 0, `In oogenesis, meiosis I and II are unequal. Most cytoplasm stays with the ovum. The polar bodies degenerate.`);
asr(3, `pregnancy`, `Pregnancy test kits detect hCG in urine.`, `hCG is made by the trophoblast cells soon after implantation.`, 0, `hCG rises soon after implantation, which is why the test works early. R explains A.`);
asr(3, `lactation`, `Colostrum is essential for the newborn.`, `It contains antibodies that give passive immunity.`, 0, `Colostrum, the first milk, is rich in IgA antibodies. R explains A.`);
asr(4, `pregnancy`, `Relaxin is produced by the ovary during later pregnancy.`, `Relaxin is secreted only by the placenta.`, 2, `Relaxin is secreted by the ovary in the later phase of pregnancy. So R is false.`, `Do not confuse hCG, hPL (placenta) with relaxin (ovary).`);
asr(4, `embryo development`, `The 8 to 16 celled embryo does not increase in size even though the cell number increases.`, `Cleavage is a series of mitotic divisions without growth between them.`, 0, `Cleavage divides the zygote into smaller blastomeres without growth, so the overall size stays the same.`);
asr(4, `fertilisation`, `The sex chromosome of the ovum is always X.`, `The sex of the baby is decided by the mother.`, 2, `A is true. The father decides the sex since his sperm may carry X or Y. R is false.`, `A famous myth: the mother decides the sex.`);
stm(2, `male system`, `Leydig cells lie outside the seminiferous tubules.`, `They produce androgens.`, 0, `Leydig cells lie in the interstitial spaces between the tubules and make androgens. Both are correct.`);
stm(3, `female system`, `The perimetrium is the innermost layer of the uterus.`, `The endometrium undergoes cyclic changes in the menstrual cycle.`, 3, `The perimetrium is the thin outer layer, not the innermost. The endometrium is the inner glandular layer and does change in cycles.`);
stm(3, `menstrual cycle`, `The ovulation takes place at about the middle of the cycle.`, `It is induced by a surge in LH.`, 0, `Both are correct. The LH surge around day 14 triggers ovulation in a 28-day cycle.`);
stm(3, `menstrual cycle`, `The luteal phase begins after menstruation and before ovulation.`, `The follicular phase is also called the secretory phase.`, 1, `The luteal (secretory) phase follows ovulation. The follicular phase is the proliferative phase. Both statements are incorrect.`, `Follicular = proliferative; luteal = secretory.`);
stm(3, `gametogenesis`, `A primary oocyte in a primary follicle is arrested at prophase I.`, `It completes meiosis I just before ovulation.`, 0, `Primary oocytes begin meiosis I in the foetus and stop at prophase I. They finish it before ovulation. Both are correct.`);
stm(3, `parturition`, `Oxytocin and uterine contractions are in a positive feedback loop during labour.`, `Prolactin brings about the contraction of the uterus.`, 2, `Oxytocin and uterine contractions stimulate each other in positive feedback. Prolactin makes milk; it does not contract the uterus.`);
stm(4, `pregnancy`, `By the end of 12 weeks most organ systems are formed.`, `By the end of 24 weeks the eyelids separate and eyelashes form.`, 0, `Both match NCERT: first trimester ends with major organ systems formed; at 24 weeks the body has fine hair, eyelids separate and eyelashes appear.`);
stm(4, `embryo development`, `The blastocyst is implanted through the trophoblast.`, `The inner cell mass is attached to the trophoblast layer.`, 0, `The trophoblast attaches to the endometrium. The inner cell mass lies attached to the trophoblast on the inside. Both are correct.`);
stm(4, `placenta`, `The placenta is an endocrine tissue.`, `It produces hCG, hPL, oestrogen and progesterone.`, 0, `The placenta releases these hormones. So both statements are correct.`);
stm(4, `fertilisation`, `The ovum is released from the ovary as a secondary oocyte.`, `The second polar body is formed before ovulation.`, 2, `The secondary oocyte is released. The second polar body forms only after sperm entry. So Statement II is incorrect.`, `Second meiotic division of the oocyte is completed only after fertilisation.`);

// ---------------------------------------------------------------- Level 3
mc(3, `gametogenesis`, `How many sperm are formed from 100 primary spermatocytes?`, `400`, [`100`, `200`, `800`], `Each primary spermatocyte gives 2 secondary spermatocytes and then 4 spermatids, which become 4 sperm. 100 &times; 4 = 400.`);
mc(3, `gametogenesis`, `How many sperm are formed from 100 secondary spermatocytes?`, `200`, [`100`, `400`, `50`], `Each secondary spermatocyte divides once (meiosis II) into 2 spermatids. So 100 gives 200 sperm.`, `Starting at the secondary stage gives only 2 sperm each.`);
mc(3, `gametogenesis`, `How many ova can be formed from 50 primary oocytes (each completes meiosis)?`, `50`, [`25`, `100`, `200`], `One primary oocyte gives one ovum and polar bodies. So 50 primary oocytes give 50 ova.`);
mc(3, `gametogenesis`, `A spermatogonium has 46 chromosomes. How many chromosomes and chromatids are present in a primary spermatocyte at metaphase I?`, `46 chromosomes and 92 chromatids`, [`23 chromosomes and 46 chromatids`, `46 chromosomes and 46 chromatids`, `92 chromosomes and 92 chromatids`], `The primary spermatocyte is 2n = 46. After S phase every chromosome has two chromatids, so 92 chromatids.`, `Chromosome number counts centromeres, not chromatids.`);
mc(3, `gametogenesis`, `Which of the following has the same chromosome number as a spermatid?`, `Secondary spermatocyte`, [`Primary spermatocyte`, `Spermatogonium`, `Zygote`], `Both are haploid (n = 23). Primary spermatocyte, spermatogonium and zygote are 2n = 46.`);
mc(3, `gametogenesis`, `Which of the following is NOT haploid in humans?`, `Primary oocyte`, [`Secondary oocyte`, `First polar body`, `Ovum`], `The primary oocyte is diploid (46). Secondary oocyte, polar bodies and ovum are haploid.`, `The secondary oocyte is haploid even though it is arrested in metaphase II.`);
mc(3, `gametogenesis`, `The Graafian follicle contains`, `a secondary oocyte surrounded by zona pellucida`, [`a primary oocyte with no antrum`, `an ovum surrounded by corona radiata only`, `a corpus luteum`], `The Graafian follicle has an antrum, theca layers and a secondary oocyte surrounded by zona pellucida.`);
mc(3, `gametogenesis`, `The theca of a tertiary follicle is organised into`, `theca interna and theca externa`, [`granulosa and zona`, `antrum and corpus`, `perimetrium and myometrium`], `The theca is divided into an inner theca interna and an outer theca externa.`);
mc(3, `male system`, `FSH acts on which cells in males?`, `Sertoli cells`, [`Leydig cells`, `Spermatogonia directly`, `Prostate cells`], `FSH acts on the Sertoli cells, which release factors that help in spermiogenesis. LH acts on Leydig cells.`);
mc(3, `male system`, `The hormone that stimulates the Leydig cells to secrete androgens is`, `LH`, [`FSH`, `oxytocin`, `prolactin`], `LH (also called ICSH in males) acts on Leydig cells. GnRH comes from the hypothalamus.`);
mc(3, `male system`, `What is the role of GnRH in males?`, `It makes the anterior pituitary release LH and FSH`, [`It makes the testis release sperm`, `It acts on the Leydig cells directly`, `It stores sperm`], `The hypothalamus releases GnRH. This acts on the anterior pituitary, which then secretes LH and FSH.`);
mc(3, `sperm structure`, `The tail of the sperm is powered by`, `mitochondria of the middle piece`, [`acrosome`, `nucleus`, `centriole of the head`], `The middle piece has mitochondria that make ATP for movement.`);
mc(3, `sperm structure`, `For normal fertility, an ejaculate should contain at least`, `60 per cent of sperm with normal shape and size, and 40 per cent with vigorous motility`, [`10 per cent normal and 90 per cent motile`, `100 per cent normal`, `50 per cent immotile`], `About 200 to 300 million sperm are released during coitus. For fertilisation, at least 60 per cent should be normal and at least 40 per cent motile.`);
mc(3, `menstrual cycle`, `In a 28-day cycle, the follicular phase (excluding menstruation) lasts about`, `from day 6 to day 13`, [`from day 15 to day 28`, `from day 1 to day 5`, `only on day 14`], `Days 1 to 5 are menstrual. Days 6 to 13 are the proliferative follicular phase, with ovulation about day 14, then the luteal phase from day 15 to 28.`);
mc(3, `menstrual cycle`, `Which of the following is high during the secretory (luteal) phase?`, `Progesterone`, [`LH`, `FSH`, `hCG`], `The corpus luteum releases much progesterone. LH and FSH are low then. hCG appears only if a pregnancy begins.`);
mc(3, `menstrual cycle`, `The thickness of the endometrium is greatest`, `at the end of the luteal phase, just before menstruation`, [`on day 3`, `on day 6`, `just after menstruation`], `The endometrium thickens through the proliferative phase and becomes secretory (rich in glands and blood vessels) under progesterone.`);
mc(3, `menstrual cycle`, `Which statement about the human menstrual cycle is correct?`, `Cycles are absent during pregnancy`, [`Ovulation occurs on day 28 of every cycle`, `Menstruation takes place after ovulation if fertilisation occurs`, `The corpus luteum forms before ovulation`], `Cycles stop during pregnancy because progesterone is kept high. Menopause is the end at about 50 years.`);
mc(3, `fertilisation`, `Which of the following helps the sperm to penetrate the egg coverings?`, `Enzymes released from the acrosome`, [`Mitochondria in the tail`, `Polar bodies`, `Oestrogen`], `The acrosome secretions help the sperm to pass the zona pellucida and enter the cytoplasm.`);
mc(3, `fertilisation`, `Fertilisation can take place only if`, `the ovum and the sperm are transported to the ampullary-isthmic junction at the same time`, [`the ovum is in the uterus`, `the sperm is in the ovary`, `the corpus luteum is functioning`], `Both gametes must reach the junction of ampulla and isthmus together. That is why timing of intercourse matters.`);
mc(3, `fertilisation`, `A normal zygote of humans has`, `46 chromosomes: 23 from each parent`, [`23 chromosomes`, `69 chromosomes`, `92 chromosomes`], `Sperm (23) + ovum (23) = 46.`);
mc(3, `embryo development`, `Cleavage divisions in humans are`, `mitotic divisions in which cells do not grow, giving blastomeres`, [`meiotic divisions`, `amitotic divisions with growth`, `divisions only in the uterus`], `Cleavage divides the zygote into smaller cells called blastomeres. The zygote travels through the isthmus to the uterus while it divides.`);
mc(3, `embryo development`, `The blastocyst is formed at the stage when`, `the embryo has an outer trophoblast and an inner cell mass`, [`the zygote forms`, `the ovum is fertilised`, `the first polar body forms`], `After the morula stage, a cavity forms and the blastocyst has the trophoblast and inner cell mass.`);
mc(3, `embryo development`, `Implantation occurs when`, `the blastocyst embeds in the endometrium through the trophoblast`, [`the morula forms`, `the sperm enters the ovum`, `the polar body forms`], `Trophoblast attaches to the endometrium. The uterine cells cover the blastocyst.`);
mc(3, `placenta`, `Chorionic villi are`, `finger-like projections of the trophoblast that interdigitate with the uterine tissue`, [`projections of the testis`, `parts of the mammary gland`, `projections of the zona pellucida`], `They form the placenta together with the uterine tissue and maternal blood.`);
mc(3, `placenta`, `The placenta does NOT`, `produce LH to trigger ovulation`, [`produce hCG`, `supply oxygen and nutrients to the foetus`, `remove CO<sub>2</sub> and wastes`], `The placenta supplies and removes substances, and releases hCG, hPL, oestrogens and progesterone. It does not trigger ovulation.`);
mc(3, `pregnancy`, `During pregnancy, the levels of which hormones increase in the maternal blood?`, `Oestrogens, progesterone, cortisol, prolactin and thyroxine`, [`FSH and LH only`, `Testosterone and androgens`, `Only hCG`], `NCERT states that oestrogens, progesterone, cortisol, prolactin and thyroxine rise several-fold in pregnancy.`);
mc(3, `pregnancy`, `Which of the following is a feature of the second trimester?`, `The body of the foetus is covered with fine hair`, [`The heart starts to form`, `The embryo implants`, `The foetus is born`], `By 24 weeks, the body is covered with fine hair, eyelids separate and eyelashes form.`);
mc(3, `parturition`, `The expelling of the placenta after the baby is born is called`, `the afterbirth`, [`implantation`, `ovulation`, `lactation`], `The placenta and foetal membranes are delivered after the baby.`);
mc(3, `parturition`, `The labour contractions are an example of`, `positive feedback`, [`negative feedback`, `no feedback`, `homeostasis through hormone suppression`], `Oxytocin causes contractions, and contractions cause more oxytocin until birth.`);
mc(3, `lactation`, `Which of the following is true of the first milk?`, `It contains antibodies and is vital for the newborn`, [`It is low in antibodies`, `It is made by the placenta`, `It is made only on the fifth day`], `Colostrum is produced in the first few days and gives the baby antibodies.`);
mc(3, `female system`, `A woman has the ovarian follicle that ruptures in her right ovary. The ovum released is`, `a secondary oocyte`, [`a primary oocyte`, `an ovum with 2 polar bodies`, `a zygote`], `The structure released at ovulation is the secondary oocyte. It becomes an ovum on sperm entry.`);
mc(3, `male system`, `Which part is NOT a male accessory gland?`, `Epididymis`, [`Prostate`, `Seminal vesicle`, `Bulbourethral gland`], `The epididymis is part of the duct system, not a gland.`);
mc(3, `female system`, `Which of the following is NOT part of the external genitalia of the human female?`, `Cervix`, [`Mons pubis`, `Labia minora`, `Clitoris`], `The cervix is internal. External genitalia (vulva) include mons pubis, labia majora and minora, hymen and clitoris.`);
mc(3, `gametogenesis`, `Which of the following is correct for male and female gametogenesis in humans?`, `Spermatogenesis begins at puberty, but oogenesis begins in the embryo`, [`Both begin at puberty`, `Both begin in the embryo`, `Oogenesis begins at puberty and spermatogenesis in the embryo`], `Sperm formation begins at puberty and continues. Oogonia are formed in the foetal ovary.`);

match(3, `male system`, `hr-m1`, `Male structures and their functions`, [`A. Sertoli cells`, `B. Leydig cells`, `C. Seminal vesicle`, `D. Epididymis`], [`p. Secretes fructose rich fluid`, `q. Stores and matures sperm`, `r. Secretes androgens`, `s. Nourish the germ cells`], `A-s, B-r, C-p, D-q`, [`A-r, B-s, C-p, D-q`, `A-s, B-r, C-q, D-p`, `A-p, B-r, C-s, D-q`], `Sertoli cells nourish germ cells (s). Leydig cells make androgens (r). Seminal vesicles add fructose (p). The epididymis stores sperm (q).`);
match(3, `menstrual cycle`, `hr-m2`, `Menstrual cycle in a 28-day cycle`, [`A. Menstrual phase`, `B. Follicular phase`, `C. Ovulation`, `D. Luteal phase`], [`p. Day 15 to 28`, `q. Day 1 to 5`, `r. About day 14`, `s. Day 6 to 13`], `A-q, B-s, C-r, D-p`, [`A-s, B-q, C-r, D-p`, `A-q, B-s, C-p, D-r`, `A-p, B-s, C-r, D-q`], `Menses are on days 1 to 5 (q). Follicular phase is days 6 to 13 (s). Ovulation is near day 14 (r). The luteal phase is days 15 to 28 (p).`);
match(3, `gametogenesis`, `hr-m3`, `Cells of human gametogenesis`, [`A. Spermatogonium`, `B. Secondary spermatocyte`, `C. Primary oocyte`, `D. Second polar body`], [`p. Haploid, formed by meiosis I, will divide again`, `q. Diploid, divides by mitosis`, `r. Diploid, arrested at prophase I`, `s. Haploid, formed by meiosis II and degenerates`], `A-q, B-p, C-r, D-s`, [`A-p, B-q, C-r, D-s`, `A-q, B-p, C-s, D-r`, `A-r, B-q, C-p, D-s`], `Spermatogonium divides by mitosis (q). Secondary spermatocyte is haploid and enters meiosis II (p). Primary oocyte is 2n and arrested at prophase I (r). The second polar body is a haploid product of meiosis II (s).`);
match(3, `pregnancy`, `hr-m4`, `Hormones and where they are made`, [`A. hCG`, `B. Relaxin`, `C. Oxytocin`, `D. Prolactin`], [`p. Maternal pituitary: milk production`, `q. Maternal pituitary: uterine contraction`, `r. Placenta`, `s. Ovary in late pregnancy`], `A-r, B-s, C-q, D-p`, [`A-s, B-r, C-q, D-p`, `A-r, B-s, C-p, D-q`, `A-q, B-s, C-r, D-p`], `hCG comes from the placenta (r). Relaxin from the ovary in late pregnancy (s). Oxytocin contracts the uterus (q). Prolactin gives milk (p).`);

pass(`hr-p1`, `A cycle chart`, `The cycle of a woman is regular and lasts 28 days. A chart records that on day 1 the menstrual flow began. On a certain day in the middle of the cycle both LH and FSH reached a peak, and an ovum was released. Afterwards the remains of the follicle formed a structure that made a hormone for about two weeks. The woman then did not become pregnant.`);
pq(`hr-p1`, 3, `menstrual cycle`, `The day of ovulation was most likely`, `day 14`, [`day 3`, `day 7`, `day 25`], `LH and FSH peak around the middle of the 28-day cycle, so ovulation is near day 14.`);
pq(`hr-p1`, 3, `menstrual cycle`, `The structure formed after ovulation and the hormone it made are`, `corpus luteum and progesterone`, [`Graafian follicle and oestrogen`, `corpus albicans and LH`, `placenta and hCG`], `The remains of the Graafian follicle become the corpus luteum, which makes mainly progesterone.`);
pq(`hr-p1`, 4, `menstrual cycle`, `Menstruation began again because`, `the corpus luteum degenerated and progesterone fell`, [`LH levels rose again`, `the ovum was fertilised`, `the endometrium stopped growing during the proliferative phase`], `With no pregnancy, the corpus luteum degenerates, progesterone falls and the endometrium breaks down.`);
pass(`hr-p2`, `Cells in the testis`, `A researcher cuts a thin section of a testis. In a seminiferous tubule he sees cells along the wall, larger cells with condensed chromosomes in the middle layers, and many small cells with tails near the lumen. Between the tubules he finds groups of other cells.`);
pq(`hr-p2`, 3, `gametogenesis`, `The cells along the wall that keep dividing by mitosis are`, `spermatogonia`, [`spermatids`, `Leydig cells`, `secondary spermatocytes`], `Spermatogonia lie on the wall of the tubule and multiply by mitosis.`);
pq(`hr-p2`, 4, `gametogenesis`, `The cells between the tubules, which produce androgens under LH, are`, `Leydig cells`, [`Sertoli cells`, `spermatogonia`, `spermatids`], `Leydig cells (interstitial cells) lie outside the tubules.`);
pass(`hr-p3`, `Embryo at the 7th day`, `A fertilised ovum divides as it moves along the fallopian tube. By about the fourth day it has 16 cells in a solid ball. A few days later it becomes a hollow structure with an outer layer and an inner group of cells, and it attaches to the uterine wall.`);
pq(`hr-p3`, 3, `embryo development`, `The solid 16-cell ball is the`, `morula`, [`blastocyst`, `gastrula`, `zygote`], `A 8 to 16 cell embryo is the morula.`);
pq(`hr-p3`, 3, `embryo development`, `The outer layer attaches to the endometrium and the inner group of cells forms`, `the embryo`, [`the placenta alone`, `the corpus luteum`, `the umbilical cord`], `The trophoblast attaches to the endometrium. The inner cell mass becomes the embryo.`);

// ---------------------------------------------------------------- Level 4
mc(4, `gametogenesis`, `A primary spermatocyte divides to give`, `two secondary spermatocytes`, [`four spermatids`, `two spermatogonia`, `one sperm`], `Meiosis I gives two haploid secondary spermatocytes. Meiosis II gives four spermatids.`);
mc(4, `gametogenesis`, `If 200 sperm are needed, the number of primary spermatocytes required is`, `50`, [`200`, `100`, `25`], `One primary spermatocyte gives 4 sperm. 200 / 4 = 50.`, `Not 200 or 100.`);
mc(4, `gametogenesis`, `A secondary oocyte that is not fertilised`, `stays arrested at metaphase II and degenerates`, [`completes meiosis II`, `becomes an ovum with a polar body`, `forms a morula`], `Meiosis II completes only if a sperm enters. Otherwise the secondary oocyte degenerates.`);
mc(4, `gametogenesis`, `Which of the following events occurs first in oogenesis?`, `Primary oocyte arrested at prophase I`, [`Formation of the first polar body`, `Formation of the second polar body`, `Ovulation`], `This happens in the foetus. The polar bodies form later.`);
mc(4, `gametogenesis`, `The primary oocyte of a 20-year-old woman has been in the arrest stage for`, `about 20 years since her foetal life`, [`about 28 days`, `about 9 months`, `no time since it is formed at ovulation`], `Primary oocytes start meiosis I before birth and stay arrested at prophase I until just before their ovulation.`);
mc(4, `gametogenesis`, `Which statement about meiosis in the human male and female is correct?`, `Female meiosis II is completed only after a sperm enters`, [`Male meiosis starts in the embryo`, `Female meiosis is complete at ovulation`, `Meiosis in males gives one gamete`], `Spermatogenesis starts at puberty. The oocyte finishes meiosis II after sperm entry.`);
mc(4, `male system`, `If the testis remains in the abdomen (cryptorchidism), the man will most likely be`, `sterile, since sperm formation needs a lower temperature`, [`unable to make testosterone at all`, `fertile with a high sperm count`, `able to make ova`], `Sperm formation needs 2 to 2.5 &deg;C below body temperature. Androgen secretion may still go on.`);
mc(4, `male system`, `A man has had a vasectomy. His testes still`, `produce testosterone and sperm, but sperm cannot reach the semen`, [`stop making all hormones`, `produce ova`, `produce no sperm`], `Cutting the vas deferens blocks the path of sperm. Testosterone still enters the blood.`);
mc(4, `male system`, `Semen contains`, `sperm and the secretions of the accessory glands`, [`only sperm`, `only secretions of the testis`, `ova and sperm`], `Semen is the sperm plus seminal plasma from seminal vesicles, prostate and bulbourethral glands.`);
mc(4, `menstrual cycle`, `On which day of a 30-day cycle is ovulation expected?`, `Day 16`, [`Day 14`, `Day 15`, `Day 20`], `The luteal phase is fairly fixed at about 14 days, so ovulation is at 30 &minus; 14 = day 16.`, `The usual 14th day is only for 28-day cycles.`);
mc(4, `menstrual cycle`, `Which curve pattern is correct for the menstrual cycle?`, `Oestrogen rises before ovulation and again in the luteal phase`, [`Progesterone peaks before ovulation`, `LH is highest at menstruation`, `FSH is highest in the luteal phase`], `Oestrogen is high at the late follicular phase, then again with the corpus luteum. Progesterone peaks in the luteal phase.`);
mc(4, `menstrual cycle`, `If the corpus luteum is removed on day 20 of a non-pregnant cycle, the likely result is`, `earlier menstruation since progesterone falls`, [`delay in menstruation`, `second ovulation`, `immediate pregnancy`], `Progesterone supports the endometrium. Without it the lining breaks down.`);
mc(4, `fertilisation`, `A sperm enters a secondary oocyte. Which of the following steps happens next?`, `Completion of meiosis II and formation of the second polar body`, [`Implantation`, `Formation of the morula`, `Formation of the placenta`], `Entry of the sperm triggers meiosis II, then the nuclei fuse.`);
mc(4, `fertilisation`, `Which of the following leads to the formation of identical twins?`, `Splitting of one zygote or early embryo into two`, [`Two ova fertilised by two sperm`, `Fertilisation by two sperm`, `Fertilisation of a polar body`], `Identical (monozygotic) twins come from one zygote. Fraternal twins come from two ova.`);
mc(4, `embryo development`, `The cells of the inner cell mass are called stem cells because`, `they can give rise to all tissues and organs`, [`they form only the trophoblast`, `they are all haploid`, `they form the placenta only`], `They are pluripotent and differentiate into the three germ layers.`);
mc(4, `embryo development`, `The three germ layers of the embryo are`, `ectoderm, mesoderm and endoderm`, [`trophoblast, ectoderm and endoderm`, `amnion, chorion and allantois`, `morula, blastula and gastrula`], `The inner cell mass differentiates into these three layers.`);
mc(4, `placenta`, `Which is a function of the umbilical cord?`, `It connects the foetus to the placenta`, [`It is the source of hCG`, `It forms the endometrium`, `It makes the polar bodies`], `Blood vessels in the cord carry oxygen, nutrients and wastes.`);
mc(4, `pregnancy`, `Choose the correct sequence of events in the development of the human embryo.`, `Zygote, morula, blastocyst, implantation`, [`Zygote, blastocyst, morula, implantation`, `Morula, zygote, blastocyst, implantation`, `Zygote, implantation, morula, blastocyst`], `Cleavage makes a morula, then a blastocyst, which implants.`);
mc(4, `pregnancy`, `A pregnant woman stops having menstrual cycles because`, `high levels of progesterone and hCG support the endometrium and the corpus luteum`, [`the ovaries are removed`, `the uterus is shed`, `oxytocin is high`], `Hormone levels of pregnancy keep the endometrium and block new cycles.`);
mc(4, `parturition`, `A baby is born. The next hormone event for lactation is mainly`, `a rise in prolactin with oxytocin helping milk ejection`, [`a rise in progesterone`, `a fall in prolactin`, `a rise in testosterone`], `Prolactin makes milk, while the suckling stimulus raises oxytocin to eject milk.`);
mc(4, `lactation`, `The reflex in which suckling causes milk release is mediated by`, `oxytocin`, [`prolactin`, `progesterone`, `FSH`], `Suckling signals the hypothalamus and pituitary to release oxytocin, which contracts cells around alveoli.`);
mc(4, `female system`, `Mammary glands are modified`, `sweat glands with 15 to 20 lobes`, [`sebaceous glands`, `salivary glands`, `endocrine glands`], `Each breast has 15 to 20 mammary lobes containing alveoli. Their cells secrete milk.`);
mc(4, `female system`, `Which of the following layers of the uterus is shed during menstruation?`, `The functional part of the endometrium`, [`Perimetrium`, `Myometrium`, `The cervix`], `The endometrial lining and its blood vessels break down and leave as menstrual flow.`);
mc(4, `gametogenesis`, `If a primary oocyte has 46 chromosomes, the first polar body has`, `23 chromosomes`, [`46 chromosomes`, `92 chromosomes`, `0 chromosomes`], `Meiosis I halves the chromosome number, so the first polar body is haploid (23).`);
mc(4, `gametogenesis`, `Which of the following gametogenesis events is hormone dependent at puberty?`, `Both formation of sperm and completion of meiosis I of the oocyte`, [`Only formation of the morula`, `Only parturition`, `Only implantation`], `GnRH, FSH and LH regulate both gametogenesis processes from puberty.`);
mc(4, `male system`, `Which one of the following correctly states the number of cells formed by meiosis in the testis versus the ovary from one primary germ cell?`, `Four sperm and one ovum`, [`One sperm and four ova`, `Four sperm and four ova`, `Two sperm and two ova`], `Spermatogenesis is equal in cytoplasm. Oogenesis gives one big ovum and polar bodies.`);
mc(4, `sperm structure`, `Which part of the sperm enters the ovum cytoplasm?`, `Head with the haploid nucleus`, [`Acrosome only`, `Only the tail`, `Middle piece`], `The head carries the haploid nucleus to the ovum. The acrosome opens the way.`);
mc(4, `embryo development`, `Embryonic cells that divide without growth in size lead to`, `smaller blastomeres`, [`larger blastomeres`, `no cells`, `a haploid embryo`], `During cleavage cell number rises but the embryo size does not.`);

// ---------------------------------------------------------------- Level 5
mc(5, `gametogenesis`, `A spermatogonium undergoes 3 mitotic divisions, and all the cells then enter meiosis. How many sperm are formed?`, `32`, [`8`, `16`, `64`], `3 mitoses give 2<sup>3</sup> = 8 cells. Each goes through meiosis to give 4 sperm: 8 &times; 4 = 32.`, `Do not count the spermatids as having a further doubling.`);
mc(5, `gametogenesis`, `A human male has a spermatogonium. How many DNA molecules (chromatids as DNA) are present in one primary spermatocyte after S phase?`, `92`, [`46`, `23`, `184`], `Each of 46 chromosomes has two sister chromatids, so 92 DNA molecules.`);
mc(5, `gametogenesis`, `The DNA content of a primary oocyte is 4C. Which cell has 1C?`, `Ovum`, [`Secondary oocyte`, `First polar body`, `Zygote`], `Primary oocyte 4C. After meiosis I the secondary oocyte and first polar body are 2C. After meiosis II the ovum is 1C.`, `The secondary oocyte is 2C even though it has 23 chromosomes.`);
mc(5, `gametogenesis`, `In which stage is the oocyte at the time of ovulation, and what is its chromosome number?`, `Secondary oocyte arrested at metaphase II, with 23 chromosomes`, [`Primary oocyte at prophase I with 46`, `Ovum with 23`, `Zygote with 46`], `Meiosis I is completed just before ovulation. The secondary oocyte stops at metaphase II.`);
mc(5, `fertilisation`, `After fertilisation, which structures are present in the cytoplasm of the zygote?`, `Haploid nuclei of the sperm and the ovum, before fusion`, [`Only 2n nucleus before fusion`, `Two diploid nuclei`, `No nucleus`], `After sperm entry, the oocyte completes meiosis II. The two haploid nuclei (pronuclei) then fuse.`);
mc(5, `fertilisation`, `A woman has an ovum with an extra chromosome 21 fertilised by a normal sperm. The zygote has`, `47 chromosomes`, [`46 chromosomes`, `45 chromosomes`, `48 chromosomes`], `24 + 23 = 47. The baby will have Down syndrome (trisomy 21).`);
mc(5, `menstrual cycle`, `In a woman with a 35-day cycle, the day of ovulation and the length of the luteal phase will be`, `day 21 and about 14 days`, [`day 14 and about 21 days`, `day 17 and about 18 days`, `day 21 and about 7 days`], `The luteal phase is nearly fixed at 14 days, so ovulation is at 35 &minus; 14 = day 21. The follicular phase varies.`, `The variable part is the follicular phase.`);
mc(5, `menstrual cycle`, `A surge of LH would not cause ovulation if`, `the follicle has not matured to the Graafian stage`, [`oestrogen were absent after ovulation`, `the corpus luteum was present`, `progesterone was low`], `Ovulation needs a mature Graafian follicle that responds to the LH surge.`);
mc(5, `embryo development`, `The corona radiata is`, `the layer of granulosa cells around the ovum`, [`the zona pellucida`, `the antrum`, `the theca interna`], `The corona radiata is a layer of follicle cells outside the zona pellucida around the ovulated oocyte.`);
mc(5, `pregnancy`, `Which one of the following correctly pairs the month and the NCERT landmark?`, `Month 2: limbs and digits develop`, [`Month 1: eyelashes form`, `Month 5: heart forms`, `Month 8: implantation`], `Heart forms by month 1. Limbs and digits by the end of month 2. First movements and hair on the head by month 5.`);
mc(5, `pregnancy`, `Choose the hormone that is NOT secreted by the placenta.`, `FSH`, [`hCG`, `hPL`, `Progesterone`], `The placenta secretes hCG, hPL, oestrogens and progesterone. FSH comes from the pituitary.`);
mc(5, `parturition`, `The positive feedback of labour ends when`, `the baby and placenta are delivered and uterine stretch signals stop`, [`oxytocin is destroyed`, `progesterone rises`, `prolactin rises`], `The stimulus (pressure on the cervix) ends after birth, so the loop stops.`);
asr(5, `gametogenesis`, `Out of the millions of oogonia formed in the foetus, only about 60,000 to 80,000 primary follicles remain at puberty.`, `A large number of follicles degenerate (atresia) from foetal life to puberty.`, 0, `Atresia explains the large loss. Only about 400 ova are ovulated in a lifetime.`);
stm(5, `fertilisation`, `The secondary oocyte is surrounded by the zona pellucida, and outside it the corona radiata.`, `In a Graafian follicle, the oocyte is arrested at prophase I.`, 2, `Statement I is correct. The oocyte in the Graafian follicle has completed meiosis I and is arrested at metaphase II. So Statement II is incorrect.`, `Prophase I arrest is in the primary follicle; metaphase II arrest is after ovulation.`);

// ---------------------------------------------------------------- Number questions (fixed)
nat(3, `counting`, `How many sperm can form from 150 primary spermatocytes?`, 600, `Each primary spermatocyte gives 4 sperm (2 secondary spermatocytes, 4 spermatids). 150 &times; 4 = 600.`);
nat(3, `counting`, `How many primary spermatocytes are needed to form 360 sperm?`, 90, `360 / 4 = 90.`);
nat(3, `counting`, `How many ova can form from 36 primary oocytes if all are ovulated and fertilised?`, 36, `One primary oocyte forms one ovum only. The other cells are polar bodies.`);
nat(4, `counting`, `A woman has 18 primary oocytes that complete meiosis. If the first polar body also divides, how many polar bodies form in all?`, 54, `Each primary oocyte forms 3 polar bodies (first polar body divides into 2, and the second polar body is the third). 18 &times; 3 = 54.`);
nat(4, `counting`, `A spermatogonium undergoes 4 mitotic divisions to form primary spermatocytes, all of which complete meiosis. How many sperm form in all?`, 64, `4 mitoses give 2<sup>4</sup> = 16 primary spermatocytes. 16 &times; 4 = 64.`);
nat(4, `counting`, `If a woman has 28-day cycles from age 14 to age 50, how many ovulations can she have at most? (Assume 13 cycles a year and no pregnancy.)`, 468, `36 years &times; 13 cycles = 468 ovulations.`, '', `Only about 400 ova are usually released in a lifetime because of pregnancies and breaks.`);
nat(4, `cycle days`, `A woman has a regular 32-day cycle. Counting the first day of menstrual flow as day 1, on which day is ovulation expected? (Assume the luteal phase is 14 days.)`, 18, `Ovulation = cycle length &minus; 14 = 32 &minus; 14 = 18.`);
nat(5, `sperm count`, `An ejaculate has a volume of 3 mL and a concentration of 80 million sperm per mL. If 40 per cent are motile, how many million motile sperm are in the sample?`, 96, `Total = 3 &times; 80 = 240 million. Motile = 40% of 240 = 96 million.`, 'million');
nat(5, `counting`, `A primary spermatocyte of a human has 46 chromosomes. How many chromatids are there in one secondary spermatocyte at metaphase II?`, 46, `The secondary spermatocyte has 23 chromosomes, each still with two chromatids. 23 &times; 2 = 46 chromatids.`, '', `Chromosomes 23, chromatids 46.`);

// ---------------------------------------------------------------- Added items (expansion)
function mt(level, sub, key, title, L1, L2, ans, sol, trap) {
  const L = 'ABCD';
  const code = (a) => a.map((c, i) => `${L[i]}-${c}`).join(', ');
  const a = ans.split('');
  const sw = (i, j) => { const b = [...a]; [b[i], b[j]] = [b[j], b[i]]; return code(b); };
  match(level, sub, key, title, L1, L2, code(a), [sw(0, 1), sw(2, 3), sw(0, 2)], sol, trap);
}
// L2
mc(2, 'male system', 'Spermatogenesis needs a temperature that is', '2 to 2.5 &deg;C lower than the normal body temperature', ['2 to 2.5 &deg;C higher than the body temperature', 'exactly the body temperature', '10 &deg;C lower than the body temperature'], 'The scrotum keeps the testes slightly cooler than the inside of the abdomen, which is needed for the formation of sperm.');
mc(2, 'male system', 'The ejaculatory duct opens into the', 'urethra', ['epididymis', 'urinary bladder', 'seminal vesicle'], 'The vas deferens and the duct of the seminal vesicle form the ejaculatory duct, which carries sperm and seminal fluid into the urethra.');
mc(2, 'male system', 'The accessory gland of the male that is a single gland around the urethra just below the urinary bladder is the', 'prostate', ['seminal vesicle', 'bulbourethral gland', 'epididymis'], 'Seminal vesicles and bulbourethral glands are paired. The prostate is single.');
mc(2, 'male system', 'The external opening of the urethra at the tip of the penis is the', 'urethral meatus', ['glans', 'foreskin', 'scrotum'], 'The urethra extends through the penis and opens at the urethral meatus. The glans is the enlarged tip, which is covered by the foreskin.');
mc(2, 'female system', 'The funnel-shaped part of the fallopian tube close to the ovary is the', 'infundibulum', ['ampulla', 'isthmus', 'cervix'], 'The infundibulum has finger-like fimbriae that collect the ovum after ovulation. The ampulla is the wider part next to it, and the isthmus is the narrow part joining the uterus.');
mc(2, 'female system', 'The wider middle part of the fallopian tube, between the infundibulum and the isthmus, is the', 'ampulla', ['fimbria', 'cervix', 'perimetrium'], 'The oviduct has infundibulum, ampulla and isthmus in that order from the ovary to the uterus.');
mc(2, 'female system', 'The labia majora are', 'fleshy folds of tissue that extend down from the mons pubis and surround the vaginal opening', ['the tiny finger-like structures at the upper junction of the labia minora', 'the thin membrane covering the vaginal opening', 'the folds of the fallopian tube'], 'The clitoris is the tiny finger-like structure; the hymen is the membrane; the labia minora lie inside the labia majora.');
mc(2, 'menstrual cycle', 'The stopping of the menstrual cycles at about the age of 50 years is called', 'menopause', ['menarche', 'ovulation', 'parturition'], 'Menarche is the first menstruation at puberty. Menopause is the permanent end of the cycles.');
mc(2, 'menstrual cycle', 'The corpus luteum develops from', 'the remains of the Graafian follicle after ovulation', ['the uterine endometrium', 'the primary oocyte', 'the fallopian tube'], 'After the ovum is released, the follicle cells change into the corpus luteum, a temporary endocrine gland that secretes progesterone.');
mc(2, 'female system', 'The ovum is moved along the fallopian tube mainly by', 'the cilia and the muscular movements of the tube', ['the flagella of the ovum', 'the pull of the uterine cervix', 'a flow of blood in the ovarian vein'], 'The ovum cannot swim. The ciliated lining and the peristalsis of the oviduct carry it towards the uterus.');
mc(2, 'placenta', 'The abbreviation hPL stands for', 'human placental lactogen', ['human prolactin level', 'hormone of the pregnant lining', 'human pituitary lutein'], 'hPL is a hormone secreted by the placenta. Together with hCG and relaxin it is produced in women only during pregnancy.');
mc(2, 'gametogenesis', 'A primary spermatocyte of a human has how many chromosomes?', '46', ['23', '92', '69'], 'The primary spermatocyte is diploid (2n = 46). The secondary spermatocytes are haploid (23).', 'It has 92 chromatids, but 46 chromosomes.');
// L3 singles
mc(3, 'male system', 'The seminiferous tubules are lined on the inside by', 'male germ cells (spermatogonia) and Sertoli cells', ['Leydig cells only', 'Leydig and Sertoli cells', 'the epididymis'], 'The spermatogonia are the cells that make sperm, and the Sertoli cells nourish them. The Leydig cells are in the spaces between the tubules.');
mc(3, 'male system', 'The vas deferens loops over the urinary bladder and joins the duct from the seminal vesicle to form the', 'ejaculatory duct', ['urethra', 'epididymis', 'rete testis'], 'The ejaculatory duct then passes through the prostate and carries the sperm into the urethra.');
mc(3, 'sperm structure', 'The mitochondria in the middle piece of the sperm provide energy for', 'the movement of the tail', ['the synthesis of acrosomal enzymes', 'the division of the spermatogonia', 'the formation of the zona pellucida'], 'The mitochondria produce the ATP for the lashing movement of the tail, which makes the sperm motile.');
mc(3, 'sperm structure', 'For normal fertility, at least what percentage of the sperm of an ejaculate should have normal shape and size, and what percentage should show vigorous motility?', '60 per cent and 40 per cent', ['40 per cent and 60 per cent', '50 per cent and 50 per cent', '80 per cent and 20 per cent'], 'NCERT says at least 60 per cent of the sperm must have normal shape and size and at least 40 per cent must show vigorous motility.', 'The two figures are easy to swap.');
mc(3, 'sperm structure', 'A normal human ejaculate has about how many sperm?', '200 to 300 million', ['2 to 3 million', '20 to 30 thousand', '2 to 3 billion'], 'During coitus about 200 to 300 million sperm are released in the semen.');
mc(3, 'gametogenesis', 'At puberty, each human ovary has about how many primary follicles?', '60,000 to 80,000', ['6 to 8 million', '600 to 800', '6 to 8 lakh'], 'Millions of oogonia are formed in the foetal ovary, but most degenerate. Only 60,000 to 80,000 primary follicles remain in each ovary at puberty.', 'Do not confuse this with the millions of oogonia.');
mc(3, 'gametogenesis', 'No new oogonia are added to the ovary after', 'birth', ['puberty', 'fertilisation', 'menopause'], 'All the oogonia are formed during the embryonic life. After birth no more are added. This is a major difference from the male.');
mc(3, 'menstrual cycle', 'The levels of both LH and FSH reach their peak', 'in the middle of the cycle, around the 14th day', ['at the start of the menstrual phase', 'on the last day of the cycle', 'at the end of the luteal phase'], 'The rise of oestrogen leads to a surge of both gonadotropins at mid cycle. The LH surge makes the Graafian follicle rupture.');
mc(3, 'fertilisation', 'Fertilisation in humans normally occurs at the', 'junction of the ampulla and the isthmus of the fallopian tube', ['uterus', 'cervix', 'vagina'], 'The ovum and the sperm meet at the ampullary-isthmic junction. Cleavage begins while the zygote moves towards the uterus.');
mc(3, 'embryo development', 'The cells formed by the cleavage divisions of the zygote are called', 'blastomeres', ['blastocysts', 'trophoblasts', 'gametes'], 'Cleavage is a series of mitotic divisions that cut the zygote into smaller and smaller cells, the blastomeres.');
mc(3, 'male system', 'A man is injected with a substance that blocks the action of LH on his testes. The first effect would be a fall in', 'the secretion of androgens by the Leydig cells', ['the number of Sertoli cells', 'the secretion of FSH', 'the size of the seminal vesicle at once'], 'LH acts on the Leydig cells to make androgens. Androgens then support spermatogenesis, so sperm formation falls later.');
mc(3, 'lactation', 'The mammary glands begin to secrete milk', 'towards the end of pregnancy and the first milk is colostrum', ['only after menopause', 'at the time of ovulation', 'at puberty and continuously after it'], 'The mammary glands differentiate during pregnancy, and the first few days of lactation give colostrum rich in antibodies.');
mc(3, 'parturition', 'Oxytocin acts on the', 'smooth muscle of the uterus (myometrium), causing stronger contractions', ['placenta, causing it to detach', 'umbilical cord, cutting it', 'pituitary, stopping its activity'], 'Oxytocin from the maternal pituitary strengthens the uterine contractions in a positive feedback loop.');
// L4 singles
mc(4, 'menstrual cycle', 'Both ovaries of a non-pregnant woman are surgically removed. Which is the likely result?', 'menstrual cycles stop, because oestrogen and progesterone are no longer made by the ovaries', ['the cycles continue, controlled by the pituitary alone', 'the cycles become shorter', 'ovulation continues from the uterus'], 'The cycle of the endometrium follows the ovarian hormones, which come from the follicles and corpus luteum. Without ovaries there is no ovulation and no menstrual cycle.');
mc(4, 'male system', 'A drug blocks the receptors of FSH in the testes. Which process is most directly affected?', 'the help given by the Sertoli cells to spermiogenesis', ['the secretion of androgens by the Leydig cells', 'the release of GnRH', 'the production of fructose by the prostate'], 'FSH acts on the Sertoli cells, which then secrete factors that help the spermatids to turn into sperm. LH, not FSH, acts on the Leydig cells.');
mc(4, 'male system', 'The pituitary gland of a young man is destroyed. Which is the likely effect on the testes?', 'the secretion of androgens and spermatogenesis fall, because LH and FSH are not secreted', ['spermatogenesis is not changed', 'only the Leydig cells are affected', 'the testes make more androgens'], 'The anterior pituitary secretes LH and FSH. Without LH the Leydig cells make little androgen, and without FSH the Sertoli cells cannot support sperm release.');
mc(4, 'fertilisation', 'A couple already has three daughters. The chance that their fourth child will be a girl is', '50 per cent', ['25 per cent', '12.5 per cent', '75 per cent'], 'Each sperm carries X or Y with equal chance. The earlier births do not change the chance for the next one.', 'The earlier daughters do not matter.');
mc(4, 'female system', 'Which of the following correctly shows the path of milk from the alveoli of the mammary gland to the nipple?', 'alveoli, mammary tubules, mammary ducts, mammary ampulla, lactiferous duct', ['alveoli, mammary ampulla, mammary tubules, lactiferous duct, mammary duct', 'mammary ducts, alveoli, tubules, ampulla, lactiferous duct', 'alveoli, lactiferous duct, mammary tubules, ampulla, mammary ducts'], 'The alveoli open into the mammary tubules. The tubules of a lobe join to form a mammary duct, several ducts join the mammary ampulla, which is connected to the lactiferous duct.');
mc(4, 'gametogenesis', 'The number of chromosomes is reduced from 46 to 23 in the male when', 'a primary spermatocyte divides to form two secondary spermatocytes', ['a spermatogonium divides to form primary spermatocytes', 'a spermatid changes into a sperm', 'a secondary spermatocyte forms two spermatids'], 'Meiosis I is the reductional division. A secondary spermatocyte has 23 chromosomes, each with two chromatids.', 'Meiosis II is not reductional in chromosome number.');
mc(4, 'gametogenesis', 'The division of a secondary spermatocyte into two spermatids is', 'meiosis II, an equational division', ['meiosis I, a reductional division', 'a mitotic division of a diploid cell', 'a division that doubles the DNA first'], 'The chromatids separate, so the chromosome number (23) stays the same in the two spermatids.');
mc(4, 'female system', 'Which statement about the hymen is correct?', 'its presence or absence is not a reliable indicator of virginity', ['it is always torn only by the first coitus', 'it is a part of the fallopian tube', 'it is present only in married women'], 'The hymen is a membrane that partially covers the vaginal opening. It may be torn by a sudden fall or jolt, a sport, or insertion of a tampon, and it can also be torn at the first coitus, so it is not a proof of anything.');
mc(4, 'parturition', 'The foetal ejection reflex is', 'the mild uterine contraction started by signals from the fully developed foetus and the placenta', ['the release of the egg from the ovary', 'a movement of the sperm tail', 'the sealing of the endometrium'], 'These contractions induce the release of oxytocin from the maternal pituitary, starting the positive feedback of labour.');
mc(4, 'menstrual cycle', 'A woman with regular cycles notes that the LH and FSH levels peak. The next structural change in the ovary is the', 'rupture of the Graafian follicle and the release of the secondary oocyte', ['formation of a new primary follicle', 'degeneration of the corpus luteum', 'shedding of the endometrium'], 'The mid-cycle LH surge causes the Graafian follicle to rupture (ovulation). The corpus luteum develops after that.');
// L5 singles
mc(5, 'gametogenesis', 'Which of the following has 23 chromosomes, each made of two chromatids?', 'a secondary spermatocyte', ['a spermatid', 'a primary spermatocyte', 'a spermatogonium'], 'The primary spermatocyte has 46 chromosomes (92 chromatids). After meiosis I the secondary spermatocyte has 23 chromosomes, each still with two chromatids. After meiosis II the spermatid has 23 single chromatids.', 'Chromosome number and chromatid number differ.');
mc(5, 'gametogenesis', 'If the DNA content of a spermatogonium in G1 is 2C, the DNA content of a primary spermatocyte, a secondary spermatocyte and a spermatid is respectively', '4C, 2C, 1C', ['2C, 2C, 1C', '4C, 4C, 2C', '2C, 1C, 1C'], 'DNA doubles in the S phase before meiosis, so the primary spermatocyte has 4C. Meiosis I halves it to 2C in the secondary spermatocyte and meiosis II gives 1C in each spermatid.', 'The primary spermatocyte has doubled its DNA.');
// Nat
nat(3, `embryo development`, `A zygote divides by five successive cleavage divisions with no cell loss. How many blastomeres are formed?`, 32, `Each division doubles the number of cells: 2<sup>5</sup> = 32.`);
nat(4, `sperm structure`, `An ejaculate has 250 million sperm. For normal fertility at least 40 per cent must show vigorous motility. What is the minimum number of vigorously motile sperm, in millions?`, 100, `40 per cent of 250 = 100 million.`, `million`);
nat(4, `gametogenesis`, `How many chromosomes are present in all the four spermatids formed from one human primary spermatocyte, taken together?`, 92, `Each spermatid is haploid with 23 chromosomes. 4 &times; 23 = 92.`, ``, `The four cells together have the same number as the primary spermatocyte has chromatids.`);
nat(4, `gametogenesis`, `A human primary oocyte completes meiosis I. How many chromosomes are present in the secondary oocyte and the first polar body together?`, 46, `Each of the two cells receives 23 chromosomes (each with two chromatids): 23 + 23 = 46.`);
nat(5, `gametogenesis`, `How many sperm are formed in all from 25 primary spermatocytes and 25 secondary spermatocytes taken together? (All of them complete the meiosis.)`, 150, `Each primary spermatocyte gives 4 sperm: 25 &times; 4 = 100. Each secondary spermatocyte gives 2 sperm: 25 &times; 2 = 50. Total = 150.`, ``, `The secondary spermatocytes are already half-way through the meiosis.`);
// Assertion
asr(3, 'male system', 'The Sertoli cells are called nurse cells.', 'They provide nutrition to the germ cells in the seminiferous tubules.', 0, 'The Sertoli cells lie in the seminiferous tubules and nourish the developing sperm. R explains A.');
asr(3, 'sperm structure', 'The middle piece of the sperm has many mitochondria.', 'The tail needs energy for its movement.', 0, 'The mitochondria produce ATP for the lashing of the tail. R explains A.');
asr(3, 'male system', 'The seminal plasma contains fructose.', 'Fructose is an energy source for the sperm.', 0, 'Seminal plasma is rich in fructose, calcium and enzymes. The sperm use the sugar for energy. R explains A.');
asr(3, 'sperm structure', 'The acrosome helps the sperm to enter the ovum.', 'The acrosome contains enzymes that dissolve the covering layers of the ovum.', 0, 'The enzymes of the cap-like acrosome help in fertilisation. R explains A.');
asr(3, 'menstrual cycle', 'Ovulation takes place at about the middle of the menstrual cycle.', 'The LH surge in the middle of the cycle causes the rupture of the Graafian follicle.', 0, 'The surge of LH occurs around the 14th day and causes ovulation. R explains A.');
asr(3, 'menstrual cycle', 'The luteal phase is also called the secretory phase.', 'In this phase the corpus luteum secretes progesterone, which makes the endometrium glandular and secretory.', 0, 'The progesterone of the corpus luteum prepares the endometrium for implantation. R explains A.');
asr(3, 'embryo development', 'The inner cell mass of the blastocyst forms the embryo.', 'The trophoblast of the blastocyst forms the embryo.', 2, 'A is true. R is false: the trophoblast forms the outer layer that attaches to the endometrium and takes part in the placenta.');
asr(3, 'fertilisation', 'The sex of a human baby is decided by the father.', 'A sperm may carry an X or a Y chromosome, while every ovum carries an X.', 0, 'The sex depends on the sperm that fertilises the ovum. R explains A.');
asr(3, 'female system', 'The ciliated lining of the fallopian tube helps the ovum to move.', 'The ovum has no means of movement of its own.', 0, 'Cilia and muscle movements of the tube transport the ovum. R explains why this help is needed.');
asr(4, 'gametogenesis', 'No new oogonia are added after the birth of a girl.', 'All the oogonia of the foetus start meiosis I and are arrested as primary oocytes during the foetal life.', 0, 'The female has a fixed stock of primary oocytes from before birth. R explains A.');
asr(4, 'gametogenesis', 'The first polar body is much smaller than the secondary oocyte.', 'The cytoplasm divides unequally in meiosis I of oogenesis.', 0, 'Most of the cytoplasm goes to the secondary oocyte, which later needs it to support the embryo. R explains A.');
asr(4, 'gametogenesis', 'The primary spermatocytes are diploid and the secondary spermatocytes are haploid.', 'Meiosis I is a reductional division.', 0, 'Meiosis I halves the chromosome number (46 to 23). R explains A.');
asr(4, 'male system', 'LH acts in the male as well as in the female.', 'In the male LH acts on the Leydig cells and stimulates the synthesis of androgens.', 0, 'LH is a gonadotropin made by the anterior pituitary in both sexes. In the male it targets the Leydig cells. R explains A.');
asr(5, 'fertilisation', 'At the time of ovulation the secondary oocyte has completed meiosis.', 'Meiosis II is completed only after the entry of a sperm.', 3, 'A is false: meiosis I is complete but the secondary oocyte is arrested in metaphase of meiosis II. R is true.', 'The ovulated cell is not a mature ovum yet.');
// Statements
stm(3, 'male system', 'The Sertoli cells are found inside the seminiferous tubules.', 'The Leydig cells lie inside the tubules and secrete androgens.', 2, 'I is correct. II is wrong: the Leydig cells lie in the spaces between the tubules (interstitial spaces).');
stm(3, 'male system', 'The vas deferens joins the duct of the seminal vesicle to form the ejaculatory duct.', 'The ejaculatory duct opens into the urethra.', 0, 'Both are correct.');
stm(3, 'male system', 'The bulbourethral glands secrete a fluid that lubricates the penis.', 'The prostate is a paired gland, like the seminal vesicles.', 2, 'I is correct. II is wrong: the prostate is a single gland.');
stm(3, 'female system', 'The ovaries are connected to the pelvic wall and the uterus by ligaments.', 'The ovarian stroma has a peripheral cortex and an inner medulla.', 0, 'Both are correct.');
stm(4, 'female system', 'The uterus opens into the vagina through the cervix.', 'The cervical canal alone forms the birth canal.', 2, 'I is correct. II is wrong: the cervical canal and the vagina together form the birth canal.');
stm(4, 'female system', 'The ampulla of the fallopian tube is wider than the isthmus.', 'The isthmus is the part of the tube that joins the uterus.', 0, 'Both are correct. The order is infundibulum, ampulla, isthmus.');
stm(4, 'gametogenesis', 'In the primary follicle the primary oocyte is surrounded by granulosa cells.', 'The primary oocyte in the tertiary follicle completes the first meiotic division.', 0, 'Both are correct. The division gives a large secondary oocyte and a tiny first polar body.');
stm(4, 'menstrual cycle', 'The LH surge induces the rupture of the Graafian follicle.', 'The corpus luteum secretes large amounts of oestrogen only.', 2, 'I is correct. II is wrong: the corpus luteum secretes large amounts of progesterone.', 'Progesterone is the hormone of the luteal phase.');
stm(4, 'fertilisation', 'The zona pellucida blocks the entry of additional sperm after one sperm contacts it.', 'The entry of a sperm induces the secondary oocyte to complete meiosis II.', 0, 'Both are correct. The second polar body and the ovum (ootid) are formed, and then the nuclei fuse.');
stm(4, 'placenta', 'The placenta produces hCG, hPL and oestrogens.', 'hCG, hPL and relaxin are produced in women only during pregnancy.', 0, 'Both are correct.');
stm(5, 'embryo development', 'The embryo implants in the endometrium at the morula stage.', 'Implantation leads to pregnancy.', 3, 'I is wrong: implantation takes place at the blastocyst stage. II is correct.', 'Morula comes before blastocyst.');
stm(5, 'pregnancy', 'After one month of pregnancy the heart of the embryo is formed.', 'The first signs of the limbs and digits appear by the end of the second month.', 0, 'Both are correct.');
mc(4, 'male system', 'Which of the following are correct? (a) The scrotum keeps the testes 2 to 2.5 &deg;C cooler. (b) The Sertoli cells nourish the germ cells. (c) The Leydig cells make androgens. (d) The seminal plasma has no fructose. (e) The spermatogonia are haploid. How many are correct?', 'Three', ['Two', 'Four', 'Five'], '(a), (b) and (c) are correct. (d) is wrong (fructose is rich in seminal plasma) and (e) is wrong (spermatogonia are diploid).', 'Check the two last statements.', 'statements');
mc(5, 'gametogenesis', 'Which of the following are correct? (a) Each ovary at puberty has about 60,000 to 80,000 primary follicles. (b) The primary oocytes are arrested in prophase I. (c) The tertiary follicle has a theca and a fluid-filled antrum. (d) The ovulation takes place at about the middle of the cycle. (e) The first polar body is larger than the secondary oocyte. How many are correct?', 'Four', ['Three', 'Five', 'Two'], '(a) to (d) are correct. (e) is wrong: the polar body is tiny.', 'The polar body is small.', 'statements');
mc(5, 'embryo development', 'Which of the following are correct? (a) The blastocyst has a trophoblast and an inner cell mass. (b) The chorionic villi arise from the trophoblast. (c) The inner cell mass forms the placenta. (d) By 12 weeks the foetus is fully developed and ready for birth. (e) The first movements of the foetus are felt in the second month. How many are correct?', 'Two', ['One', 'Three', 'Four'], '(a) and (b) are correct. (c) is wrong (the inner cell mass forms the embryo), (d) is wrong (the full term is nine months; by 12 weeks most organ systems are formed) and (e) is wrong (the first movements are in the fifth month).', 'The 12-week stage is not full term.', 'statements');
// Match
mt(3, 'male system', 'x1', 'Male accessory structures', ['A. Seminal vesicles', 'B. Prostate', 'C. Bulbourethral glands', 'D. Epididymis'], ['p. Stores the sperm', 'q. Paired glands; fructose-rich secretion', 'r. Single gland below the urinary bladder', 's. Secretion lubricates the penis'], 'qrsp', 'Seminal vesicles are paired and give fructose (q). The prostate is single (r). The bulbourethral glands lubricate the penis (s). The epididymis stores sperm (p).');
mt(3, 'female system', 'x2', 'Layers and parts of the uterus', ['A. Perimetrium', 'B. Myometrium', 'C. Endometrium', 'D. Cervix'], ['p. Inner glandular lining that is shed in menstruation', 'q. Thick middle layer of smooth muscle', 'r. Thin external membranous layer', 's. Narrow lower end that opens into the vagina'], 'rqps', 'Perimetrium is the thin outer layer (r), myometrium the thick muscle (q), endometrium the glandular lining (p), and the cervix is the narrow lower part (s).');
mt(3, 'female system', 'x3', 'Parts of the fallopian tube', ['A. Infundibulum', 'B. Ampulla', 'C. Isthmus', 'D. Fimbriae'], ['p. Narrow zone joining the uterus', 'q. Funnel-shaped opening near the ovary', 'r. Wider middle part', 's. Finger-like projections that collect the ovum'], 'qrps', 'The infundibulum is the funnel (q); the ampulla the wider middle part (r); the isthmus the narrow zone near the uterus (p); the fimbriae collect the ovum (s).');
mt(4, 'menstrual cycle', 'x4', 'Hormones and their roles', ['A. LH', 'B. FSH', 'C. Oxytocin', 'D. Progesterone of the corpus luteum'], ['p. Strong uterine contractions at birth', 'q. Maintains the endometrium for implantation', 'r. Acts on the Sertoli cells of the male', 's. Acts on the Leydig cells of the male'], 'srpq', 'LH acts on the Leydig cells (s). FSH acts on the Sertoli cells (r). Oxytocin causes uterine contractions (p). Progesterone maintains the endometrium (q).');
mt(3, 'embryo development', 'x5', 'Early stages of development', ['A. Morula', 'B. Blastocyst', 'C. Zygote', 'D. Implantation'], ['p. Embedding of the blastocyst in the endometrium', 'q. Diploid cell formed by the fusion of the gametes', 'r. Ball with the trophoblast and the inner cell mass', 's. Solid ball of 8 to 16 blastomeres'], 'srqp', 'The morula is a solid ball (s). The blastocyst has a trophoblast and an inner cell mass (r). The zygote is the diploid cell (q). Implantation is the embedding (p).');
mt(3, 'menstrual cycle', 'x6', 'Phases of a 28-day cycle', ['A. Menstrual phase', 'B. Follicular phase', 'C. Ovulation', 'D. Luteal phase'], ['p. At about the middle of the cycle', 'q. The first 3 to 5 days', 'r. After ovulation until the next menstruation', 's. Between the end of menstruation and ovulation'], 'qspr', 'The flow lasts 3 to 5 days (q). The follicular phase is before ovulation (s). Ovulation is at mid cycle (p). The luteal phase follows it (r).');
mt(4, 'gametogenesis', 'x7', 'Cells of spermatogenesis and what they do next', ['A. Primary spermatocyte', 'B. Secondary spermatocyte', 'C. Spermatid', 'D. Spermatogonium'], ['p. Divides by mitosis to multiply', 'q. Transforms into a sperm', 'r. Undergoes the reductional division', 's. Undergoes the equational division'], 'rsqp', 'Primary spermatocytes do meiosis I, the reductional division (r). Secondary spermatocytes do meiosis II (s). Spermatids undergo spermiogenesis (q). Spermatogonia multiply by mitosis (p).');
mt(4, 'pregnancy', 'x8', 'Landmarks of pregnancy', ['A. After one month', 'B. End of the second month', 'C. Fifth month', 'D. End of 12 weeks'], ['p. First movements of the foetus; hair on the head', 'q. Most major organ systems formed', 'r. Heart formed', 's. Limbs and digits appear'], 'rspq', 'The heart forms after one month (r). Limbs and digits show by the end of the second month (s). Movements and hair are seen in the fifth month (p). Most organ systems are formed by 12 weeks (q).');
mt(4, 'gametogenesis', 'x9', 'Parts of an ovarian follicle', ['A. Theca', 'B. Antrum', 'C. Zona pellucida', 'D. Granulosa cells'], ['p. Surround the primary oocyte of a primary follicle', 'q. Fluid-filled cavity of the tertiary follicle', 'r. Layer around the oocyte that changes after sperm contact', 's. Outer layers of the follicle (theca interna and externa)'], 'sqrp', 'The theca forms the outer layers (s). The antrum is the cavity (q). The zona pellucida surrounds the oocyte (r). The granulosa cells surround the oocyte of the primary follicle (p).');
mt(4, 'parturition', 'x10', 'Birth and milk', ['A. Oxytocin', 'B. Prolactin', 'C. Colostrum', 'D. Foetal ejection reflex'], ['p. Milk production', 'q. First milk with antibodies', 'r. Mild uterine contractions started by signals of the foetus', 's. Stronger uterine contractions'], 'spqr', 'Oxytocin strengthens contractions (s). Prolactin makes milk (p). Colostrum is the first milk (q). The foetal ejection reflex starts the contractions (r).');
// Passages
pass('x11', 'A semen sample', 'A semen sample of 4 mL has 75 million sperm per mL. Of the sperm in it, 70 per cent have normal shape and size and 50 per cent show vigorous motility.');
pq('x11', 3, 'sperm structure', 'The total number of sperm in the sample is', '300 million', ['75 million', '150 million', '4 million'], '4 mL &times; 75 million per mL = 300 million.');
pq('x11', 4, 'sperm structure', 'The number of vigorously motile sperm is', '150 million', ['210 million', '120 million', '75 million'], '50 per cent of 300 million = 150 million. (210 million is the number with normal shape.)', '210 million is the number of normal-shaped sperm.');
pq('x11', 4, 'sperm structure', 'Against the NCERT minimum for normal fertility, the sample is', 'normal, since 70 per cent is above 60 per cent and 50 per cent is above 40 per cent', ['poor, since the motility is below 60 per cent', 'poor, since the volume is below 5 mL', 'poor, since the count is below 500 million'], 'The minimum is at least 60 per cent of normal shape and size and at least 40 per cent of vigorous motility. Both are met.');
pass('x12', 'Hormone levels in a cycle', 'In a 28-day cycle a woman has the following hormone changes: LH and FSH peak at about day 14; oestrogen rises from day 6 and peaks just before day 14; progesterone is highest at about day 21 and falls by day 27.');
pq('x12', 3, 'menstrual cycle', 'Ovulation most likely takes place', 'at about day 14, soon after the LH peak', ['at about day 7', 'at about day 21', 'at about day 27'], 'The LH surge causes the rupture of the Graafian follicle.');
pq('x12', 3, 'menstrual cycle', 'The high progesterone at day 21 comes from the', 'corpus luteum', ['Graafian follicle', 'endometrium', 'anterior pituitary'], 'After ovulation the follicle turns into the corpus luteum, which secretes progesterone.');
pq('x12', 4, 'menstrual cycle', 'The fall in progesterone near day 27, if the woman is not pregnant, will lead to', 'the breakdown of the endometrium and menstruation', ['ovulation', 'implantation of the embryo', 'the rise of the corpus luteum'], 'When the corpus luteum degenerates, progesterone falls and the endometrium cannot be maintained, so it disintegrates and menstruation begins.');
pass('x13', 'An ovary section', 'A section of an ovary shows follicle X with a single layer of cells around the oocyte, follicle Y with a fluid-filled cavity and the oocyte on one side, and a yellowish structure Z that formed from a collapsed follicle after ovulation.');
pq('x13', 3, 'gametogenesis', 'Follicle Y is', 'a tertiary follicle', ['a primary follicle', 'a corpus luteum', 'a polar body'], 'The cavity (antrum) is a feature of the tertiary follicle.');
pq('x13', 3, 'menstrual cycle', 'Structure Z is', 'the corpus luteum, which secretes progesterone', ['the Graafian follicle, which secretes LH', 'the endometrium, which secretes FSH', 'the placenta, which secretes oxytocin'], 'The corpus luteum develops from the remaining cells of the ruptured Graafian follicle.');
pq('x13', 4, 'gametogenesis', 'In a follicle like Y, the primary oocyte', 'completes meiosis I and forms a secondary oocyte and a first polar body', ['completes meiosis II and forms an ovum', 'divides by mitosis to form oogonia', 'is released as a primary oocyte'], 'The primary oocyte completes meiosis I in the tertiary follicle. The second meiotic division is completed only if a sperm enters.');


// ---------------------------------------------------------------- Number templates
const SPECIES = [['an animal', 46], ['an animal', 20], ['an animal', 38], ['an animal', 24], ['an animal', 14], ['a human', 46], ['a rat', 42], ['a rabbit', 44], ['a cat', 38], ['a horse', 64]];
const CELLS = [
  ['a spermatogonium', 2, 'divides by mitosis and is diploid'], ['a primary spermatocyte', 2, 'is diploid before meiosis I'], ['a secondary spermatocyte', 1, 'is haploid after meiosis I'],
  ['a spermatid', 1, 'is haploid'], ['a sperm', 1, 'is haploid'], ['a primary oocyte', 2, 'is diploid and arrested at prophase I'], ['a secondary oocyte', 1, 'is haploid, arrested at metaphase II'],
  ['the first polar body', 1, 'is haploid, a product of meiosis I'], ['the second polar body', 1, 'is haploid, a product of meiosis II'], ['an ovum', 1, 'is haploid'], ['a zygote', 2, 'is formed by the fusion of two haploid nuclei'],
  ['a blastomere', 2, 'comes from mitotic divisions of the zygote'], ['a cell of the inner cell mass', 2, 'comes from mitotic divisions of the zygote'], ['a trophoblast cell', 2, 'comes from mitotic divisions of the zygote'],
];
const PHASES = [[1, 5, 'menstrual phase'], [6, 13, 'follicular (proliferative) phase'], [14, 14, 'ovulation'], [15, 28, 'luteal (secretory) phase']];
// ---------------------------------------------------------------- Level 5 round (v5): top-rank items with fixed ids
const V5 = ['neet'];
const V5POS = [1, 3, 0, 2, 2, 0, 3, 1, 1, 2, 3, 0];
let v5i = 0;
const v5take = () => V5POS[v5i++ % V5POS.length];
const v5place = (correct, wrongs) => { const p = v5take(); const o = [...wrongs]; o.splice(p, 0, correct); return [o, p]; };
function v5mc(id, sub, q, correct, wrongs, sol, trap, format = 'single', group) {
  const [options, answer] = v5place(correct, wrongs);
  items.push({ id, type: 'mcq', level: 5, format, exams: V5, sub, ...(group ? { group } : {}), q, options, answer, sol, ...(trap ? { trap } : {}) });
}
function v5asr(id, sub, A, R, ans, sol, trap) {
  items.push({ id, type: 'mcq', level: 5, format: 'assertion', exams: V5, sub, q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: AR, answer: ans, sol, ...(trap ? { trap } : {}) });
}
function v5stm(id, sub, s1, s2, ans, sol, trap) {
  items.push({ id, type: 'mcq', level: 5, format: 'statements', exams: V5, sub, q: `<b>Statement I:</b> ${s1}<br><b>Statement II:</b> ${s2}`, options: ST, answer: ans, sol, ...(trap ? { trap } : {}) });
}
function v5cnt(id, sub, q, correct, wrongs, sol, trap) { v5mc(id, sub, q, correct, wrongs, sol, trap, 'statements'); }
function v5match(id, sub, key, title, list1, list2, ans, sol, trap) {
  groups[key] = { title, list1, list2 };
  const L = 'ABCD';
  const code = (a) => a.map((c, i) => `${L[i]}-${c}`).join(', ');
  const a = ans.split('');
  const sw = (i, j) => { const b = [...a]; [b[i], b[j]] = [b[j], b[i]]; return code(b); };
  const [options, answer] = v5place(code(a), [sw(0, 1), sw(2, 3), sw(0, 2)]);
  items.push({ id, type: 'mcq', level: 5, format: 'match', exams: V5, sub, group: key, q: 'Match List I with List II and choose the correct code.', options, answer, sol, ...(trap ? { trap } : {}) });
}
function v5pass(key, title, passage) { groups[key] = { title, passage }; }

v5mc('hr-v501', 'male system', 'Which cells of the testis stay in contact with the wall of the seminiferous tubule and also reach its lumen, with the developing germ cells held between them?', 'Sertoli cells', ['Leydig cells', 'spermatogonia', 'primary spermatocytes'],
  'Idea: the Sertoli cells are the supporting (nurse) cells that span the seminiferous tubule from the wall to the lumen and nourish the germ cells; spermiation releases sperm from them into the lumen. Leydig cells lie outside the tubules, in the interstitial spaces. Spermatogonia lie at the periphery, and primary spermatocytes are displaced inwards; neither stays connected to the lumen.',
  'Leydig cells are in the spaces between the tubules, not in them.');
v5mc('hr-v502', 'gametogenesis', 'Five primary spermatocytes and five primary oocytes complete meiosis. Every secondary oocyte is fertilised, and every first polar body also divides. How many of the haploid cells formed can <b>not</b> act as gametes?', '15', ['10', '20', '5'],
  'Idea: one primary spermatocyte gives four spermatids, all of which become sperm. One primary oocyte gives one ovum and three polar bodies (the first polar body divides into two, and the secondary oocyte gives a second polar body). So the cells that cannot act as gametes: 5 &times; 3 = 15. The value 10 forgets that the first polar body divides. The value 20 counts the sperm instead.',
  'One oocyte gives one functional gamete and three polar bodies if the first polar body divides.');
v5mc('hr-v503', 'male system', 'Both seminal vesicles of a healthy man are removed surgically; the testes, epididymis and vasa deferentia are normal. Which result is expected?', 'Spermatogenesis goes on as before, but the semen has a smaller volume and lacks the fructose-rich secretion', ['Spermatogenesis stops because the androgen level falls', 'Sperm cannot leave the testis, so there are no sperm in the testis', 'The sperm are formed but cannot enter the urethra at all'],
  'Idea: the seminal vesicles are accessory glands that add fluid (rich in fructose) to the semen. Sperm are made in the seminiferous tubules, under the control of the hormones of the testis, which do not depend on the seminal vesicles. The vasa deferentia still join the ejaculatory duct, so sperm still reach the urethra. Only the volume and the energy-rich fluid fall.',
  'Accessory glands add to the semen but do not make or move the sperm.');
v5mc('hr-v504', 'gametogenesis', 'Which statement is true of both a spermatid and a second polar body of a human?', 'Both are haploid, with 23 chromosomes, each of a single chromatid', ['Both are formed from a diploid cell by meiosis I', 'Both have 46 chromosomes', 'Both are functional gametes as soon as they are formed'],
  'Idea: both are products of meiosis II. A secondary spermatocyte or a secondary oocyte has 23 chromosomes of two chromatids each. Meiosis II separates the chromatids, so each product has 23 single-chromatid chromosomes. A spermatid still needs spermiogenesis to become a sperm, and a polar body is not a gamete. Meiosis I is the division that halves the number from 46 to 23.',
  'Meiosis I halves the chromosome number; meiosis II separates the chromatids.');

v5match('hr-v505', 'numbers', 'v5m1', 'Numbers from the human reproductive system',
  ['A. Compartments (testicular lobules) in each testis', 'B. Primary follicles in each ovary at puberty', 'C. Mammary lobes in each breast', 'D. Length of each fallopian tube'],
  ['p. 15 to 20', 'q. About 250', 'r. 10 to 12 cm', 's. 60,000 to 80,000', 't. 2 to 4 cm'], 'qspr',
  'Each testis has about 250 lobules. Each ovary has 60,000 to 80,000 primary follicles at puberty (from about 2 to 4 million at birth). Each breast has 15 to 20 mammary lobes. The oviduct is about 10 to 12 cm long. The value 2 to 4 cm is the length of the ovary, which is not in List I.',
  'The ovary is 2 to 4 cm and the oviduct 10 to 12 cm; do not swap them.');
v5match('hr-v506', 'gametogenesis', 'v5m2', 'Cells of oogenesis and their chromosomes and chromatids',
  ['A. Primary oocyte arrested in prophase I (after DNA replication)', 'B. First polar body, as formed', 'C. Second polar body, as formed', 'D. Zygote just after the fusion of the nuclei'],
  ['p. 23 chromosomes, 46 chromatids', 'q. 23 chromosomes, 23 chromatids', 'r. 46 chromosomes, 92 chromatids', 's. 46 chromosomes, 46 chromatids', 't. 92 chromosomes, 92 chromatids'], 'rpqs',
  'The primary oocyte has 46 chromosomes, each of two chromatids (92). Meiosis I gives a haploid cell of 23 chromosomes of two chromatids each: the secondary oocyte and the first polar body (46 chromatids). Meiosis II separates the chromatids, so the second polar body has 23 chromosomes of one chromatid (23). The zygote is diploid, with 46 single-chromatid chromosomes before it replicates its DNA.',
  'Count chromosomes by centromeres, and chromatids by DNA strands.');
v5match('hr-v507', 'fertilisation and early development', 'v5m3', 'Event and the place where it happens',
  ['A. Fertilisation', 'B. First cleavage divisions of the zygote', 'C. Change of the morula into a blastocyst', 'D. Implantation'],
  ['p. In the uterine cavity', 'q. In the endometrium', 'r. At the ampullary-isthmic junction', 's. In the isthmus of the fallopian tube, on the way to the uterus', 't. In the infundibulum'], 'rspq',
  'Fertilisation takes place at the ampullary-isthmic junction. The zygote divides as it moves through the isthmus towards the uterus, giving a 2, 4, 8 and 16 celled morula. The morula changes into the blastocyst as it moves further into the uterus. The blastocyst embeds in the endometrium (implantation).',
  'The infundibulum only collects the ovum; fertilisation is not there.');
v5match('hr-v508', 'hormones', 'v5m4', 'Event and the hormone that triggers it',
  ['A. Rupture of the Graafian follicle', 'B. Change of spermatids into sperm (spermiogenesis)', 'C. Ejection of milk when the baby sucks', 'D. Regrowth of the endometrium in the follicular phase'],
  ['p. FSH acting on the Sertoli cells', 'q. LH surge', 'r. Oxytocin', 's. Oestrogen', 't. Prolactin'], 'qprs',
  'The surge of LH in the middle of the cycle makes the Graafian follicle rupture. FSH acts on the Sertoli cells and stimulates factors that help spermiogenesis. Suckling releases oxytocin, which causes milk ejection. Oestrogen from the growing follicles regenerates the endometrium. Prolactin makes the milk but does not eject it.',
  'Prolactin makes milk; oxytocin ejects it.');

v5asr('hr-v509', 'male hormones', 'In the male, the secretion of androgens depends on LH and not on FSH.', 'LH acts on the Leydig cells in the interstitial spaces, whereas FSH acts on the Sertoli cells inside the seminiferous tubules.', 0,
  'Both are true and R explains A. Androgens are made by the Leydig cells, and the Leydig cells have receptors for LH. FSH acts on the Sertoli cells and stimulates factors that help spermiogenesis, so it does not drive androgen synthesis.',
  'LH goes with Leydig, FSH with Sertoli.');
v5asr('hr-v510', 'oogenesis', 'A primary oocyte becomes a secondary oocyte before the girl is born.', 'Meiosis I of the oogonia begins and is arrested at prophase I during embryonic life.', 3,
  'Assertion A is false: the primary oocytes formed in the foetus stay arrested at prophase I. Only after puberty, inside a tertiary follicle, does a primary oocyte complete meiosis I and become a secondary oocyte. Reason R is true.',
  'The arrested cell at birth is a primary oocyte.');
v5asr('hr-v511', 'male system', 'In the testis, the cells that undergo meiosis lie inside the seminiferous tubules.', 'The Leydig cells divide by meiosis to produce androgens.', 2,
  'Assertion A is true: spermatogonia divide by mitosis and primary spermatocytes undergo meiosis, all inside the tubules. Reason R is false: Leydig cells do not divide by meiosis, and they make androgens by synthesis, not by division.',
  'Meiosis makes gametes only.');
v5asr('hr-v512', 'male system', 'The seminal plasma is rich in fructose, calcium and some enzymes.', 'The seminal vesicles are paired glands, while the prostate is a single gland.', 1,
  'Both statements are true, but R does not explain A. The seminal plasma gets its fructose and other secretions from the accessory glands, but the number of the glands (paired or single) does not explain what the plasma contains.',
  'A true reason need not be the explanation.');

v5cnt('hr-v513', 'mammary gland', 'How many of the following statements are correct? (i) A mammary gland has 15 to 20 mammary lobes containing clusters of alveoli. (ii) The cells of the alveoli secrete milk. (iii) The alveoli open directly into the lactiferous duct. (iv) Several mammary ducts join to form a wider mammary ampulla. (v) The mammary tubules of each lobe join to form the mammary ampulla.', 'Three', ['Two', 'Four', 'Five'],
  '(i) True. (ii) True. (iii) False: the alveoli open into mammary tubules. (iv) True: several mammary ducts join to form the ampulla, which connects to the lactiferous duct. (v) False: the tubules of each lobe join to form a mammary duct, not the ampulla. So (i), (ii) and (iv) are correct: three.',
  'The order is alveoli, tubules, duct, ampulla, lactiferous duct.');
v5stm('hr-v514', 'ovary', 'The number of primary follicles in an ovary at puberty is smaller than at birth.', 'At puberty the primary follicles of the ovary contain secondary oocytes.', 2,
  'Statement I is correct: about 2 to 4 million at birth fall to 60,000 to 80,000 at puberty. Statement II is incorrect: primary follicles contain primary oocytes arrested at prophase I. The secondary oocyte forms only in a tertiary follicle after puberty.',
  'Secondary oocytes are never found in primary follicles.');
v5stm('hr-v515', 'oogenesis', 'The second polar body is formed in the tertiary follicle before ovulation.', 'The first polar body is formed in the tertiary follicle before ovulation.', 3,
  'Statement I is incorrect: the second polar body forms only after the entry of a sperm, when the secondary oocyte completes meiosis II. Statement II is correct: the primary oocyte of the tertiary follicle completes meiosis I and gives the secondary oocyte and the first polar body.',
  'Meiosis II is completed after sperm entry.');
v5stm('hr-v516', 'fertilisation', 'Fertilisation can take place only if the ovum and the sperm reach the ampullary-isthmic junction at the same time.', 'Therefore not every coitus leads to fertilisation and pregnancy.', 0,
  'Both are correct. Fertilisation needs the sperm and the ovum to be transported to the ampullary-isthmic junction together, which explains why not all copulations lead to pregnancy.',
  null);
v5cnt('hr-v517', 'gametogenesis', 'How many of the following statements are correct? (i) A secondary spermatocyte has 23 chromosomes, each of two chromatids. (ii) A spermatid has 23 chromosomes, each of one chromatid. (iii) A first polar body has 23 chromosomes, each of two chromatids. (iv) A second polar body has 46 chromatids. (v) A primary spermatocyte at metaphase I has 92 chromatids.', 'Four', ['Two', 'Three', 'Five'],
  '(i) True. (ii) True. (iii) True: meiosis I separates homologous chromosomes, not chromatids. (iv) False: a second polar body is haploid, with 23 single-chromatid chromosomes, so 23 chromatids. (v) True: 46 chromosomes, each of two chromatids. So four are correct.',
  'A haploid cell after meiosis II has 23 chromatids, not 46.');

v5pass('v5p1', 'Three men, one fault each', 'Three adult men each have one fault. Man X: his Leydig cells do not respond to LH. Man Y: his Sertoli cells do not respond to FSH, but his pituitary and Leydig cells are normal. Man Z: both of his vasa deferentia are blocked, but his testes, pituitary and hormone levels are normal.');
v5mc('hr-v518', 'male system', 'The man whose semen contains seminal plasma but no sperm, even though sperm are being formed normally in his testes, is', 'Z', ['X', 'Y', 'all three'],
  'The sperm of Z are made but cannot pass beyond the blocked vasa deferentia, so the ejaculatory duct carries only the secretions of the accessory glands. X has low androgens, which disturbs sperm formation. Y has a fault in sperm formation (spermiogenesis).',
  null, 'passage', 'v5p1');
v5mc('hr-v519', 'male hormones', 'The man who is expected to have a low level of androgens is', 'X', ['Y', 'Z', 'none of them'],
  'Androgens are made by the Leydig cells under the control of LH. In X the Leydig cells do not respond to LH, so androgens fall. In Y and Z the Leydig cells and LH are normal.',
  null, 'passage', 'v5p1');
v5mc('hr-v520', 'male hormones', 'The man who has a normal androgen level and normal male secondary sexual characters, but poor sperm formation in the testes, is', 'Y', ['X', 'Z', 'both X and Z'],
  'In Y the Leydig cells are normal, so androgens and the secondary sexual characters are normal. His Sertoli cells do not respond to FSH, so the factors that help spermiogenesis are missing. X has low androgens. Z forms sperm normally.',
  null, 'passage', 'v5p1');

const gens = [
  {
    id: 'hr-g01', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'counting sperm',
    make(rng) {
      const N = choose(rng, [10, 25, 40, 50, 75, 100, 120, 150, 200, 500]);
      const st = choose(rng, ['primary spermatocytes', 'secondary spermatocytes', 'spermatids']);
      const per = { 'primary spermatocytes': 4, 'secondary spermatocytes': 2, spermatids: 1 }[st];
      return { N, st, q: `How many sperm can form from ${N} ${st}? (Every cell completes the remaining divisions and spermiogenesis.)`, answer: N * per, tol: 0, sol: `Idea: one primary spermatocyte gives 4 sperm, one secondary spermatocyte gives 2, and one spermatid gives 1. For ${st}: ${per} per cell, so ${N} &times; ${per} = ${N * per}.` };
    },
    verify(p) { return p.N * { 'primary spermatocytes': 2 * 2, 'secondary spermatocytes': 2, spermatids: 1 }[p.st]; },
  },
  {
    id: 'hr-g02', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'counting primary spermatocytes',
    make(rng) {
      const s = choose(rng, [40, 80, 120, 200, 360, 400, 800, 1000]);
      return { s, q: `How many primary spermatocytes are needed to produce ${s} sperm?`, answer: s / 4, tol: 0, sol: `Idea: one primary spermatocyte gives 4 sperm, so primary spermatocytes needed = ${s} / 4 = ${s / 4}.` };
    },
    verify(p) { return p.s / 4; },
  },
  {
    id: 'hr-g03', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'chromosome number',
    make(rng) {
      const [who, d] = choose(rng, SPECIES);
      const [cell, k, why] = choose(rng, CELLS);
      return { d, k, q: `${who[0].toUpperCase() + who.slice(1)} has ${d} chromosomes in its body cells. How many chromosomes does ${cell} have? (Count chromosomes by centromeres.)`, answer: k === 2 ? d : d / 2, tol: 0, sol: `Idea: ${cell} ${why}. A diploid cell has ${d} chromosomes and a haploid cell has ${d / 2}. Answer: ${k === 2 ? d : d / 2}.` };
    },
    verify(p) { return p.k === 2 ? p.d : p.d / 2; },
  },
  {
    id: 'hr-g04', type: 'nat', level: 4, format: 'integer', exams: ['neet'], sub: 'mitosis then meiosis',
    make(rng) {
      const k = int(rng, 2, 6);
      const m = int(rng, 1, 3);
      return { k, m, q: `${m} spermatogonia each divide by mitosis ${k} times to form primary spermatocytes. All of these then complete meiosis and spermiogenesis. How many sperm form?`, answer: m * 2 ** k * 4, tol: 0, sol: `Idea: ${k} rounds of mitosis give 2<sup>${k}</sup> = ${2 ** k} primary spermatocytes per spermatogonium. Each makes 4 sperm. Total = ${m} &times; ${2 ** k} &times; 4 = ${m * 2 ** k * 4}.` };
    },
    verify(p) { let c = p.m; for (let i = 0; i < p.k; i++) c *= 2; return c * 4; },
  },
  {
    id: 'hr-g05', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'counting polar bodies',
    make(rng) {
      const N = choose(rng, [5, 10, 12, 20, 25, 30, 50, 100]);
      const w = choose(rng, ['polar bodies', 'ova', 'cells (ova and polar bodies together)']);
      const ans = w === 'polar bodies' ? 3 * N : w === 'ova' ? N : 4 * N;
      return { N, w, q: `${N} primary oocytes complete both meiotic divisions after fertilisation (the first polar body also divides). How many ${w} are formed in all?`, answer: ans, tol: 0, sol: `Idea: one primary oocyte forms 1 ovum and 3 polar bodies (the first polar body divides into 2, and meiosis II gives the second polar body). Per oocyte: 1 ovum, 3 polar bodies, 4 cells. Answer for ${w}: ${ans}.` };
    },
    verify(p) { return p.w === 'polar bodies' ? p.N * 3 : p.w === 'ova' ? p.N : p.N * 4; },
  },
  {
    id: 'hr-g06', type: 'nat', level: 3, format: 'numeric', exams: ['neet'], sub: 'sperm count',
    make(rng) {
      const V = choose(rng, [2, 2.5, 3, 3.5, 4, 5]);
      const C = choose(rng, [40, 50, 60, 80, 100]);
      const M = choose(rng, [40, 50, 60, 75]);
      const t = V * C;
      const m = (t * M) / 100;
      return { V, C, M, q: `A semen sample has a volume of ${V} mL and a sperm concentration of ${C} million per mL. If ${M} per cent of the sperm are motile, how many million motile sperm does it contain?`, answer: +m.toFixed(2), tol: 0.01, unit: 'million', sol: `Idea: total sperm = volume &times; concentration = ${V} &times; ${C} = ${t} million. Motile = ${M}% of ${t} = ${m.toFixed(2)} million.` };
    },
    verify(p) { return +(p.V * p.C * p.M / 100).toFixed(2); },
  },
  {
    id: 'hr-g07', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'cycle days',
    make(rng) {
      const L = int(rng, 24, 36);
      const w = choose(rng, ['ovulation', 'luteal', 'next']);
      const q = w === 'ovulation' ? `A woman has a regular ${L}-day menstrual cycle. Counting the first day of flow as day 1, ovulation is expected on which day? (Assume the luteal phase is a fixed 14 days.)` : w === 'luteal' ? `A woman has a regular ${L}-day cycle with ovulation on day ${L - 14}. How many days after ovulation does the next menstruation begin?` : `A woman's last menstruation began on day 1 and her cycles are ${L} days long. On which day count from that day 1 will her next menstruation begin?`;
      const ans = w === 'ovulation' ? L - 14 : w === 'luteal' ? 14 : L + 1;
      return { L, w, q, answer: ans, tol: 0, sol: `Idea: the luteal phase is nearly fixed at 14 days, and the next cycle begins the day after the current one ends. ${w === 'ovulation' ? `Ovulation = ${L} &minus; 14 = day ${L - 14}.` : w === 'luteal' ? `Ovulation to the next flow is 14 days (the luteal phase).` : `The cycle is ${L} days, so the next flow starts on day ${L + 1}.`}` };
    },
    verify(p) { return p.w === 'ovulation' ? p.L - 14 : p.w === 'luteal' ? 14 : p.L + 1; },
  },
  {
    id: 'hr-g08', type: 'nat', level: 4, format: 'integer', exams: ['neet'], sub: 'lifetime ovulations',
    make(rng) {
      const a = int(rng, 12, 15), b = int(rng, 45, 52), preg = int(rng, 0, 4);
      const ans = (b - a) * 13 - preg * 9 * 1.0 * 1;
      const months = (b - a) * 12 - preg * 9;
      return { a, b, preg, months, q: `A woman has menarche at age ${a} and menopause at age ${b}. She has ${preg} full-term pregnancies of 9 months each and no other break in her cycles. Taking each month as one cycle with one ovulation (12 cycles a year), how many ovulations will she have?`, answer: months, tol: 0, sol: `Idea: ovulation occurs once each month when she is not pregnant. Months = (${b} &minus; ${a}) &times; 12 = ${(b - a) * 12}. Lost to pregnancy = ${preg} &times; 9 = ${preg * 9}. Ovulations = ${months}.` };
    },
    verify(p) { return (p.b - p.a) * 12 - p.preg * 9; },
  },
  {
    id: 'hr-g09', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'cleavage',
    make(rng) {
      const k = int(rng, 1, 5);
      const w = choose(rng, ['blast', 'div']);
      if (w === 'blast') return { k, w, q: `A zygote undergoes ${k} rounds of cleavage, with every cell dividing each time. How many blastomeres are present?`, answer: 2 ** k, tol: 0, sol: `Idea: each cleavage round doubles the number of cells. After ${k} rounds: 2<sup>${k}</sup> = ${2 ** k}.` };
      return { k, w, q: `How many rounds of cleavage are needed for a zygote to form a ${2 ** k}-celled embryo? (Every cell divides in each round.)`, answer: k, tol: 0, sol: `Idea: cells double each round. 2<sup>${k}</sup> = ${2 ** k}, so ${k} rounds.` };
    },
    verify(p) { return p.w === 'blast' ? Math.pow(2, p.k) : p.k; },
  },
  {
    id: 'hr-g10', type: 'mcq', level: 3, format: 'single', exams: ex(3), sub: 'phase by day',
    make(rng) {
      const L = choose(rng, [28, 28, 30, 32]);
      const d = int(rng, 1, L);
      const ov = L - 14;
      let name;
      if (d <= 5) name = 'menstrual phase'; else if (d < ov) name = 'follicular (proliferative) phase'; else if (d === ov) name = 'ovulation'; else name = 'luteal (secretory) phase';
      const all = ['menstrual phase', 'follicular (proliferative) phase', 'ovulation', 'luteal (secretory) phase'];
      const o = shuffleOpts(rng, name, all.filter((x) => x !== name));
      return { L, d, name, q: `In a regular ${L}-day menstrual cycle (day 1 is the first day of flow, flow lasts 5 days, luteal phase 14 days), day ${d} falls in the`, options: o.options, answer: o.answer, sol: `Idea: menstruation is days 1 to 5; ovulation is on day ${L} &minus; 14 = ${ov}; days 6 to ${ov - 1} are the follicular phase; days ${ov + 1} to ${L} are the luteal phase. Day ${d} is the ${name}.` };
    },
    verify(p) { const ov = p.L - 14; const n = p.d <= 5 ? 'menstrual phase' : p.d < ov ? 'follicular (proliferative) phase' : p.d === ov ? 'ovulation' : 'luteal (secretory) phase'; return p.options.indexOf(n); },
  },
  {
    id: 'hr-g11', type: 'mcq', level: 3, format: 'single', exams: ex(3), sub: 'hormone source',
    make(rng) {
      const H = [['LH', 'anterior pituitary', 'triggers ovulation and acts on Leydig cells'], ['FSH', 'anterior pituitary', 'acts on Sertoli cells and starts follicle growth'], ['GnRH', 'hypothalamus', 'makes the anterior pituitary release LH and FSH'], ['oxytocin', 'maternal pituitary (posterior)', 'causes uterine contractions in labour'], ['prolactin', 'anterior pituitary', 'makes milk in the mammary glands'], ['progesterone from the corpus luteum', 'corpus luteum', 'maintains the endometrium'], ['hCG', 'placenta (trophoblast)', 'is the hormone detected in pregnancy tests'], ['testosterone', 'Leydig cells', 'is the main male sex hormone'], ['relaxin', 'ovary in late pregnancy', 'relaxes pelvic ligaments']];
      const [h, src] = choose(rng, H);
      const wrong = ['anterior pituitary', 'hypothalamus', 'Leydig cells', 'placenta (trophoblast)', 'corpus luteum', 'ovary in late pregnancy', 'maternal pituitary (posterior)'].filter((x) => x !== src);
      const o = shuffleOpts(rng, src, wrong.sort(() => rng() - 0.5).slice(0, 3));
      return { h, src, q: `${h[0].toUpperCase() + h.slice(1)} is secreted by the`, options: o.options, answer: o.answer, sol: `Idea: learn each hormone with its source. ${h[0].toUpperCase() + h.slice(1)} comes from the ${src}.` };
    },
    verify(p) { return p.options.indexOf(p.src); },
  },
  {
    id: 'hr-g12', type: 'mcq', level: 3, format: 'single', exams: ex(3), sub: 'pregnancy landmarks',
    make(rng) {
      const L = [['After about one month of pregnancy', 'the heart is formed'], ['By the end of the second month', 'limbs and digits develop'], ['By the end of 12 weeks (first trimester)', 'most major organ systems are formed'], ['In the fifth month', 'the first foetal movements and hair on the head appear'], ['By the end of 24 weeks (second trimester)', 'the body is covered with fine hair and the eyelids separate'], ['By the end of nine months', 'the foetus is fully developed and ready for delivery']];
      const i = int(rng, 0, L.length - 1);
      const wr = L.filter((_, j) => j !== i).map((x) => x[1]).sort(() => rng() - 0.5).slice(0, 3);
      const o = shuffleOpts(rng, L[i][1], wr);
      return { i, right: L[i][1], q: `${L[i][0]}, which of the following is seen in the human embryo or foetus?`, options: o.options, answer: o.answer, sol: `Idea: learn the NCERT landmarks in order: 1 month heart; 2 months limbs and digits; 12 weeks major organ systems; 5 months movements and hair on the head; 24 weeks fine hair and eyelids separate; 9 months ready for birth. So: ${L[i][1]}.` };
    },
    verify(p) { return p.options.indexOf(p.right); },
  },
  {
    id: 'hr-g13', type: 'nat', level: 4, format: 'numeric', exams: ['neet'], sub: 'DNA content',
    make(rng) {
      const X = choose(rng, [3, 5, 6, 6.6, 7.2, 8]);
      const st = choose(rng, [['a primary spermatocyte after S phase', 2], ['a secondary spermatocyte before meiosis II', 1], ['a spermatid', 0.5], ['a spermatogonium in G1', 1 * 1], ['a primary oocyte after S phase', 2], ['the first polar body', 1], ['the ovum', 0.5]]);
      const base = st[0].includes('spermatogonium') ? 1 : 1;
      return { X, f: st[1], q: `The DNA content of a human diploid cell in G1 (for example a spermatogonium) is ${X} pg. What is the DNA content of ${st[0]}?`, answer: +(X * st[1]).toFixed(2), tol: 0.01, unit: 'pg', sol: `Idea: G1 diploid = ${X} pg. After S phase the DNA doubles (${2 * X} pg). Meiosis I halves it back to ${X} pg per cell (secondary spermatocyte, secondary oocyte, first polar body). Meiosis II halves it again to ${X / 2} pg (spermatid, ovum). For ${st[0]}: ${(X * st[1]).toFixed(2)} pg.` };
    },
    verify(p) { return +(p.X * p.f).toFixed(2); },
  },
  {
    id: 'hr-g14', type: 'nat', level: 4, format: 'integer', exams: ['neet'], sub: 'cycle and pregnancy days',
    make(rng) {
      const L = int(rng, 26, 32);
      const gest = choose(rng, [266, 270, 273]);
      const f = L - 14;
      return { L, gest, q: `A woman with a regular ${L}-day cycle conceives by fertilisation on the day of ovulation (luteal phase 14 days, day 1 is the first day of her last flow). If pregnancy lasts ${gest} days from fertilisation, on which day counted from day 1 of her last period is the baby born?`, answer: f + gest, tol: 0, sol: `Idea: ovulation and fertilisation fall on day ${L} &minus; 14 = ${f}. Birth is ${gest} days later: ${f} + ${gest} = ${f + gest}.` };
    },
    verify(p) { return p.L - 14 + p.gest; },
  },
];

export default { topic: 'human-reproduction', groups, items, gens };
