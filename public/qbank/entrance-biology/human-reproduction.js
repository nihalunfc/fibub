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

// ---------------------------------------------------------------- Number templates
const SPECIES = [['an animal', 46], ['an animal', 20], ['an animal', 38], ['an animal', 24], ['an animal', 14], ['a human', 46], ['a rat', 42], ['a rabbit', 44], ['a cat', 38], ['a horse', 64]];
const CELLS = [
  ['a spermatogonium', 2, 'divides by mitosis and is diploid'], ['a primary spermatocyte', 2, 'is diploid before meiosis I'], ['a secondary spermatocyte', 1, 'is haploid after meiosis I'],
  ['a spermatid', 1, 'is haploid'], ['a sperm', 1, 'is haploid'], ['a primary oocyte', 2, 'is diploid and arrested at prophase I'], ['a secondary oocyte', 1, 'is haploid, arrested at metaphase II'],
  ['the first polar body', 1, 'is haploid, a product of meiosis I'], ['the second polar body', 1, 'is haploid, a product of meiosis II'], ['an ovum', 1, 'is haploid'], ['a zygote', 2, 'is formed by the fusion of two haploid nuclei'],
  ['a blastomere', 2, 'comes from mitotic divisions of the zygote'], ['a cell of the inner cell mass', 2, 'comes from mitotic divisions of the zygote'], ['a trophoblast cell', 2, 'comes from mitotic divisions of the zygote'],
];
const PHASES = [[1, 5, 'menstrual phase'], [6, 13, 'follicular (proliferative) phase'], [14, 14, 'ovulation'], [15, 28, 'luteal (secretory) phase']];
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
