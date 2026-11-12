// #T944 Tyre type
export const path = '/vehicles/tyre-type/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/tyre-type/`); await page.waitForTimeout(300);
  const first = () => page.textContent('.tt [data-o="first"]');
  const tap = async (g, v) => { await page.click(`.tt [data-g="${g}"] [data-v="${v}"]`); await page.waitForTimeout(60); };
  check((await first()) === 'Summer tyre', `tyre-type: warm, no snow, city -> summer (${await first()})`);
  await page.selectOption('.tt [data-k="country"]', 'canada');
  await tap('cold', 'vcold'); await tap('snow', 'weeks');
  check((await first()) === 'Winter tyre', 'tyre-type: Canada, below -10, weeks of snow -> winter');
  await tap('cold', 'mild'); await tap('snow', 'never'); await page.selectOption('.tt [data-k="country"]', 'gulf'); await tap('roads', 'sand');
  check((await first()) === 'All-terrain tyre' && (await page.textContent('.tt [data-o="note"]')).includes('reinflate'), 'tyre-type: Gulf, sand -> all-terrain with reinflate note');
  await tap('roads', 'city'); await tap('vehicle', 'bike');
  check((await first()) === 'Road tyre', 'tyre-type: motorcycle in the city -> road tyre');
  await page.goto(`${BASE}/vehicles/tyre-type/?c=uk`); await page.waitForTimeout(300);
  check((await page.inputValue('.tt [data-k="country"]')) === 'uk', 'tyre-type: ?c=uk presets the country');
};
