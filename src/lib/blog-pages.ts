// Page size for the Blog's kind lists (/blog/<kind>/ is page 1, /blog/<kind>/page/2/ onward).
export const PER_PAGE = 24;
export const pageUrl = (kind: string, n: number) => (n <= 1 ? `/blog/${kind}/` : `/blog/${kind}/page/${n}/`);
