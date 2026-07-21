import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { AlertCircle, ArrowLeft, Save, X, Plus } from 'lucide-react';
import axios from 'axios';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useStore();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setImages(data.images || []);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoadingUpdate(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/products/${productId}`, {
        name, price, image, images, category, description, countInStock
      }, config);
      setLoadingUpdate(false);
      navigate('/admin/products');
    } catch (err) {
      setErrorUpdate(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoadingUpdate(false);
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
      alert('Image upload failed');
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
      alert('Gallery image upload failed');
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
          <h1 className="text-4xl text-white">Edit Product</h1>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-6 relative z-10">
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-gray-100">
          {loadingUpdate && <div className="text-fittree-primary mb-4 font-medium">Updating...</div>}
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
                  className="w-full bg-fittree-bg border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-fittree-primary outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-fittree-text mb-2">Price (₹)</label>
                  <input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    className="w-full bg-fittree-bg border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-fittree-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-fittree-text mb-2">Count In Stock</label>
                  <input 
                    type="number" 
                    value={countInStock} 
                    onChange={(e) => setCountInStock(e.target.value)} 
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
                    <label className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:text-fittree-primary hover:border-fittree-primary hover:bg-leaf/5 cursor-pointer transition-colors">
                      <Plus size={24} className="mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Add Image</span>
                      <input type="file" className="hidden" onChange={uploadGalleryHandler} />
                    </label>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Upload extra images to create a product gallery slider.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-fittree-text mb-2">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-fittree-bg border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-fittree-primary outline-none"
                >
                  <option value="SPICES">Spices</option>
                  <option value="PULSES">Pulses</option>
                  <option value="SEEDS">Seeds</option>
                  <option value="DEHYDRATED PRODUCTS">Dehydrated Products</option>
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
                <button type="submit" className="w-full btn btn-primary flex items-center justify-center gap-2">
                  <Save size={20} /> Save Product Updates
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
