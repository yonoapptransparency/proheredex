import { Newspaper, Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function NewsPage() {
  const { news: mockNews, settings: mockSettings } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredNews = mockNews.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ceo_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <title>Latest News & Updates - {mockSettings.site_title}</title>
        <meta name="description" content="Stay updated with the latest news, transmissions, and intel from our secure network." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={window.location.origin + "/news"} />
      </Helmet>

      <div className="mb-12">
        <h1 className="text-4xl sm:text-6xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter italic leading-none m-0">
          News<br/>Intel
        </h1>
        <div className="relative max-w-xl">
          <input
            type="text"
            className="block w-full py-4 bg-transparent border-b-2 border-black/10 placeholder-slate-400 focus:outline-none focus:border-red-600 transition-all font-black text-xl uppercase italic"
            placeholder="Search Intelligence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-20">
        {filteredNews.map((item) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="group flex flex-col"
          >
            <Link to={`/news/${item.slug}`} className="block h-64 sm:h-80 rounded-3xl overflow-hidden mb-6 shadow-sm border border-black/5">
              <img src={item.logo_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </Link>
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-red-600 border border-red-600/20 px-2 py-0.5 rounded-full">Intel Report</span>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-30">NT-{item.id}</span>
              </div>
              <Link to={`/news/${item.slug}`} className="text-3xl sm:text-4xl font-black mb-4 uppercase tracking-tighter italic leading-none hover:text-red-600 transition-colors">
                {item.title}
              </Link>
              <p className="text-base opacity-60 mb-8 line-clamp-3 font-medium leading-relaxed text-slate-600">{item.description}</p>
              
              <Link to={`/news/${item.slug}`} className="inline-flex items-center gap-3 text-red-600 font-black uppercase text-[10px] tracking-[0.2em] italic group-hover:gap-5 transition-all">
                Read Transmissions <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        ))}
        {filteredNews.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-500 font-black uppercase tracking-widest italic opacity-40">
            Signal Lost: No news found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
