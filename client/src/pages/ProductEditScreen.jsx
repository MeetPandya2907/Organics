import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  AlertCircle, ArrowLeft, Save, X, Plus, Package, Image,
  Tag, Info, DollarSign, Layers, Trash2, ChevronDown, ChevronUp,
  Shield, Search, Beaker, FileText,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// ─── Constants ────────────────────────────────────────────────────────────────
const SIZE_OPTIONS = ['25g', '50g', '100g', '150g', '200g', '250g', '500g', '1kg', '2kg', '5kg', '100ml', '200ml', '500ml', '1L'];
const BASE_UNIT_OPTIONS = ['50g', '100g', '200g', '250g', '500g', '1kg'];
const STATUS_OPTIONS = ['Published', 'Draft', 'Archived'];
const STATUS_COLORS = { Published: 'bg-green-100 text-green-700', Draft: 'bg-yellow-100 text-yellow-700', Archived: 'bg-gray-100 text-gray-500' };
const DEFAULT_NUTRITION = [
  { nutrient: 'Energy', value: '', unit: 'kcal' },
  { nutrient: 'Protein', value: '', unit: 'g' },
  { nutrient: 'Carbohydrates', value: '', unit: 'g' },
  { nutrient: 'Fat', value: '', unit: 'g' },
  { nutrient: 'Fiber', value: '', unit: 'g' },
  { nutrient: 'Sodium', value: '', unit: 'mg' },
];

// ─── Reusable Components ──────────────────────────────────────────────────────
const Field = ({ label, hint, children }) => (
  <div className="space-y-1.5">
    <label className="block text-[13px] font-bold text-fittree-text uppercase tracking-wider">{label}</label>
    {hint && <p className="text-[12px] text-fittree-text-light font-medium">{hint}</p>}
    {children}
  </div>
);

const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full bg-fittree-bg border border-transparent rounded-xl py-3 px-4 focus:ring-2 focus:ring-fittree-primary outline-none text-fittree-text transition-shadow ${className}`}
    {...props}
  />
);

const Textarea = ({ className = '', ...props }) => (
  <textarea
    className={`w-full bg-fittree-bg border border-transparent rounded-xl py-3 px-4 focus:ring-2 focus:ring-fittree-primary outline-none text-fittree-text transition-shadow resize-none ${className}`}
    {...props}
  />
);

const SectionCard = ({ icon: Icon, title, subtitle, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-fittree-primary/10 flex items-center justify-center text-fittree-primary shrink-0">
            <Icon size={18} />
          </div>
          <div className="text-left">
            <p className="text-[15px] font-bold text-fittree-text">{title}</p>
            {subtitle && <p className="text-[12px] text-fittree-text-light font-medium">{subtitle}</p>}
          </div>
        </div>
        {open ? <ChevronUp size={18} className="text-fittree-text-light" /> : <ChevronDown size={18} className="text-fittree-text-light" />}
      </button>
      {open && (
        <div className="px-6 pb-6 pt-2 space-y-5 border-t border-gray-50">
          {children}
        </div>
      )}
    </div>
  );
};

const SizeRow = ({ size, onChange, onRemove }) => (
  <div className="flex items-center gap-3 bg-fittree-bg rounded-xl px-4 py-3">
    <select
      value={size.label}
      onChange={(e) => onChange({ ...size, label: e.target.value })}
      className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] font-bold text-fittree-text focus:ring-2 focus:ring-fittree-primary outline-none w-28"
    >
      {SIZE_OPTIONS.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    <div className="relative flex-1">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fittree-text-light font-bold text-[14px]">₹</span>
      <input
        type="number"
        min="0"
        value={size.price}
        onChange={(e) => onChange({ ...size, price: e.target.value })}
        onWheel={(e) => e.target.blur()}
        placeholder="Price"
        className="w-full bg-white border border-gray-200 rounded-lg pl-7 pr-4 py-2 text-[14px] font-semibold text-fittree-text focus:ring-2 focus:ring-fittree-primary outline-none"
      />
    </div>
    <button
      type="button"
      onClick={onRemove}
      className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors shrink-0"
    >
      <Trash2 size={14} />
    </button>
  </div>
);

const NutritionRow = ({ row, onChange, onRemove }) => (
  <div className="flex items-center gap-2 bg-fittree-bg rounded-xl px-4 py-2.5">
    <input
      type="text"
      value={row.nutrient}
      onChange={(e) => onChange({ ...row, nutrient: e.target.value })}
      placeholder="Nutrient"
      className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] font-semibold text-fittree-text focus:ring-2 focus:ring-fittree-primary outline-none"
    />
    <input
      type="text"
      value={row.value}
      onChange={(e) => onChange({ ...row, value: e.target.value })}
      placeholder="Value"
      className="w-24 bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] font-semibold text-fittree-text focus:ring-2 focus:ring-fittree-primary outline-none text-center"
    />
    <select
      value={row.unit}
      onChange={(e) => onChange({ ...row, unit: e.target.value })}
      className="w-20 bg-white border border-gray-200 rounded-lg px-2 py-2 text-[12px] font-bold text-fittree-text focus:ring-2 focus:ring-fittree-primary outline-none"
    >
      {['g', 'mg', 'mcg', 'kcal', 'kJ', '%', 'IU', 'ml'].map((u) => (
        <option key={u} value={u}>{u}</option>
      ))}
    </select>
    <button
      type="button"
      onClick={onRemove}
      className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors shrink-0"
    >
      <Trash2 size={12} />
    </button>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const isNew = productId === 'new';
  const navigate = useNavigate();
  const { userInfo } = useStore();

  // Basic Info
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [origin, setOrigin] = useState('');
  const [status, setStatus] = useState('Published');

  // Pricing & Stock
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [discount, setDiscount] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [baseUnit, setBaseUnit] = useState('');
  const [sizes, setSizes] = useState([]);

  // Images
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);

  // Details
  const [description, setDescription] = useState('');
  const [benefits, setBenefits] = useState('');

  // Nutrition
  const [nutrition, setNutrition] = useState([]);

  // Compliance
  const [ingredients, setIngredients] = useState('');
  const [storageInstructions, setStorageInstructions] = useState('');
  const [shelfLife, setShelfLife] = useState('');
  const [fssaiLicense, setFssaiLicense] = useState('');
  const [hsnCode, setHsnCode] = useState('');

  // SEO
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Category management
  const [categories, setCategories] = useState([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  // UI state
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Auto-compute discount from MRP vs selling price
  const numericPrice = Number(price) || 0;
  const numericMrp = Number(mrp) || 0;
  const autoDiscount = numericMrp > numericPrice && numericPrice > 0
    ? Math.round(((numericMrp - numericPrice) / numericMrp) * 100)
    : 0;

  // Slug preview
  const slug = name
    ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : '';

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) navigate('/login');
  }, [userInfo, navigate]);

  useEffect(() => {
    let cancelled = false;
    axios.get('/api/categories').then(({ data }) => {
      if (cancelled) return;
      setCategories(data);
      if (isNew && data.length > 0) setCategory((prev) => prev || data[0].name);
    }).catch(() => {});
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${productId}`);
        if (cancelled) return;
        setName(data.name || '');
        setSku(data.sku || '');
        setTagline(data.tagline || '');
        setPrice(data.price ?? '');
        setMrp(data.mrp ?? '');
        setDiscount(data.discount ?? '');
        setImage(data.image || '');
        setImages(data.images || []);
        setCategory(data.category || '');
        setCountInStock(data.countInStock ?? '');
        setDescription(data.description || '');
        setTags(data.tags || '');
        setOrigin(data.origin || '');
        setBenefits(data.benefits || '');
        setBaseUnit(data.baseUnit || '');
        setSizes(data.sizes || []);
        setStatus(data.status || 'Published');
        setNutrition(data.nutrition && data.nutrition.length > 0 ? data.nutrition : []);
        setIngredients(data.ingredients || '');
        setStorageInstructions(data.storageInstructions || '');
        setShelfLife(data.shelfLife || '');
        setFssaiLicense(data.fssaiLicense || '');
        setHsnCode(data.hsnCode || '');
        setMetaTitle(data.metaTitle || '');
        setMetaDescription(data.metaDescription || '');
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError(err.response?.data?.message ?? err.message);
        setLoading(false);
      }
    };
    fetchProduct();
    return () => { cancelled = true; };
  }, [productId, isNew]);

  // ── Submit ──────────────────────────────────────────────────────────────────
  const submitHandler = async (e) => {
    e.preventDefault();
    const numP = Number(price);
    const numS = Number(countInStock);

    if (!Number.isFinite(numP) || numP < 0) {
      setErrorUpdate('Enter a valid selling price (0 or more)');
      return;
    }
    if (!Number.isFinite(numS) || numS < 0) {
      setErrorUpdate('Enter a valid stock quantity (0 or more)');
      return;
    }

    const cleanedSizes = sizes
      .map((s) => ({ label: s.label, price: Number(s.price) }))
      .filter((s) => s.label && Number.isFinite(s.price) && s.price >= 0);

    const cleanedNutrition = nutrition
      .filter((n) => n.nutrient.trim() && n.value.trim());

    const payload = {
      name, sku, tagline,
      price: numP,
      mrp: Number(mrp) || 0,
      discount: autoDiscount,
      image, images, category, description,
      countInStock: numS,
      tags, origin, benefits, baseUnit,
      sizes: cleanedSizes,
      status,
      nutrition: cleanedNutrition,
      ingredients, storageInstructions, shelfLife, fssaiLicense, hsnCode,
      metaTitle, metaDescription,
    };

    try {
      setLoadingUpdate(true);
      setErrorUpdate(null);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      if (isNew) {
        await axios.post('/api/products', payload, config);
        toast.success('Product created successfully!');
      } else {
        await axios.put(`/api/products/${productId}`, payload, config);
        toast.success('Product updated successfully!');
      }
      setLoadingUpdate(false);
      navigate('/admin/products');
    } catch (err) {
      setErrorUpdate(err.response?.data?.message ?? err.message);
      setLoadingUpdate(false);
    }
  };

  // ── Category management ────────────────────────────────────────────────────
  const addCategoryHandler = async () => {
    if (!newCategoryName.trim()) return;
    setSavingCategory(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post('/api/categories', { name: newCategoryName }, config);
      setCategories((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      setCategory(data.name);
      setNewCategoryName('');
      setShowNewCategory(false);
      toast.success(`Category "${data.name}" added`);
    } catch (err) {
      toast.error(err.response?.data?.message ?? err.message);
    } finally {
      setSavingCategory(false);
    }
  };

  // ── Image uploads ──────────────────────────────────────────────────────────
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const { data } = await axios.post('/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setImage(data);
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const uploadGalleryHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const { data } = await axios.post('/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setImages((prev) => [...prev, data]);
    } catch {
      toast.error('Gallery image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

  // ── Size variant helpers ───────────────────────────────────────────────────
  const addSize = () => setSizes((prev) => [...prev, { label: '100g', price: '' }]);
  const updateSize = (idx, updated) => setSizes((prev) => prev.map((s, i) => i === idx ? updated : s));
  const removeSize = (idx) => setSizes((prev) => prev.filter((_, i) => i !== idx));

  // ── Nutrition helpers ──────────────────────────────────────────────────────
  const addNutritionRow = () => setNutrition((prev) => [...prev, { nutrient: '', value: '', unit: 'g' }]);
  const updateNutritionRow = (idx, updated) => setNutrition((prev) => prev.map((r, i) => i === idx ? updated : r));
  const removeNutritionRow = (idx) => setNutrition((prev) => prev.filter((_, i) => i !== idx));
  const prefillNutrition = () => setNutrition(DEFAULT_NUTRITION.map((r) => ({ ...r })));

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-fittree-bg min-h-screen pb-24">
      {/* Header */}
      <div className="bg-fittree-primary pt-32 pb-24 px-6 rounded-b-[3rem] shadow-2xl shadow-black/5 mb-[-80px]">
        <div className="max-w-[900px] mx-auto flex items-center gap-4 text-white">
          <Link
            to="/admin/products"
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{isNew ? 'Create Product' : 'Edit Product'}</h1>
            <p className="text-white/60 text-sm mt-1 font-medium">{isNew ? 'Fill in the details below to add a new product' : `Editing product ID: ${productId}`}</p>
          </div>
          {/* Status pill in header */}
          <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${STATUS_COLORS[status] || STATUS_COLORS.Published}`}>
            {status}
          </span>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-6 relative z-10">

        {loadingUpdate && (
          <div className="bg-fittree-primary/10 text-fittree-primary p-4 rounded-xl mb-4 flex items-center gap-2 font-semibold">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-fittree-primary" />
            {isNew ? 'Creating product...' : 'Saving changes...'}
          </div>
        )}
        {errorUpdate && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 flex items-center gap-2 border border-red-100">
            <AlertCircle size={16} className="shrink-0" /> {errorUpdate}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-fittree-primary" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center gap-3 border border-red-100">
            <AlertCircle size={22} /> {error}
          </div>
        ) : (
          <form onSubmit={submitHandler} className="space-y-4">

            {/* ══════════════════════════════════════════════════════════════
                SECTION 1: BASIC INFORMATION
            ══════════════════════════════════════════════════════════════ */}
            <SectionCard icon={Info} title="Basic Information" subtitle="Name, SKU, tagline, category, status, origin & tags">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <Field label="Product Name" hint="Full descriptive name shown on product pages">
                    <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Turmeric Powder (Haldi)" required />
                  </Field>
                </div>

                <Field label="SKU / Product Code" hint="Optional internal code for tracking">
                  <Input type="text" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g. FTO-HALDI-001" />
                </Field>

                <Field label="Status" hint="Draft products are hidden from the storefront">
                  <div className="flex gap-2">
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatus(s)}
                        className={`flex-1 py-3 rounded-xl font-bold text-[13px] transition-all border-2 ${
                          status === s
                            ? s === 'Published' ? 'border-green-500 bg-green-50 text-green-700'
                            : s === 'Draft' ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                            : 'border-gray-400 bg-gray-50 text-gray-600'
                            : 'border-transparent bg-fittree-bg text-fittree-text-light hover:bg-fittree-bg/80'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Tagline" hint="Short marketing hook shown on cards">
                  <Input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="e.g. Pure, cold-ground for maximum potency" />
                </Field>

                {/* Category */}
                <div>
                  <Field label="Category">
                    <div className="flex items-center justify-end mb-2">
                      <button type="button" onClick={() => setShowNewCategory((v) => !v)} className="text-xs font-bold text-fittree-primary hover:underline flex items-center gap-1">
                        <Plus size={13} /> New Category
                      </button>
                    </div>
                    {showNewCategory && (
                      <div className="flex gap-2 mb-3">
                        <Input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="e.g. Cold-Pressed Oils" className="!py-2" />
                        <button type="button" onClick={addCategoryHandler} disabled={savingCategory || !newCategoryName.trim()} className="bg-fittree-primary text-white px-5 rounded-xl font-bold text-sm disabled:opacity-50 shrink-0">
                          {savingCategory ? '...' : 'Add'}
                        </button>
                      </div>
                    )}
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-fittree-bg border border-transparent rounded-xl py-3 px-4 focus:ring-2 focus:ring-fittree-primary outline-none text-fittree-text">
                      {categories.length === 0 && <option value="">Loading categories...</option>}
                      {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  </Field>
                </div>

                <Field label="Origin / Region" hint="Farm sourcing region (e.g. Nashik, Idukki)">
                  <Input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="e.g. Nashik, Maharashtra" />
                </Field>

                <Field label="Tags" hint="Comma-separated keywords for filtering">
                  <Input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. organic, spice, anti-inflammatory" />
                </Field>
              </div>
            </SectionCard>

            {/* ══════════════════════════════════════════════════════════════
                SECTION 2: PRICING & STOCK
            ══════════════════════════════════════════════════════════════ */}
            <SectionCard icon={DollarSign} title="Pricing & Stock" subtitle="MRP, selling price, auto-discount, stock, and size variants">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <Field label="MRP (₹)" hint="Maximum Retail Price (printed price)">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-fittree-text-light">₹</span>
                    <Input type="number" min="0" value={mrp} onChange={(e) => setMrp(e.target.value)} onWheel={(e) => e.target.blur()} className="!pl-8" placeholder="0" />
                  </div>
                </Field>

                <Field label="Selling Price (₹)" hint="Actual selling price for the default pack">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-fittree-text-light">₹</span>
                    <Input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} onWheel={(e) => e.target.blur()} className="!pl-8" required />
                  </div>
                </Field>

                <Field label="Discount" hint="Auto-computed from MRP">
                  <div className="flex items-center gap-2 bg-fittree-bg rounded-xl py-3 px-4 h-[48px]">
                    {autoDiscount > 0 ? (
                      <span className="text-[16px] font-extrabold text-green-600">{autoDiscount}% OFF</span>
                    ) : (
                      <span className="text-[14px] text-fittree-text-light font-medium">No discount</span>
                    )}
                  </div>
                </Field>

                <Field label="Count In Stock" hint="0 triggers 'Notify Me'">
                  <Input type="number" min="0" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} onWheel={(e) => e.target.blur()} required />
                </Field>
              </div>

              {/* Discount Preview */}
              {autoDiscount > 0 && (
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3">
                  <span className="bg-green-600 text-white text-[11px] font-bold px-3 py-1 rounded-full">{autoDiscount}% OFF</span>
                  <span className="text-[13px] text-fittree-text font-medium">
                    Customers will see: <span className="line-through text-fittree-text-light">₹{numericMrp}</span> → <span className="font-bold text-green-700">₹{numericPrice}</span>
                  </span>
                </div>
              )}

              {/* Size Variants */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[13px] font-bold text-fittree-text uppercase tracking-wider">Size Variants & Individual Prices</p>
                    <p className="text-[12px] text-fittree-text-light font-medium mt-0.5">Set custom prices per pack size. Leave empty to auto-calculate from base price.</p>
                  </div>
                  <button type="button" onClick={addSize} className="flex items-center gap-1.5 text-[12px] font-bold text-white bg-fittree-primary hover:bg-fittree-primary/90 px-4 py-2 rounded-xl transition-colors shrink-0">
                    <Plus size={14} /> Add Size
                  </button>
                </div>
                {sizes.length === 0 ? (
                  <div className="bg-fittree-bg rounded-xl p-5 text-center border border-dashed border-slate-200">
                    <Layers size={24} className="text-fittree-text-light mx-auto mb-2" />
                    <p className="text-[13px] text-fittree-text-light font-medium">No size variants added.</p>
                    <p className="text-[12px] text-fittree-text-light/70 mt-1">Prices will be auto-calculated from the base price.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {sizes.map((size, idx) => (
                      <SizeRow key={idx} size={size} onChange={(updated) => updateSize(idx, updated)} onRemove={() => removeSize(idx)} />
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-1">
                <Field label="Default Pack Size (Base Unit)" hint="The pack size selected by default on the product page">
                  <select value={baseUnit} onChange={(e) => setBaseUnit(e.target.value)} className="w-full bg-fittree-bg border border-transparent rounded-xl py-3 px-4 focus:ring-2 focus:ring-fittree-primary outline-none text-fittree-text">
                    <option value="">Auto-detect from name/category</option>
                    {BASE_UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </Field>
              </div>
            </SectionCard>

            {/* ══════════════════════════════════════════════════════════════
                SECTION 3: IMAGES
            ══════════════════════════════════════════════════════════════ */}
            <SectionCard icon={Image} title="Images" subtitle="Primary product image and additional gallery photos">
              <Field label="Primary Image" hint="Main image shown in listings and at the top of the product page">
                <div className="flex gap-3 items-center">
                  <Input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://... or upload a file below" required />
                  <label className="shrink-0 cursor-pointer px-5 py-3 bg-white border border-gray-200 text-fittree-text rounded-xl font-semibold text-[13px] hover:bg-gray-50 transition-colors whitespace-nowrap">
                    {uploading ? 'Uploading...' : '📁 Upload'}
                    <input type="file" className="hidden" onChange={uploadFileHandler} accept="image/*" />
                  </label>
                </div>
                {image && (
                  <div className="mt-3 w-24 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                    <img src={image} alt="Primary preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </Field>
              <Field label="Gallery Images (Optional)" hint="Extra images for the product gallery slider">
                <div className="bg-fittree-bg p-5 rounded-2xl border border-slate-100">
                  <div className="flex flex-wrap gap-3 mb-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                        <img src={img} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeGalleryImage(index)} className="absolute top-1 right-1 bg-white/90 text-red-500 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50">
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                    <label className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:text-fittree-primary hover:border-fittree-primary hover:bg-fittree-primary/5 cursor-pointer transition-colors">
                      <Plus size={22} className="mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Add</span>
                      <input type="file" className="hidden" onChange={uploadGalleryHandler} accept="image/*" />
                    </label>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">{images.length} gallery image{images.length !== 1 ? 's' : ''} added</p>
                </div>
              </Field>
            </SectionCard>

            {/* ══════════════════════════════════════════════════════════════
                SECTION 4: DESCRIPTION & DETAILS
            ══════════════════════════════════════════════════════════════ */}
            <SectionCard icon={Tag} title="Description & Details" subtitle="Product description, benefits, and key features">
              <Field label="Product Description" hint="Main description shown on the product detail page">
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} placeholder="Describe what makes this product unique..." required />
              </Field>
              <Field label="Benefits / Key Features" hint="Enter one benefit per line — shown as a bullet list on the product page">
                <Textarea value={benefits} onChange={(e) => setBenefits(e.target.value)} rows={5} placeholder={"Rich in antioxidants\nAnti-inflammatory properties\nBoosts immunity\nNo artificial additives"} />
                {benefits && (
                  <div className="mt-3 bg-fittree-bg rounded-xl p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-fittree-text-light mb-2">Preview</p>
                    <ul className="space-y-1">
                      {benefits.split('\n').filter(Boolean).map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] text-fittree-text font-medium">
                          <span className="text-fittree-primary mt-0.5">✓</span> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Field>
            </SectionCard>

            {/* ══════════════════════════════════════════════════════════════
                SECTION 5: NUTRITIONAL INFORMATION
            ══════════════════════════════════════════════════════════════ */}
            <SectionCard icon={Beaker} title="Nutritional Information" subtitle="Per 100g nutritional values — shown in a Nutrition tab on the product page" defaultOpen={false}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[12px] text-fittree-text-light font-medium">Add nutritional values per 100g serving</p>
                <div className="flex gap-2">
                  {nutrition.length === 0 && (
                    <button type="button" onClick={prefillNutrition} className="text-[11px] font-bold text-fittree-primary hover:underline">
                      Pre-fill Common Nutrients
                    </button>
                  )}
                  <button type="button" onClick={addNutritionRow} className="flex items-center gap-1.5 text-[12px] font-bold text-white bg-fittree-primary hover:bg-fittree-primary/90 px-3 py-1.5 rounded-lg transition-colors">
                    <Plus size={12} /> Add Row
                  </button>
                </div>
              </div>

              {nutrition.length === 0 ? (
                <div className="bg-fittree-bg rounded-xl p-5 text-center border border-dashed border-slate-200">
                  <Beaker size={24} className="text-fittree-text-light mx-auto mb-2" />
                  <p className="text-[13px] text-fittree-text-light font-medium">No nutrition info added yet.</p>
                  <p className="text-[12px] text-fittree-text-light/70 mt-1">Click "Pre-fill Common Nutrients" to get started quickly.</p>
                </div>
              ) : (
                <>
                  <div className="flex gap-2 px-4 mb-1">
                    <span className="flex-1 text-[10px] font-bold uppercase tracking-wider text-fittree-text-light">Nutrient</span>
                    <span className="w-24 text-[10px] font-bold uppercase tracking-wider text-fittree-text-light text-center">Per 100g</span>
                    <span className="w-20 text-[10px] font-bold uppercase tracking-wider text-fittree-text-light text-center">Unit</span>
                    <span className="w-7" />
                  </div>
                  <div className="space-y-2">
                    {nutrition.map((row, idx) => (
                      <NutritionRow key={idx} row={row} onChange={(updated) => updateNutritionRow(idx, updated)} onRemove={() => removeNutritionRow(idx)} />
                    ))}
                  </div>
                </>
              )}
            </SectionCard>

            {/* ══════════════════════════════════════════════════════════════
                SECTION 6: COMPLIANCE & CERTIFICATIONS
            ══════════════════════════════════════════════════════════════ */}
            <SectionCard icon={Shield} title="Compliance & Certifications" subtitle="Ingredients, storage & shelf life" defaultOpen={false}>

              <Field label="Ingredients" hint="Comma-separated ingredients list">
                <Textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} rows={2} placeholder="e.g. 100% organic turmeric root (Curcuma longa)" />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Storage Instructions" hint="How to store the product">
                  <Input type="text" value={storageInstructions} onChange={(e) => setStorageInstructions(e.target.value)} placeholder="e.g. Store in a cool, dry place away from sunlight" />
                </Field>
                <Field label="Shelf Life" hint="Product shelf life from packaging">
                  <Input type="text" value={shelfLife} onChange={(e) => setShelfLife(e.target.value)} placeholder="e.g. 12 months from date of packaging" />
                </Field>
              </div>
            </SectionCard>

            {/* ══════════════════════════════════════════════════════════════
                SECTION 7: SEO
            ══════════════════════════════════════════════════════════════ */}
            <SectionCard icon={Search} title="SEO" subtitle="Meta tags for search engine optimization" defaultOpen={false}>
              <Field label="Meta Title" hint="Custom page title for Google (leave blank to auto-generate from product name)">
                <Input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder={name ? `FitTree Organics | ${name}` : 'e.g. Buy Organic Turmeric Powder Online | FitTree Organics'} />
                <p className="text-[11px] text-fittree-text-light font-medium mt-1">{(metaTitle || `FitTree Organics | ${name}`).length}/60 characters</p>
              </Field>
              <Field label="Meta Description" hint="Custom description for Google search results (150-160 chars ideal)">
                <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} placeholder="e.g. Shop 100% organic turmeric powder sourced directly from Nashik farms. Rich in curcumin, lab-tested, FSSAI certified." />
                <p className="text-[11px] text-fittree-text-light font-medium mt-1">{metaDescription.length}/160 characters</p>
              </Field>
              {slug && (
                <div className="bg-fittree-bg rounded-xl p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-fittree-text-light mb-1">URL Slug Preview</p>
                  <p className="text-[13px] text-fittree-text font-medium font-mono">fittreeorganics.com/product/<span className="text-fittree-primary">{slug}</span></p>
                </div>
              )}
            </SectionCard>

            {/* ══════════════════════════════════════════════════════════════
                SUMMARY / SUBMIT BAR
            ══════════════════════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-fittree-primary/10 flex items-center justify-center text-fittree-primary">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-fittree-text">{name || 'Untitled Product'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${STATUS_COLORS[status]}`}>{status}</span>
                      <span className="text-[12px] text-fittree-text-light font-medium">
                        {autoDiscount > 0 && <span className="text-green-600 font-bold">{autoDiscount}% OFF · </span>}
                        {sizes.length > 0
                          ? `${sizes.length} size variant${sizes.length !== 1 ? 's' : ''}`
                          : price ? `₹${price}` : 'No price set'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loadingUpdate}
                  className="flex items-center gap-2 bg-fittree-primary hover:bg-fittree-primary/90 text-white font-bold px-8 py-3.5 rounded-xl transition-colors disabled:opacity-60 shadow-sm"
                >
                  <Save size={18} />
                  {loadingUpdate ? 'Saving...' : isNew ? 'Create Product' : 'Save Changes'}
                </button>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default ProductEditScreen;
