// Central place for pack-size logic so pricing units are consistent
// across the homepage, listing page, and product detail page.
// The product schema has no weight field yet, so units are inferred
// from the product name (falls back to category, then a default).

const NAME_UNIT_MAP = [
  { match: /turmeric/i, unit: '100g' },
  { match: /cardamom/i, unit: '100g' },
  { match: /coriander/i, unit: '100g' },
  { match: /cumin/i, unit: '100g' },
  { match: /masoor|dal|lentil/i, unit: '1kg' },
  { match: /quinoa/i, unit: '500g' },
  { match: /chia/i, unit: '250g' },
  { match: /honey/i, unit: '500g' },
  { match: /onion flakes|garlic powder|dehydrated/i, unit: '200g' },
];

const CATEGORY_UNIT_MAP = {
  SPICES: '100g',
  PULSES: '1kg',
  SEEDS: '250g',
  'DEHYDRATED PRODUCTS': '200g',
};

const DEFAULT_UNIT = '250g';

// Each base unit offers a small, medium (base) and large pack size,
// priced with a per-gram discount as the pack gets bigger.
const VARIANT_SETS = {
  '100g': [
    { label: '50g', multiplier: 0.55 },
    { label: '100g', multiplier: 1 },
    { label: '250g', multiplier: 2.3 },
  ],
  '200g': [
    { label: '100g', multiplier: 0.55 },
    { label: '200g', multiplier: 1 },
    { label: '500g', multiplier: 2.3 },
  ],
  '250g': [
    { label: '100g', multiplier: 0.45 },
    { label: '250g', multiplier: 1 },
    { label: '500g', multiplier: 1.9 },
  ],
  '500g': [
    { label: '250g', multiplier: 0.55 },
    { label: '500g', multiplier: 1 },
    { label: '1kg', multiplier: 1.9 },
  ],
  '1kg': [
    { label: '500g', multiplier: 0.55 },
    { label: '1kg', multiplier: 1 },
    { label: '2kg', multiplier: 1.9 },
  ],
};

export function getBaseUnit(product) {
  if (!product) return DEFAULT_UNIT;
  // Prefer explicitly stored baseUnit from the DB
  if (product.baseUnit) return product.baseUnit;
  const nameMatch = NAME_UNIT_MAP.find(({ match }) => match.test(product.name || ''));
  if (nameMatch) return nameMatch.unit;
  return CATEGORY_UNIT_MAP[product.category] || DEFAULT_UNIT;
}

export function getVariants(product) {
  // If the product has custom per-size prices stored in the DB, use them directly.
  if (product?.sizes && product.sizes.length > 0) {
    const baseUnit = getBaseUnit(product);
    return product.sizes.map((s) => ({
      label: s.label,
      price: s.price,
      isDefault: s.label === baseUnit,
    }));
  }

  // Fallback: compute from multipliers (for products without custom size data)
  const baseUnit = getBaseUnit(product);
  const basePrice = product?.price || 0;
  const sets = VARIANT_SETS[baseUnit] || VARIANT_SETS['250g'];
  return sets.map((v) => ({
    label: v.label,
    isDefault: v.label === baseUnit,
    price: Math.round(basePrice * v.multiplier),
  }));
}

export function getDisplayUnit(product) {
  // If the admin configured custom sizes, find the default one (matching baseUnit) or use the first one.
  if (product?.sizes && product.sizes.length > 0) {
    const baseUnit = getBaseUnit(product);
    const defaultSize = product.sizes.find((s) => s.label === baseUnit) || product.sizes[0];
    return defaultSize.label;
  }
  // Fall back to the inferred base unit (name/category matching)
  return getBaseUnit(product);
}

export function getDisplayPrice(product) {
  // If the admin configured custom sizes, find the default one's price.
  if (product?.sizes && product.sizes.length > 0) {
    const baseUnit = getBaseUnit(product);
    const defaultSize = product.sizes.find((s) => s.label === baseUnit) || product.sizes[0];
    return defaultSize.price;
  }
  // Fall back to the stored product price
  return product?.price || 0;
}


// Sourcing region shown on the "farm-traced" chip. Inferred from name,
// falling back to category.
const NAME_REGION_MAP = [
  { match: /turmeric/i, region: 'Nashik' },
  { match: /cardamom|pepper/i, region: 'Idukki' },
  { match: /masoor|dal|lentil|toor|chana/i, region: 'Malwa' },
  { match: /cumin|coriander/i, region: 'Unjha' },
  { match: /onion|garlic|dehydrated/i, region: 'Gujarat' },
  { match: /quinoa|chia/i, region: 'Rajasthan' },
  { match: /honey/i, region: 'Wild' },
];

const CATEGORY_REGION_MAP = {
  SPICES: 'Unjha',
  PULSES: 'Malwa',
  SEEDS: 'Rajasthan',
  'DEHYDRATED PRODUCTS': 'Gujarat',
};

export function getRegion(product) {
  if (!product) return 'India';
  // Prefer explicitly stored origin from the DB
  if (product.origin) return product.origin;
  const hit = NAME_REGION_MAP.find(({ match }) => match.test(product.name || ''));
  if (hit) return hit.region;
  return CATEGORY_REGION_MAP[product.category] || 'India';
}

// Cashback shown on cards: 10% of price, rounded.
export function getCashback(product) {
  return Math.round((product?.price || 0) / 10);
}
