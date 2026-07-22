import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  ArrowRight, Award, Box, CheckCircle2, Clock3, CreditCard, Headphones, Heart,
  Leaf, PackageCheck, Play, Recycle, ShieldCheck, Sprout, Star, Truck,
} from 'lucide-react';
import Meta from '../components/Meta';

const FALLBACK_PRODUCTS = [
  { _id: 'green-moong', name: 'Green Moong', price: 150, oldPrice: null, unit: '1kg', rating: 4.8, tag: 'BESTSELLER', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=85' },
  { _id: 'raw-honey', name: 'Raw Organic Honey', price: 250, unit: '500g', rating: 4.9, tag: 'ORGANIC', image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=600&q=85' },
  { _id: 'white-quinoa', name: 'White Quinoa', price: 299, unit: '1kg', rating: 4.7, tag: 'NEW', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=85' },
  { _id: 'toor-dal', name: 'Toor Dal', price: 120, unit: '1kg', rating: 4.8, image: 'https://images.unsplash.com/photo-1631209121750-a9f656d28f46?auto=format&fit=crop&w=600&q=85' },
  { _id: 'coconut-oil', name: 'Cold Pressed Coconut Oil', price: 350, unit: '1L', rating: 4.9, image: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&w=600&q=85' },
  { _id: 'turmeric', name: 'Organic Turmeric Powder', price: 100, oldPrice: 260, unit: '250g', rating: 4.6, tag: 'SALE', image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=600&q=85' },
];

const CATEGORIES = [
  ['Pulses', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=300&q=85'],
  ['Grains', 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?auto=format&fit=crop&w=300&q=85'],
  ['Flours', 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&w=300&q=85'],
  ['Dry Fruits', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=300&q=85'],
  ['Spices', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=85'],
  ['Seeds', 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=300&q=85'],
  ['Oils', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=85'],
  ['Herbs', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=85'],
];

const featureIcons = [
  [Leaf, '100% Organic', 'No Chemicals'], [Sprout, 'Farm Fresh', 'Direct from Farmers'],
  [ShieldCheck, 'Lab Tested', 'For Purity'], [Heart, 'Sustainable', 'Better for Earth'],
];

const HomePage = () => {
  const { products, fetchProducts, loading, addToCart } = useStore();

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const liveProducts = products.filter((p) => p.price > 0 && p.name !== 'Sample name').slice(0, 6);
  const displayProducts = liveProducts.length ? liveProducts.map((p, i) => ({
    ...p, unit: p.unit || (i === 1 ? '500g' : '1kg'), rating: (4.6 + (i % 4) / 10).toFixed(1), tag: i === 0 ? 'BESTSELLER' : i === 1 ? 'ORGANIC' : i === 2 ? 'NEW' : i === 5 ? 'SALE' : null,
  })) : FALLBACK_PRODUCTS;

  const add = (e, product) => {
    e.preventDefault();
    if (product._id && !String(product._id).includes('-')) addToCart({ ...product, qty: 1 }, 1);
  };

  return (
    <div className="min-h-screen bg-[#fbfaf6] pt-[122px] text-[#0b3020] overflow-hidden">
      <Meta title="FitTree Organics | Good for You, Good for Nature" />

      <section className="relative min-h-[520px] bg-[#fbfaf6]">
        <div className="absolute inset-y-0 right-0 w-[58%] hidden lg:block">
          <img src="/hero_banner_farm.png" alt="Organic farm landscape" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fbfaf6] via-[#fbfaf6]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fbfaf6] via-transparent to-transparent" />
        </div>
        <div className="relative max-w-[1340px] mx-auto px-5 sm:px-8 pt-24 pb-8 grid lg:grid-cols-[1fr_1.05fr] gap-10 items-center">
          <div className="z-10">
            <p className="uppercase tracking-[0.22em] text-[13px] font-extrabold text-[#0b6b3a] mb-5">Clean food. Real ingredients.</p>
            <h1 className="font-serif text-[50px] sm:text-[64px] lg:text-[72px] leading-[0.95] font-bold text-[#082f20] mb-6">Good for You,<br /><span className="text-[#0a7a3d]">Good for Nature.</span></h1>
            <p className="text-lg text-[#17251f] leading-7 mb-8 max-w-xl">Pure, natural & chemical-free staples delivered fresh from trusted farms to your home.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-8 max-w-2xl">
              {featureIcons.map(([Icon, title, sub]) => <div key={title} className="flex gap-3 items-center"><Icon className="text-[#0a6b3d]" size={28}/><div><b className="block text-sm">{title}</b><span className="text-xs text-[#47584e]">{sub}</span></div></div>)}
            </div>
            <div className="flex items-center gap-6">
              <Link to="/products" className="inline-flex items-center gap-3 rounded-lg bg-[#064c2d] px-7 py-4 text-white font-bold shadow-lg hover:bg-[#083b25]">Shop Now <ArrowRight size={19}/></Link>
              <Link to="/about" className="inline-flex items-center gap-3 font-semibold text-[#34453b]"><span className="grid h-12 w-12 place-items-center rounded-full border border-[#b6bcae]"><Play size={18} fill="currentColor" /></span> Watch Our Story</Link>
            </div>
          </div>
          <div className="relative z-10 min-h-[430px] hidden lg:block">
            <div className="absolute right-4 bottom-0 w-[620px] max-w-full rounded-[2rem]">
              <img src="/hero_banner_pantry.png" alt="FitTree organic product basket" className="w-full h-[420px] object-cover rounded-[2rem] shadow-2xl" />
              <div className="absolute -right-4 bottom-8 h-24 w-24 rounded-full bg-white border shadow-xl grid place-items-center text-center text-[#064c2d] font-black text-xs tracking-widest rotate-[-15deg]">PURE<br/>NATURAL</div>
            </div>
            <Leaf className="absolute left-8 top-4 text-[#6a8a45] animate-float" size={70} fill="currentColor" />
          </div>
        </div>
      </section>

      <main className="max-w-[1340px] mx-auto px-5 sm:px-8 -mt-2 pb-10 space-y-8">
        <div className="grid lg:grid-cols-[1fr_380px] gap-4">
          <section className="bg-white rounded-2xl shadow-[0_18px_50px_rgba(30,45,30,.09)] p-7">
            <div className="flex justify-between items-center mb-5"><h2 className="font-serif text-2xl font-bold">Shop by Category</h2><Link to="/products" className="text-[#0a6b3d] font-bold flex gap-2 items-center">View All Categories <ArrowRight size={16}/></Link></div>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">{CATEGORIES.map(([name, img]) => <Link to="/products" key={name} className="text-center group"><div className="mx-auto h-20 w-20 rounded-full bg-[#f6efe2] overflow-hidden border border-[#eadfca] p-1"><img src={img} alt={name} className="h-full w-full rounded-full object-cover group-hover:scale-110 transition" /></div><b className="mt-3 block text-sm text-[#17251f]">{name}</b></Link>)}</div>
          </section>
          <aside className="rounded-2xl bg-[#064c2d] text-white p-7 relative overflow-hidden"><Leaf className="absolute right-8 bottom-4 text-white/10" size={170}/><h3 className="font-serif text-xl font-bold mb-5">Why Choose FitTree Organics?</h3>{['Chemical & Pesticide Free','Sourced from Trusted Farmers','Lab Tested for Purity','Sustainable & Ethical Practices'].map(t => <p key={t} className="flex items-center gap-3 mb-3 text-sm"><CheckCircle2 size={16} className="text-[#f0d487]"/> {t}</p>)}</aside>
        </div>

        <section className="grid lg:grid-cols-[230px_1fr_170px] gap-5 items-stretch">
          <div className="rounded-2xl bg-[#f4efe5] p-7 relative overflow-hidden"><h3 className="font-serif text-2xl font-bold leading-tight mb-8">NATURE’S<br/><span className="text-[#0a6b3d]">GOODNESS,</span><br/>DELIVERED TO YOUR DOOR.</h3><p className="text-sm leading-6 mb-7">Carefully packed to retain nutrition and natural goodness.</p><Link to="/products" className="inline-flex items-center gap-2 bg-[#064c2d] text-white rounded-lg px-4 py-3 text-sm font-bold">Explore All Products <ArrowRight size={16}/></Link><Leaf className="absolute -bottom-4 -left-2 text-[#709a43]" size={80}/></div>
          <div>
            <div className="flex justify-between items-center mb-5"><h2 className="font-serif text-2xl font-bold flex items-center gap-3"><Sprout size={24} className="text-[#0a6b3d]"/>Trending This Week</h2><Link to="/products" className="text-[#0a6b3d] font-bold flex gap-2 items-center">View All Products <ArrowRight size={16}/></Link></div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">{displayProducts.map((p) => <Link key={p._id} to={String(p._id).includes('-') ? '/products' : `/product/${p._id}`} className="bg-white border border-[#ece6d8] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"><div className="relative h-44 bg-[#f7f1e6]"><img src={p.image} alt={p.name} className="h-full w-full object-cover" />{p.tag && <span className={`absolute top-3 left-3 rounded px-2 py-1 text-[10px] font-black text-white ${p.tag === 'SALE' ? 'bg-[#f05a24]' : 'bg-[#0a7a3d]'}`}>{p.tag}</span>}</div><div className="p-3"><h4 className="text-sm font-bold text-[#1c231f] min-h-[38px] line-clamp-2">{p.name}</h4><p className="text-xs text-[#6e756f]">{p.unit}</p><div className="mt-2 flex justify-between items-center"><b>₹{p.price}</b><span className="text-xs flex items-center gap-1"><Star size={12} fill="#f59e0b" className="text-[#f59e0b]" />{p.rating}</span></div><button onClick={(e)=>add(e,p)} className="mt-3 w-full bg-[#0a6b3d] text-white rounded-md py-2 text-xs font-bold flex justify-center gap-2">Add to Cart <Truck size={13}/></button></div></Link>)}</div>
          </div>
          <aside className="rounded-2xl bg-[#f4efe5] p-6 flex flex-col justify-around">{[[Truck,'Free Shipping','On orders above ₹999'],[Recycle,'Easy Returns','Hassle free returns'],[CreditCard,'Secure Payment','100% secure payments'],[Headphones,'24/7 Support','We are here to help']].map(([Icon,t,s]) => <div key={t} className="flex gap-3 items-center"><Icon className="text-[#0a6b3d]" size={30}/><div><b className="text-sm">{t}</b><p className="text-xs text-[#566259]">{s}</p></div></div>)}</aside>
        </section>

        <section className="grid lg:grid-cols-[1.1fr_.8fr_1fr] gap-5">
          <div className="rounded-2xl bg-[#064c2d] text-white p-8 min-h-[190px] bg-[url('/hero_banner_farm.png')] bg-cover bg-center overflow-hidden relative"><div className="absolute inset-0 bg-[#064c2d]/65"/><div className="relative max-w-xs"><h3 className="font-serif text-2xl font-bold mb-4">From Our Farms<br/>To Your Family</h3><p className="text-sm mb-5">We work directly with farmers who follow natural & sustainable farming methods.</p><Link to="/about" className="bg-white text-[#064c2d] rounded px-4 py-2 text-sm font-bold">Know Our Story</Link></div></div>
          <div className="rounded-2xl bg-[#fff7e8] p-8 relative overflow-hidden"><h3 className="font-serif text-xl font-bold mb-4">Subscribe & Save</h3><p className="font-serif text-2xl font-bold mb-7">Get 10% OFF on your first order</p><form onSubmit={(e)=>e.preventDefault()} className="flex"><input className="min-w-0 flex-1 rounded-l-lg border px-4 text-sm" placeholder="Enter your email address"/><button className="rounded-r-lg bg-[#064c2d] px-5 text-white text-sm font-bold">Subscribe</button></form><Leaf className="absolute -right-6 -top-4 text-[#779c45]" size={130}/></div>
          <div className="rounded-2xl bg-[#eef3e9] p-8"><h3 className="font-serif text-xl font-bold mb-8">Our Promise</h3><div className="grid grid-cols-4 gap-3 text-center">{[[Award,'100+','Organic Products'],[Heart,'50K+','Happy Customers'],[Sprout,'30+','Partner Farms'],[PackageCheck,'100%','Quality Assured']].map(([Icon,n,s]) => <div key={s}><Icon className="mx-auto mb-3 text-[#0a6b3d]"/><b className="block text-[#0a7a3d] text-xl">{n}</b><span className="text-xs">{s}</span></div>)}</div></div>
        </section>

        <section className="grid md:grid-cols-4 gap-5 rounded-2xl bg-white/80 p-5 shadow-sm">{[[Leaf,'100% Organic','No chemicals or additives'],[Sprout,'Direct from Farms','Fresh & responsibly sourced'],[Box,'Secure Packaging','Safe & hygienic delivery'],[Clock3,'Environment Friendly','We care for our planet']].map(([Icon,t,s]) => <div key={t} className="flex items-center gap-4 justify-center"><Icon className="text-[#0a6b3d]"/><div><b>{t}</b><p className="text-sm text-[#566259]">{s}</p></div></div>)}</section>
      </main>
    </div>
  );
};

export default HomePage;
