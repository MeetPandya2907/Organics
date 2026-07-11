import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { AlertCircle, ArrowLeft, Save } from 'lucide-react';
import axios from 'axios';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useStore();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(null);

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
        name, price, image, category, description, countInStock
      }, config);
      setLoadingUpdate(false);
      navigate('/admin/products');
    } catch (err) {
      setErrorUpdate(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoadingUpdate(false);
    }
  };

  return (
    <div className="bg-paper min-h-screen pb-24">
      <div className="bg-forest pt-12 pb-24 px-6 rounded-b-[3rem] shadow-soft mb-[-80px]">
        <div className="max-w-[800px] mx-auto flex items-center gap-4 text-white">
          <Link to="/admin/products" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-4xl text-white">Edit Product</h1>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-6 relative z-10">
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-glass border border-gray-100">
          {loadingUpdate && <div className="text-leaf mb-4 font-medium">Updating...</div>}
          {errorUpdate && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 flex items-center gap-2"><AlertCircle size={16}/> {errorUpdate}</div>}
          
          {loading ? (
             <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-leaf"></div></div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center gap-3"><AlertCircle /> {error}</div>
          ) : (
            <form onSubmit={submitHandler} className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full bg-paper border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-leaf outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Price (₹)</label>
                  <input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    className="w-full bg-paper border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-leaf outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Count In Stock</label>
                  <input 
                    type="number" 
                    value={countInStock} 
                    onChange={(e) => setCountInStock(e.target.value)} 
                    className="w-full bg-paper border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-leaf outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">Image URL</label>
                <input 
                  type="text" 
                  value={image} 
                  onChange={(e) => setImage(e.target.value)} 
                  className="w-full bg-paper border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-leaf outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-paper border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-leaf outline-none"
                >
                  <option value="SPICES">Spices</option>
                  <option value="PULSES">Pulses</option>
                  <option value="SEEDS">Seeds</option>
                  <option value="DEHYDRATED PRODUCTS">Dehydrated Products</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="w-full bg-paper border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-leaf outline-none min-h-[120px]"
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
