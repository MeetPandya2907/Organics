import React from 'react';
import Meta from '../components/Meta';
import { Clock, ChefHat, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RECIPES = [
  {
    id: 1,
    title: 'The Perfect Golden Milk (Haldi Doodh)',
    excerpt: 'Boost your immunity with this traditional evening drink using our high-curcumin Lakadong turmeric.',
    image: 'https://images.unsplash.com/photo-1621255855877-2f3b9004d2e8?w=800&q=80',
    time: '10 Mins',
    difficulty: 'Easy'
  },
  {
    id: 2,
    title: 'Comforting Sunday Masoor Dal',
    excerpt: 'A hearty, protein-packed bowl of red lentil dal tempered with fresh cumin and ghee.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80',
    time: '30 Mins',
    difficulty: 'Medium'
  },
  {
    id: 3,
    title: 'Overnight Chia Pudding',
    excerpt: 'Start your morning right with organic chia seeds soaked in almond milk, topped with seasonal fruits.',
    image: 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=800&q=80',
    time: '5 Mins',
    difficulty: 'Easy'
  }
];

const BlogPage = () => {
  return (
    <div className="bg-fittree-bg min-h-screen pt-32 pb-24 px-6 font-sans">
      <Meta title="Recipes & Blog | FitTree Organics" />
      
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <span className="text-fittree-primary font-extrabold text-[11px] uppercase tracking-[0.2em] mb-4 block">Kitchen Stories</span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-fittree-dark mb-6">Recipes & Remedies</h1>
          <p className="text-fittree-text-light max-w-2xl mx-auto">
            Discover how to make the most of your organic pantry. From heirloom family recipes to quick morning superfoods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {RECIPES.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-3xl overflow-hidden shadow-fittree-sm border border-fittree-border hover:shadow-fittree-md transition-shadow group flex flex-col">
              <div className="relative h-60 overflow-hidden">
                <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="pill-tag bg-white/90 text-fittree-dark backdrop-blur-sm"><Clock size={12} /> {recipe.time}</span>
                  <span className="pill-tag bg-white/90 text-fittree-dark backdrop-blur-sm"><ChefHat size={12} /> {recipe.difficulty}</span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-xl font-display font-bold text-fittree-dark mb-3 leading-snug group-hover:text-fittree-primary transition-colors">{recipe.title}</h3>
                <p className="text-sm text-fittree-text-light leading-relaxed mb-6 flex-1">{recipe.excerpt}</p>
                <Link to="#" className="inline-flex items-center gap-2 text-sm font-bold text-fittree-primary">
                  Read Recipe <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
