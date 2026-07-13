import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useStore = create((set, get) => ({
  products: [],
  page: 1,
  pages: 1,
  loading: false,
  error: null,
  cart: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [],
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
  shippingAddress: localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {},
  paymentMethod: localStorage.getItem('paymentMethod') ? JSON.parse(localStorage.getItem('paymentMethod')) : 'Razorpay',

  fetchProducts: async (keyword = '', pageNumber = '', category = '', minPrice = '', maxPrice = '', sort = '') => {
    set({ loading: true });
    try {
      const query = new URLSearchParams();
      if (keyword) query.append('keyword', keyword);
      if (pageNumber) query.append('pageNumber', pageNumber);
      if (category && category !== 'All') query.append('category', category);
      if (minPrice) query.append('minPrice', minPrice);
      if (maxPrice) query.append('maxPrice', maxPrice);
      if (sort) query.append('sort', sort);

      const { data } = await axios.get(`/api/products?${query.toString()}`);
      set({ products: data.products, page: data.page, pages: data.pages, loading: false, error: null });
    } catch (error) {
      set({ 
        error: error.response && error.response.data.message ? error.response.data.message : error.message,
        loading: false 
      });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/users/login', { email, password }, config);
      
      set({ userInfo: data, loading: false, error: null });
      if (data.cart && data.cart.length > 0) {
        set({ cart: data.cart });
        localStorage.setItem('cart', JSON.stringify(data.cart));
      }
      localStorage.setItem('userInfo', JSON.stringify(data));
      return true;
    } catch (error) {
      set({ 
        error: error.response && error.response.data.message ? error.response.data.message : error.message,
        loading: false 
      });
      return false;
    }
  },

  googleLogin: async (credential) => {
    set({ loading: true });
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/users/google-auth', { credential }, config);
      
      set({ userInfo: data, loading: false, error: null });
      if (data.cart && data.cart.length > 0) {
        set({ cart: data.cart });
        localStorage.setItem('cart', JSON.stringify(data.cart));
      }
      localStorage.setItem('userInfo', JSON.stringify(data));
      return true;
    } catch (error) {
      set({ 
        error: error.response && error.response.data.message ? error.response.data.message : error.message,
        loading: false 
      });
      return false;
    }
  },

  sendOtp: async (email) => {
    set({ loading: true });
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      await axios.post('/api/users/send-otp', { email }, config);
      set({ loading: false, error: null });
      return true;
    } catch (error) {
      set({ 
        error: error.response && error.response.data.message ? error.response.data.message : error.message,
        loading: false 
      });
      return false;
    }
  },

  register: async (name, email, password, otp) => {
    set({ loading: true });
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/users', { name, email, password, otp }, config);
      
      set({ userInfo: data, loading: false, error: null });
      localStorage.setItem('userInfo', JSON.stringify(data));
      return true;
    } catch (error) {
      set({ 
        error: error.response && error.response.data.message ? error.response.data.message : error.message,
        loading: false 
      });
      return false;
    }
  },

  resetPassword: async (email, otp, newPassword) => {
    set({ loading: true });
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      await axios.post('/api/users/reset-password', { email, otp, newPassword }, config);
      set({ loading: false, error: null });
      return true;
    } catch (error) {
      set({ 
        error: error.response && error.response.data.message ? error.response.data.message : error.message,
        loading: false 
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await axios.post('/api/users/logout');
    } catch (error) {
      console.error('Backend logout failed, but local state will be cleared.', error);
    } finally {
      set({ userInfo: null, cart: [] });
      localStorage.removeItem('userInfo');
      localStorage.removeItem('cart');
    }
  },

  updateProfile: async (name, email, password) => {
    set({ loading: true });
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.put('/api/users/profile', { name, email, password }, config);
      set({ userInfo: data, loading: false, error: null });
      localStorage.setItem('userInfo', JSON.stringify(data));
      return true;
    } catch (error) {
      set({ 
        error: error.response && error.response.data.message ? error.response.data.message : error.message,
        loading: false 
      });
      return false;
    }
  },

  getMyOrders: async () => {
    try {
      const { data } = await axios.get('/api/orders/myorders');
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  syncCartToDB: async (newCart) => {
    const userInfo = get().userInfo;
    if (userInfo) {
      try {
        await axios.put('/api/users/cart', { cart: newCart });
      } catch (e) {
        console.error('Failed to sync cart', e);
      }
    }
  },

  addToCart: (product, qty) => {
    const cart = get().cart;
    const existItem = cart.find((x) => x._id === product._id);

    let newCart;
    if (existItem) {
      newCart = cart.map((x) => (x._id === existItem._id ? { ...product, qty } : x));
    } else {
      newCart = [...cart, { ...product, qty }];
    }
    
    set({ cart: newCart });
    localStorage.setItem('cart', JSON.stringify(newCart));
    get().syncCartToDB(newCart);
  },

  removeFromCart: (id) => {
    const newCart = get().cart.filter((x) => x._id !== id);
    set({ cart: newCart });
    localStorage.setItem('cart', JSON.stringify(newCart));
    get().syncCartToDB(newCart);
  },

  saveShippingAddress: (data) => {
    set({ shippingAddress: data });
    localStorage.setItem('shippingAddress', JSON.stringify(data));
  },

  savePaymentMethod: (data) => {
    set({ paymentMethod: data });
    localStorage.setItem('paymentMethod', JSON.stringify(data));
  },

  clearCart: () => {
    set({ cart: [] });
    localStorage.removeItem('cart');
  },

  createReview: async (productId, review) => {
    try {
      const { data } = await axios.post(`/api/products/${productId}/reviews`, review);
      return { success: true, message: data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response && error.response.data.message ? error.response.data.message : error.message 
      };
    }
  },
}));
