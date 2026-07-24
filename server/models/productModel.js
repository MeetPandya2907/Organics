import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const sizeSchema = mongoose.Schema(
  {
    label: { type: String, required: true },  // e.g. "100g", "250g", "500g"
    price: { type: Number, required: true },  // individual price for this size
  },
  { _id: false }
);

const nutritionSchema = mongoose.Schema(
  {
    nutrient: { type: String, required: true },  // e.g. "Protein"
    value: { type: String, required: true },     // e.g. "22"
    unit: { type: String, default: 'g' },        // e.g. "g", "mg", "kcal"
  },
  { _id: false }
);

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      default: '',
    },
    tagline: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      required: true,
    },
    images: [{ type: String }],
    category: {
      type: String,
      required: true,
    },
    tags: {
      type: String,       // comma-separated tags, e.g. "organic,spice,turmeric"
      default: '',
    },
    origin: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    benefits: {
      type: String,       // newline-separated bullet points
      default: '',
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    mrp: {
      type: Number,       // Maximum Retail Price; if > price, discount is auto-computed
      default: 0,
    },
    discount: {
      type: Number,       // percentage, e.g. 10 means 10% off (auto-computed from mrp vs price)
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    baseUnit: {
      type: String,
      default: '',        // e.g. "250g" — the default/base pack size
    },
    sizes: [sizeSchema],  // custom per-size pricing; if empty, multiplier fallback applies

    // ── Product Status ──────────────────────────────────────────────
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Archived'],
      default: 'Published',
    },

    // ── Nutritional Information ──────────────────────────────────────
    nutrition: [nutritionSchema],

    // ── Compliance & Certifications ─────────────────────────────────
    ingredients: {
      type: String,         // e.g. "100% organic turmeric root"
      default: '',
    },
    storageInstructions: {
      type: String,         // e.g. "Store in a cool, dry place"
      default: '',
    },
    shelfLife: {
      type: String,         // e.g. "12 months from packaging"
      default: '',
    },
    fssaiLicense: {
      type: String,         // FSSAI license number
      default: '',
    },
    hsnCode: {
      type: String,         // HSN code for GST
      default: '',
    },

    // ── SEO ─────────────────────────────────────────────────────────
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
