import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useData } from '../contexts/DataContext';
import { LayoutGrid, Sparkles, Search, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppListItem } from '../components/PlayStoreUI';
import { Link } from 'react-router-dom';

export default function VideosPage() {
  const { apps: mockApps, settings: mockSettings } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const allCategoryApps = useMemo(() => {
    return mockApps.filter(app => {
      const appCategories = app.category ? app.category.toLowerCase().split(',').map(c => c.trim()) : [];
      const matchesCategory = appCategories.some(cat => cat === 'all app' || cat === 'all apps');
      
      if (!searchTerm) return matchesCategory;
      
      const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (app.seo_title && app.seo_title.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    }).sort((a, b) => (a.serial_number || 0) - (b.serial_number || 0));
  }, [mockApps, searchTerm]);

  return (
    <div className="animate-fade-in min-h-screen plain-content px-4">
      <div className="mb-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] opacity-40 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-3 h-3" />
          Gateway
        </Link>
      </div>
      <Helmet>
        <title>All Premium Apps - {mockSettings.site_title}</title>
        <meta name="description" content="Explore our complete collection of verified premium applications. Vetted for security and performance." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={window.location.origin + "/videos"} />
      </Helmet>

      <div className="mb-12">
        <div className="flex items-center gap-4 mb-8">
          <LayoutGrid className="w-10 h-10 text-red-600" />
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter italic leading-none m-0">Premium<br/>Apps</h1>
        </div>
        
        <div className="relative max-w-xl">
          <input
            type="text"
            className="block w-full py-4 bg-transparent border-b-2 border-black/10 placeholder-slate-400 focus:outline-none focus:border-red-600 transition-all font-black text-xl uppercase italic"
            placeholder="Search Premium Index..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
        </div>
      </div>

      <div className="space-y-4">
        {allCategoryApps.map((app, index) => (
          <AppListItem key={app.id} app={app} index={index + 1} />
        ))}
      </div>
      
      {allCategoryApps.length === 0 && (
        <div className="text-center py-40 border-2 border-dashed border-black/5 rounded-3xl">
          <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-3">Feed Interrupted</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] max-w-[250px] mx-auto italic">
            {searchTerm ? "Search query returned zero matches" : "Syncing newly verified applications. Stand by."}
          </p>
        </div>
      )}
    </div>
  );
}
