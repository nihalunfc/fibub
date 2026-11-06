// Link cleaner rules. Pure functions, no network: short links (bit.ly, lnkd.in) can't be expanded
// without visiting them, so they are left as they are and flagged.

/** Tracking parameters removed everywhere. Lower-case; entries ending in * match by prefix. */
const TRACKING = [
  'utm_*', 'fbclid', 'gclid', 'gclsrc', 'dclid', 'gbraid', 'wbraid', 'gad_source', 'msclkid', 'yclid', 'twclid', 'ttclid',
  'li_fat_id', 'igshid', 'igsh', 'mc_cid', 'mc_eid', '_hsenc', '_hsmi', 'hsa_*', 'mkt_tok', 'vero_*', 'oly_*', 'wickedid',
  '_ga', '_gl', 'ga_*', 'trk', 'trkcampaign', 'trackingid', 's_cid', 'cmpid', 'spm', 'scm', 'srsltid', 'ref_src', 'ref_url',
  'rcm', 'si', 'feature', 'pp', 'share_id', 'sharer', 'ncid', 'sr_share', 'ocid', 'cvid', 'ei', 'ved', 'sca_esv', 'sxsrf', 'oq',
  'gs_lcrp', 'sourceid', 'uact', 'ns_*', 'mbid', 'campaign_id', 'ad_id', 'adset_id',
];
/** Affiliate and referral parameters, removed when the switch is on. */
const AFFILIATE = [
  'ref', 'referrer', 'aff', 'affid', 'aff_id', 'affiliate', 'affiliate_id', 'aff_sub*', 'clickid', 'irclickid', 'irgwc',
  'ranmid', 'raneaid', 'ransiteid', 'partnerid', 'partner_id', 'subid', 'sub_id', 'click_id', 'cjevent', 'cjdata', 'awc', 'afftrack',
];
/** Affiliate parameters that only mean "affiliate" on these sites. */
const SITE_AFFILIATE: [RegExp, string[]][] = [
  [/(^|\.)amazon\./, ['tag', 'linkcode', 'linkid', 'ascsubtag', 'creative', 'creativeasin', 'camp']],
];
/** Sites where "ref" is a real setting (a branch or tag), not a referral. */
const KEEP_REF = /(^|\.)(github|gitlab|bitbucket)\.(com|org|io)$/;
/** Parameters that are tracking only on these sites (they mean something elsewhere). */
const SITE_PARAMS: [RegExp, string[]][] = [
  [/(^|\.)amazon\./, ['_encoding', 'psc', 'pd_rd_*', 'pf_rd_*', 'content-id', 'crid', 'dib', 'dib_tag', 'keywords', 'qid', 'sprefix', 'sr', 'th', 'smid', 'spla', 'ref_']],
  [/(^|\.)youtube\.com$|(^|\.)youtu\.be$/, ['ab_channel', 'embeds_referring_euri', 'embeds_referring_origin', 'source_ve_path']],
  [/(^|\.)linkedin\.com$/, ['trackingid', 'refid', 'lipi', 'licu', 'midtoken', 'midsig', 'trk*', 'eid', 'otptoken', 'origin', 'originalsubdomain']],
  [/(^|\.)x\.com$|(^|\.)twitter\.com$/, ['s', 't', 'ref_src']],
  [/(^|\.)instagram\.com$|(^|\.)facebook\.com$/, ['mibextid', 'rdid', 'share_url', 'hc_ref', '__tn__', '__cft__*', 'paipv', 'eav']],
  [/(^|\.)aliexpress\./, ['spm', 'scm', 'algo_*', 'pdp_*', 'aff_*', 'sk', 'gatewayadapt', 'gps-id', 'scm_id', 'scm-url', 'pvid', 'utparam*']],
  [/(^|\.)ebay\./, ['_trkparms', '_trksid', 'hash', 'amdata', 'mkcid', 'mkrid', 'siteid', 'campid', 'customid', 'toolid', 'mkevt']],
  [/(^|\.)flipkart\.com$/, ['pid', 'lid', 'marketplace', 'store', 'srno', 'otracker', 'fm', 'iid', 'ppt', 'ppn', 'ssid', 'qh', 'affid', 'affextparam1', 'affextparam2']],
  [/(^|\.)spotify\.com$/, ['context', 'nd', 'dlsi']],
];
/** Redirect wrappers: the real address is inside a parameter. */
const WRAPPERS: [RegExp, RegExp, string[]][] = [
  [/(^|\.)google\.[a-z.]+$/, /^\/url$/, ['q', 'url']],
  [/^l\.facebook\.com$|^lm\.facebook\.com$|^l\.instagram\.com$/, /^\/l\.php$|^\/$/, ['u']],
  [/(^|\.)youtube\.com$/, /^\/redirect$/, ['q']],
  [/^out\.reddit\.com$/, /./, ['url']],
  [/(^|\.)linkedin\.com$/, /^\/redir\/redirect/, ['url']],
  [/^(www\.)?bing\.com$/, /^\/ck\/a$/, ['u']],
  [/(^|\.)safelinks\.protection\.outlook\.com$/, /./, ['url']],
  [/^(www\.)?duckduckgo\.com$/, /^\/l\/$/, ['uddg']],
  [/^t\.umblr\.com$/, /^\/redirect$/, ['z']],
  [/^(www\.)?slack-redir\.net$/, /^\/link$/, ['url']],
];
const SHORTENERS = /^(bit\.ly|t\.co|tinyurl\.com|goo\.gl|ow\.ly|buff\.ly|lnkd\.in|rebrand\.ly|cutt\.ly|is\.gd|amzn\.to|amzn\.eu|a\.co|fb\.me|shorturl\.at|tiny\.cc|rb\.gy|t\.ly|s\.id|dub\.sh|bl\.ink)$/;

const match = (list: string[], key: string) => list.some((p) => (p.endsWith('*') ? key.startsWith(p.slice(0, -1)) : key === p));

export interface Cleaned { input: string; output: string; removed: string[]; unwrapped: boolean; short: boolean; changed: boolean }

export function cleanUrl(raw: string, opts = { affiliate: true }): Cleaned {
  const removed: string[] = [];
  let unwrapped = false;
  let url: URL;
  try { url = new URL(raw); } catch { return { input: raw, output: raw, removed, unwrapped, short: false, changed: false }; }
  // Unwrap redirect links, up to a few levels deep.
  for (let depth = 0; depth < 4; depth++) {
    const host = url.hostname.toLowerCase();
    const w = WRAPPERS.find(([h, p]) => h.test(host) && p.test(url.pathname));
    const inner = w && w[2].map((k) => url.searchParams.get(k)).find((v) => v && /^https?:\/\//i.test(v));
    if (!inner) break;
    try { url = new URL(inner); unwrapped = true; removed.push(`redirect via ${host}`); } catch { break; }
  }
  const host = url.hostname.toLowerCase();
  const site = SITE_PARAMS.filter(([re]) => re.test(host)).flatMap(([, l]) => l);
  const siteAff = SITE_AFFILIATE.filter(([re]) => re.test(host)).flatMap(([, l]) => l);
  for (const key of [...new Set(url.searchParams.keys())]) {
    const k = key.toLowerCase();
    if (k === 'ref' && KEEP_REF.test(host)) continue;
    if (match(TRACKING, k) || match(site, k) || (opts.affiliate && (match(AFFILIATE, k) || match(siteAff, k)))) {
      // Keep YouTube's t (start time) and v (video); only these sites use the bare names above.
      if ((/(^|\.)youtube\.com$|(^|\.)youtu\.be$/.test(host)) && (k === 'v' || k === 't' || k === 'list')) continue;
      url.searchParams.delete(key);
      removed.push(key);
    }
  }
  // Amazon: /Product-Name/dp/ASIN/ref=... -> /dp/ASIN
  if (/(^|\.)amazon\./.test(host)) {
    const m = url.pathname.match(/\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})/i);
    if (m && url.pathname !== `/dp/${m[1]}`) { url.pathname = `/dp/${m[1]}`; removed.push('product name and ref in path'); }
    else if (/\/ref=[^/]*$/.test(url.pathname)) { url.pathname = url.pathname.replace(/\/ref=[^/]*$/, ''); removed.push('ref in path'); }
  }
  // Tracking hashes such as #:~:text= are kept (they jump to text); analytics hashes are dropped.
  if (/^#(utm_|xtor=|at_medium|echobox)/i.test(url.hash)) { removed.push(url.hash.slice(1).split('=')[0]); url.hash = ''; }
  let output = url.href;
  if (!url.search || url.search === '?') output = output.replace('?', '');
  const short = SHORTENERS.test(host) && url.pathname.length > 1;
  return { input: raw, output, removed, unwrapped, short, changed: output !== raw };
}

/** Every http(s) link in a block of text. Trailing punctuation is not part of the link. */
export function findLinks(text: string): { start: number; end: number; url: string }[] {
  const out: { start: number; end: number; url: string }[] = [];
  const re = /https?:\/\/[^\s<>"'`]+/gi;
  for (let m; (m = re.exec(text)); ) {
    let url = m[0];
    while (/[.,;:!?)\]}]$/.test(url) && !(url.endsWith(')') && url.includes('('))) url = url.slice(0, -1);
    out.push({ start: m.index, end: m.index + url.length, url });
  }
  return out;
}

export function cleanText(text: string, opts = { affiliate: true }) {
  const links = findLinks(text);
  const results = links.map((l) => cleanUrl(l.url, opts));
  let out = '', at = 0;
  links.forEach((l, i) => { out += text.slice(at, l.start) + results[i].output; at = l.end; });
  out += text.slice(at);
  return { text: out, results };
}
