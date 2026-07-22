import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { AlertCircle, ArrowLeft, Save, X, Plus } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const isNew = productId === 'new';
  const navigate = useNavigate();
  const { userInfo } = useStore();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');

  const [categories, setCategories] = useState([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  // Load the category list once (used for both create and edit).
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

  // Fetch the existing product exactly once per productId — guarded against
  // duplicate/overlapping requests so an in-flight response can never
  // overwrite an admin's in-progress edits.
  useEffect(() => {
    if (isNew) return;
    let cancelled = false;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${productId}`);
        if (cancelled) return;
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setImages(data.images || []);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    fetchProduct();
    return () => { cancelled = true; };
  }, [productId, isNew]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const numericPrice = Number(price);
    const numericStock = Number(countInStock);
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      setErrorUpdate('Enter a valid price (0 or more)');
      return;
    }
    if (!Number.isFinite(numericStock) || numericStock < 0) {
      setErrorUpdate('Enter a valid stock quantity (0 or more)');
      return;
    }

    const payload = {
      name,
      price: numericPrice,
      image,
      images,
      category,
      description,
      countInStock: numericStock,
    };

    try {
      setLoadingUpdate(true);
      setErrorUpdate(null);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      if (isNew) {
        await axios.post('/api/products', payload, config);
        toast.success('Product created');
      } else {
        await axios.put(`/api/products/${productId}`, payload, config);
        toast.success('Product updated');
      }

      setLoadingUpdate(false);
      navigate('/admin/products');
    } catch (err) {
      setErrorUpdate(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoadingUpdate(false);
    }
  };

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
      toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setSavingCategory(false);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.post('/api/upload', formData, config);
      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      toast.error('Image upload failed');
    }
  };

  const uploadGalleryHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.post('/api/upload', formData, config);
      setImages([...images, data]);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      toast.error('Gallery image upload failed');
    }
  };

  const removeGalleryImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="bg-fittree-bg min-h-screen pb-24">
      <div className="bg-fittree-primary pt-32 pb-24 px-6 rounded-b-[3rem] shadow-2xl shadow-black/5 mb-[-80px]">
        <div className="max-w-[800px] mx-auto flex items-center gap-4 text-white">
          <Link to="/admin/products" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-4xl text-white">{isNew ? 'Create Product' : 'Edit Product'}</h1>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-6 relative z-10">
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-gray-100">
          {loadingUpdate && <div className="text-fittree-primary mb-4 font-medium">{isNew ? 'Creating...' : 'Updating...'}</div>}
          {errorUpdate && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 flex items-center gap-2"><AlertCircle size={16}/> {errorUpdate}</div>}

          {loading ? (
             <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fittree-primary"></div></div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center gap-3"><AlertCircle /> {error}</div>
          ) : (
            <form onSubmit={submitHandler} className="space-y-6">

              <div>
                <label className="block text-sm font-medium text-fittree-text mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Turmeric Powder (Haldi)"
                  className="w-full bg-fittree-bg border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-fittree-primary outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-fittree-text mb-2">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    className="w-full bg-fittree-bg border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-fittree-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-fittree-text mb-2">Count In Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    className="w-full bg-fittree-bg border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-fittree-primary outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-fittree-text mb-2">Primary Image URL</label>
                <div className="flex gap-4 items-center mb-6">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://... or upload a file"
                    className="w-full bg-fittree-bg border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-fittree-primary outline-none"
                    required
                  />
                  <label className="btn bg-white border border-gray-200 text-fittree-text cursor-pointer hover:bg-gray-50 flex-shrink-0 whitespace-nowrap">
                    {uploading ? 'Uploading...' : 'Upload File'}
                    <input type="file" className="hidden" onChange={uploadFileHandler} />
                  </label>
                </div>

                <label className="block text-sm font-medium text-fittree-text mb-2">Gallery Images (Optional)</label>
                <div className="bg-fittree-bg p-6 rounded-2xl border border-slate-100 mb-6">
                  <div className="flex flex-wrap gap-4 mb-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                        <img src={img} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-1 right-1 bg-white/90 text-red-500 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <label className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:text-fittree-primary hover:border-fittree-primary hover:bg-fittree-primary/5 cursor-pointer transition-colors">
                      <Plus size={24} className="mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Add Image</span>
                      <input type="file" className="hidden" onChange={uploadGalleryHandler} />
                    </label>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Upload extra images to create a product gallery slider.</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-fittree-text">Category</label>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory((v) => !v)}
                    className="text-xs font-bold text-fittree-primary hover:underline flex items-center gap-1"
                  >
                    <Plus size={13} /> New Category
                  </button>
                </div>

                {showNewCategory && (
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="e.g. Cold-Pressed Oils"
                      className="flex-1 bg-fittree-bg border-none rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-fittree-primary outline-none text-sm"
                    />
                    <button
                      type="button"
                      onClick={addCategoryHandler}
                      disabled={savingCategory || !newCategoryName.trim()}
                      className="bg-fittree-primary text-white px-4 rounded-xl font-bold text-sm disabled:opacity-50"
                    >
                      {savingCategory ? '...' : 'Add'}
                    </button>
                  </div>
                )}

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-fittree-bg border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-fittree-primary outline-none"
                >
                  {categories.length === 0 && <option value="">Loading categories...</option>}
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-fittree-text mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-fittree-bg border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-fittree-primary outline-none min-h-[120px]"
                  required
                ></textarea>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={loadingUpdate} className="w-full btn btn-primary flex items-center justify-center gap-2 disabled:opacity-60">
                  <Save size={20} /> {isNew ? 'Create Product' : 'Save Product Updates'}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductEditScreen;
