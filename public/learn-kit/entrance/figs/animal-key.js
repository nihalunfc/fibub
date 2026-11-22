// Animal kingdom: the basis of classification as a key. Pick a phylum: the six boxes show its level of
// organisation, symmetry, germ layers, body cavity, segmentation and notochord, and the readout gives its hallmark
// features and examples (as in NCERT Class 11, Animal kingdom).
import { canvas, text, row, choice, readout, arrow } from '../../kit.js';

const KEYS = ['Organisation', 'Symmetry', 'Germ layers', 'Body cavity', 'Segmentation', 'Notochord'];
const P = {
  pori: { name: 'Porifera', v: ['cellular', 'mostly asymmetrical', 'not true tissues', 'none', 'no', 'absent'], h: 'water canal system (ostia → spongocoel → osculum), choanocytes, spicules or spongin fibres; hermaphrodite, internal fertilisation, larva', ex: 'Sycon, Spongilla, Euspongia' },
  cnid: { name: 'Cnidaria', v: ['tissue', 'radial', 'diploblastic', 'none', 'no', 'absent'], h: 'cnidoblasts (stinging cells), gastrovascular cavity with one opening on the hypostome; polyp and medusa forms, which alternate in Obelia (metagenesis); corals have a calcium carbonate skeleton', ex: 'Physalia, Adamsia, Pennatula, Gorgonia, Meandrina' },
  cten: { name: 'Ctenophora', v: ['tissue', 'radial', 'diploblastic', 'none', 'no', 'absent'], h: 'eight external rows of ciliated comb plates for swimming, bioluminescence; sexual reproduction only, external fertilisation, indirect development', ex: 'Pleurobrachia, Ctenoplana' },
  platy: { name: 'Platyhelminthes', v: ['organ', 'bilateral', 'triploblastic', 'acoelomate', 'no', 'absent'], h: 'flattened body; flame cells for excretion and osmoregulation; parasites with hooks and suckers absorb food through the body surface; Planaria regenerates', ex: 'Taenia (tapeworm), Fasciola (liver fluke)' },
  asch: { name: 'Aschelminthes', v: ['organ system', 'bilateral', 'triploblastic', 'pseudocoelomate', 'no', 'absent'], h: 'round in cross-section; complete gut with a muscular pharynx; sexes separate, females longer than males', ex: 'Ascaris, Wuchereria (filaria worm), Ancylostoma (hookworm)' },
  anne: { name: 'Annelida', v: ['organ system', 'bilateral', 'triploblastic', 'coelomate', 'metameric', 'absent'], h: 'nephridia for excretion, closed circulation, longitudinal and circular muscles; Nereis has parapodia and separate sexes; earthworm and leech are monoecious', ex: 'Nereis, Pheretima (earthworm), Hirudinaria (leech)' },
  arth: { name: 'Arthropoda', v: ['organ system', 'bilateral', 'triploblastic', 'coelomate', 'segmented', 'absent'], h: 'jointed appendages, chitin exoskeleton; largest phylum (about two-thirds of named species); open circulation; Malpighian tubules; compound eyes, statocysts', ex: 'Apis, Bombyx, Laccifer, Anopheles, Locusta, Limulus (living fossil)' },
  moll: { name: 'Mollusca', v: ['organ system', 'bilateral', 'triploblastic', 'coelomate', 'no', 'absent'], h: 'calcareous shell; head, muscular foot and visceral hump covered by a mantle; feather-like gills in the mantle cavity; a rasping radula', ex: 'Pila, Pinctada, Sepia, Loligo, Octopus, Aplysia, Dentalium' },
  echi: { name: 'Echinodermata', v: ['organ system', 'radial adult, bilateral larva', 'triploblastic', 'coelomate', 'no', 'absent'], h: 'spiny skin of calcareous ossicles; water vascular system (tube feet for movement and feeding); no excretory system; all marine', ex: 'Asterias, Echinus, Antedon, Cucumaria, Ophiura' },
  hemi: { name: 'Hemichordata', v: ['organ system', 'bilateral', 'triploblastic', 'coelomate', 'no', 'absent (stomochord)'], h: 'worm-like body of proboscis, collar and trunk; a stomochord that looks like a notochord; proboscis gland excretes; gills', ex: 'Balanoglossus, Saccoglossus' },
  chor: { name: 'Chordata', v: ['organ system', 'bilateral', 'triploblastic', 'coelomate', 'segmented', 'present'], h: 'notochord, dorsal hollow nerve cord, pharyngeal gill slits and a post-anal tail at some stage; ventral heart', ex: 'Urochordata, Cephalochordata and Vertebrata' },
};
export default function (host) {
  let cur = 'anne';
  const cv = canvas(host, { aspect: 0.7, max: 420, min: 300, label: 'Six classification features for one animal phylum' });
  const ctl = row(host);
  choice(ctl, 'Phylum', Object.entries(P).map(([k, p]) => [k, p.name]), cur, (v) => { cur = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => { const p = P[cur]; out.innerHTML = `<b>${p.name}</b>: ${p.h}. Examples: ${p.ex}.`; };
  cv.draw = (ctx, w, h, col) => {
    const p = P[cur], top = 34, gap = (h - top - 10) / 6, bw = Math.min(w - 20, 340), x = (w - bw) / 2;
    text(ctx, p.name, w / 2, 16, { color: col.ink, size: 14, weight: 700, align: 'center' });
    for (let i = 0; i < 6; i++) {
      const y = top + i * gap, bh = gap - 14;
      ctx.fillStyle = col.soft; ctx.strokeStyle = col.s[i % 8] || col.line; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(x, y, bw, bh, 7); ctx.fill(); ctx.stroke();
      text(ctx, KEYS[i], x + 10, y + bh / 2, { color: col.muted, size: 11 });
      text(ctx, p.v[i], x + bw - 10, y + bh / 2, { color: col.ink, size: 12, weight: 600, align: 'right' });
      if (i < 5) arrow(ctx, w / 2, y + bh + 1, w / 2, y + gap - 1, col.muted, 1.5, 6);
    }
  };
  cv.redraw(); show();
}
