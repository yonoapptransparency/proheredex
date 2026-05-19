import { useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { FileText, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function Blogs() {
  const { settings: mockSettings, blogs: mockBlogs } = useData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="animate-fade-in max-w-5xl mx-auto py-8 plain-content px-4">
      <Helmet>
        <title>Intelligence Logs & Stories - {mockSettings.site_title}</title>
        <meta name="description" content="In-depth logs, stories, and articles about our secure ecosystem." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={window.location.origin + "/blogs"} />
      </Helmet>

      <div className="mb-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] opacity-40 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-3 h-3" />
          Gateway
        </Link>
      </div>

      <div className="flex items-center gap-6 mb-12 border-b-2 border-black/5 pb-8">
        <div className="p-4 bg-red-600 rounded-3xl text-white shadow-xl shadow-red-600/20">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter italic m-0">Logs</h1>
      </div>

      {mockBlogs.length === 0 ? (
        <div className="text-center py-24 text-slate-500 font-black uppercase tracking-[0.4em] opacity-30 italic">
          - Feed Encrypted: No Logs Available -
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-12 sm:gap-20">
          {mockBlogs.map(blog => (
            <motion.div 
               key={blog.id} 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="group flex flex-col"
            >
              <Link to={`/blog/${blog.slug}`} className="block h-64 sm:h-80 rounded-3xl overflow-hidden mb-6 shadow-sm border border-black/5">
                <img src={blog.cover_url || `https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=400&fit=crop`} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </Link>
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest opacity-40 italic">
                    <Calendar className="w-3 h-3" />
                    {new Date(blog.published_at).toLocaleDateString()}
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-red-600">
                    By {blog.author}
                  </div>
                </div>
                <Link to={`/blog/${blog.slug}`} className="text-3xl sm:text-4xl font-black mb-4 uppercase tracking-tighter italic leading-none hover:text-red-600 transition-colors">
                  {blog.title}
                </Link>
                <p className="text-base opacity-60 mb-8 line-clamp-3 font-medium leading-relaxed text-slate-600">{blog.content.substring(0, 150)}...</p>
                <Link to={`/blog/${blog.slug}`} className="inline-flex items-center gap-3 text-red-600 font-black uppercase text-[10px] tracking-[0.2em] italic group-hover:gap-5 transition-all">
                  Open File <FileText className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
