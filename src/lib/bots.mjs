// Tells crawlers, link previewers, scripts and test browsers apart from people, so the public view and
// use counters count people only. It looks at the browser's own name (user agent) and nothing else;
// the name is checked on the spot and never kept or sent anywhere. Used by the page script
// (src/scripts/counts.ts) and by the counter itself (worker/index.ts), so both skip the same visitors.

// Search engines, AI crawlers, SEO and uptime services, chat-app link previews, command-line and
// programming-language HTTP clients, and headless or automated browsers. "bot" is matched as its own
// word ending (Googlebot, bingbot, GPTBot) but not inside a name such as CUBOT, a phone brand.
const BOT_UA = new RegExp([
  '(?<!cu)bot\\b', 'crawl', 'spider', 'slurp', 'scrape', 'headless', 'phantomjs', 'puppeteer', 'playwright',
  'selenium', 'webdriver', 'lighthouse', 'pagespeed', 'gtmetrix', 'pingdom', 'uptime', 'statuscake',
  'google-inspectiontool', 'google-read-aloud', 'mediapartners', 'adsbot', 'bingpreview', 'yandex',
  'baiduspider', 'petalbot', 'bytespider', 'applebot', 'duckduckbot', 'ccbot', 'gptbot', 'chatgpt',
  'oai-searchbot', 'claude', 'anthropic', 'perplexity', 'cohere', 'diffbot', 'semrush', 'ahrefs', 'mj12',
  'dotbot', 'archive\\.org', 'ia_archiver', 'facebookexternalhit', 'facebookcatalog', 'meta-externalagent',
  'twitterbot', 'linkedinbot', 'pinterest', 'slackbot', 'discordbot', 'telegrambot', 'whatsapp', 'skypeuripreview',
  'embedly', 'iframely', 'outbrain', 'quora link preview', 'redditbot', 'vkshare', 'w3c_validator', 'validator\\.nu',
  'feedfetcher', 'feedly', 'curl\\/', 'wget', 'httpie', 'python', 'aiohttp', 'go-http-client', 'java\\/',
  'okhttp', 'apache-httpclient', 'libwww', 'axios', 'node-fetch', 'undici', 'got \\(', 'ruby', 'php\\/',
  'scrapy', 'postman', 'insomnia',
].join('|'), 'i');

/** True when this user agent belongs to a crawler, script or headless browser, or is missing. */
export function isBotUA(ua) {
  return !ua || ua.length < 20 || BOT_UA.test(ua);
}
