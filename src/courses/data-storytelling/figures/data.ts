// Northbay Goods numbers for the Data storytelling charts, added up once from src/lib/dax/northbay.ts (the made-up
// shop of the Power BI course), so both courses tell the same story. Amounts in dollars, rounded.
// If northbay.ts changes, re-add these up (sum Sales[Amount] by month, store, category; Targets by month and store).

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const SALES_2024 = [13412, 13617, 15461, 15928, 16836, 16638, 17079, 17304, 17091, 15691, 22068, 22313];
export const SALES_2025 = [18238, 13369, 21792, 20080, 23520, 22083, 21880, 21962, 21367, 21123, 27025, 30031];
export const TARGET_2025 = [14200, 14500, 19300, 19900, 21500, 20600, 20600, 20900, 21200, 19200, 27400, 27000];

export const STORES = ['Queen Street', 'Falls Centre', 'Rideau', 'Harbour Front', 'Forks Market'];
export const REGION = ['Central', 'West', 'East', 'West', 'West'];
export const STORE_2024 = [67787, 53199, 42674, 39778, 0];
export const STORE_2025 = [78295, 57838, 50727, 45433, 30178]; // Forks Market opened 1 March 2025
export const STORE_TARGET_2025 = [72000, 56500, 45400, 42100, 30300];

export const CATS = ['Electronics', 'Home', 'Outdoor', 'Grocery'];
export const CAT_2024 = [72838, 56559, 50920, 23121];
export const CAT_2025 = [95022, 72932, 66362, 28155];
export const CAT_MARGIN = [0.487, 0.543, 0.54, 0.424]; // margin % over both years

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const WEEKDAY_SALES = [57890, 62990, 55998, 59923, 60862, 81960, 86285];

export const LINE_BINS = ['0-25', '25-50', '50-75', '75-100', '100-150', '150-200', '200-300', '300+'];
export const LINE_COUNTS = [1739, 2432, 1106, 889, 537, 400, 172, 53];

// [product, category, unit price, units sold (2 years), sales]
export const PRODUCTS: [string, string, number, number, number][] = [
  ['Phone charger', 'Electronics', 25, 1029, 26340], ['Snow shovel', 'Outdoor', 35, 699, 25045], ['Desk lamp', 'Home', 38, 1213, 47090],
  ['Coffee beans 1 kg', 'Grocery', 18, 1099, 20195], ['Storage boxes', 'Home', 24, 1168, 28644], ['Maple syrup 500 ml', 'Grocery', 12, 1168, 14328],
  ['Oat milk 6-pack', 'Grocery', 15, 1093, 16753], ['Camping chair', 'Outdoor', 55, 1215, 68277], ['Bath towel set', 'Home', 45, 1168, 53757],
  ['Wireless earbuds', 'Electronics', 89, 1170, 106366], ['Smart plug', 'Electronics', 30, 1145, 35154], ['Water bottle', 'Outdoor', 20, 1172, 23961],
];

export const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
export const TOTAL_2024 = sum(SALES_2024); // 203,438
export const TOTAL_2025 = sum(SALES_2025); // 262,470
