import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { MapPin, CreditCard, ShoppingBag, Tag, ChevronRight, Lock, Edit2, User, Phone, Mail, Trash2, Plus, Minus, ShieldCheck, Leaf, Truck, HeadphonesIcon, CircleDollarSign, X, Check, BookmarkPlus } from 'lucide-react';
import axios from 'axios';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const { cart, shippingAddress, paymentMethod, userInfo, clearCart, coupon, savePaymentMethod, saveShippingAddress, addToCart, removeFromCart, applyCoupon, removeCoupon, couponLoading, addSavedAddress, deleteSavedAddress } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponInput, setCouponInput] = useState('');

  const savedAddresses = userInfo?.addresses || [];

  // Inline shipping form states
  const [isEditingShipping, setIsEditingShipping] = useState(!shippingAddress || !shippingAddress.address);
  const [showAddressBook, setShowAddressBook] = useState(savedAddresses.length > 0 && (!shippingAddress || !shippingAddress.address));
  const [recipientName, setRecipientName] = useState(userInfo?.name || '');
  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || 'India');
  const [phone, setPhone] = useState(shippingAddress?.phone || '');
  const [saveThisAddress, setSaveThisAddress] = useState(false);

  const useSavedAddressHandler = (a) => {
    saveShippingAddress({ address: a.addressLine, city: a.city, postalCode: a.postalCode, country: 'India', phone: a.phone });
    setIsEditingShipping(false);
    setShowAddressBook(false);
  };

  // Guest checkout — collected only when nobody is signed in.
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  // Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const itemsPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 1000 ? 0 : 50;
  const taxPrice = addDecimals(Number((0.05 * itemsPrice).toFixed(2))); // 5% tax
  const discountAmount = coupon ? coupon.discountAmount : 0;
  const totalPrice = Math.max(Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice) - discountAmount, 0).toFixed(2);

  const saveShippingHandler = async (e) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode, country, phone });
    if (saveThisAddress && userInfo) {
      await addSavedAddress({ label: 'Home', fullName: recipientName, phone, addressLine: address, city, state: city, postalCode });
    }
    setIsEditingShipping(false);
  };

  const placeOrderHandler = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post('/api/orders', {
        orderItems: cart.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item.originalId || item._id,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        couponCode: coupon ? coupon.code : undefined,
        discountAmount,
        ...(!userInfo && { guestName, guestEmail }),
      });

      clearCart();
      if (!userInfo) {
        // Guest orders require this email to view/cancel the order later —
        // stash it so this browser can keep viewing it without re-entering.
        sessionStorage.setItem('guestOrderEmail', guestEmail);
      }
      navigate(`/order/${data._id}`);
    } catch (error) {
      setError(error.response && error.response.data.message ? error.response.data.message : error.message);
      setLoading(false);
    }
  };

  const applyCouponHandler = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = await applyCoupon(couponInput.trim(), itemsPrice);
    if (ok) {
       setCouponInput('');
       setShowCouponInput(false);
    }
  };

  const paymentOptions = [
    { id: 'Cash on Delivery', title: 'Cash on Delivery', subtitle: 'Pay on delivery', icon: <CircleDollarSign className="text-forest" size={24} /> },
    { id: 'UPI', title: 'UPI', subtitle: 'Pay using UPI', icon: <span className="font-bold text-[#6a1b9a] italic text-lg leading-none">UPI</span> },
    { id: 'Credit / Debit Card', title: 'Credit / Debit Card', subtitle: 'Visa, Mastercard, RuPay', icon: <CreditCard className="text-[#1a237e]" size={24} /> },
    { id: 'Razorpay', title: 'Razorpay', subtitle: 'Secure Online Payment', icon: <span className="font-bold text-[#0288d1] text-lg leading-none">Razorpay</span> }
  ];

  const isPlaceOrderDisabled = cart.length === 0 || loading || !shippingAddress?.address || !paymentMethod
    || (!userInfo && (!guestName.trim() || !guestEmail.trim()));

  return (
    <div className="bg-slate-50 min-h-screen pt-10 pb-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800">Checkout</h1>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column */}
        <div className="lg:w-2/3 space-y-6">

          {/* Guest Contact Card — only shown when nobody is signed in */}
          {!userInfo && (
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-forest">
                  <User size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-slate-800">Contact Details</h2>
                  <p className="text-slate-500 text-sm mt-0.5">
                    Checking out as a guest. <Link to="/login?redirect=/placeorder" className="text-forest font-bold hover:underline">Sign in</Link> to track orders and save addresses.
                  </p>
                </div>
              </div>
              <div className="ml-[3.25rem] grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                  <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-forest text-slate-800 text-sm" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email</label>
                  <input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-forest text-slate-800 text-sm" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="you@example.com" />
                </div>
              </div>
            </div>
          )}

          {/* Shipping Card */}
          <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-6 sm:p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-forest">
                  <MapPin size={20} />
                </div>
                <h2 className="text-xl font-display font-bold text-slate-800">Shipping Details</h2>
              </div>
              {!isEditingShipping && (
                <button onClick={() => setIsEditingShipping(true)} className="flex items-center gap-2 border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors text-slate-600">
                  <Edit2 size={14} /> Edit
                </button>
              )}
            </div>
            
            {showAddressBook ? (
              <div className="ml-[3.25rem] space-y-3">
                {savedAddresses.map((a) => (
                  <div key={a._id} className="flex items-start justify-between gap-4 border border-slate-200 rounded-xl p-4 hover:border-forest transition-colors">
                    <button onClick={() => useSavedAddressHandler(a)} className="flex-1 text-left flex items-start gap-3">
                      <MapPin size={16} className="text-slate-400 mt-1 shrink-0" />
                      <span>
                        <span className="block font-bold text-slate-800 text-sm">{a.label} &middot; {a.fullName}</span>
                        <span className="block text-slate-600 text-sm mt-0.5">{a.addressLine}, {a.city} {a.postalCode}</span>
                        <span className="block text-slate-500 text-xs mt-0.5">{a.phone}</span>
                      </span>
                    </button>
                    <button onClick={() => deleteSavedAddress(a._id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => { setShowAddressBook(false); setIsEditingShipping(true); }}
                  className="flex items-center gap-2 text-forest font-bold text-sm hover:underline"
                >
                  <Plus size={15} /> Add a new address
                </button>
              </div>
            ) : isEditingShipping ? (
              <form onSubmit={saveShippingHandler} className="ml-[3.25rem] space-y-4">
                {userInfo && (
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Recipient Name</label>
                    <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-forest text-slate-800 text-sm" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Who should we deliver to?" />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Street Address</label>
                  <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-forest text-slate-800 text-sm" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Organic Way" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">City</label>
                    <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-forest text-slate-800 text-sm" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Postal Code</label>
                    <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-forest text-slate-800 text-sm" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="400001" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                  <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-forest text-slate-800 text-sm" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
                </div>
                {userInfo && (
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={saveThisAddress} onChange={(e) => setSaveThisAddress(e.target.checked)} className="w-4 h-4 accent-forest" />
                    <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5"><BookmarkPlus size={15} /> Save this address for next time</span>
                  </label>
                )}
                <div className="flex items-center gap-3">
                  <button type="submit" className="px-6 py-3 bg-forest text-white rounded-xl text-sm font-bold hover:bg-forest/90 transition-colors w-full sm:w-auto">
                    Save Address
                  </button>
                  {savedAddresses.length > 0 && (
                    <button type="button" onClick={() => { setIsEditingShipping(false); setShowAddressBook(true); }} className="text-sm font-bold text-slate-500 hover:text-forest transition-colors">
                      Use a saved address instead
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="ml-[3.25rem] space-y-3">
                {userInfo && (
                  <div className="flex items-center gap-3 text-slate-700">
                    <User size={16} className="text-slate-400 shrink-0" />
                    <span className="font-medium">{userInfo.name}</span>
                  </div>
                )}
                <div className="flex items-start gap-3 text-slate-600">
                  <MapPin size={16} className="text-slate-400 mt-1 shrink-0" />
                  <span className="leading-relaxed">
                    {shippingAddress.address}, <br/>
                    {shippingAddress.city} {shippingAddress.postalCode}, {shippingAddress.country}
                  </span>
                </div>
                {shippingAddress.phone && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone size={16} className="text-slate-400 shrink-0" />
                    <span>{shippingAddress.phone}</span>
                  </div>
                )}
                {userInfo && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail size={16} className="text-slate-400 shrink-0" />
                    <span>{userInfo.email}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Payment Card */}
          <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-forest">
                <CreditCard size={20} />
              </div>
              <h2 className="text-xl font-display font-bold text-slate-800">Payment Method</h2>
            </div>
            <p className="text-slate-500 text-sm ml-[3.25rem] mb-6">
              {userInfo ? 'Select a payment option' : (
                <>Cash on Delivery only for guest orders — <Link to="/login?redirect=/placeorder" className="text-forest font-bold hover:underline">sign in</Link> to pay online.</>
              )}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(userInfo ? paymentOptions : paymentOptions.filter((o) => o.id === 'Cash on Delivery')).map((option) => (
                <div 
                  key={option.id}
                  onClick={() => savePaymentMethod(option.id)}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-3 ${paymentMethod === option.id ? 'border-forest bg-forest/5' : 'border-slate-100 hover:border-slate-200'}`}
                >
                  <div className={`absolute top-3 left-3 w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === option.id ? 'border-forest' : 'border-slate-300'}`}>
                    {paymentMethod === option.id && <div className="w-2 h-2 bg-forest rounded-full" />}
                  </div>
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center border border-slate-100">
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-[13px]">{option.title}</h3>
                    <p className="text-slate-500 text-[11px] mt-1">{option.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-sm">
              <Lock size={14} /> Your payment information is secure and encrypted
            </div>
          </div>

          {/* Order Items Card */}
          <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-forest">
                  <ShoppingBag size={20} />
                </div>
                <h2 className="text-xl font-display font-bold text-slate-800">Order Items ({cart.length})</h2>
              </div>
            </div>
            
            {cart.length === 0 ? (
              <p className="text-slate-500 text-center py-8">Your bag is empty</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {cart.map((item, index) => (
                  <div key={index} className="p-6 sm:p-8 flex items-center gap-6 group hover:bg-slate-50/50 transition-colors">
                    <div className="relative w-20 h-20 bg-slate-100 rounded-xl p-2 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1">
                      <Link to={`/product/${item.originalId || item._id}`} className="font-bold text-slate-800 hover:text-forest transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                        <span>500g</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="text-forest font-medium text-xs bg-forest/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                           <div className="w-1.5 h-1.5 bg-forest rounded-full"></div> In Stock
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <div className="font-bold text-slate-800">
                         ₹{(item.qty * item.price).toFixed(2)}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                          <button 
                            onClick={() => addToCart(item, item.qty - 1)}
                            disabled={item.qty <= 1}
                            className="p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors disabled:opacity-50"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-slate-800">{item.qty}</span>
                          <button 
                            onClick={() => addToCart(item, item.qty + 1)}
                            className="p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item._id || item.originalId)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden sticky top-28">
            {/* Dark Green Header */}
            <div className="bg-[#0E2B1C] p-6 relative overflow-hidden">
              <Leaf className="absolute right-[-20px] top-[-20px] text-white/5 w-32 h-32 transform rotate-12" />
              <h2 className="text-xl font-display font-bold text-white relative z-10">Order Summary</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>Subtotal ({cart.reduce((a, c) => a + c.qty, 0)} item{cart.length !== 1 ? 's' : ''})</span>
                  <span className="font-bold text-slate-800">₹{itemsPrice}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>Shipping Charges</span>
                  <span className="font-bold text-slate-800">{shippingPrice === 0 ? 'Free' : `₹${shippingPrice.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>GST (5%)</span>
                  <span className="font-bold text-slate-800">₹{taxPrice}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 py-4 mb-2">
                {!coupon ? (
                  <>
                    <button onClick={() => setShowCouponInput(!showCouponInput)} className="flex items-center justify-between w-full text-slate-600 hover:text-forest transition-colors group">
                      <span className="flex items-center gap-2 text-sm font-medium"><Tag size={16} /> Apply Coupon</span>
                      <ChevronRight size={16} className={`transition-transform ${showCouponInput ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                    </button>
                    {showCouponInput && (
                      <form onSubmit={applyCouponHandler} className="mt-4 flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="Enter coupon code"
                          className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-forest uppercase"
                        />
                        <button 
                          type="submit" 
                          disabled={couponLoading || !couponInput.trim()}
                          className="px-4 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-900 disabled:opacity-50 transition-colors"
                        >
                          {couponLoading ? '...' : 'Apply'}
                        </button>
                      </form>
                    )}
                  </>
                ) : (
                  <div className="bg-green-50 border border-green-100 text-green-700 px-3 py-2.5 rounded-lg text-sm flex justify-between items-center">
                    <span className="font-medium flex items-center gap-2"><Tag size={14}/> {coupon.code} applied</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
                      <button onClick={removeCoupon} className="text-green-700 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"><X size={14} strokeWidth={2.5} /></button>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-6 mb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-slate-800 text-lg">Total Amount</span>
                    <p className="text-xs text-slate-500 mt-1">Inclusive of all taxes</p>
                  </div>
                  <span className="text-2xl font-bold text-slate-900">₹{totalPrice}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-100 font-medium">
                  {error}
                </div>
              )}

              {/* Validation helper messages */}
              {(!shippingAddress?.address || !paymentMethod) && (
                <div className="mb-4">
                  {!shippingAddress?.address ? (
                    <p className="text-amber-600 text-[13px] font-bold text-center">Please complete your shipping details.</p>
                  ) : (
                    <p className="text-amber-600 text-[13px] font-bold text-center">Please select a payment method.</p>
                  )}
                </div>
              )}

              <button
                onClick={placeOrderHandler}
                disabled={isPlaceOrderDisabled}
                className={`w-full py-4 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all shadow-lg ${isPlaceOrderDisabled ? 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed' : 'bg-[#0E2B1C] hover:bg-[#173D28] text-white shadow-[#0E2B1C]/20'}`}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Lock size={16} /> Place Order
                  </>
                )}
              </button>
              
              <p className="text-center text-xs text-slate-500 mt-4">
                By placing an order, you agree to our <Link to="/terms" className="text-forest font-medium hover:underline">Terms & Conditions</Link>
              </p>

              <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-forest" />
                  <div>
                     <span className="block text-[11px] font-bold text-slate-800">Secure Checkout</span>
                     <span className="block text-[10px] text-slate-500">SSL Encrypted</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-forest" />
                  <div>
                     <span className="block text-[11px] font-bold text-slate-800">100% Safe</span>
                     <span className="block text-[10px] text-slate-500">Trusted Payments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Trust Badges Footer */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-t border-slate-200">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <ShieldCheck className="text-slate-800 shrink-0" size={32} strokeWidth={1.5} />
            <div>
              <h4 className="font-bold text-slate-800 text-sm">100% Secure Payment</h4>
              <p className="text-xs text-slate-500 mt-0.5">Your payment details are<br/>safe with us</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <Leaf className="text-slate-800 shrink-0" size={32} strokeWidth={1.5} />
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Organic Certified</h4>
              <p className="text-xs text-slate-500 mt-0.5">Lab-tested and certified<br/>organic products</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <Truck className="text-slate-800 shrink-0" size={32} strokeWidth={1.5} />
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Fast Delivery</h4>
              <p className="text-xs text-slate-500 mt-0.5">Quick delivery across<br/>India</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <HeadphonesIcon className="text-slate-800 shrink-0" size={32} strokeWidth={1.5} />
            <div>
              <h4 className="font-bold text-slate-800 text-sm">24x7 Customer Support</h4>
              <p className="text-xs text-slate-500 mt-0.5">We're here to help you<br/>anytime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
